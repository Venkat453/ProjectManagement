using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class referencemasterViewModel
    {
        public int id { get; set; }
        public int group_id { get; set; }
        public string reference_item { get; set; }
        public string reference_value { get; set; }
        public string description { get; set; }
    }
}