using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class InductionViewModel : IEntityBase
    {
        public int id { get; set; }
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