using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class EmployeeViewModel
    {
        public int id { get; set; }
        
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