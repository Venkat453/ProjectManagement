using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_subcontractor_components : IEntityBase
    {
        [Key]
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }

        [ForeignKey("subcontractor"), DatabaseGenerated(DatabaseGeneratedOption.None)]

        public int subcontractor_id { get; set; }
        public string  subcontractor_name { get; set; } 
        public int component_id { get; set; }
        public string component_name { get; set; }

        public virtual tbl_subcontractor subcontractor { get; set; }


    }
}
