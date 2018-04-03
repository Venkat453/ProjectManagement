using Projects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class IndentDetailsViewModel : IEntityBase
    {
         public int id { get; set; }
        public int tenant_id { get; set; }
        public int project_id { get; set; }
        public int SubContractor_id { get; set; }
        public string indent_no { get; set; }
        public string material_name { get; set; }
        public string material_description { get; set; }
        public int quantity { get; set; }
        public int unit_of_measurement { get; set; }
        public int material_price { get; set; }
        public int total_price { get; set; }
        public int given_quantity { get; set; }
        public bool material_released_status { get; set; }
        public float released_material_Cost { get; set; }
        public DateTime material_released_date { get; set; }
    }
}