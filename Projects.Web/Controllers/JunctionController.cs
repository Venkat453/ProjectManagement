using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Services;
using Projects.Services.Utilities;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Projects.Web.Controllers;
using AutoMapper;
using System.IO;
using System.Web;
using System.Configuration;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/Junction")]
    public class JunctionController:ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_junction> _junctionRepository;
        public readonly IEntityBaseRepository<tbl_workverification> _workverificationRepository;
        public readonly IEntityBaseRepository<tbl_workprogress> _workprogressRepository;
        public readonly IEntityBaseRepository<tbl_junctionComponents> _junctionComponentsRepository;

        public JunctionController(IEntityBaseRepository<tbl_junction> junctionRepository,
            IEntityBaseRepository<tbl_junctionComponents> junctionComponentsRepository,
            IEntityBaseRepository<tbl_workverification> workverificationRepository,
            IEntityBaseRepository<tbl_workprogress> workprogressRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
            _junctionRepository = junctionRepository;
            _workprogressRepository = workprogressRepository;
            _junctionComponentsRepository = junctionComponentsRepository;
            _workverificationRepository = workverificationRepository;
        }

        [HttpPost]
        [Route("SaveJunction")]
        public HttpResponseMessage SaveJunction(HttpRequestMessage request, JunctionViewModel junction)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    tbl_junction newJunction = new tbl_junction();
                    newJunction.AddJunction(junction);                   
                    for(var i=0;i<junction.junComponents.Count;i++)
                    {
                        var newJunComponent = new tbl_junctionComponents();
                        newJunComponent.tenant_id = junction.tenant_id;
                        newJunComponent.project_id = newJunction.project_id;
                        newJunComponent.junction_id = newJunction.id;
                        newJunComponent.component = junction.junComponents[i].component;
                        newJunComponent.quantity = junction.junComponents[i].quantity;
                        newJunction.junComponents.Add(newJunComponent);

                    }
                    _junctionRepository.Add(newJunction);
                    _unitOfWork.Commit();

                    for (var i = 0; i < junction.junComponents.Count; i++)
                    {
                        tbl_workprogress newworkprogress = new tbl_workprogress();
                        newworkprogress.tenant_id = junction.tenant_id;
                        newworkprogress.junction_id = newJunction.id;
                        newworkprogress.AddWorkprogress(junction);
                        newworkprogress.jun_component = junction.junComponents[i].component;
                        newworkprogress.total = junction.junComponents[i].quantity;
                        newworkprogress.completed = 0;
                        newworkprogress.pending = 0;
                        newworkprogress.progress = 0;
                        _workprogressRepository.Add(newworkprogress);

                        tbl_workverification newworkverification = new tbl_workverification();
                        newworkverification.tenant_id = junction.tenant_id;
                        newworkverification.project_id = junction.project_id;
                        newworkverification.ps_id = junction.ps_id;
                        newworkverification.junction_id = newJunction.id;
                        newworkverification.subcontractor_id = 0;
                        newworkverification.assigned_date = DateTime.Now;
                        newworkverification.jun_component = junction.junComponents[i].component;
                        newworkverification.total = junction.junComponents[i].quantity;
                        newworkverification.completed = 0;
                        newworkverification.verified_by = 0;
                        newworkverification.verification_status = 0;
                        newworkverification.verified_quantity = 0;
                        newworkverification.nc_quantity = 0;
                        newworkverification.created_date = DateTime.Now;
                        _workverificationRepository.Add(newworkverification);

                        _unitOfWork.Commit();
                    }                        
                    response = request.CreateResponse<JunctionViewModel>(HttpStatusCode.Created, junction); 
                }
                return response;
            });
        }        

        [HttpGet]
        [Route("getJunctionsList/{tenant_id:int}")]
        public IHttpActionResult getJunctionsList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var junctionslist = (from jn in contextObj.junctionset
                                     join ps in contextObj.policestatoinset on jn.ps_id equals ps.id
                                     select new
                                     {
                                         j_id=jn.id,
                                         junction_name = jn.junction_name,
                                         ps_id=ps.id,
                                         ps_name = ps.ps_name,
                                         project_id = jn.project_id,
                                         tenant_id = jn.tenant_id
                                     }).Where(x=>x.tenant_id==tenant_id);
            return Ok(junctionslist);
        }

        [HttpGet]
        [Route("getJunctionsListByProjID/{project_id:int}")]
        public IHttpActionResult getJunctionsListByProjID(HttpRequestMessage request, int project_id)
        {
            DBConnect contextObj = new DBConnect();
            var junctionslist = (from jn in contextObj.junctionset where jn.project_id == project_id
                                 join ps in contextObj.policestatoinset on jn.ps_id equals ps.id
                                 select new
                                 {
                                     j_id = jn.id,
                                     junction_name = jn.junction_name,
                                     ps_name = ps.ps_name,
                                     project_id = jn.project_id
                                 });
            //var junctionslist = _junctionRepository.GetAll();
            return Ok(junctionslist);
        }
        
        [HttpGet]
        [Route("getJunctionsCompList")]
        public IHttpActionResult getJunctionsCompList(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var junctionsComplist = (from jnc in contextObj.junComponents

                                     select new
                                     {
                                         junction_id=jnc.junction_id,
                                         component=jnc.component,
                                         quantity=jnc.quantity,
                                         row_id=jnc.id

                                     });
            return Ok(junctionsComplist);
        }

        [HttpPost]
        [Route("UpdateJunction")]
        public HttpResponseMessage UpdateJunction(HttpRequestMessage request, JunComponents jn)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var existingJN = _junctionComponentsRepository.GetSingle(jn.id);
                    existingJN.quantity = jn.quantity;
                    _junctionComponentsRepository.Edit(existingJN);

                    var existJN = _workprogressRepository.GetSingle(jn.id);
                    existJN.total= jn.quantity;
                    _workprogressRepository.Edit(existJN);

                    var existWV = _workverificationRepository.GetSingle(jn.id);
                    existWV.total = jn.quantity;
                    _workverificationRepository.Edit(existWV);

                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }

        [HttpPost]
        [Route("DeleteJun/{row_id:int}")]
        public HttpResponseMessage DeleteJun(HttpRequestMessage request, int row_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;

                if (!ModelState.IsValid)
                {
                    response = request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
                }
                else
                {
                    var existingworkprograss = _workprogressRepository.GetSingle(row_id);
                    if (existingworkprograss.completed == 0)
                    {
                        _workprogressRepository.Delete(existingworkprograss);
                        var existingjunction = _junctionComponentsRepository.GetSingle(row_id);
                        _junctionComponentsRepository.Delete(existingjunction);
                        _unitOfWork.Commit();
                        response = request.CreateResponse(HttpStatusCode.OK);
                    }
                }

                return response;
            });
        }
        
    }
}