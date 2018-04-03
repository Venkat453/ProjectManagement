using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;

namespace Projects.Web.Models
{
    public class CompanyViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string company_code { get; set; }
        public string company_name { get; set; }
        public string domain { get; set; }
        public string pan { get; set; }
        public string tin { get; set; }
        public string vat { get; set; }
        public string contact_person { get; set; }
        public string email { get; set; }
        public string contact_no { get; set; }
        public string alt_contact_no { get; set; }
        public string address { get; set; }
        public int country { get; set; }
        public int state { get; set; }
        public int city { get; set; }
        public string zip { get; set; }
        public byte[] logo { get; set; }
        public string logo_image_type { get; set; }
        public string bank_account_no { get; set; }
        public string bank_name { get; set; }
        public string bank_branch { get; set; }
        public string ifsc_code { get; set; }
        public string comments { get; set; }
        public bool is_active { get; set; }
        public DateTime date_added { get; set; }
        public int added_by { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new CompanyViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}