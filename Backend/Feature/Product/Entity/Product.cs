
using Net_Backend.Data;
using System.Security.Claims;

namespace Net_Backend.Feature.Products.Entity
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

    public class ProductDb : RecordDB<Product>
    {
        public ProductDb(DBConfiguration dbConfig)
            : base(dbConfig, null)
        {
        }

        public ProductDb(DBConfiguration dbConfig, ClaimsPrincipal? user)
            : base(dbConfig, user)
        {
        }

        public override string CollectionName => "Product";

        protected override void SetCreatedBy(Product document)
        {
            document.CreatedBy = new RecordUpdateInfo
            {
                UserId = null,
                UserName = string.Empty,
                Date = default
            };
        }

        protected override void SetUpdatedBy(Product document)
        {
            document.UpdatedBy = new RecordUpdateInfo
            {
                UserId = null,
                UserName = string.Empty,
                Date = default
            };
        }
    }
}