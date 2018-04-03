using FluentValidation;
using Projects.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Projects.Web.Infrastructure.Validators
{
    public class RegistrationViewModelValidator : AbstractValidator<UsersRegistrationViewModel>
    {
        public RegistrationViewModelValidator()
        {
            RuleFor(r => r.Email).NotEmpty().EmailAddress()
                .WithMessage("Invalid email address");

            RuleFor(r => r.userid).NotEmpty()
                .WithMessage("Invalid userid");

            RuleFor(r => r.password).NotEmpty()
                .WithMessage("Invalid password");
        }
    }

    public class LoginViewModelValidator : AbstractValidator<LoginViewModel>
    {
        public LoginViewModelValidator()
        {
            RuleFor(r => r.userid).NotEmpty()
                .WithMessage("Invalid userid");

            RuleFor(r => r.password).NotEmpty()
                .WithMessage("Invalid password");
        }
    }

    public class UsersViewModelValidator : AbstractValidator<UsersViewModel>
    {
        public UsersViewModelValidator()
        {
            RuleFor(r => r.user_name).NotEmpty()
                .WithMessage("Invalid userid");

            RuleFor(r => r.email).NotEmpty()
                .WithMessage("Invalid password");
        }
    }
}