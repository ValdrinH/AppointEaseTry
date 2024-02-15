using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Contracts.Interfaces
{
    public interface IAuthenticationService
    {
        Task<IdentityResult> RegisterAsync();
        Task<SignInResult> LoginAsync();
    }
}
