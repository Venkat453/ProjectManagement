using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Projects.Entities.Projects
{
    public class tbl_Workprogress_History : IEntityBase
    {
        [Key]
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string junction_component { get; set; }
        public DateTime update_date { get; set; } 
        public int junction_id { get; set; }
        public int subcontractor_id { get; set; }
        public int total { get; set; }
        public int completed { get; set; }
        public int pending { get; set; }
        public int progress { get; set; }
    }
}
