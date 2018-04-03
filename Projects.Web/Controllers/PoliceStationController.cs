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
        [RoutePrefix("api/PoliceStation")]
        public class PoliceStationController : ApiControllerBase
        {
            public readonly IEntityBaseRepository<tbl_policestation> _policestationRepository;

            public PoliceStationController(IEntityBaseRepository<tbl_policestation> policestationRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository,
                IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
                _policestationRepository = policestationRepository;
            }

            [HttpPost]
            [Route("SavePoliceStation")]
            public HttpResponseMessage SavePoliceStation(HttpRequestMessage request, PoliceStationViewModel policestation)
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
                        tbl_policestation newPolicestation = new tbl_policestation();
                        newPolicestation.AddPolicestation(policestation);
                        _policestationRepository.Add(newPolicestation);
                        _unitOfWork.Commit();
                        response = request.CreateResponse<PoliceStationViewModel>(HttpStatusCode.Created, policestation);
                    }
                    return response;
                });
            }

            [HttpGet]
            [Route("getPoliceStationList/{tenant_id:int}")]
            public HttpResponseMessage getPoliceStationList(HttpRequestMessage request, int tenant_id)
            {
                return CreateHttpResponse(request, () =>
                {
                    HttpResponseMessage response = null;
                    var Policestations = _policestationRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                    IEnumerable<PoliceStationViewModel> Policestationsvm = Mapper.Map<IEnumerable<tbl_policestation>, IEnumerable<PoliceStationViewModel>>(Policestations);
                    response = request.CreateResponse<IEnumerable<PoliceStationViewModel>>(HttpStatusCode.OK, Policestationsvm);
                    return response;

                });
            }
        [HttpGet]
        [Route("getPoliceStationListByProjId/{project_id:int}")]
        public HttpResponseMessage getPoliceStationListByProjId(HttpRequestMessage request,int project_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Policestations = _policestationRepository.GetAll().Where(x=>x.project_id==project_id);
                IEnumerable<PoliceStationViewModel> Policestationsvm = Mapper.Map<IEnumerable<tbl_policestation>, IEnumerable<PoliceStationViewModel>>(Policestations);
                response = request.CreateResponse<IEnumerable<PoliceStationViewModel>>(HttpStatusCode.OK, Policestationsvm);
                return response;

            });
        }
        [HttpPost]
        [Route("UpdatePolicestation")]
        public HttpResponseMessage UpdatePolicestation(HttpRequestMessage request, PoliceStationViewModel ps)
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
                    var existingPS = _policestationRepository.GetSingle(ps.id);
                    existingPS.ps_name = ps.ps_name;
                    existingPS.ps_contact_person = ps.ps_contact_person;
                    existingPS.contact_person_mobile_no = ps.contact_person_mobile_no;
                    existingPS.modified_date = DateTime.Now;
                    existingPS.modified_by = ps.modified_by;
                    _policestationRepository.Edit(existingPS);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }
    }
}