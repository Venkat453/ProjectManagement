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
    [RoutePrefix("api/Vehicle")]
    public class VehicleController : ApiControllerBase
    {
        public readonly IEntityBaseRepository<tbl_vehicle> _vehicleRepository;
        public readonly IEntityBaseRepository<tbl_employee> _EmployeeRepository;
        public readonly IEntityBaseRepository<tbl_settings> _settingsRepository;

        public VehicleController(IEntityBaseRepository<tbl_vehicle> vehicleRepository,
            IEntityBaseRepository<tbl_settings> settingsRepository,
            IEntityBaseRepository<tbl_employee> EmployeeRepository,
            IEntityBaseRepository<tbl_error> _errorsRepository,
            IUnitOfWork _unitOfWork)
            : base(_errorsRepository, _unitOfWork)
        {
            _vehicleRepository = vehicleRepository;
            _EmployeeRepository = EmployeeRepository;
            _settingsRepository = settingsRepository;
        }
        
        [HttpPost]
        [Route("Savevehicle")]
        public HttpResponseMessage Savevehicle(HttpRequestMessage request, VehicleViewModel vehicle)
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
                    var codeFormat = _settingsRepository.GetAll().Where(t => t.tenant_id == vehicle.tenant_id).FirstOrDefault();
                    var exsistingEmployees = _EmployeeRepository.GetAll().Where(e => e.tenant_id == vehicle.tenant_id);

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
                        var lastERec = _EmployeeRepository.GetAll().Where(e => e.tenant_id == vehicle.tenant_id).OrderByDescending(e => e.id).First();
                        //var lastERec = _EmployeeRepository.GetSingle(empCount);
                        newEmployeeMaster.emp_code = lastERec.emp_code;
                        newEmployeeMaster.code_seperation = lastERec.code_seperation;
                        newEmployeeMaster.emp_num = lastERec.emp_num + 1;
                    }

                    newEmployeeMaster.tenant_id = vehicle.tenant_id;
                    newEmployeeMaster.project_id = vehicle.project_id;
                    newEmployeeMaster.Designation = "Driver";
                    newEmployeeMaster.emp_name = vehicle.driver_name;
                    newEmployeeMaster.date_created = DateTime.Now;
                    newEmployeeMaster.CreatedBy = "Admin";

                    _EmployeeRepository.Add(newEmployeeMaster);
                    //_unitOfWork.Commit();


                    //end of saving to master emp table

                    tbl_vehicle newProject = new tbl_vehicle();
                    newProject.master_emp_id = _EmployeeRepository.GetAll().Count() + 1;
                    
                    newProject.created_date = DateTime.Now;
                    newProject.created_by = GlobalVars.gvUserID;
                    newProject.modified_date = DateTime.Now;
                    newProject.modified_by = GlobalVars.gvUserID;

                    newProject.Addvehicle(vehicle);

                    _vehicleRepository.Add(newProject);

                    _unitOfWork.Commit();
                    response = request.CreateResponse<VehicleViewModel>(HttpStatusCode.Created, vehicle);
                }
                return response;
            });
        }

        [HttpGet]
        [Route("GetVehiclesList/{tenant_id:int}")]
        public HttpResponseMessage GetVehiclesList(HttpRequestMessage request, int tenant_id)
        {
            return CreateHttpResponse(request, () =>
            {
                HttpResponseMessage response = null;
                var Vehicles = _vehicleRepository.GetAll().Where(x => x.tenant_id == tenant_id);
                IEnumerable<VehicleViewModel> Vehiclesvm = Mapper.Map<IEnumerable<tbl_vehicle>, IEnumerable<VehicleViewModel>>(Vehicles);
                response = request.CreateResponse<IEnumerable<VehicleViewModel>>(HttpStatusCode.OK, Vehiclesvm);
                return response;

            });
        }

        [HttpPost]
        [Route("UpdateVehicles")]
        public HttpResponseMessage UpdateVehicles(HttpRequestMessage request, VehicleViewModel vehicle)
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
                    var existingVehicle = _vehicleRepository.GetSingle(vehicle.id);
                    existingVehicle.vehicle_reg_no = vehicle.vehicle_reg_no;
                    existingVehicle.pollution_clearance = vehicle.pollution_clearance;
                    existingVehicle.pollution_validdate = vehicle.pollution_validdate;

                    existingVehicle.pollution_filename = vehicle.pollution_filename;
                    existingVehicle.pollutionimage_filetype = vehicle.pollutionimage_filetype;
                    existingVehicle.pollutionimage = vehicle.pollutionimage;

                    existingVehicle.insurence_clearance = vehicle.insurence_clearance;
                    existingVehicle.insurence_validdate = vehicle.insurence_validdate;

                    existingVehicle.insurence_filename = vehicle.insurence_filename;
                    existingVehicle.insurenceimage_filetype = vehicle.insurenceimage_filetype;
                    existingVehicle.insurenceimage = vehicle.insurenceimage;


                    existingVehicle.fitness_clearance = vehicle.fitness_clearance;
                    existingVehicle.fitness_validdate = vehicle.fitness_validdate;

                    existingVehicle.fitness_filename = vehicle.fitness_filename;
                    existingVehicle.fitnessimage_filetype = vehicle.fitnessimage_filetype;
                    existingVehicle.fitnessimage = vehicle.fitnessimage;

                    existingVehicle.driver_photo = vehicle.driver_photo;
                    existingVehicle.driver_photo_file_type = vehicle.driver_photo_file_type;
                    existingVehicle.driver_filename = vehicle.driver_filename;

                    existingVehicle.driver_name = vehicle.driver_name;
                    existingVehicle.driver_contact_no = vehicle.driver_contact_no;
                    existingVehicle.driver_aadharnumber = vehicle.driver_aadharnumber;
                    existingVehicle.driver_lic_no = vehicle.driver_lic_no;
                    existingVehicle.driver_lic_validdate = vehicle.driver_lic_validdate;

                    existingVehicle.driverlicimage = vehicle.driverlicimage;
                    existingVehicle.driverlicimage_filetype = vehicle.driverlicimage_filetype;
                    existingVehicle.driver_lic_filename = vehicle.driver_lic_filename;
                   

                    existingVehicle.current_street = vehicle.current_street;
                    existingVehicle.current_country = vehicle.current_country;
                    existingVehicle.current_state = vehicle.current_state;
                    existingVehicle.current_city = vehicle.current_city;
                    existingVehicle.current_zip = vehicle.current_zip;

                    existingVehicle.permanent_street = vehicle.permanent_street;
                    existingVehicle.permanent_country = vehicle.permanent_country;
                    existingVehicle.permanent_state = vehicle.permanent_state;
                    existingVehicle.permanent_city = vehicle.permanent_city;
                    existingVehicle.permanent_zip = vehicle.permanent_zip;

                    existingVehicle.contact_person_name = vehicle.contact_person_name;
                    existingVehicle.contact_person_relationship_id = vehicle.contact_person_relationship_id;
                    existingVehicle.contact_person_street = vehicle.contact_person_street;
                    existingVehicle.contact_person_country = vehicle.contact_person_country;
                    vehicle.contact_person_state = vehicle.contact_person_state;
                    existingVehicle.contact_person_city = vehicle.contact_person_city;
                    existingVehicle.contact_person_zip = vehicle.contact_person_zip;
                    existingVehicle.contact_person_contact_number = vehicle.contact_person_contact_number;
                    existingVehicle.modified_date = DateTime.Now;
                    existingVehicle.modified_by = vehicle.modified_by;
                    _vehicleRepository.Edit(existingVehicle);

                    _unitOfWork.Commit();

                    response = request.CreateResponse(HttpStatusCode.OK);
                }

                return response;
            });
        }

    }
}
