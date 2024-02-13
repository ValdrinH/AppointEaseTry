using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Data.Data;
using AppointEase.Data.Models;
using AppointEase.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppointEase.Data
{
    public static class DataInjectionServices
    {
        public static void AddDataServices(this IServiceCollection serviceDescriptors, IConfiguration configuration)
        {
            serviceDescriptors.AddDbContext<AppointEaseContext>(options =>
            {
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")
                );
            });

            serviceDescriptors.AddScoped<AppointEaseContext>();
            serviceDescriptors.AddScoped<IRepository<TblUser>, UserRepository>();
            serviceDescriptors.AddScoped<IRepository<TblAdmin>, AdminRepository>();
        }
    }
}
