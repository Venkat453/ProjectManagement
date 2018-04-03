using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class FieldworkViewModel : IEntityBase
    {

        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string fieldwork_name { get; set; }
        public string fieldwork_description { get; set; }
        public int unit_of_measurement { get; set; }
        public string fieldwork_price { get; set; }
 

    }
}