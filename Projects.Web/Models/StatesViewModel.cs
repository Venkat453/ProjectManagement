using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using Projects.Web.Infrastructure.Validators;

namespace Projects.Web.Models
{
    public class StatesViewModel : IValidatableObject
    {
        public int id { get; set; }
        public int country_id { get; set; }
        public string state_name { get; set; }
        public string capital { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new StatesViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}