using System;
using Projects.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class PoliceStationViewModel: IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string ps_name { get; set; }
        public string ps_contact_person { get; set; }
        public string contact_person_mobile_no { get; set; }
        public DateTime created_date { get; set; }
        public int created_by { get; set; }
        public DateTime modified_date { get; set; }
        public int modified_by { get; set; }
    }
}