using System.ComponentModel.DataAnnotations;

namespace Net_Backend.Feature.Products.Dto.Request
{
    public class CreateProductRequestDto
    {
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Range(typeof(decimal), "0.01", "999999999")]
        public decimal Price { get; set; }

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }

        [StringLength(2048)]
        public string? ImageUrl { get; set; }
    }
}