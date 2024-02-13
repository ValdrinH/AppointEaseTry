using AppointEase.Application.Contracts.Identity;
using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Application.Contracts.ModelsDto;
using AppointEase.Data.Models;
using AppointEase.Data.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppointEase.AspNetCore.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IRepository<TblUser> _uRepository;
        private readonly IRepository<TblAdmin> _AdminRepo;


        public AuthController(UserManager<ApplicationUser> userManager, IMapper mapper, IRepository<TblAdmin> adminRepo, IRepository<TblUser> repository)
        {
            _userManager = userManager;
            _mapper = mapper;
            _AdminRepo = adminRepo;
            _uRepository = repository;
        }

        private async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(TblUserDto model)
        {
            try
            {
                // Mapimi i DTO-së në modelin aktual
                var user = _mapper.Map<TblUser>(model);

                // Kryeni operacionet e nevojshme me modelin aktual, për shembull, ruajeni në bazën e të dhënave
               
            


                await _uRepository.AddAsync(user);
                var appUser = await _uRepository.GetByIdAsync(model.);

                // Pastaj, shtoni rolin për përdoruesin duke përdorur UserManager
                await _userManager.AddToRoleAsync(appUser, GetRoleToString(model.Role));

                return Ok("Registered successfully!");

            }
            catch (Exception ex)
            {
                // Nëse ndodh një gabim, kthe një përgjigje me status të gabimit dhe mesazhin e gabimit
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        private string GetRoleToString(int role)
        {
            switch (role)
            {
                case 1:
                    return "Admin";
                    break;
                case 2:
                    return "Pacient";
                    break;
                case 3:
                    return "Doctor";
                    break;
                default:
                    break;
            }
            return "";
        }
    }
}
