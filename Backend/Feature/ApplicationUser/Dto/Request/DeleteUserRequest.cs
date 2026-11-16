
using System.ComponentModel.DataAnnotations;

namespace Net_Backend.Feature.ApplicationUser.Dto.Request
{
    public class DeleteUserRequest
    {
        [Required]
        public string Id { get; set; } = string.Empty;
    }
}
