using AppointEase.Application.Contracts.Interfaces;
using AppointEase.Application.Contracts.Models.Operations;
using AppointEase.Application.Contracts.Models.Request;
using AppointEase.Data.Contracts.Identity;
using AppointEase.Data.Contracts.Interfaces;
using AppointEase.Data.Contracts.Models;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace AppointEase.Application.Services
{
    public class ConnectionUserService : IConnectionUserService
    {
        private readonly IRepository<Connections> _connectionRepository;
        private readonly IMapper _mapper;
        private IOperationResult operationResult;
        private readonly UserManager<ApplicationUser> _userManager;

        public ConnectionUserService(IRepository<Connections> repository,IMapper mapper,IOperationResult operationResult,UserManager<ApplicationUser> userManager)
        {
            _connectionRepository = repository;
            _mapper = mapper;
            this.operationResult = operationResult;
            _userManager = userManager;
        }
        public async Task<OperationResult> AddConnection(ConnectionUserRequest ConnectionRequest)
        {
            try
            {
                var mapped = _mapper.Map<Connections>(ConnectionRequest);

                var result = await _connectionRepository.AddAsync(mapped);
                if (result.Succeeded)
                    return operationResult.SuccessResult();
                else
                    return operationResult.ErrorResult("Error while Accept Connection");

            }
            catch (Exception ex)
            {
                return operationResult.ErrorResult("Error: ", new[] { ex.Message });
            }
        }

        public async Task<object> CheckIfExcist(string UserId, string DoctorId)
        {
            try
            {
                var getAllRequest = await _connectionRepository.GetAllAsync();
                var getSpecificRequest = getAllRequest.AsEnumerable().Where(r => (r.FromId == UserId && r.ToId == DoctorId) || r.FromId == DoctorId && r.ToId == UserId).Any();
                return getSpecificRequest;
            }
            catch (Exception ex)
            {
                return operationResult.ErrorResult("Error: ", new[] { ex.Message });
            }
        }

        public async Task<OperationResult> DeleteConnection(string id)
        {
            return null;
        }
         
        public async Task<IEnumerable<object>> GetAllConnections(string userId)
        {
            try
            {

                var getAllRequest = await _connectionRepository.GetAllAsync();
                var getUserConnections = getAllRequest.AsEnumerable()
                    .Where(r => (r.FromId == userId || r.ToId == userId))
                    .ToList();

                var task = getUserConnections.AsEnumerable().Select(async x =>
                {
                    string selecteUserId = (userId == x.FromId ? x.ToId : x.FromId);
                    var userData = await _userManager.FindByIdAsync(selecteUserId);
                    return new
                    {
                        userId = userData.Id,
                        connectionId = x.ConnectionId,
                        fullName = userData.Name + " " + userData.Surname,
                        userPicture = userData.PhotoData,
                        pictureFormat = userData.PhotoFormat,
                        datestamp = x.dateTimestamp
                    };
                }).ToList();

                var getUserDetais = await Task.WhenAll(task);
                return getUserDetais.ToList();
            }
            catch (Exception ex)
            {
                return operationResult.ErrorResult("Error: ", new[] { ex.Message }).Errors;
            }

        }
    }
}
