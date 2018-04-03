using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class WorkAssignmentViewModel : IEntityBase
    {
        public int id { get; set; }       
        public int tenant_id { get; set; }       
        public int project_id { get; set; }
        public int ps_id { get; set; }
        public int junction_id { get; set; }
        public bool isAssigned { get; set; }
        public DateTime assigned_date { get; set; }
        public int subcontractor_id { get; set; }
        public DateTime created_date { get; set; }
        public DateTime modified_date { get; set; }

    }
}