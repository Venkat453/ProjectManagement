using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;
using Projects.Entities;
using System;

namespace Projects.Web.Models
{
    public class RepresentativeViewModel : IEntityBase
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public int company_id { get; set; }
        public string representative_name { get; set; }
        public string email { get; set; }
        public string contact_no { get; set; }
        public string alt_contact_no { get; set; }
        public string present_address { get; set; }
        public string permanent_address { get; set; }
        public int country { get; set; }
        public int state { get; set; }
        public int city { get; set; }
        public string zip { get; set; }
        public byte[] photo { get; set; }
        public string photo_image_type { get; set; }
        public DateTime? birth_date { get; set; }
        public DateTime? anniversary_date { get; set; }
        public string comments { get; set; }
        public bool is_active { get; set; }
        public DateTime date_added { get; set; }
        public int added_by { get; set; }
        public DateTime last_modified { get; set; }
        public int modified_by { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new RepresentativeViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}