using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.Auth.DTO.Request;
using Net_Backend.Feature.Auth.Services;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Auth.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterController : ApiControllerBase
    {
        private readonly RegisterService _registerService;

        public RegisterController(
            DBConfiguration dbConfig,
            PasswordService passwordService)
            : base(dbConfig)
        {
            _registerService = new RegisterService(
                dbConfig,
                passwordService);
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> Register(
            [FromBody] RegisterRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                response = await _registerService.RegisterUser(item);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}