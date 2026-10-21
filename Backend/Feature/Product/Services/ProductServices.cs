
using ProductEntity = Net_Backend.Feature.Product.Entity.Product;
using System.Security.Claims;
using Net_Backend.Data;
using Net_Backend.Feature.Product.Dto.Request;
using Net_Backend.Feature.Product.Dto.Response;
using Net_Backend.Middleware.ReqContext;

namespace Net_Backend.Feature.Product.Services
{
    public class ProductService
    {
        private readonly RecordDB<ProductEntity> _productDb;

        public ProductService(MongoDBContext context)
        {
            _productDb = new RecordDB<ProductEntity>(
                context,
                RequestUser.Principal
                    ?? new ClaimsPrincipal(new ClaimsIdentity()));
        }

        public async Task<ProductDto> CreateAsync(
            CreateProductRequestDto request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var product = new ProductEntity
            {
                Name = request.Name.Trim(),
                Description = request.Description.Trim(),
                Price = request.Price,
                Category = request.Category.Trim(),
                StockQuantity = request.StockQuantity,
                ImageUrl = request.ImageUrl.Trim(),
                IsActive = true
            };

            await _productDb.AddAsync(product);

            return MapToDto(product);
        }

        private static ProductDto MapToDto(ProductEntity product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Category = product.Category,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                IsActive = product.IsActive
            };
        }
    }
}
