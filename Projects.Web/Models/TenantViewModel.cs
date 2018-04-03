using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class TenantViewModel : IEntityBase
    {
        public int id { get; set; }
        public string tenant_key { get; set; }
        public int tenant_type { get; set; }
        public string tenant_name { get; set; } 
        public string domain { get; set; }
        public string pan { get; set; }
        public string tin { get; set; }
        public string vat { get; set; }
        public int? finance_start_month { get; set; }
        public string bank_account_no { get; set; }
        public string bank_name { get; set; }
        public string bank_branch { get; set; }
        public string ifsc_code { get; set; }
        public string contact_person { get; set; }
        public string email { get; set; }
        public string contact_no { get; set; }
        public string alt_contact_no { get; set; }
        public string address { get; set; }
        public int city { get; set; }
        public int? state { get; set; }
        public int? country { get; set; }
        public int? zip { get; set; }
        public byte[] logo { get; set; }
        public string logo_image_type { get; set; }
        public string comments { get; set; }
        public bool IsLocked { get; set; }
        public DateTime account_valid_till { get; set; }
        public DateTime date_created { get; set; }
        public int created_by { get; set; }
        public DateTime date_modified { get; set; }
        public int modified_by { get; set; }
    }
}