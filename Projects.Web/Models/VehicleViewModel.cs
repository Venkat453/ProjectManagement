using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;
namespace Projects.Web.Models
{
    public class VehicleViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int subcontractor_id { get; set; }
        public int master_emp_id { get; set; }
        public string vehicle_reg_no { get; set; }
        public int vehicle_type { get; set; }

        public bool pollution_clearance { get; set; }
        public DateTime pollution_validdate { get; set; }
        public string pollution_filename { get; set; }
        public string pollutionimage_filetype { get; set; }
        public Byte[] pollutionimage { get; set; }

        public bool insurence_clearance { get; set; }
        public DateTime insurence_validdate { get; set; }
        public string insurence_filename { get; set; }
        public string insurenceimage_filetype { get; set; }
        public Byte[] insurenceimage { get; set; }

        public bool fitness_clearance { get; set; }
        public DateTime fitness_validdate { get; set; }
        public string fitness_filename { get; set; }
        public string fitnessimage_filetype { get; set; }
        public Byte[] fitnessimage { get; set; }
        public string driver_name { get; set; }
        public string driver_contact_no { get; set; }
        public string driver_aadharnumber { get; set; }
        public string driver_filename { get; set; }
        public byte[] driver_photo { get; set; }
        public string driver_photo_file_type { get; set; }

        public string driver_lic_no { get; set; }
        public DateTime driver_lic_validdate { get; set; }
        public string driver_lic_filename { get; set; }
        public string driverlicimage_filetype { get; set; }
        public Byte[] driverlicimage { get; set; }

        public string current_street { get; set; }
        public int current_country { get; set; }
        public int current_state { get; set; }
        public int current_city { get; set; }
        public string current_zip { get; set; }

        public string permanent_street { get; set; }
        public int permanent_country { get; set; }
        public int permanent_state { get; set; }
        public int permanent_city { get; set; }
        public string permanent_zip { get; set; }

        public string contact_person_name { get; set; }
        public int contact_person_relationship_id { get; set; }
        public string contact_person_street { get; set; }
        public int contact_person_country { get; set; }
        public int contact_person_state { get; set; }
        public int contact_person_city { get; set; }
        public string contact_person_zip { get; set; }
        public string contact_person_contact_number { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }

    }
}