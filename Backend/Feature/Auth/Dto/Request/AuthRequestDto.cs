
using System.ComponentModel.DataAnnotations;
using Net_Backend.Common.Dto;
using Net_Backend.Feature.ApplicationUser.Model;

namespace Backend.Feature.Auth.Dto
{
    public class LoginRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequestDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        public Gender Gender { get; set; } = Gender.Undefined;

        public AddressModel Address { get; set; } = new();

        public DateTime DateofBirth { get; set; }
    }
}