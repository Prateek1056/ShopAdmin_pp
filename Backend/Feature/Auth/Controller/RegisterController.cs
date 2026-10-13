
using Backend.Feature.Auth.Dto;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Feature.ApplicationUser.Services;

namespace Net_Backend.Feature.Auth.Controller
{
    [ApiController]
    [Route("api/auth")]
    public class RegisterController : ControllerBase
    {
        private readonly UserService _userService;

        public RegisterController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterRequestDto request)
        {
            var emailExists = await _userService
                .EmailExistsAsync(request.Email);

            if (emailExists)
            {
                return Conflict(new
                {
                    success = false,
                    message = "This email is already registered."
                });
            }

            var user = await _userService.RegisterAsync(request);

            return StatusCode(201, new
            {
                success = true,
                message = "Registration successful.",
                data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Phone,
                    user.Gender,
                    user.Address,
                    user.DateofBirth
                }
            });
        }
    }
}