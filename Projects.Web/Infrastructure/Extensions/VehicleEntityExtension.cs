using Projects.Entities.Projects;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Extensions
{
    public static class VehicleEntityExtension
    {
        public static void Addvehicle(this tbl_vehicle vehicle, VehicleViewModel vehicleVm)
        {
            vehicle.tenant_id = vehicleVm.tenant_id;
            vehicle.project_id = vehicleVm.project_id;
            vehicle.subcontractor_id = vehicleVm.subcontractor_id;
            vehicle.vehicle_reg_no = vehicleVm.vehicle_reg_no;
            vehicle.vehicle_type = vehicleVm.vehicle_type;
            vehicle.pollution_clearance = vehicleVm.pollution_clearance;
            vehicle.pollution_validdate = vehicleVm.pollution_validdate;
            vehicle.pollution_filename = vehicleVm.pollution_filename;
            vehicle.pollutionimage_filetype = vehicleVm.pollutionimage_filetype;
            vehicle.pollutionimage = vehicleVm.pollutionimage;

            vehicle.insurence_clearance = vehicleVm.insurence_clearance;
            vehicle.insurence_validdate = vehicleVm.insurence_validdate;
            vehicle.insurence_filename = vehicleVm.insurence_filename;
            vehicle.insurenceimage_filetype = vehicleVm.insurenceimage_filetype;
            vehicle.insurenceimage = vehicleVm.insurenceimage;


            vehicle.fitness_clearance = vehicleVm.fitness_clearance;
            vehicle.fitness_validdate = vehicleVm.fitness_validdate;
            vehicle.fitness_filename = vehicleVm.fitness_filename;
            vehicle.fitnessimage_filetype = vehicleVm.fitnessimage_filetype;
            vehicle.fitnessimage = vehicleVm.fitnessimage;

            vehicle.driver_name = vehicleVm.driver_name;
            vehicle.driver_contact_no = vehicleVm.driver_contact_no;
           // vehicle.working_status = vehicle.working_status;
            vehicle.driver_aadharnumber = vehicleVm.driver_aadharnumber;
            vehicle.driver_filename = vehicleVm.driver_filename;
            vehicle.driver_photo = vehicleVm.driver_photo;
            vehicle.driver_photo_file_type = vehicleVm.driver_photo_file_type;
            vehicle.driver_lic_no = vehicleVm.driver_lic_no;
            vehicle.driver_lic_validdate = vehicleVm.driver_lic_validdate;
            vehicle.driver_lic_filename = vehicleVm.driver_lic_filename;
            vehicle.driverlicimage_filetype = vehicleVm.driverlicimage_filetype;
            vehicle.driverlicimage = vehicleVm.driverlicimage;

            vehicle.current_street = vehicleVm.current_street;
            vehicle.current_country = vehicleVm.current_country;
            vehicle.current_state = vehicleVm.current_state;
            vehicle.current_city = vehicleVm.current_city;
            vehicle.current_zip = vehicleVm.current_zip;

            vehicle.permanent_street = vehicleVm.permanent_street;
            vehicle.permanent_country = vehicleVm.permanent_country;
            vehicle.permanent_state = vehicleVm.permanent_state;
            vehicle.permanent_city = vehicleVm.permanent_city;
            vehicle.permanent_zip = vehicleVm.permanent_zip;

            vehicle.contact_person_name = vehicleVm.contact_person_name;
            vehicle.contact_person_relationship_id = vehicleVm.contact_person_relationship_id;
            vehicle.contact_person_street = vehicleVm.contact_person_street;
            vehicle.contact_person_country = vehicleVm.contact_person_country;
            vehicle.contact_person_state = vehicleVm.contact_person_state;
            vehicle.contact_person_city = vehicleVm.contact_person_city;
            vehicle.contact_person_zip = vehicleVm.contact_person_zip;
            vehicle.contact_person_contact_number = vehicleVm.contact_person_contact_number;
            vehicle.created_date = DateTime.Now;
            vehicle.created_by = vehicleVm.created_by;
            vehicle.modified_date = DateTime.Now;
            vehicle.modified_by = vehicleVm.modified_by;
        }
    }
}