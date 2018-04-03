using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class ProjectMasterViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string project_name { get; set; }
        public string project_description { get; set; }
        public string project_customer { get; set; }

    }
}