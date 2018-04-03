using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ForgotPasswordViewModel
    {
        public int id { get; set; }
        public int tenant_id { get; set; } 
        public string email { get; set; }
        public string password { get; set; }
        public string salt { get; set; }
    }
}