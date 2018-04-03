using Projects.Web.Models;
using FluentValidation;

namespace Projects.Web.Infrastructure.Validators
{
    public class CompanyViewModelValidator : AbstractValidator<CompanyViewModel>
    {
        public CompanyViewModelValidator()
        {
            RuleFor(c => c.company_code).NotEmpty()
                .WithMessage("Invalid Company!");

        }
    }
}