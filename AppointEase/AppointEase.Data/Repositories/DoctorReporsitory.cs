using AppointEase.Application.Contracts.Models;
using AppointEase.Data.Data;
using AppointEase.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Data.Repositories
{
    public class DoctorReporsitory : Repository<TblDoctor>
    {
        public DoctorReporsitory(AppointEaseContext context) : base(context)
        {
        }
    }
}
