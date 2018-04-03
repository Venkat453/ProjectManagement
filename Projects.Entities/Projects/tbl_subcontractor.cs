using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Projects.Entities.MasterData;
namespace Projects.Entities.Projects
{
    public class tbl_subcontractor : IEntityBase
    {
        public tbl_subcontractor()
        {
            sccomponents = new HashSet<tbl_subcontractor_components>();
        }
        public int id { get; set; } 
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public string company_name { get; set; }

        [ForeignKey("project"), DatabaseGenerated(DatabaseGeneratedOption.None)]
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
        public virtual ICollection<tbl_subcontractor_components> sccomponents { get; set; }
        public virtual tbl_project_master project { get; set; }

    }
}
