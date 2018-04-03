using Projects.Web.Infrastructure.Validators;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Projects.Web.Models
{
    public class UsersViewModel : IValidatableObject
    {
        public int id { get; set; }
        public int tenant_id { get; set; }
        public string userid { get; set; }
        public string user_name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public string salt { get; set; }
        public bool is_locked { get; set; }
        public bool is_tenant { get; set; }
        public int role_id { get; set; }
        public DateTime date_created { get; set; }
        public DateTime date_modified { get; set; }

        //public List<TestStepsViewModel> testSteps { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validator = new UsersViewModelValidator();
            var result = validator.Validate(this);
            return result.Errors.Select(item => new ValidationResult(item.ErrorMessage, new[] { item.PropertyName }));
        }
    }
}