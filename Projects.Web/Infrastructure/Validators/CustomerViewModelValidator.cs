using Projects.Web.Models;
using FluentValidation;

namespace Projects.Web.Infrastructure.Validators
{
    public class CustomerViewModelValidator : AbstractValidator<CustomerViewModel>
    {
        public CustomerViewModelValidator()
        {
            RuleFor(c => c.customer_code).NotEmpty()
                .WithMessage("Invalid Customer Code!");

        }
    }
}