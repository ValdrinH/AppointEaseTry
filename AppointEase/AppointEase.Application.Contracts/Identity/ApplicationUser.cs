using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Contracts.Identity
{
    public class ApplicationUser : IdentityUser
    {
        public string Emri { get; set; }
        public string Mbiemri { get; set; }
        public string Roli { get; set; }
    }
}
