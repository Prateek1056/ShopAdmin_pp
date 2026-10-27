using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Feature.Auth.DTO.Request;
using Net_Backend.Feature.Auth.DTO.Response;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Auth.Services
{
    public class LoginService
    {
        private readonly DBConfiguration _dbConfig;
        private readonly UserDB _userDB;
        private readonly PasswordService _passwordService;
        private readonly JwtTokenService _jwtTokenService;

        public LoginService(
            DBConfiguration dbConfig,
            PasswordService passwordService,
            JwtTokenService jwtTokenService)
        {
            _dbConfig = dbConfig;
            _userDB = new UserDB(dbConfig, RequestUser.Principal);
            _passwordService = passwordService;
            _jwtTokenService = jwtTokenService;
        }

        public async Task<ApiResponse<AuthResponseDto>> Login(LoginRequestDto item)
        {
            var response = new ApiResponse<AuthResponseDto>();

            try
            {
                if (item == null ||
                    string.IsNullOrWhiteSpace(item.Email) ||
                    string.IsNullOrWhiteSpace(item.Password))
                {
                    return response.ErrorResponse("Invalid email or password.");
                }

                var email = item.Email.Trim().ToLowerInvariant();

                var user = await _userDB.GetAsync(x => x.Email == email);

                if (user == null)
                    return response.ErrorResponse("Invalid email or password.");

                var isPasswordValid = _passwordService.VerifyPassword(
                    item.Password,
                    user.PasswordHash
                );

                if (!isPasswordValid)
                    return response.ErrorResponse("Invalid email or password.");

                var authResponse = _jwtTokenService.GenerateToken(
                    user.Id ?? string.Empty,
                    user.Name ?? string.Empty
                );

                response.Data = authResponse;
                response.Success = true;
                response.Message = "Login successful";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}
