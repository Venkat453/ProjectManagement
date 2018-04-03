using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class SettingsViewModel : IEntityBase
    {
      
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string emp_code { get; set; }
        public string code_seperation { get; set; }
        public int emp_num { get; set; }
    }
}