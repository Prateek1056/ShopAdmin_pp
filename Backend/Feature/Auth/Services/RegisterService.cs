using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Feature.Auth.DTO.Request;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Auth.Services
{
    public class RegisterService
    {
        private readonly DBConfiguration _dbConfig;
        private readonly UserDB _userDB;
        private readonly PasswordService _passwordService;

        public RegisterService(DBConfiguration dbConfig, PasswordService passwordService)
        {
            _dbConfig = dbConfig;
            _userDB = new UserDB(dbConfig, RequestUser.Principal);
            _passwordService = passwordService;
        }

        public async Task<ApiResponse<bool>> RegisterUser(RegisterRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (item == null)
                    return response.ErrorResponse("Please provide valid data");

                if (string.IsNullOrWhiteSpace(item.Name) ||
                    string.IsNullOrWhiteSpace(item.Email) ||
                    string.IsNullOrWhiteSpace(item.Password) ||
                    string.IsNullOrWhiteSpace(item.ContactNumber))
                {
                    return response.ErrorResponse("Please provide all required fields");
                }

                var email = item.Email.Trim().ToLowerInvariant();

                var existingUser = await _userDB.GetByEmailAsync(email);

                if (existingUser != null)
                    return response.ErrorResponse("Email already exists");

                var hashPassword = _passwordService.HashPassword(item.Password);

                var user = new User
                {
                    Name = item.Name.Trim(),
                    Email = email,
                    PasswordHash = hashPassword,
                    Phone = item.ContactNumber.Trim(),
                    Gender = item.Gender,
                    Address = item.Address,
                    DateofBirth = item.DateofBirth
                };

                response.Data = await _userDB.AddAsync(user);
                response.Success = response.Data;

                if (response.Success)
                    response.Message = "User registered successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}