using Backend.Feature.Auth.Dto;
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Authentication;

namespace Net_Backend.Feature.ApplicationUser.Services
{
    public class UserService
    {
        private readonly UserDb _userDb;
        private readonly PasswordService _passwordService;

        public UserService(
            MongoDBContext context,
            PasswordService passwordService)
        {
            _userDb = new UserDb(
                context,
                RequestUser.Principal
                    ?? new System.Security.Claims.ClaimsPrincipal(
                        new System.Security.Claims.ClaimsIdentity()));

            _passwordService = passwordService;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            var user = await _userDb.GetByEmailAsync(
                email.Trim().ToLowerInvariant());

            return user != null;
        }

        public async Task<User> RegisterAsync(RegisterRequestDto request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = normalizedEmail,
                Phone = request.Phone.Trim(),
                PasswordHash = _passwordService.HashPassword(
                    request.Password),
                Gender = request.Gender,
                Address = request.Address,
                DateofBirth = request.DateofBirth
            };

            await _userDb.CreateAsync(user);

            return user;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            var normalizedEmail = email.Trim().ToLowerInvariant();

            return await _userDb.GetByEmailAsync(normalizedEmail);
        }

        public bool VerifyPassword(
            string password,
            string passwordHash)
        {
            return _passwordService.VerifyPassword(
                password,
                passwordHash);
        }
    }
}