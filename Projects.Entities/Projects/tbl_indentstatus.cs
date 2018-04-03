using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
   public class tbl_indentstatus :IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int indent_id { get; set; }
        public string indent_no { get; set; }
        public int SubContractor_id { get; set; }
        public string material { get; set; } 
        public string recieved_by { get; set; } 
        public DateTime date_recieved { get; set; }
        public DateTime date_required { get; set; }
        public string indentstatus { get; set; }

    }
}
