
using Net_Backend.Common.Dto;
using Net_Backend.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using MongoDB.Driver;

namespace Net_Backend.Feature.ApplicationUser.Model
{
    public class User : Record
    {
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Undefined;

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }
    }

    public enum Gender
    {
        Undefined = 0,

        [Display(Name = "Male")]
        Male = 1,

        [Display(Name = "Female")]
        Female = 2
    }

    public class UserDb : RecordDB<User>
    {
        public UserDb(
            MongoDBContext context,
            ClaimsPrincipal user)
            : base(context, user)
        {
        }

        public override string CollectionName => "Users";

        public async Task<User?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            var normalizedEmail = email.Trim().ToLowerInvariant();

            return await Collection
                .Find(user => user.Email == normalizedEmail)
                .FirstOrDefaultAsync();
        }

        public async Task CreateAsync(User user)
        {
            ArgumentNullException.ThrowIfNull(user);

            await AddAsync(user);
        }
    }
}