using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class WorkVerificationHistoryViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int ps_id { get; set; }
        public int junction_id { get; set; }
        public int subcontractor_id { get; set; }
        public string junction_component { get; set; }
        public int total { get; set; }
        public int completed { get; set; }
        public int verification_status { get; set; }
        public int verified_quantity { get; set; }
        public int nc_quantity { get; set; }
        public string comments { get; set; }
        public int verified_by { get; set; }
        public DateTime created_date { get; set; }
    }
}