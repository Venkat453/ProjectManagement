using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class JunctionViewModel: IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }        
        public int project_id { get; set; }
        public int ps_id { get; set; }
        public string junction_name { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
        public List<JunComponents> junComponents { get; set; }
    }
}