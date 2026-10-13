
using Backend.Feature.Auth.Dto;
using MongoDB.Driver;
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Services.Authentication;

namespace Net_Backend.Feature.ApplicationUser.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly PasswordService _passwordService;

        public UserService(
            MongoDBContext context,
            PasswordService passwordService)
        {
            _users = context.Database.GetCollection<User>("Users");
            _passwordService = passwordService;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();

            var filter = Builders<User>.Filter.Eq(
                user => user.Email,
                normalizedEmail
            );

            return await _users.Find(filter).AnyAsync();
        }

        public async Task<User> RegisterAsync(RegisterRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            var user = new User
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                Name = request.Name.Trim(),
                Email = normalizedEmail,
                Phone = request.Phone.Trim(),
                PasswordHash = _passwordService.HashPassword(
                    request.Password
                ),
                Gender = request.Gender,
                Address = request.Address,
                DateofBirth = request.DateofBirth
            };

            await _users.InsertOneAsync(user);

            return user;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();

            var filter = Builders<User>.Filter.Eq(
                user => user.Email,
                normalizedEmail
            );

            return await _users
                .Find(filter)
                .FirstOrDefaultAsync();
        }

        public bool VerifyPassword(string password, string passwordHash)
        {
            return _passwordService.VerifyPassword(
                password,
                passwordHash
            );
        }
    }
}