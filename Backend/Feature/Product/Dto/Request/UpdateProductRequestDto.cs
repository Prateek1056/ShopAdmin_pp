
using System.ComponentModel.DataAnnotations;

namespace Net_Backend.Feature.Products.Dto.Request
{
    public class UpdateProductRequestDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public string Category { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }

        public string? ImageUrl { get; set; }
    }
}
