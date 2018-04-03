using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Projects.Entities;
using Projects.Entities.MasterData;

namespace Projects.Entities.Projects
{
    public class tbl_labour : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int subcontractor_id { get; set; }
        public int master_emp_id { get; set; }
        public string name { get; set; }
        public string fathers_name { get; set; }
        public int gender { get; set; }
        public DateTime age { get; set; }
        public int blood_group { get; set; }
        public string mother_tongue { get; set; }

        public string current_street { get; set; }
        public int current_country { get; set; }
        public int current_state { get; set; }
        public int current_city { get; set; }
        public string current_zip { get; set; }
        public string current_contact_number { get; set; }

        public string permanent_street { get; set; }
        public int permanent_country { get; set; }
        public int permanent_state { get; set; }
        public int permanent_city { get; set; }
        public string permanent_zip { get; set; }
        public string permanent_contact_number { get; set; }

        public string contact_person_name { get; set; }
        public int contact_person_relationship_id { get; set; }
        public string contact_person_street { get; set; }
        public int contact_person_country { get; set; }
        public int contact_person_state { get; set; }
        public int contact_person_city { get; set; }
        public string contact_person_zip { get; set; }
        public string contact_person_contact_number { get; set; }

        public string bank_name { get; set; }
        public string bank_account_no { get; set; }
        public string bank_branch { get; set; }
        public string ifsc { get; set; }
        public string pan { get; set; }
        public string aadhar { get; set; }
        public string epf_no { get; set; }
        public string esi_no { get; set; }

        public byte[] labour_photo { get; set; }
        public string labour_photo_file_type { get; set; }
        public string labour_filename { get; set; }

        public bool check_aadhar { get; set; }
        public byte[] aadhar_encode { get; set; }
        public string aadhar_encode_file_type { get; set; }
        public string aadhar_filename { get; set; }

        public bool check_bank { get; set; }
        public byte[] bank_encode { get; set; }
        public string bank_encode_file_type { get; set; }
        public string bank_filename { get; set; }

        public bool check_medical_certificate { get; set; }
        public byte[] medical_certificate_encode { get; set; }
        public string medical_certificate_encode_file_type { get; set; }
        public string medical_filename { get; set; }

        public bool check_eye_certificate { get; set; }
        public byte[] eye_certificate_encode { get; set; }
        public string eye_certificate_encode_file_type { get; set; }
        public string eye_certificate_filenmae { get; set; }

        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
    }
}
