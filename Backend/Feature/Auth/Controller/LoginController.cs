
using Backend.Feature.Auth.Dto;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Feature.ApplicationUser.Services;
using Net_Backend.Services.Authentication;

namespace Backend.Feature.Auth.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class LoginController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtTokenService _jwtTokenService;

        public LoginController(
            UserService userService,
            JwtTokenService jwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginRequestDto request)
        {
            var user = await _userService.GetByEmailAsync(
                request.Email
            );

            if (user == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid email or password."
                });
            }

            var isPasswordValid = _userService.VerifyPassword(
                request.Password,
                user.PasswordHash
            );

            if (!isPasswordValid)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid email or password."
                });
            }

            var token = _jwtTokenService.GenerateToken(
                user.Id,
                user.Name
            );

            return Ok(new
            {
                success = true,
                message = "Login successful.",
                data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    token
                }
            });
        }
    }
}