using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projects.Entities.Projects
{
    public class tbl_employee:IEntityBase
    {
        [Key]
        public int id { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string emp_code { get; set; }
        public string code_seperation { get; set; }
        public int emp_num { get; set; }
        public string Designation { get; set; }
        public string emp_name { get; set; }
        public DateTime date_created { get; set; }
        public string CreatedBy { get; set; }




    }
}
