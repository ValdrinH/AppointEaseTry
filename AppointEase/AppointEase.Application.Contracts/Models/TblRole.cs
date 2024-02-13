using System;
using System.Collections.Generic;

namespace AppointEase.Data.Models;

public partial class TblRole
{
    public int RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<TblAdmin> TblAdmins { get; set; } = new List<TblAdmin>();

    public virtual ICollection<TblUser> TblUsers { get; set; } = new List<TblUser>();
}
