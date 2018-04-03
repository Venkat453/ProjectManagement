using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class PurchaseOrderViewModel : IEntityBase
    {
        public int id { get; set; }
        public int purchase_id { get; set; }
        public int product_id { get; set; }
        public string batch_no { get; set; }
        public int unit_id { get; set; }
        public DateTime manufacture_date { get; set; }
        public DateTime expiry_date { get; set; }
        public float mrp { get; set; }
        public int quantity { get; set; }
        public float unit_price { get; set; }
        public float total_price { get; set; }
    }
}