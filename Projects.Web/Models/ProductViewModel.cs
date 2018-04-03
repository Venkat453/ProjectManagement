using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class ProductViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int company_id { get; set; }
        public string product_code { get; set; }
        public string product_name { get; set; }
        public int product_type { get; set; } //inhouse manufactured or purchased
        public int packing { get; set; } //packet, ml, strip, bottle
        public string batch_no { get; set; }
        public decimal mrp { get; set; }
        public decimal purchase_price { get; set; }
        public decimal sales_price { get; set; }
        public int discount_percent { get; set; }
        public int? rack_id { get; set; }
        public string note { get; set; }
        public DateTime date_added { get; set; }
        public int added_by { get; set; }
        public DateTime date_modified { get; set; }
        public int modified_by { get; set; }
    }
}