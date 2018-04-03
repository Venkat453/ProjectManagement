using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
  public class tbl_induction: IEntityBase
    {
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int master_emp_id { get; set; }
        public string empcode { get; set; }
        public string name { get; set; }
        public DateTime date_of_joining { get; set; }
        public DateTime induction_date { get; set; }
       // public bool induction { get; set; }
        public int wbi_no { get; set; }
    }
}
