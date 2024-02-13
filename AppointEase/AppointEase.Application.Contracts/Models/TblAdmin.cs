using System;
using System.Collections.Generic;

namespace AppointEase.Data.Models;

public partial class TblAdmin
{
    public int AdminId { get; set; }

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int Role { get; set; }

    public virtual TblRole RoleNavigation { get; set; } = null!;
}
