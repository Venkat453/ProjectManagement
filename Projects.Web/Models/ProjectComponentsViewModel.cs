using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ProjectComponentsViewModel : IEntityBase
    {
        public int id { get; set; }        
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        //public string component { get; set; }
        //public string description { get; set; }
        //public string uom { get; set; }
        public List<Components> componentdetails { get; set; }

        //public DateTime created_date { get; set; }
        //public DateTime modified_date { get; set; }
    }
}