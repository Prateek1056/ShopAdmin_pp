using Net_Backend.Common.Dto;
using Net_Backend.Feature.ApplicationUser.Model;

namespace Net_Backend.Feature.Auth.DTO.Request
{
    public class RegisterRequestDto
    {
        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Undefined;

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }
    }
}