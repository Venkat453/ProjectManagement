using Projects.Web.Infrastructure.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class UsersRegistrationViewModel : IValidatableObject
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string userid { get; set; }
        public string UserName { get; set; }
        public string password { get; set; }
        public string Email { get; set; }
        public bool is_tenant { get; set; }
        public bool mail2tenant { get; set; }
        public bool mail2user { get; set; }
        public int Roleid { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new RegistrationViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}