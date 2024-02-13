using AppointEase.Data.Data;
using AppointEase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Data.Repositories
{
    public class UserRepository : Repository<TblUser>
    {
        public UserRepository(AppointEaseContext context) : base(context)
        {
        }
    }
}
