using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{

    public class tbl_project_master : IEntityBase
    {

        public tbl_project_master()
        {
            subcontractors = new HashSet<tbl_subcontractor>();
        }
        [Key]
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }

        public string project_name { get; set; }
        public string project_description { get; set; }

        public string project_customer { get; set; }

        public virtual ICollection<tbl_subcontractor> subcontractors { get; set; }

    }

}
