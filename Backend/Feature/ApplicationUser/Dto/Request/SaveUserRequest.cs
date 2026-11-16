
using Net_Backend.Common.Dto;
using Net_Backend.Feature.ApplicationUser.Model;

namespace Net_Backend.Feature.ApplicationUser.Dto.Request
{
    public class SaveUserRequest
    {
        public string? Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Undefined;

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }

        public UserRole Role { get; set; } = UserRole.User;
    }
}
