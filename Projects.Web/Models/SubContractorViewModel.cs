using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class SubContractorViewModel:IEntityBase
    {
        public int id { get; set; } 
        public int tenant_id { get; set; }
        public string company_name { get; set; }
        public int project_id { get; set; }
        public string reg_No { get; set; }
        public string subcontractor_name { get; set; }
        public string current_street { get; set; }
        public int current_country { get; set; }
        public int current_state { get; set; }
        public int current_city { get; set; }
        public string current_zip { get; set; }
        public string current_contact_number { get; set; }
        public string alternative_contactNumber { get; set; } 
        public string service_tax_no { get; set; }
        public string pan { get; set; }
        public string bank_account_no { get; set; }
        public string bank_name { get; set; }
        public string bank_branch { get; set; }
        public string ifsc { get; set; }
        public byte[] contractor_photo { get; set; }
        public string contractor_photo_file_type { get; set; }
        public string contractor_photo_file_name { get; set; } 
        public byte[] agreement { get; set; }
        public string agreement_file_type { get; set; }
        public string contractor_agreement_file_name { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
        public string email_id { get; set; }
        public List<SubcontractorCoponentViewModel> scomponentslist { get; set; }


    }
}