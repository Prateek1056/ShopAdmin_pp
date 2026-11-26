using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Dto.Request;
using Net_Backend.Feature.ApplicationUser.Dto.Response;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Feature.ApplicationUser.Service;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.ApplicationUser.Controller
{
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    [ApiController]
    public class UserController : ApiControllerBase
    {
        private readonly UserService _userService;

        public UserController(
            DBConfiguration dbConfig,
            PasswordService passwordService)
            : base(dbConfig)
        {
            _userService = new UserService(
                dbConfig,
                passwordService
            );
        }

        // GET ALL USERS
        [HttpGet]
        [HttpGet("GetAll")]
        public async Task<ApiResponse<List<UserDto>>> GetAll()
        {
            return await _userService.GetAllAsync();
        }

        // GET USER BY ID
        [HttpGet("{id}")]
        [HttpGet("GetById/{id}")]
        public async Task<ApiResponse<UserDto>> GetById(string id)
        {
            return await _userService.GetByIdAsync(id);
        }

        // CREATE OR UPDATE USER
        [HttpPost]
        [HttpPost("Save")]
        [HttpPost("Update")]
        public async Task<ApiResponse<bool>> Save(
            [FromBody] SaveUserRequest item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                if (item == null)
                    return response.ErrorResponse("Invalid user data.");

                response = await _userService.SaveAsync(item);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // SOFT DELETE USER
        [HttpPost("Delete")]
        public async Task<ApiResponse<bool>> Delete(
            [FromBody] DeleteUserRequest item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                response = await _userService.DeleteAsync(item.Id);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}
