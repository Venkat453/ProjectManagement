using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class MaterialpriceViewModel: IEntityBase
    {
       
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public string material_name { get; set; }
        public string material_description { get; set; }
        public int unit_of_measurement { get; set; }
        public string material_price { get; set; }
     
    }
}