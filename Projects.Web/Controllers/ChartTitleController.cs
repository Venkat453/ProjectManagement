using AutoMapper;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
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
    [RoutePrefix("api/ChartTitle")]
    public class ChartTitleController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_charts_titles> _CharttitleRepository;


        public ChartTitleController(IEntityBaseRepository<tbl_charts_titles> CharttitleRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _CharttitleRepository = CharttitleRepository;
        }


        [HttpPost]
        [Route("SaveChartTitle")]
        public HttpResponseMessage SaveChartTitle(HttpRequestMessage request, ChartTitleViewModel charttitle)
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
                    tbl_charts_titles newCharttitle = new tbl_charts_titles();
                    for (int i = 0; i < charttitle.charttitlelist.Count; i++)
                    {
                        newCharttitle.userid = charttitle.userid;
                        newCharttitle.user_name = charttitle.user_name;
                        newCharttitle.chart_id = charttitle.charttitlelist[i].chart_id;
                        newCharttitle.is_active = charttitle.charttitlelist[i].is_active;
                        newCharttitle.charts_title = charttitle.charttitlelist[i].charts_title;
                        _CharttitleRepository.Add(newCharttitle);
                        _unitOfWork.Commit();
                        response = request.CreateResponse<ChartTitleViewModel>(HttpStatusCode.Created, charttitle);
                    };
                }
                return response;
            });
        }

        [HttpPost]
        [Route("UpdateChartTitleList")]
        public HttpResponseMessage UpdateChartTitleList(HttpRequestMessage request, List<ChartTitlesViewModel> charttitle)
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
                    var chartcount = charttitle.Count();

                    if (chartcount != 0) {

                        if (charttitle[0].id == 0)
                        {
                            var ID = charttitle[0].userid;
                            var existingList = _CharttitleRepository.GetAll().Where(x => x.userid == ID).ToList();
                            for (int i = 0; i < existingList.Count; i++)
                            {
                                existingList[i].is_active = false;
                                _CharttitleRepository.Edit(existingList[i]);
                            }
                        }
                        else
                        {
                            var user_ID = charttitle[0].userid;
                            var existingChartList = _CharttitleRepository.GetAll().Where(x => x.userid == user_ID).ToList();
                            for (int i = 0; i < existingChartList.Count; i++)
                            {
                                existingChartList[i].is_active = false;
                                for (int j = 0; j < chartcount; j++)
                                {
                                    if (charttitle[j].id == existingChartList[i].id)
                                    {
                                        existingChartList[i].is_active = true;
                                    }

                                }
                                _CharttitleRepository.Edit(existingChartList[i]);
                            }
                        }
                        
                    } 
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }

        [HttpPost]
        [Route("UpdateChartTitle")]
        public HttpResponseMessage UpdateChartTitle(HttpRequestMessage request, ChartTitlesViewModel charttitle)
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
                    var existingOrder = _CharttitleRepository.GetSingle(charttitle.id);
                    existingOrder.userid = charttitle.userid;
                    existingOrder.user_name = charttitle.user_name;
                    existingOrder.is_active = charttitle.is_active;
                    existingOrder.charts_title = charttitle.charts_title;
                    _CharttitleRepository.Edit(existingOrder);
                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("GetChartTitlelist/{user_id:int}")]
        public HttpResponseMessage GetChartTitlelist(HttpRequestMessage request, int user_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Charttitlelist = _CharttitleRepository.GetAll().Where(x => x.userid == user_id);
                IEnumerable<ChartTitlesViewModel> charttitlevm = Mapper.Map<IEnumerable<tbl_charts_titles>, IEnumerable<ChartTitlesViewModel>>(Charttitlelist);
                response = request.CreateResponse<IEnumerable<ChartTitlesViewModel>>(HttpStatusCode.OK, charttitlevm);
                return response;
            });
        }
    }
}