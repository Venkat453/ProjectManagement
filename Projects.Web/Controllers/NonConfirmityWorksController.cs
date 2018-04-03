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
    [RoutePrefix("api/NonConfirmityWorks")]
    public class NonConfirmityWorksController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_workprogress> _workprogressRepository;
        public readonly IEntityBaseRepository<tbl_junction> _junctionRepository;
        public readonly IEntityBaseRepository<tbl_workverification> _workverificationRepository;
        public readonly IEntityBaseRepository<tbl_workverification_history> _workverificationhistoryRepository;
        public readonly IEntityBaseRepository<tbl_nonconfirmity_works> _nonconfirmityworksRepository;
        public readonly IEntityBaseRepository<tbl_nonconfirmity_history> _nonconfirmityhistoryRepository;

        public NonConfirmityWorksController(IEntityBaseRepository<tbl_junction> junctionRepository,
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
        [Route("GetNonConfirmityWorksList/{tenant_id:int}")]
        public IHttpActionResult GetNonConfirmityWorksList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var NCworkslist = (from ncw in contextObj.nonconfirmityworksset.Where(c => c.tenant_id == tenant_id)
                               select new
                               {
                                   id = ncw.id,
                                   project_id = ncw.project_id,
                                   project_name = contextObj.ProjectMaster.Where(x => x.id == ncw.project_id).Select(x => x.project_name).FirstOrDefault(),
                                   ps_id = ncw.ps_id,
                                   ps_name = contextObj.policestatoinset.Where(x => x.id == ncw.ps_id).Select(x => x.ps_name).FirstOrDefault(),
                                   junction_id = ncw.junction_id,
                                   junction_name = contextObj.junctionset.Where(x => x.id == ncw.junction_id).Select(x => x.junction_name).FirstOrDefault(),
                                   subcontractor_id = ncw.subcontractor_id,
                                   subcontractor_name = contextObj.subcontractorset.Where(x => x.id == ncw.subcontractor_id).Select(x => x.subcontractor_name).FirstOrDefault(),
                                   work_verification_id = ncw.work_verification_id,
                                   junction_component = ncw.junction_component,
                                   total = ncw.total,
                                   completed = ncw.completed,
                                   verification_status = ncw.verification_status,
                                   verification_status_value = contextObj.refmaster.Where(x => x.id == ncw.verification_status).Select(x => x.reference_value).FirstOrDefault(),
                                   verified_quantity = ncw.verified_quantity,
                                   nc_quantity = ncw.nc_quantity,
                                   comments = ncw.comments,
                                   created_date = ncw.created_date
                               });
            return Ok(NCworkslist);
        }

        [HttpPost]
        [Route("UpdateNCWorks")]
        public HttpResponseMessage UpdateNCWorks(HttpRequestMessage request, NonConfirmityWorksViewModel ncWorks)
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
                    var existrecord = _nonconfirmityworksRepository.GetSingle(ncWorks.id);
                    existrecord.verification_status = ncWorks.verification_status;
                    _nonconfirmityworksRepository.Edit(existrecord);

                    var existWVrecord = _workverificationRepository.GetSingle(ncWorks.work_verification_id);
                    existWVrecord.verification_status = ncWorks.verification_status;
                    _workverificationRepository.Edit(existWVrecord);

                    tbl_nonconfirmity_history exitingNCWorks = new tbl_nonconfirmity_history();

                    exitingNCWorks.tenant_id = existrecord.tenant_id;
                    exitingNCWorks.project_id = existrecord.project_id;
                    exitingNCWorks.ps_id = existrecord.ps_id;
                    exitingNCWorks.junction_id = existrecord.junction_id;
                    exitingNCWorks.subcontractor_id = existrecord.subcontractor_id;
                    exitingNCWorks.work_verification_id = existrecord.work_verification_id;
                    exitingNCWorks.junction_component = existrecord.junction_component;
                    exitingNCWorks.total = existrecord.total;
                    exitingNCWorks.completed = existrecord.completed;
                    exitingNCWorks.verified_quantity = existrecord.verified_quantity;
                    exitingNCWorks.nc_quantity = existrecord.nc_quantity;
                    exitingNCWorks.comments = existrecord.comments;
                    exitingNCWorks.verification_status = existrecord.verification_status;
                    exitingNCWorks.created_date = DateTime.Now;

                    _nonconfirmityhistoryRepository.Add(exitingNCWorks);

                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });



        }
    }
}