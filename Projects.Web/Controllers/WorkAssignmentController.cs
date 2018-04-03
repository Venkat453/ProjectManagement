using AutoMapper;
using Projects.Data;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Projects.Web.Controllers
{
    public class updateSC
    {
        public int id { get; set; }
        public int subcontractor_id { get; set; }
        public DateTime assigned_date { get; set; }
    }

    public class WPData
    {
        public int junction_id { get; set; }
        public string junction_component { get; set; }
    }

    [RoutePrefix("api/WorkAssignment")]

    public class WorkAssignmentController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_workassigns> _WorkAssignmentRepository;
        public readonly IEntityBaseRepository<tbl_workassigns_log> _workAssignsLogRepository;
        public readonly IEntityBaseRepository<tbl_workassigns_log> _workassignhistoryRepository;

        public WorkAssignmentController(IEntityBaseRepository<tbl_workassigns> WorkAssignmentRepository,
            IEntityBaseRepository<tbl_workassigns_log> workAssignsLogRepository,
              IEntityBaseRepository<tbl_workassigns_log> workassignhistoryRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
            _WorkAssignmentRepository = WorkAssignmentRepository;
            _workAssignsLogRepository = workAssignsLogRepository;
            _workassignhistoryRepository = workassignhistoryRepository;
        }


        [HttpGet]
        [Route("GetAssignList")]
        public HttpResponseMessage GetAssignList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var WorkAssignmentList = _WorkAssignmentRepository.GetAll();
                IEnumerable<WorkAssignmentViewModel> WorkAssignmentListvm = Mapper.Map<IEnumerable<tbl_workassigns>, IEnumerable<WorkAssignmentViewModel>>(WorkAssignmentList);
                response = request.CreateResponse<IEnumerable<WorkAssignmentViewModel>>(HttpStatusCode.OK, WorkAssignmentListvm);
                return response;

            });
        }


        [HttpPost]
        [Route("SaveWorkAssign")]
        public HttpResponseMessage SaveWorkAssign(HttpRequestMessage request, WorkAssignmentViewModel workassign)
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
                    tbl_workassigns newAssign = new tbl_workassigns();
                    newAssign.AddAssignment(workassign);
                    _WorkAssignmentRepository.Add(newAssign);

                    tbl_workassigns_log newWorkAssignLog = new tbl_workassigns_log();
                    newWorkAssignLog.tenant_id = workassign.tenant_id;
                    newWorkAssignLog.project_id = workassign.project_id;
                    newWorkAssignLog.ps_id = workassign.ps_id;
                    newWorkAssignLog.junction_id = workassign.junction_id;
                    newWorkAssignLog.subcontractor_id = workassign.subcontractor_id;
                  //  newWorkAssignLog.deassigned_date = new DateTime(01 / 01 / 0001);
                    newWorkAssignLog.assigned_date = DateTime.Now;
                    newWorkAssignLog.created_date = DateTime.Now;

                    _workAssignsLogRepository.Add(newWorkAssignLog);

                    _unitOfWork.Commit();
                    response = request.CreateResponse<WorkAssignmentViewModel>(HttpStatusCode.Created, workassign);

                }

                return response;
            });
        }        

        [HttpGet]
        [Route("GetTotalJunctionsList/{tenant_id:int}")]
        public IHttpActionResult GetTotalJunctionsList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var junctionslist = (from jn in contextObj.junctionset.Where(jn => jn.tenant_id == tenant_id)
                                 join p in contextObj.ProjectMaster on jn.project_id equals p.id                                 
                                 join ps in contextObj.policestatoinset on jn.ps_id equals ps.id into pstns
                                 from x in pstns.DefaultIfEmpty()
                                 select new
                                 {
                                     project_id=p.id,
                                     project_name = p.project_name,
                                     ps_id=jn.ps_id,
                                     ps_name = x.ps_name,
                                     junction_id=jn.id,
                                     junction_name = jn.junction_name,
                                    
                                     //poles_no = jn.poles_no,
                                     //pits_no = jn.pits_no,
                                     //earthings_pits_no = jn.earthings_pits_no,
                                     //trench_length_meters = jn.trench_length_meters
                                 });
            return Ok(junctionslist);
        }

        
        [HttpPost]
        [Route("UpdateWorkAssign")]
        public HttpResponseMessage UpdateWorkAssign(HttpRequestMessage request, updateSC JnWorkAssign)
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
                    var existingJN = _WorkAssignmentRepository.GetSingle(JnWorkAssign.id);
                    existingJN.subcontractor_id = JnWorkAssign.subcontractor_id;
                   // existingJN.assigned_date = JnWorkAssign.assigned_date;
                    existingJN.assigned_date = TimeZoneInfo.ConvertTimeFromUtc(JnWorkAssign.assigned_date, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                    existingJN.modified_date = DateTime.Now;
                    _WorkAssignmentRepository.Edit(existingJN);

                    DBConnect contextObj = new DBConnect();
                    var WAList = _WorkAssignmentRepository.GetSingle(JnWorkAssign.id);

                    tbl_workassigns_log newWorkAssignLog = new tbl_workassigns_log();
                    newWorkAssignLog.project_id = WAList.project_id;
                    newWorkAssignLog.ps_id = WAList.ps_id;
                    newWorkAssignLog.junction_id = WAList.junction_id;
                    newWorkAssignLog.subcontractor_id = JnWorkAssign.subcontractor_id;
                    newWorkAssignLog.assigned_date = DateTime.Now;
                    newWorkAssignLog.deassigned_date = new DateTime(01/01/0001);
                    newWorkAssignLog.created_date = DateTime.Now;

                    _workAssignsLogRepository.Add(newWorkAssignLog);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }

        [HttpGet]
        [Route("getassignedList")]
        public HttpResponseMessage getassignedList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var assignedsc = _WorkAssignmentRepository.GetAll();
                IEnumerable<WorkAssignmentViewModel> assignedsvm = Mapper.Map<IEnumerable<tbl_workassigns>, IEnumerable<WorkAssignmentViewModel>>(assignedsc);
                response = request.CreateResponse<IEnumerable<WorkAssignmentViewModel>>(HttpStatusCode.OK, assignedsvm);
                return response;

            });
        }


        [HttpPost]
        [Route("deleteWorkAssign/{assid:int}")]
        public void deleteWorkAssign(int assid)
        {
            var existingModule = _WorkAssignmentRepository.GetSingle(assid);
            if (existingModule != null)
            {
                _WorkAssignmentRepository.Delete(existingModule);


                DBConnect contextObj = new DBConnect();
                var WAList = _workAssignsLogRepository.GetSingle(assid);


                //tbl_workassigns_log newWorkAssignLog = new tbl_workassigns_log();
                WAList.subcontractor_id = WAList.subcontractor_id;
                WAList.deassigned_date = DateTime.Now;
                //newWorkAssignLog.project_id = WAList.project_id;
                //newWorkAssignLog.ps_id = WAList.ps_id;
                //newWorkAssignLog.junction_id = WAList.junction_id;
                //newWorkAssignLog.subcontractor_id = 0;
                //newWorkAssignLog.assigned_date = DateTime.Now;
                //newWorkAssignLog.created_date = DateTime.Now;

                _workAssignsLogRepository.Edit(WAList);

                _unitOfWork.Commit();
                
            }
        }
        [HttpGet]
        [Route("getWorkassignHistoryList")]
        public HttpResponseMessage getWorkassignHistoryList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var WorkassignHistoryList = _workassignhistoryRepository.GetAll();
                IEnumerable<WorkAssignsLogViewModel> WorkassignHistoryListsvm = Mapper.Map<IEnumerable<tbl_workassigns_log>, IEnumerable<WorkAssignsLogViewModel>>(WorkassignHistoryList);
                response = request.CreateResponse<IEnumerable<WorkAssignsLogViewModel>>(HttpStatusCode.OK, WorkassignHistoryListsvm);
                return response;

            });
        }

        [HttpPost]
        [Route("getWPJNCompWiseSCList")]
        public HttpResponseMessage getWPJNCompWiseSCList(HttpRequestMessage request, WPData wpdata)
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
                    var contextObj = new DBConnect();

                    var SubcontractorList = (from jc in contextObj.WorkAssignments.Where(j => j.junction_id == wpdata.junction_id)
                                             join scc in contextObj.subcontractorcomponentsset on jc.subcontractor_id equals scc.subcontractor_id
                                             select new
                                             {
                                                 subcontractor_id = scc.subcontractor_id,
                                                 subcontractor_name = scc.subcontractor_name,
                                                 component_id = scc.component_id,
                                                 component_name = scc.component_name
                                                 // sc_name = contextObj.subcontractorset.Where(s => s.id == scc.subcontractor_id).Select(x => x.subcontractor_name)
                                             }).Where(x => x.component_name == wpdata.junction_component);

                    response = request.CreateResponse(HttpStatusCode.OK, SubcontractorList);
                }
                return response;
            });
        }

    }
}