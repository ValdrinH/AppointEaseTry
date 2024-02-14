using AppointEase.Application.Contracts.Identity;
using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Application.Contracts.Models;
using AppointEase.Application.Contracts.ModelsDto;
using AppointEase.Application.Services;
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
        private readonly IRepository<TblPacient> _uRepository;
        private readonly ICommon _common;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthController(UserManager<ApplicationUser> userManager, IMapper mapper, IRepository<TblPacient> repository, ICommon common, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _uRepository = repository;
            _common = common;
            _signInManager = signInManager;
        }


        [HttpPost("CreatePatient")]
        public async Task<IActionResult> CreatePatient([FromBody] TblUserDto model)
        {

            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid data provided.");
                }
                var patients = await _uRepository.GetAllAsync();

                var patientExcist = from pExcist in patients
                                    where pExcist != null && (pExcist.Email == model.Email || pExcist.PersonalNumber == model.PersonalNumber)
                                    select pExcist;

                if (patientExcist?.Count() > 0)
                    return BadRequest($"Failed to create user: Because Patient with this information excist!");



                var patient = _mapper.Map<TblPacient>(model);
                await _uRepository.AddAsync(patient);


                var user = new ApplicationUser
                {
                    UserName = model.Email,
                    Email = model.Email,
                    Emri = model.Name,
                    Mbiemri = model.Surname,
                    Roli = "Patient"
                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                    return BadRequest($"Failed to create user: {string.Join(", ", result.Errors.Select(e => e.Description))}");

                await _userManager.AddToRoleAsync(user, user.Roli);



                _common.LogInformation("Patient created successfully!");

                return Ok("Patient created successfully!");

            }
            catch (FluentValidation.ValidationException validationException)
            {
                return BadRequest(validationException.Errors.Select(e => new { e.PropertyName, e.ErrorMessage }));
            }
            catch (Exception ex)
            {
                _common.LogError($"Error creating pacient: {ex.Message}");
                // Log the exception or handle it in an appropriate way
                return StatusCode(500, "Internal Server Error \n\n"+ex.Message);
            }
        }


        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]LoginDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data provided.");
            }


            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, lockoutOnFailure: false);

            if(!result.Succeeded)
                return StatusCode(401, "Invalid login attempt.");

            var userProfile = _uRepository.GetIdByEmailAndPasswordAsync(model.Email,model.Password);
            if (userProfile == null)
                return StatusCode(401, "User not found.");

            var userPersonalData = _uRepository.GetByIdAsync(userProfile.Id);
            var userTask = await _userManager.FindByEmailAsync(model.Email);
            if (userTask == null)
            {
                return BadRequest("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(userTask);
            if (roles.Contains("Admin"))
            {
                return Ok($"Welcome , you are logged in as an Administrator.");
            }
            else if (roles.Contains("Manager"))
            {
                return Ok($"Welcome , you are logged in as a Manager.");
            }
            else if (roles.Contains("Patient"))
            {
                return Ok($"Welcome , you are logged in as a Patient.");
            }
            else
            {
                return Ok($"Welcome , you are logged in.");
            }
        }
    }
}
