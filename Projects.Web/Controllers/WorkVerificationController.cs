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
    public class WorkVerification
    {
        public int id { get; set; }
        public string comments { get; set; }
        public int verification_status { get; set; }
        public int nc_quantity { get; set; }
    }

    [RoutePrefix("api/Workverification")]
    public class WorkVerificationController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_workprogress> _workprogressRepository;
        public readonly IEntityBaseRepository<tbl_junction> _junctionRepository;
        public readonly IEntityBaseRepository<tbl_workverification> _workverificationRepository;
        public readonly IEntityBaseRepository<tbl_workverification_history> _workverificationhistoryRepository;
        public readonly IEntityBaseRepository<tbl_nonconfirmity_works> _nonconfirmityworksRepository;
        public readonly IEntityBaseRepository<tbl_nonconfirmity_history> _nonconfirmityhistoryRepository;

        public WorkVerificationController(IEntityBaseRepository<tbl_junction> junctionRepository,
            IEntityBaseRepository<tbl_workprogress> workprogressRepository,
            IEntityBaseRepository<tbl_workverification> workverificationRepository,
            IEntityBaseRepository<tbl_workverification_history> workverificationhistoryRepository,
            IEntityBaseRepository<tbl_nonconfirmity_works> nonconfirmityworksRepository,
            IEntityBaseRepository<tbl_nonconfirmity_history> nonconfirmityhistoryRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _workprogressRepository = workprogressRepository;
            _workverificationRepository = workverificationRepository;
            _workverificationhistoryRepository = workverificationhistoryRepository;
            _nonconfirmityworksRepository = nonconfirmityworksRepository;
            _nonconfirmityhistoryRepository = nonconfirmityhistoryRepository;
        }

        [HttpGet]
        [Route("GetWorkVerification")]
        public IHttpActionResult GetWorkVerification(HttpRequestMessage request)
        {
            DBConnect contextObj = new DBConnect();
            var workverificationlist = (from wv in contextObj.workverificationSet where wv.total == wv.completed
                                   join jn in contextObj.junctionset on wv.junction_id equals jn.id
                                   select new
                                   {
                                       id=wv.id,
                                       project_id = wv.project_id,
                                       ps_id = wv.ps_id,
                                       junction_id = wv.junction_id,
                                       subcontractor_id = wv.subcontractor_id,
                                       assigned_date = wv.assigned_date,
                                       jun_component = wv.jun_component,
                                       total = wv.total,
                                       completed = wv.completed,
                                       verification_status = wv.verification_status,
                                       verified_quantity = wv.verified_quantity,
                                       nc_quantity = wv.nc_quantity,
                                       comments = wv.comments,
                                       verified_by = wv.verified_by,
                                       created_date = wv.created_date
                                   });
            return Ok(workverificationlist);
        }


        [HttpPost]
        [Route("UpdateWorkVerification")]
        public HttpResponseMessage UpdateWorkVerification(HttpRequestMessage request, WorkVerification wrkvrfcn)
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
                    var existrecord = _workverificationRepository.GetSingle(wrkvrfcn.id);
                    existrecord.comments = wrkvrfcn.comments;
                    existrecord.verification_status = wrkvrfcn.verification_status;
                    existrecord.nc_quantity = wrkvrfcn.nc_quantity;
                    existrecord.verified_quantity = existrecord.total - wrkvrfcn.nc_quantity;
                    existrecord.created_date = DateTime.Now;

                    _workverificationRepository.Edit(existrecord);

                    tbl_workverification_history exitwvh = new tbl_workverification_history();
                    exitwvh.tenant_id = existrecord.tenant_id;
                    exitwvh.project_id = existrecord.project_id;
                    exitwvh.ps_id = existrecord.ps_id;
                    exitwvh.junction_id = existrecord.junction_id;
                    exitwvh.subcontractor_id = existrecord.subcontractor_id;
                    exitwvh.junction_component = existrecord.jun_component;
                    exitwvh.total = existrecord.total;
                    exitwvh.completed = existrecord.completed;
                    exitwvh.verified_quantity = existrecord.verified_quantity;
                    exitwvh.nc_quantity = existrecord.nc_quantity;
                    exitwvh.comments = existrecord.comments;
                    exitwvh.verification_status = existrecord.verification_status;
                    exitwvh.verified_by = existrecord.verified_by;
                    exitwvh.created_date = DateTime.Now;

                    _workverificationhistoryRepository.Add(exitwvh);

                    if (wrkvrfcn.verification_status == 57)
                    {
                        var NCList = _nonconfirmityworksRepository.GetAll().Where(x => x.work_verification_id == wrkvrfcn.id).FirstOrDefault();
                        if (NCList != null)
                        {
                            var existingNCRecord = _nonconfirmityworksRepository.GetSingle(NCList.id);
                            existingNCRecord.verification_status = wrkvrfcn.verification_status;
                            existingNCRecord.comments = wrkvrfcn.comments;
                            existingNCRecord.created_date = DateTime.Now;

                            _nonconfirmityworksRepository.Edit(existingNCRecord);
                        }
                        else
                        {
                            tbl_nonconfirmity_works newwvhistory = new tbl_nonconfirmity_works();
                            var existwv = _workverificationRepository.GetSingle(wrkvrfcn.id);
                            newwvhistory.tenant_id = existwv.tenant_id;
                            newwvhistory.project_id = existwv.project_id;
                            newwvhistory.ps_id = existwv.ps_id;
                            newwvhistory.junction_id = existwv.junction_id;
                            newwvhistory.subcontractor_id = existwv.subcontractor_id;
                            newwvhistory.work_verification_id = existwv.id;
                            newwvhistory.junction_component = existwv.jun_component;
                            newwvhistory.total = existwv.total;
                            newwvhistory.completed = existwv.completed;
                            newwvhistory.verified_quantity = existwv.verified_quantity;
                            newwvhistory.nc_quantity = existwv.nc_quantity;
                            newwvhistory.comments = existwv.comments;
                            newwvhistory.verification_status = existwv.verification_status;
                            newwvhistory.created_date = DateTime.Now;
                            _nonconfirmityworksRepository.Add(newwvhistory);
                        }
                    }
                    

                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }
        
    }
}