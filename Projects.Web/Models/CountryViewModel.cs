using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;

namespace Projects.Web.Models
{
    public class CountryViewModel : IValidatableObject
    {
        public int id { get; set; }
        public string iso_code { get; set; }
        public string country_name { get; set; }
        public string capital { get; set; }
        public string country_code { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new CountryViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}