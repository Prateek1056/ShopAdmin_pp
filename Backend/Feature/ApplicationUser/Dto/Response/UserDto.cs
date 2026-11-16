using Net_Backend.Common.Dto;
using Net_Backend.Feature.ApplicationUser.Model;

namespace Net_Backend.Feature.ApplicationUser.Dto.Response
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public Gender Gender { get; set; }

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }

        public UserRole Role { get; set; }

        public bool IsActive { get; set; }
    }
}