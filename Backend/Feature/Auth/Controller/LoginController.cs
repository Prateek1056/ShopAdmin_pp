
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.Auth.DTO.Request;
using Net_Backend.Feature.Auth.DTO.Response;
using Net_Backend.Feature.Auth.Services;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;
using System.Security.Claims;

namespace Net_Backend.Feature.Auth.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ApiControllerBase
    {
        private readonly LoginService _loginService;
        private readonly IWebHostEnvironment _environment;

        public LoginController(
            DBConfiguration dbConfig,
            PasswordService passwordService,
            JwtTokenService jwtTokenService,
            IWebHostEnvironment environment)
            : base(dbConfig)
        {
            _loginService = new LoginService(
                dbConfig,
                passwordService,
                jwtTokenService);

            _environment = environment;
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> Login(
            [FromBody] LoginRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                var loginResponse = await _loginService.Login(item);

                if (!loginResponse.Success || loginResponse.Data == null)
                {
                    response.Success = false;
                    response.Message = loginResponse.Message;
                    return response;
                }

                var tokens = loginResponse.Data;

                var isSecure = !_environment.IsDevelopment() || Request.IsHttps;

                Response.Cookies.Append(
                    "accessToken",
                    tokens.AccessToken,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = isSecure,
                        SameSite = SameSiteMode.Lax,
                        Path = "/",
                        Expires = DateTimeOffset.UtcNow.AddMinutes(15)
                    });

                Response.Cookies.Append(
                    "refreshToken",
                    tokens.RefreshToken,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = isSecure,
                        SameSite = SameSiteMode.Lax,
                        Path = "/",
                        Expires = DateTimeOffset.UtcNow.AddDays(7)
                    });

                response.Success = true;
                response.Message = "Login successful";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // Logout API
        [HttpPost("logout")]
        public ApiResponse<bool> Logout()
        {
            var response = new ApiResponse<bool>();

            try
            {
                var isSecure = !_environment.IsDevelopment() || Request.IsHttps;

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = isSecure,
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                };

                Response.Cookies.Delete("accessToken", cookieOptions);
                Response.Cookies.Delete("refreshToken", cookieOptions);

                response.Success = true;
                response.Message = "Logout successful";
                response.Data = true;
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        [Authorize]
        [HttpGet("me")]
        public ApiResponse<CurrentUserDto> GetCurrentUser()
        {
            var response = new ApiResponse<CurrentUserDto>();

            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userName = User.Identity?.Name;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userName))
                {
                    response.Success = false;
                    response.Message = "User information not found";
                    return response;
                }

                response.Success = true;
                response.Message = "User retrieved successfully";

                response.Data = new CurrentUserDto
                {
                    UserId = userId,
                    UserName = userName
                };
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}
