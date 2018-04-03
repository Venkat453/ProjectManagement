using Projects.Web.Models;
using FluentValidation;

namespace Projects.Web.Infrastructure.Validators
{
    public class RepresentativeViewModelValidator : AbstractValidator<RepresentativeViewModel>
    {
        public RepresentativeViewModelValidator()
        {
            RuleFor(c => c.id).NotEmpty()
                .WithMessage("Invalid Company!");

        }
    }
}