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
    [RoutePrefix("api/WorkprogressHistory")]
    public class WorkProgressHistoryController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_Workprogress_History> _workprogresshistoryRepository;
        public readonly IEntityBaseRepository<tbl_workassigns_log> _workassignhistoryRepository;

        public WorkProgressHistoryController(
            IEntityBaseRepository<tbl_Workprogress_History> workprogresshistoryRepository,
              IEntityBaseRepository<tbl_workassigns_log> workassignhistoryRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _workprogresshistoryRepository = workprogresshistoryRepository;
            _workassignhistoryRepository = workassignhistoryRepository;
        }

        [HttpPost]
        [Route("SaveWorkprogressHistory")]
        public HttpResponseMessage SaveWorkprogressHistory(HttpRequestMessage request, WorkProgressHistoryViewModel workprogress)
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
                    tbl_Workprogress_History newWorkprogress = new tbl_Workprogress_History();
                    newWorkprogress.AddWorkprogressHistory(workprogress);
                    _workprogresshistoryRepository.Add(newWorkprogress);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<WorkProgressHistoryViewModel>(HttpStatusCode.Created, workprogress);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("getWorkProgressHistoryList")]
        public HttpResponseMessage getWorkProgressHistoryList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var WorkprogressHistoryList = _workprogresshistoryRepository.GetAll();
                IEnumerable<WorkProgressHistoryViewModel> WorkprogressHistorysvm = Mapper.Map<IEnumerable<tbl_Workprogress_History>, IEnumerable<WorkProgressHistoryViewModel>>(WorkprogressHistoryList);
                response = request.CreateResponse<IEnumerable<WorkProgressHistoryViewModel>>(HttpStatusCode.OK, WorkprogressHistorysvm);
                return response;

            });
        }
        //[HttpGet]
        //[Route("getWorkassignHistoryList")]
        //public HttpResponseMessage getWorkassignHistoryList(HttpRequestMessage request)
        //{
        //    return CreateHttpResponse(request, () =>
        //    {
        //        HttpResponseMessage response = null;
        //        var WorkassignHistoryList = _workassignhistoryRepository.GetAll();
        //        IEnumerable<WorkAssignsLogViewModel> WorkassignHistoryListsvm = Mapper.Map<IEnumerable<tbl_workassigns_log>, IEnumerable<WorkAssignsLogViewModel>>(WorkassignHistoryList);
        //        response = request.CreateResponse<IEnumerable<WorkAssignsLogViewModel>>(HttpStatusCode.OK, WorkassignHistoryListsvm);
        //        return response;

        //    });
        //}
    }
}