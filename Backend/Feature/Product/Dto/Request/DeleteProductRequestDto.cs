using System.ComponentModel.DataAnnotations;
namespace Net_Backend.Feature.Products.Dto.Request
{
    public class DeleteProductRequestDto
    {
        [Required]
        public string Id { get; set; } = string.Empty;
    }
}