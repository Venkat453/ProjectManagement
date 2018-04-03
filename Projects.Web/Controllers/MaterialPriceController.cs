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
using System.Net.Http.Headers;

namespace Projects.Web.Controllers
{
    public class userdata
    {
        public int id { get; set; }
        public string material_price { get; set; }
       

    }
    [RoutePrefix("api/MaterialPrice")]
    public class MaterialPriceController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_material_price> _materialpriceRepository;

        public MaterialPriceController(IEntityBaseRepository<tbl_material_price> materialpriceRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {
            _materialpriceRepository = materialpriceRepository;
        }

        [HttpPost]
        [Route("SaveMaterialPrice")]
        public HttpResponseMessage SaveMaterialPrice(HttpRequestMessage request, MaterialpriceViewModel materialPrice)
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
                    tbl_material_price newMaterialPrice = new tbl_material_price();
                    newMaterialPrice.addMaterialPrice(materialPrice);
                    _materialpriceRepository.Add(newMaterialPrice);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<MaterialpriceViewModel>(HttpStatusCode.Created, materialPrice);
                     
                }
                return response;
            });
        }

        [HttpGet]
        [Route("GetMaterialList/{tenant_id:int}")]
        public IHttpActionResult GetMaterialList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var materiallist = (from mp in contextObj.materialpricekset.Where(x => x.tenant_id == tenant_id)
                                 select new
                                 {
                                     id = mp.id,
                                     project_id = mp.project_id,
                                     project_name = contextObj.ProjectMaster.Where(x => x.id == mp.project_id).Select(x => x.project_name).FirstOrDefault(),
                                     material_name = mp.material_name,
                                     material_description = mp.material_description,
                                     material_price = mp.material_price,
                                     unit_of_measurement = mp.unit_of_measurement,
                                     UOMID = contextObj.refmaster.Where(x => x.id == mp.unit_of_measurement).Select(x => x.reference_value).FirstOrDefault()
                                 });
            return Ok(materiallist);
        }

        [HttpGet]
        [Route("GetMaterialListByProjId/{project_id:int}")]
        public HttpResponseMessage GetMaterialListByProjId(HttpRequestMessage request,int project_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var material = _materialpriceRepository.GetAll().Where(x=>x.project_id==project_id);
                IEnumerable<MaterialpriceViewModel> materialvm = Mapper.Map<IEnumerable<tbl_material_price>, IEnumerable<MaterialpriceViewModel>>(material);
                response = request.CreateResponse<IEnumerable<MaterialpriceViewModel>>(HttpStatusCode.OK, materialvm);
                
                return response;
            });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("updatematerial")]
        public HttpResponseMessage updatematerial(HttpRequestMessage request, userdata usrdata)
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
                    var existingmaterial = _materialpriceRepository.GetSingle(usrdata.id);
                    existingmaterial.material_price = usrdata.material_price;

                    _materialpriceRepository.Edit(existingmaterial);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }
    }
    
        }
