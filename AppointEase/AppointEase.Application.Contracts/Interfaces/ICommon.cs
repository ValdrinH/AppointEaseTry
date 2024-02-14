using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Application.Contracts.Interfaces
{
    public interface ICommon
    {
        void LogInformation(string message);
        void LogError(string message);
    }
}
