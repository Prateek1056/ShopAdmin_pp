
using Net_Backend.Data;

namespace Net_Backend.Feature.Product.Entity
{
    public class Product : Record
    {
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public string Category { get; set; } = string.Empty;

        public int StockQuantity { get; set; } = 0;

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;
    }
}
