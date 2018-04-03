using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class WorkProgressHistoryViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string junction_component { get; set; }
        public DateTime update_date { get; set; }
        public int junction_id { get; set; }
        public int subcontractor_id { get; set; }
        public int total { get; set; }
        public int completed { get; set; }
        public int pending { get; set; }
        public int progress { get; set; }
    }
}