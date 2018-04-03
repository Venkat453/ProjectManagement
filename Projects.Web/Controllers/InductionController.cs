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
using System.Web.Http;

namespace Projects.Web.Controllers
{
    [RoutePrefix("api/Induction")]
    public class InductionController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_induction> _InductionRepository;
        public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
        public readonly IEntityBaseRepository<tbl_labour> _labourRepository;


        public InductionController(IEntityBaseRepository<tbl_induction> InductionRepository,
            IEntityBaseRepository<tbl_employee> EmployeeRepository,
            IEntityBaseRepository<tbl_labour> labourRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
        {

            _InductionRepository = InductionRepository;
            _EmployeeRepository = EmployeeRepository;
            _labourRepository = labourRepository;

        }


        [HttpPost]
        [Route("Saveinduct")]
        public HttpResponseMessage Saveinduct(HttpRequestMessage request, InductionViewModel saveinduct)
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
                    tbl_induction newlabour = new tbl_induction();
                    newlabour.AddInduction(saveinduct);
                    _InductionRepository.Add(newlabour);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<InductionViewModel>(HttpStatusCode.Created, saveinduct);
                }
                return response;
            });
        }
        //////save driver data for induction///
        [HttpPost]
        [Route("Saveinductdriver")]
        public HttpResponseMessage Saveinductdriver(HttpRequestMessage request, InductionViewModel Saveinductdriver)
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
                    tbl_induction newdriver = new tbl_induction();
                    newdriver.AddInductiondriver(Saveinductdriver);
                    _InductionRepository.Add(newdriver);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<InductionViewModel>(HttpStatusCode.Created, Saveinductdriver);
                }
                return response;
            });
        }

        ///save driver data for induction////
        [HttpGet]
        [Route("GetindlbrList")]
        public HttpResponseMessage GetindlbrList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var indlbr = _InductionRepository.GetAll();
                IEnumerable<InductionViewModel> indlbrvm = Mapper.Map<IEnumerable<tbl_induction>, IEnumerable<InductionViewModel>>(indlbr);
                response = request.CreateResponse<IEnumerable<InductionViewModel>>(HttpStatusCode.OK, indlbrvm);
                return response;
            });
        }
        
        [HttpGet]
        [Route("Inductionlabourlist/{tenant_id:int}")]
        public IHttpActionResult Inductionlabourlist(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var indlbrlist = (from em in contextObj.EmployeeMaster
                              join lb in contextObj.labourset on em.id equals lb.master_emp_id
                              select new
                              {
                                  tenant_id = em.tenant_id,
                                  project_id=lb.project_id,
                                  empcode = em.emp_code + em.code_seperation + em.emp_num,
                                  name = lb.name,
                                  created_date = lb.created_date,
                                  master_emp_id = lb.master_emp_id,
                                  subcontractor_id = lb.subcontractor_id
                              }).Where(x=>x.tenant_id == tenant_id);
            return Ok(indlbrlist);
        }

        [HttpGet]
        [Route("Inductiondriverlist/{tenant_id:int}")]
        public IHttpActionResult Inductiondriverlist(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var indlbrlist = (from em in contextObj.EmployeeMaster
                              join dr in contextObj.vehicleset on em.id equals dr.master_emp_id
                              select new
                              {
                                  tenant_id = em.tenant_id,
                                  project_id=dr.project_id,
                                  empcode = em.emp_code + em.code_seperation + em.emp_num,
                                  driver_name = dr.driver_name,
                                  created_date = dr.created_date,
                                  master_emp_id = dr.master_emp_id,
                                  subcontractor_id = dr.subcontractor_id
                              }).Where(x => x.tenant_id == tenant_id);

            return Ok(indlbrlist);
        }

    }
}
