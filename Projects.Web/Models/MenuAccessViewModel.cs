using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class MenuAccessViewModel
    {
        public int id { get; set; }
        public int menu_id { get; set; }
        public int user_id { get; set; }
        public int tenant_id { get; set; }
        public bool is_active { get; set; }
    }
}