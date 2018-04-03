using AutoMapper;
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
    public class ratechartData
    {
        public int id { get; set; }
        public float price { get; set; }

    }

    [RoutePrefix("api/RateChart")]
    public class RateChartController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_subcontractor_ratechart> _ratechartRepository;

        public RateChartController(IEntityBaseRepository<tbl_subcontractor_ratechart> ratechartRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _ratechartRepository = ratechartRepository;
        }

        [HttpPost]
        [Route("SaveRateChart")]
        public HttpResponseMessage SaveRateChart(HttpRequestMessage request, SubContractorRateChartViewModel ratechart)
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
                    tbl_subcontractor_ratechart newRateChartDetails = new tbl_subcontractor_ratechart();
                                       
                    for (int i = 0; i < ratechart.ratechartdetails.Count; i++)
                    {
                        newRateChartDetails.tenant_id = ratechart.tenant_id;
                        newRateChartDetails.projectid = ratechart.projectid;
                        newRateChartDetails.subcontractor_id = ratechart.subcontractor_id;
                        newRateChartDetails.fieldwork_id = ratechart.ratechartdetails[i].fieldwork_id;
                        newRateChartDetails.fieldwork_description = ratechart.ratechartdetails[i].fieldwork_description;
                        newRateChartDetails.unitofmeasurement = ratechart.ratechartdetails[i].unitofmeasurement;
                        newRateChartDetails.price = ratechart.ratechartdetails[i].price; 
                        
                        _ratechartRepository.Add(newRateChartDetails);
                        _unitOfWork.Commit();
                    }                    
                    response = request.CreateResponse<SubContractorRateChartViewModel>(HttpStatusCode.Created, ratechart);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("getRatechartList")]
        public IHttpActionResult getRatechartList(HttpRequestMessage request)
        {
            var RatechartList = _ratechartRepository.GetAll();
            return Ok(RatechartList);
        }

        [HttpGet]
        [Route("GetRatechartListByTenant/{tenant_id:int}/{project_id:int}")]
        public IHttpActionResult GetRatechartListByprojId(HttpRequestMessage request, int tenant_id,int project_id)
        {
            var RatechartList = _ratechartRepository.GetAll().Where(x => x.tenant_id == tenant_id && x.projectid == project_id);
            return Ok(RatechartList);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("updateratechart")]
        public HttpResponseMessage updateratechart(HttpRequestMessage request, ratechartData rcdata)
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
                    var existingratechart = _ratechartRepository.GetSingle(rcdata.id);
                    existingratechart.price = rcdata.price;

                    _ratechartRepository.Edit(existingratechart);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }
    }
}