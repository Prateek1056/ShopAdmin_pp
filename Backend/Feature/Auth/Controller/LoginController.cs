using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.Auth.DTO.Request;
using Net_Backend.Feature.Auth.DTO.Response;
using Net_Backend.Feature.Auth.Services;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Auth.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ApiControllerBase
    {
        private readonly LoginService _loginService;

        public LoginController(
            DBConfiguration dbConfig,
            PasswordService passwordService,
            JwtTokenService jwtTokenService)
            : base(dbConfig)
        {
            _loginService = new LoginService(
                dbConfig,
                passwordService,
                jwtTokenService);
        }

        [HttpPost]
        public async Task<ApiResponse<AuthResponseDto>> Login(
            [FromBody] LoginRequestDto item)
        {
            var response = new ApiResponse<AuthResponseDto>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                response = await _loginService.Login(item);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}