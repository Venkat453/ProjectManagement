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
    public class WorkProgress
    {
        public int workprogress_id { get; set; } 
        public int progress { get; set; }
        public DateTime update_date { get; set; }
        public int subcontractor_id { get; set; }

    }

    [RoutePrefix("api/Workprogress")]
    public class WorkProgressController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_workprogress> _workprogressRepository;
        public readonly IEntityBaseRepository<tbl_junction> _junctionRepository;
        public readonly IEntityBaseRepository<tbl_workverification> _workverificationRepository;

        public WorkProgressController(IEntityBaseRepository<tbl_junction> junctionRepository,
            IEntityBaseRepository<tbl_workprogress> workprogressRepository,
            IEntityBaseRepository<tbl_workverification> workverificationRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _workprogressRepository = workprogressRepository;
            _workverificationRepository = workverificationRepository;
        }

        [HttpPost]
        [Route("SaveWorkprogress")]
        public HttpResponseMessage SaveWorkprogress(HttpRequestMessage request, WorkProgressViewModel workprogress)
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
                    tbl_workprogress newWorkprogress = new tbl_workprogress();
                    newWorkprogress.AddWorkprogress(workprogress);
                    //_workprogressRepository.Add(AddWorkprogress);
                    _unitOfWork.Commit();
                    //response = request.CreateResponse<SubContractorViewModel>(HttpStatusCode.Created, workprogress);
                }
                return response;
            });
        }


        [HttpPost]
        [Route("UpdateWorkprogress")]
        public HttpResponseMessage UpdateWorkprogress(HttpRequestMessage request, WorkProgress workprogress)
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
                    var existingWorkProgress = _workprogressRepository.GetSingle(workprogress.workprogress_id);
                    existingWorkProgress.progress = workprogress.progress;
                    existingWorkProgress.subcontractor_id = workprogress.subcontractor_id;
                    existingWorkProgress.update_date = workprogress.update_date;
                    existingWorkProgress.completed = existingWorkProgress.completed + workprogress.progress;
                    existingWorkProgress.pending = existingWorkProgress.total - existingWorkProgress.completed;
                    existingWorkProgress.update_date = DateTime.Now;

                    _workprogressRepository.Edit(existingWorkProgress);

                    var existingWorkVerification = _workverificationRepository.GetSingle(workprogress.workprogress_id);
                    existingWorkVerification.subcontractor_id = workprogress.subcontractor_id;
                    existingWorkVerification.assigned_date = workprogress.update_date;
                    existingWorkVerification.completed = existingWorkVerification.completed + workprogress.progress;

                    _workverificationRepository.Edit(existingWorkVerification);

                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }


        [HttpGet]
        [Route("getworkprogress")]
        public IHttpActionResult getworkprogress(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var workprogreslist = (from wp in contextObj.workprogressset
                                   join jn in contextObj.junctionset on wp.junction_id equals jn.id
                                 select new
                                 {
                                     project_id= wp.project_id,
                                     workprogress_id=wp.id,
                                     junction_id = jn.id,
                                     junction_name=jn.junction_name,
                                     junction_component = wp.jun_component,
                                     total=wp.total,
                                     completed=wp.completed,
                                     pending=wp.pending,
                                     progress=wp.progress
                                 });            
            return Ok(workprogreslist);
        }
    }
}