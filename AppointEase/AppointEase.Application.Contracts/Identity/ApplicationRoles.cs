using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Contracts.Identity
{
    [Table("Roles")]
    public class ApplicationRoles : IdentityRole
    {
        public string Pershkrimi { get; set; }
    }
}
