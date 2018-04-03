using Projects.Web.Models;
using FluentValidation;

namespace Projects.Web.Infrastructure.Validators
{
    public class CountryViewModelValidator : AbstractValidator<CountryViewModel>
    {
        public CountryViewModelValidator()
        {
            RuleFor(c => c.country_name).NotEmpty()
                .WithMessage("Invalid Country!");

        }
    }

    public class StatesViewModelValidator : AbstractValidator<StatesViewModel>
    {
        public StatesViewModelValidator()
        {
            RuleFor(s => s.state_name).NotEmpty()
                .WithMessage("Invalid State!");

        }
    }
}