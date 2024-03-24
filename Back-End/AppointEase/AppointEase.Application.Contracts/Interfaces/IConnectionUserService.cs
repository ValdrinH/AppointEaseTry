using AppointEase.Application.Contracts.Models.Operations;
using AppointEase.Application.Contracts.Models.Request;

namespace AppointEase.Application.Contracts.Interfaces
{
    public interface IConnectionUserService
    {
        Task<OperationResult> AddConnection(ConnectionUserRequest connectionRequest);
        Task<IEnumerable<object>> GetAllConnections(string userId);
        Task<OperationResult> DeleteConnection(string id);
        Task<object> CheckIfExcist(string UserId, string DoctorId);

    }
}
