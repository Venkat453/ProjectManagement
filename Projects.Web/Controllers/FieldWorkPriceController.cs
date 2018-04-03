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
    public class fielddata
    {
        public int id { get; set; }
        public string fieldwork_price { get; set; }


    }

    [RoutePrefix("api/fieldworkprice")]
    public class FieldWorkPriceController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_fieldwork_price> _FieldWorkPriceRepository;

        public FieldWorkPriceController(IEntityBaseRepository<tbl_fieldwork_price> FieldWorkPriceRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _FieldWorkPriceRepository = FieldWorkPriceRepository;
        }

        [HttpPost]
        [Route("SaveFieldWorkPrice")]
        public HttpResponseMessage SaveFieldWorkPrice(HttpRequestMessage request, FieldworkViewModel fieldworkprice)
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
                    tbl_fieldwork_price newFieldWorkPrice = new tbl_fieldwork_price();
                    newFieldWorkPrice.addFieldWorkForm(fieldworkprice);
                    _FieldWorkPriceRepository.Add(newFieldWorkPrice);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<FieldworkViewModel>(HttpStatusCode.Created, fieldworkprice);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("GetFieldWorksListByprojId/{project_id:int}")] 
        public HttpResponseMessage GetFieldWorksListByprojId(HttpRequestMessage request,int project_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var FieldWorks = _FieldWorkPriceRepository.GetAll().Where(x=>x.project_id == project_id);
                IEnumerable<FieldworkViewModel> fieldworksvm = Mapper.Map<IEnumerable<tbl_fieldwork_price>, IEnumerable<FieldworkViewModel>>(FieldWorks);
                response = request.CreateResponse<IEnumerable<FieldworkViewModel>>(HttpStatusCode.OK, fieldworksvm);
                return response;
            });
        }

        [HttpGet]
        [Route("GetFieldWorksList/{tenant_id:int}")]
        public IHttpActionResult GetFieldWorksList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var filedworklist = (from fw in contextObj.fieldworkset.Where(x => x.tenant_id == tenant_id)
                               select new
                               {
                                   id = fw.id,
                                   project_id = fw.project_id,
                                   project_name = contextObj.ProjectMaster.Where(x => x.id == fw.project_id).Select(x => x.project_name).FirstOrDefault(),
                                   fieldwork_name=fw.fieldwork_name,
                                   fieldwork_description=fw.fieldwork_description,
                                   fieldwork_price=fw.fieldwork_price,
                                   UOMid = fw.unit_of_measurement,
                                   UOM = contextObj.refmaster.Where(x => x.id == fw.unit_of_measurement).Select(x => x.reference_value).FirstOrDefault()
                               });
            return Ok(filedworklist);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("updatefieldworkprice")]
        public HttpResponseMessage updatefieldworkprice(HttpRequestMessage request, fielddata fdata)
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
                    var existingfieldwork = _FieldWorkPriceRepository.GetSingle(fdata.id);
                    existingfieldwork.fieldwork_price = fdata.fieldwork_price;

                    _FieldWorkPriceRepository.Edit(existingfieldwork);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }
    }
}
