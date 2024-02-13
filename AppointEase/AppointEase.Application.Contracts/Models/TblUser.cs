using System;
using System.Collections.Generic;

namespace AppointEase.Data.Models;

public partial class TblUser
{
    public int UserId { get; set; }

    public string PersonalNumber { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string Gander { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string ContactNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int Role { get; set; }

    public virtual TblRole RoleNavigation { get; set; } = null!;
}
