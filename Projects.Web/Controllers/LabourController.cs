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
    public class emailid
    {
        public string from { get; set; }
        public string toemail { get; set; }
        public string subject { get; set; }
        public Byte[] attachment { get; set; }
        public List<LabourViewModel> LabourswiseList { get; set; }

    }
    [RoutePrefix("api/Labour")]
    public class LabourController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_subcontractor> _subcontractorRepository;
        public readonly IEntityBaseRepository<tbl_labour> _labourRepository;
        public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;

        public LabourController(IEntityBaseRepository<tbl_subcontractor> subcontractorRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IEntityBaseRepository<tbl_labour> labourRepository,
            IEntityBaseRepository<tbl_settings> settingsRepository,
            IEntityBaseRepository<tbl_employee> EmployeeRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _subcontractorRepository = subcontractorRepository;
            _labourRepository = labourRepository;
            _EmployeeRepository = EmployeeRepository;
            _settingsRepository = settingsRepository;
        }

        [HttpPost]
        [Route("SaveLabour")]
        public HttpResponseMessage SaveLabour(HttpRequestMessage request, LabourViewModel savelabour)
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
                    //start of saving to master emp table
                    var codeFormat = _settingsRepository.GetAll().Where(t => t.tenant_id == savelabour.tenant_id).FirstOrDefault();
                    var exsistingEmployees = _EmployeeRepository.GetAll().Where(e => e.tenant_id == savelabour.tenant_id);

                    tbl_employee newEmployeeMaster = new tbl_employee();
                    int empCount = exsistingEmployees.Count();

                    if (empCount <= 0)
                    {

                        newEmployeeMaster.emp_code = codeFormat.emp_code;
                        newEmployeeMaster.code_seperation = codeFormat.code_seperation;
                        newEmployeeMaster.emp_num = codeFormat.emp_num;
                    }
                    else
                    {
                        var lastERec = _EmployeeRepository.GetAll().Where(e => e.tenant_id == savelabour.tenant_id).OrderByDescending(e => e.id).First();
                       // var lastERec = _EmployeeRepository.GetSingle(empCount);
                        newEmployeeMaster.emp_code = lastERec.emp_code;
                        newEmployeeMaster.code_seperation = lastERec.code_seperation;
                        newEmployeeMaster.emp_num = lastERec.emp_num + 1;
                    }

                    newEmployeeMaster.tenant_id = savelabour.tenant_id;
                    newEmployeeMaster.project_id = savelabour.project_id;
                    newEmployeeMaster.Designation = "Labour";
                    newEmployeeMaster.emp_name = savelabour.name;
                    newEmployeeMaster.date_created = DateTime.Now;
                    newEmployeeMaster.CreatedBy = "Admin";

                    _EmployeeRepository.Add(newEmployeeMaster);
                    //_unitOfWork.Commit();


                    //end of saving to master emp table.



                    tbl_labour newlabour = new tbl_labour();
                    newlabour.master_emp_id = _EmployeeRepository.GetAll().Count() + 1;
                    newlabour.AddLabour(savelabour);
                    _labourRepository.Add(newlabour);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<LabourViewModel>(HttpStatusCode.Created, savelabour);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("GetLaboursList/{tenant_id:int}")]
        public HttpResponseMessage GetLaboursList(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Labours = _labourRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<LabourViewModel> laboursvm = Mapper.Map<IEnumerable<tbl_labour>, IEnumerable<LabourViewModel>>(Labours);
                response = request.CreateResponse<IEnumerable<LabourViewModel>>(HttpStatusCode.OK, laboursvm);
                return response;
            });
        }
        [HttpGet]
        [Route("GetLaboursWiseList/{tenant_id:int}")]
        public IHttpActionResult GetLaboursWiseList(HttpRequestMessage request, int tenant_id)
        {
            DBConnect contextObj = new DBConnect();
            var Labourslist = (from lb in contextObj.labourset.Where(x => x.tenant_id == tenant_id)
                               select new
                               {
                                   id = lb.id,
                                   project_id = lb.project_id,
                                   project_name = contextObj.ProjectMaster.Where(x => x.id == lb.project_id).Select(x => x.project_name).FirstOrDefault(),
                                   subcontractor_id = lb.subcontractor_id,
                                   subcontractor_name = contextObj.subcontractorset.Where(x => x.id == lb.subcontractor_id).Select(x => x.subcontractor_name).FirstOrDefault(),
                                   master_emp_id = lb.master_emp_id,
                                   name = lb.name,
                                   fathers_name = lb.fathers_name,
                                   gender = lb.gender,
                                   gender_value = contextObj.refmaster.Where(x => x.id == lb.gender).Select(x => x.reference_value).FirstOrDefault(), 
                                   age = lb.age,
                                   blood_group = lb.blood_group,
                                   blood_group_value = contextObj.refmaster.Where(x => x.id == lb.blood_group).Select(x => x.reference_value).FirstOrDefault(),
                                   mother_tongue = lb.mother_tongue,
                                   current_street = lb.current_street,
                                   current_country = lb.current_country,
                                   current_state = lb.current_state,
                                   current_city = lb.current_city,
                                   currentcity_name = contextObj.cityset.Where(x => x.id == lb.current_city).Select(x => x.city_name).FirstOrDefault(),
                                   current_zip = lb.current_zip,
                                   current_contact_number = lb.current_contact_number,
                                   permanent_street = lb.permanent_street,
                                   permanent_country = lb.permanent_country,
                                   permanent_state = lb.permanent_state,
                                   permanent_city = lb.permanent_city,
                                   permanent_zip = lb.permanent_zip,
                                   permanent_contact_number = lb.permanent_contact_number,
                                   contact_person_name = lb.contact_person_name,
                                   contact_person_relationship_id = lb.contact_person_relationship_id,
                                   contact_person_relationship_name = contextObj.refmaster.Where(x => x.id == lb.contact_person_relationship_id).Select(x => x.reference_value).FirstOrDefault(),
                                   contact_person_street = lb.contact_person_street,
                                   contact_person_country = lb.contact_person_country,
                                   contact_person_state = lb.contact_person_state,
                                   contact_person_city = lb.contact_person_city,
                                   contact_person_zip = lb.contact_person_zip,
                                   contact_person_contact_number = lb.contact_person_contact_number,
                                   bank_name = lb.bank_name,
                                   bank_account_no = lb.bank_account_no,
                                   bank_branch = lb.bank_branch,
                                   ifsc = lb.ifsc,
                                   pan = lb.pan,
                                   aadhar = lb.aadhar,
                                   epf_no = lb.epf_no,
                                   esi_no = lb.esi_no,
                                   labour_photo = lb.labour_photo,
                                   labour_photo_file_type = lb.labour_photo_file_type,
                                   labour_filename = lb.labour_filename,
                                   check_aadhar = lb.check_aadhar,
                                   aadhar_encode = lb.aadhar_encode,
                                   aadhar_encode_file_type = lb.aadhar_encode_file_type,
                                   aadhar_filename = lb.aadhar_filename,
                                   check_bank = lb.check_bank,
                                   bank_encode = lb.bank_encode,
                                   bank_encode_file_type = lb.bank_encode_file_type,
                                   bank_filename = lb.bank_filename,
                                   check_medical_certificate = lb.check_medical_certificate,
                                   medical_certificate_encode = lb.medical_certificate_encode,
                                   medical_certificate_encode_file_type = lb.medical_certificate_encode_file_type,
                                   medical_filename = lb.medical_filename,
                                   check_eye_certificate = lb.check_eye_certificate,
                                   eye_certificate_encode = lb.eye_certificate_encode,
                                   eye_certificate_encode_file_type = lb.eye_certificate_encode_file_type,
                                   eye_certificate_filenmae = lb.eye_certificate_filenmae,
                                   created_date = lb.created_date,
                                   created_by = lb.created_by,
                                   created_name= contextObj.RoleSet.Where(x => x.id == lb.created_by).Select(x => x.Name).FirstOrDefault(),
                                   modified_date = lb.modified_date,
                                   modified_by = lb.modified_by,
                                   wbi_no = contextObj.inductionset.Where(x=>x.master_emp_id == lb.master_emp_id).Select(x=>x.wbi_no).FirstOrDefault(),
                                   emp_code = contextObj.EmployeeMaster.Where(x => x.id == lb.master_emp_id).Select(x => x.emp_code).FirstOrDefault(),
                                   code_seperation = contextObj.EmployeeMaster.Where(x => x.id == lb.master_emp_id).Select(x => x.code_seperation).FirstOrDefault(),
                                   emp_num = contextObj.EmployeeMaster.Where(x => x.id == lb.master_emp_id).Select(x => x.emp_num).FirstOrDefault()
                               }
                               );

            return Ok(Labourslist);
        }



        [HttpPost]
        [Route("UpdateLabour")]
        public HttpResponseMessage UpdateLabour(HttpRequestMessage request, LabourViewModel labour)
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
                    var existinglabour = _labourRepository.GetSingle(labour.id);
                    existinglabour.subcontractor_id = labour.subcontractor_id;
                    existinglabour.name = labour.name;
                    existinglabour.fathers_name = labour.fathers_name;
                    existinglabour.gender = labour.gender;
                    existinglabour.age = labour.age;
                    existinglabour.blood_group = labour.blood_group;
                    existinglabour.mother_tongue = labour.mother_tongue;

                    existinglabour.current_street = labour.current_street;
                    existinglabour.current_state = labour.current_state;
                    existinglabour.current_country = labour.current_country;
                    existinglabour.current_city = labour.current_city;
                    existinglabour.current_zip = labour.current_zip;
                    existinglabour.current_contact_number = labour.current_contact_number;

                    existinglabour.permanent_street = labour.permanent_street;
                    existinglabour.permanent_country = labour.permanent_country;
                    existinglabour.permanent_state = labour.permanent_state;
                    existinglabour.permanent_city = labour.permanent_city;
                    existinglabour.permanent_zip = labour.permanent_zip;
                    existinglabour.permanent_contact_number = labour.permanent_contact_number;

                    existinglabour.contact_person_name = labour.contact_person_name;
                    existinglabour.contact_person_relationship_id = labour.contact_person_relationship_id;
                    existinglabour.contact_person_street = labour.contact_person_street;
                    existinglabour.contact_person_country = labour.contact_person_country;
                    existinglabour.contact_person_state = labour.contact_person_state;
                    existinglabour.contact_person_city = labour.contact_person_city;
                    existinglabour.contact_person_zip = labour.contact_person_zip;
                    existinglabour.contact_person_contact_number = labour.contact_person_contact_number;

                    existinglabour.bank_name = labour.bank_name;
                    existinglabour.bank_account_no = labour.bank_account_no;
                    existinglabour.bank_branch = labour.bank_branch;
                    existinglabour.ifsc = labour.ifsc;
                    existinglabour.pan = labour.pan;
                    existinglabour.aadhar = labour.aadhar;
                    existinglabour.epf_no = labour.epf_no;
                    existinglabour.esi_no = labour.esi_no;

                    existinglabour.labour_photo = labour.labour_photo;
                    existinglabour.labour_photo_file_type = labour.labour_photo_file_type;
                    existinglabour.labour_filename = labour.labour_filename;

                    existinglabour.check_aadhar = labour.check_aadhar;
                    existinglabour.aadhar_encode = labour.aadhar_encode;
                    existinglabour.aadhar_encode_file_type = labour.aadhar_encode_file_type;
                    existinglabour.aadhar_filename = labour.aadhar_filename;

                    existinglabour.check_bank = labour.check_bank;
                    existinglabour.bank_encode = labour.bank_encode;
                    existinglabour.bank_encode_file_type = labour.bank_encode_file_type;
                    existinglabour.bank_filename = labour.bank_filename;

                    existinglabour.check_medical_certificate = labour.check_medical_certificate;
                    existinglabour.medical_certificate_encode = labour.medical_certificate_encode;
                    existinglabour.medical_certificate_encode_file_type = labour.medical_certificate_encode_file_type;
                    existinglabour.medical_filename = labour.medical_filename;

                    existinglabour.check_eye_certificate = labour.check_eye_certificate;
                    existinglabour.eye_certificate_encode = labour.eye_certificate_encode;
                    existinglabour.eye_certificate_encode_file_type = labour.eye_certificate_encode_file_type;
                    existinglabour.eye_certificate_filenmae = labour.eye_certificate_filenmae;

                    existinglabour.modified_date = DateTime.Now;
                    existinglabour.modified_by = labour.modified_by;

                    _labourRepository.Edit(existinglabour);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }



    }
}