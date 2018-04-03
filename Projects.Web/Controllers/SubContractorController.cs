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
    [RoutePrefix("api/SubContractor")]
    public class SubContractorController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_subcontractor> _subcontractorRepository;
        public readonly IEntityBaseRepository<tbl_project_master> _projectRepository;
        public readonly IEntityBaseRepository<tbl_subcontractor_components> _scComponentsRepository;
        public SubContractorController(IEntityBaseRepository<tbl_subcontractor> subcontractorRepository,
            IEntityBaseRepository<tbl_project_master> projectRepository,
            IEntityBaseRepository<tbl_subcontractor_components> scComponentsRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _subcontractorRepository = subcontractorRepository;
            _projectRepository = projectRepository;
            _scComponentsRepository = scComponentsRepository;
        }

        [HttpGet]
        [Route("GetSubcontractorComponentsList")]
        public IHttpActionResult GetSubcontractorComponentsList(HttpRequestMessage request)
        {



            var contextObj = new DBConnect();

            var SCcomponents = (from scc in contextObj.subcontractorcomponentsset

                                select new
                                {
                                    subcontractor_id = scc.subcontractor_id,
                                    component_id = scc.component_id,
                                    component_name = scc.component_name
                                });

            return Ok(SCcomponents);

        }

        [HttpPost]
        [Route("SaveSubContractor")]
        public HttpResponseMessage SaveSubContractor(HttpRequestMessage request, SubContractorViewModel subcontractor)
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
                    var newSubContractor = new tbl_subcontractor()
                    {
                        tenant_id = subcontractor.tenant_id,
                        project_id = subcontractor.project_id,
                        company_name = subcontractor.company_name,
                        reg_No = subcontractor.reg_No,
                        subcontractor_name = subcontractor.subcontractor_name,
                        current_street = subcontractor.current_street,
                        current_country = subcontractor.current_country,
                        current_state = subcontractor.current_state,
                        current_city = subcontractor.current_city,
                        current_zip = subcontractor.current_zip,
                        current_contact_number = subcontractor.current_contact_number,
                        alternative_contactNumber = subcontractor.alternative_contactNumber,
                        contractor_photo_file_name = subcontractor.contractor_photo_file_name,
                        service_tax_no = subcontractor.service_tax_no,
                        pan = subcontractor.pan,
                        bank_account_no = subcontractor.bank_account_no,
                        bank_name = subcontractor.bank_name,
                        bank_branch = subcontractor.bank_branch,
                        ifsc = subcontractor.ifsc,
                        contractor_photo = subcontractor.contractor_photo,
                        contractor_photo_file_type = subcontractor.contractor_photo_file_type,
                        agreement = subcontractor.agreement,
                        agreement_file_type = subcontractor.agreement_file_type,
                        contractor_agreement_file_name = subcontractor.contractor_agreement_file_name,
                        created_date = DateTime.Now,
                        created_by = subcontractor.created_by,
                        modified_date = DateTime.Now,
                        modified_by = subcontractor.modified_by,
                        email_id = subcontractor.email_id
                    };



                    for (int i = 0; i < subcontractor.scomponentslist.Count; i++)
                    {
                        var newscComponents = new tbl_subcontractor_components();
                        newscComponents.tenant_id = subcontractor.tenant_id;
                        newscComponents.project_id = subcontractor.project_id;
                        newscComponents.subcontractor_id = newSubContractor.id;
                        newscComponents.subcontractor_name = subcontractor.subcontractor_name;
                        newscComponents.component_id = subcontractor.scomponentslist[i].component_id;
                        newscComponents.component_name = subcontractor.scomponentslist[i].component_name;

                        _subcontractorRepository.Add(newSubContractor);
                        _scComponentsRepository.Add(newscComponents);

                    }
                    _unitOfWork.Commit();
                    response = request.CreateResponse<SubContractorViewModel>(HttpStatusCode.Created, subcontractor);
                }
                return response;
            });
        }

        [HttpPost]
        [Route("UpdateSubContractorsList")]
        public HttpResponseMessage UpdateSubContractor(HttpRequestMessage request, SubContractorViewModel subcontractorviewmodel)
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
                    var existingUser = _subcontractorRepository.GetSingle(subcontractorviewmodel.id);
                    existingUser.company_name = subcontractorviewmodel.company_name;
                    existingUser.project_id = subcontractorviewmodel.project_id;
                    existingUser.reg_No = subcontractorviewmodel.reg_No;
                    existingUser.subcontractor_name = subcontractorviewmodel.subcontractor_name;
                    existingUser.current_street = subcontractorviewmodel.current_street;
                    existingUser.current_country = subcontractorviewmodel.current_country;
                    existingUser.current_state = subcontractorviewmodel.current_state;
                    existingUser.current_city = subcontractorviewmodel.current_city;
                    existingUser.current_zip = subcontractorviewmodel.current_zip;
                    existingUser.current_contact_number = subcontractorviewmodel.current_contact_number;
                    existingUser.alternative_contactNumber = subcontractorviewmodel.alternative_contactNumber;

                    existingUser.service_tax_no = subcontractorviewmodel.service_tax_no;
                    existingUser.pan = subcontractorviewmodel.pan;
                    existingUser.bank_account_no = subcontractorviewmodel.bank_account_no;
                    existingUser.bank_name = subcontractorviewmodel.bank_name;
                    existingUser.bank_branch = subcontractorviewmodel.bank_branch;
                    existingUser.ifsc = subcontractorviewmodel.ifsc;

                    existingUser.contractor_photo = subcontractorviewmodel.contractor_photo;
                    existingUser.contractor_photo_file_type = subcontractorviewmodel.contractor_photo_file_type;
                    existingUser.contractor_photo_file_name = subcontractorviewmodel.contractor_photo_file_name;

                    existingUser.contractor_agreement_file_name = subcontractorviewmodel.contractor_agreement_file_name;
                    existingUser.agreement = subcontractorviewmodel.agreement;
                    existingUser.agreement_file_type = subcontractorviewmodel.agreement_file_type;

                    existingUser.modified_date = DateTime.Now;
                    existingUser.modified_by = subcontractorviewmodel.modified_by;
                    existingUser.email_id = subcontractorviewmodel.email_id; 
                    _subcontractorRepository.Edit(existingUser);

                    //deleting existing comps..
                    var existingSc_id_sc_comps = _scComponentsRepository.GetAll().Where(s => s.subcontractor_id == subcontractorviewmodel.id);
                    foreach (var sc_comp in existingSc_id_sc_comps)
                    {
                        _scComponentsRepository.Delete(sc_comp);
                    }

                    //adding new comps..
                    for (int i = 0; i < subcontractorviewmodel.scomponentslist.Count; i++)
                    {
                        var newscComponents = new tbl_subcontractor_components();
                        newscComponents.tenant_id = subcontractorviewmodel.tenant_id;
                        newscComponents.project_id = subcontractorviewmodel.project_id;
                        newscComponents.subcontractor_id = subcontractorviewmodel.id;
                        newscComponents.subcontractor_name = subcontractorviewmodel.subcontractor_name;
                        newscComponents.component_id = subcontractorviewmodel.scomponentslist[i].component_id;
                        newscComponents.component_name = subcontractorviewmodel.scomponentslist[i].component_name;

                        _scComponentsRepository.Add(newscComponents);

                    }

                    _unitOfWork.Commit();
                    response = request.CreateResponse(HttpStatusCode.OK);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("serch/{filter?}")]
        public HttpResponseMessage serch(HttpRequestMessage request, string filter = null)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Subcontractor = _subcontractorRepository.FindBy(s => s.subcontractor_name.ToLower().Contains(filter) || s.project.project_name.ToLower().Contains(filter)).ToList();
                IEnumerable<SubContractorViewModel> Subcontractorsvm = Mapper.Map<IEnumerable<tbl_subcontractor>, IEnumerable<SubContractorViewModel>>(Subcontractor);
                response = request.CreateResponse<IEnumerable<SubContractorViewModel>>(HttpStatusCode.OK, Subcontractorsvm);
                return response;

            });
        }

        [HttpGet]
        [Route("getSubContractorbyid/{id:int}")]
        public HttpResponseMessage getSubContractorbyid(HttpRequestMessage request, int id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Subcontractor = _subcontractorRepository.GetAll().Where(x => x.id == id);
                IEnumerable<SubContractorViewModel> Subcontractorsvm = Mapper.Map<IEnumerable<tbl_subcontractor>, IEnumerable<SubContractorViewModel>>(Subcontractor);
                response = request.CreateResponse<IEnumerable<SubContractorViewModel>>(HttpStatusCode.OK, Subcontractorsvm);
                return response;

            });
        }
         
        [HttpGet]
        [Route("getSubContractorsList/{tenant_id:int}")]
        public HttpResponseMessage getSubContractorsList(HttpRequestMessage request, int tenant_id)
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
                    var SubcontractorList = from sub in _subcontractorRepository.GetAll().AsQueryable().Where(x => x.tenant_id == tenant_id)
                                             join pm in _projectRepository.GetAll().AsQueryable() on sub.project_id equals pm.id into o
                                             from pm in o.DefaultIfEmpty()
                                             select new
                                             {
                                                 id = sub.id,
                                                 project_id = sub.project_id,
                                                 company_name = sub.company_name,
                                                 project_name = pm.project_name,
                                                 subcontractor_name = sub.subcontractor_name,
                                                 reg_No = sub.reg_No,
                                                 modified_date = sub.modified_date,
                                                 service_tax_no = sub.service_tax_no,
                                                 bank_account_no = sub.bank_account_no,
                                                 created_date = sub.created_date,
                                                 pan = sub.pan,
                                                 current_contact_number = sub.current_contact_number,
                                                 alternative_contactNumber = sub.alternative_contactNumber,
                                                 bank_name = sub.bank_name,
                                                 bank_branch = sub.bank_branch,
                                                 ifsc = sub.ifsc,
                                                 current_zip = sub.current_zip,
                                                 current_street = sub.current_street,
                                                 current_country = sub.current_country,
                                                 current_state = sub.current_state,
                                                 current_city = sub.current_city,
                                                 contractor_photo = sub.contractor_photo,
                                                 contractor_photo_file_type = sub.contractor_photo_file_type,
                                                 contractor_photo_file_name = sub.contractor_photo_file_name,
                                                 agreement_file_type = sub.agreement_file_type,
                                                 agreement = sub.agreement,
                                                 contractor_agreement_file_name = sub.contractor_agreement_file_name,
                                                 created_by = sub.created_by,
                                                 modified_by = sub.modified_by,
                                                 email_id = sub.email_id
                                             }; 
                    response = request.CreateResponse(HttpStatusCode.OK, SubcontractorList);
                }
                return response;
            });
        }



        [HttpGet]
        [Route("getJNCompWiseSCList/{jun_id:int}/{prj_id:int}")]
        public HttpResponseMessage getJNCompWiseSCList(HttpRequestMessage request, int jun_id, int prj_id)
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

                    var SubcontractorList = (from jc in contextObj.junComponents.Where(j => j.junction_id == jun_id && j.project_id == prj_id)
                                             join scc in contextObj.subcontractorcomponentsset on jc.component equals scc.component_name
                                             where (jc.project_id == scc.project_id)
                                             select new
                                             {
                                                 sc_id = scc.subcontractor_id,
                                                 // sc_name = contextObj.subcontractorset.Where(s => s.id == scc.subcontractor_id).Select(x => x.subcontractor_name)
                                                 sc_name = scc.subcontractor_name
                                             }).Distinct();

                    response = request.CreateResponse(HttpStatusCode.OK, SubcontractorList);
                }
                return response;
            });
        }
    }
}