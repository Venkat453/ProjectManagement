using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class PurchaseOrderMasterViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int company_id { get; set; }
        public string purchase_order_no { get; set; }
        public DateTime purchase_order_date { get; set; }
        public decimal sub_total { get; set; }
        public decimal freight { get; set; }
        public decimal sales_tax { get; set; }
        public decimal order_total { get; set; }
        public string po_note { get; set; }
        public int shipping_address { get; set; }
        public DateTime? required_by_date { get; set; }
        public int payment_terms { get; set; }
        public bool po_cancelled { get; set; }
        public string po_cancelled_note { get; set; }
        public int created_by { get; set; }
        public DateTime created_date { get; set; }
        public int? cancelled_by { get; set; }
        public DateTime? cancelled_date { get; set; }

        public PurchaseOrderViewModel purchase_order { get; set; }
    }
}