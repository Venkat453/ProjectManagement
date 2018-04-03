using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class LogViewModel : IEntityBase
    {
        public int id { get; set; } 
        public int userid { get; set; }
        public string user_name { get; set; }

        public string ip_address { get; set; }

        public string page_url { get; set; }
        public string reference_url { get; set; }
        public DateTime created_date { get; set; }


    }
}