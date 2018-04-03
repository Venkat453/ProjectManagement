using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ErrorLogViewModel
    {
        public int id { get; set; }
        public string tenant_key { get; set; }
        public int user_id { get; set; }
        public string message { get; set; }
        public string stacktrace { get; set; }
        public DateTime date_Created { get; set; }
    }
}