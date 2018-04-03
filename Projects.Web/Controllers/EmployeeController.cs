using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Data.Infrastructure;
using Projects.Data.Repositories;
using Projects.Entities.Membership;
using Projects.Entities.Projects;
using Projects.Web.Infrastructure.Core;
using Projects.Web.Infrastructure.Extensions;
using Projects.Web.Models;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AutoMapper;
using Projects.Data;

namespace Projects.Web.Controllers
{
    
        [RoutePrefix("api/EmployeeMaster")]

        public class EmployeeController : ApiControllerBase
        {

            public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
            public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;


        public EmployeeController(IEntityBaseRepository<tbl_settings> settingsRepository,
                IEntityBaseRepository<tbl_employee> EmployeeRepository,
                IEntityBaseRepository<tbl_error> _errorsRepository, IUnitOfWork _unitOfWork)
                : base(_errorsRepository, _unitOfWork)
            {
                _EmployeeRepository = EmployeeRepository;
                _settingsRepository = settingsRepository;

            }



        [HttpPost]
        [Route("AddEmployee")]
        public HttpResponseMessage AddEmployee(HttpRequestMessage request, EmployeeViewModel employee)
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
                    var codeFormat = _settingsRepository.GetAll().Where(t => t.tenant_id == employee.tenant_id).FirstOrDefault();
                    var exsistingEmployees = _EmployeeRepository.GetAll().Where(e => e.tenant_id == employee.tenant_id);

                    tbl_employee newEmployeeMaster = new tbl_employee();
                    int empCount = exsistingEmployees.Where(t => t.tenant_id == employee.tenant_id).Count();
                                                            
                    if (empCount <= 0)
                    {

                        newEmployeeMaster.emp_code = codeFormat.emp_code;
                        newEmployeeMaster.code_seperation = codeFormat.code_seperation;
                        newEmployeeMaster.emp_num = codeFormat.emp_num;
                    }
                    else
                    {
                        // var lastERec = _EmployeeRepository.GetAll().Where(e=>e.tenant_id==employee.tenant_id).GroupBy(e=>e.tenant_id).Select(y=>new { tenant_id=y.Key,  lastrecord=y.OrderByDescending(e=>e.emp_num).FirstOrDefault()});
                        var lastERec = _EmployeeRepository.GetAll().Where(e => e.tenant_id == employee.tenant_id).OrderByDescending(e => e.id).First();
                        newEmployeeMaster.emp_code = lastERec.emp_code;
                        newEmployeeMaster.code_seperation = lastERec.code_seperation;
                        newEmployeeMaster.emp_num = lastERec.emp_num+1;
                    }
                    

                    newEmployeeMaster.AddEmployeeMaster(employee);
                    _EmployeeRepository.Add(newEmployeeMaster);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<EmployeeViewModel>(HttpStatusCode.Created, employee);
                }
                return response;
            });
        }
        
        [HttpGet]
        [Route("GetEmployees/{tenant_id:int}")]
        public HttpResponseMessage GetEmployees(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var EmployeesList = _EmployeeRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<EmployeeViewModel> Employeeslistvm = Mapper.Map<IEnumerable<tbl_employee>, IEnumerable<EmployeeViewModel>>(EmployeesList);
                response = request.CreateResponse<IEnumerable<EmployeeViewModel>>(HttpStatusCode.OK, Employeeslistvm);
                return response;

            });
        }


        [HttpPost]
        [Route("AddEmployeeCodeSettings")]
        public HttpResponseMessage AddEmployeeCodeSettings(HttpRequestMessage request, SettingsViewModel settings)
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
                    tbl_settings newSettings = new tbl_settings();
                    newSettings.AddSettings(settings);
                    _settingsRepository.Add(newSettings);
                    _unitOfWork.Commit();
                    response = request.CreateResponse<SettingsViewModel>(HttpStatusCode.Created, settings);
                }
                return response;
            });
        }



        [HttpGet]
        [Route("GetEmployeesList")]
        public HttpResponseMessage GetEmployeesList(HttpRequestMessage request)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var SettingsList = _settingsRepository.GetAll();
                IEnumerable<SettingsViewModel> SettingListvm = Mapper.Map<IEnumerable<tbl_settings>, IEnumerable<SettingsViewModel>>(SettingsList);
                response = request.CreateResponse<IEnumerable<SettingsViewModel>>(HttpStatusCode.OK, SettingListvm);
                return response;

            });
        }




    }
}
