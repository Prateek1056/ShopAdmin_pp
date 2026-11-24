
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
using Net_Backend.Feature.ApplicationUser.Model;

namespace Net_Backend.Feature.Auth.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ApiControllerBase
    {
        private readonly LoginService _loginService;
        private readonly AuthServices _authServices;
        private readonly IWebHostEnvironment _environment;

        public LoginController(
            DBConfiguration dbConfig,
            PasswordService passwordService,
            JwtTokenService jwtTokenService,
            IWebHostEnvironment environment)
            : base(dbConfig)
        {
            _authServices = new AuthServices(
                dbConfig,
                jwtTokenService
            );

            _loginService = new LoginService(
                dbConfig,
                passwordService,
                _authServices
            );

            _environment = environment;
        }

        [AllowAnonymous]
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

                if (!loginResponse.Success ||
                    loginResponse.Data == null)
                {
                    response.Success = false;
                    response.Message = loginResponse.Message;
                    response.Errors =
                        loginResponse.Errors ?? new List<ApiError>();

                    return response;
                }

                SetAuthCookies(loginResponse.Data);

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

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken =
                Request.Cookies["refreshToken"];

            var tokens = await _authServices.RefreshAsync(
                refreshToken
            );

            if (tokens == null)
            {
                DeleteAuthCookies();

                var response = new ApiResponse<bool>
                {
                    Success = false,
                    Message = "Invalid or expired refresh token.",
                    Data = false
                };

                return Unauthorized(response);
            }

            SetAuthCookies(tokens);

            return Ok(new ApiResponse<bool>
            {
                Success = true,
                Message = "Token refreshed successfully.",
                Data = true
            });
        }

        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<ApiResponse<bool>> Logout()
        {
            var response = new ApiResponse<bool>();

            try
            {
                await _authServices.LogoutAsync(
                    Request.Cookies["refreshToken"]
                );

                DeleteAuthCookies();

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
        public async Task<ApiResponse<CurrentUserDto>> GetCurrentUser()
        {
            var response = new ApiResponse<CurrentUserDto>();

            try
            {
                var userId = User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    response.Success = false;
                    response.Message = "User information not found";
                    return response;
                }

                // Fetch the latest user information from MongoDB
                var userDB = new UserDB(_dbConfig, User);

                var user = await userDB.GetAsync(userId);

                if (user == null || user.IsDeleted || !user.IsActive)
                {
                    response.Success = false;
                    response.Message = "User not found or inactive";
                    return response;
                }

                response.Success = true;
                response.Message = "User retrieved successfully";

                response.Data = new CurrentUserDto
                {
                    UserId = user.Id,
                    UserName = user.Name,
                    Email = user.Email,
                    Phone = user.Phone,
                    Role = user.Role.ToString(),
                    ProfilePic = user.ProfilePic
                };
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.AddError(ex.Message);
            }

            return response;
        }

        private void SetAuthCookies(AuthResponseDto tokens)
        {
            var isSecure =
                !_environment.IsDevelopment() || Request.IsHttps;

            Response.Cookies.Append(
                "accessToken",
                tokens.AccessToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = isSecure,
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.Add(
                        JwtTokenService.AccessTokenLifetime
                    )
                }
            );

            Response.Cookies.Append(
                "refreshToken",
                tokens.RefreshToken,
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = isSecure,
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.Add(
                        JwtTokenService.RefreshTokenLifetime
                    )
                }
            );
        }

        private void DeleteAuthCookies()
        {
            var isSecure =
                !_environment.IsDevelopment() || Request.IsHttps;

            var options = new CookieOptions
            {
                HttpOnly = true,
                Secure = isSecure,
                SameSite = SameSiteMode.Lax,
                Path = "/"
            };

            Response.Cookies.Delete("accessToken", options);
            Response.Cookies.Delete("refreshToken", options);
        }
    }
}
