using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class SubcontractorCoponentViewModel : IEntityBase
    {
        public int id { get; set; } 
        public int component_id { get; set; }
        public string component_name { get; set; }

    }
}