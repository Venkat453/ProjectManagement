using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class LoginTrackViewModel
    {
        public int id { get; set; }
        public string tenant_key { get; set; }
        public int user_id { get; set; }
        public DateTime login_time { get; set; }
        public string login_ip { get; set; }
        public string location { get; set; }
    }
}