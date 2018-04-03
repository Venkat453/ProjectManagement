using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class JunComponents:IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int junction_id { get; set; }
        public string component { get; set; }
        public int quantity { get; set; }       
    }
}