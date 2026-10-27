
using Net_Backend.Common.Dto;
using Net_Backend.Data;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace Net_Backend.Feature.ApplicationUser.Model
{
    public class User : Record
    {
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        // Existing ShopAdmin fields — keep unchanged for now
        public string Phone { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Undefined;

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }

        // Properties from your mentor's User entity
        public bool IsActive { get; set; } = true;

        public bool IsDeleted { get; set; } = false;

        public string RefreshToken { get; set; } = string.Empty;

        public string ProfilePic { get; set; } = string.Empty;

        public List<string> Roles { get; set; } = new();

        public LastLogin? LastLogin { get; set; }
    }

    public class LastLogin
    {
        public DateTime Time { get; set; }

        public string IP { get; set; } = string.Empty;

        public string Browser { get; set; } = string.Empty;
    }
    
    public enum Gender
    {
        Undefined = 0,

        [Display(Name = "Male")]
        Male = 1,

        [Display(Name = "Female")]
        Female = 2
    }

    public class UserDB : RecordDB<User>
    {
        public UserDB(DBConfiguration dbConfig)
            : base(dbConfig, null)
        {
        }

        public UserDB(DBConfiguration dbConfig, ClaimsPrincipal? user)
            : base(dbConfig, user)
        {
        }

        public override string CollectionName => "Users";

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await GetAsync(
                user => user.Email == email.Trim().ToLowerInvariant());
        }

        public async Task<bool> CreateAsync(User user)
        {
            return await AddAsync(user);
        }
    }
}