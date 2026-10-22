using System.Security.Claims;
using Net_Backend.Data;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Feature.Products.Entity;
using MyApp.Server.Utilities;

namespace Net_Backend.Feature.Products.Services
{
    public class ProductService
    {
        private readonly DBConfiguration _dbConfig;
        private readonly ProductDb _productDb;

        public ProductService(DBConfiguration dbConfig)
        {
            _dbConfig = dbConfig;
            _productDb = new ProductDb(_dbConfig, RequestUser.UserId);
        }

        public async Task<ApiResponse<bool>> CreateAsync(Product request)
        {
            var response = new ApiResponse<bool>();
            try
            {
                if (request == null)
                    return response.ErrorResponse("Please provide valid data");
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // private static ProductDto MapToDto(ProductEntity product)
        // {
        //     return new ProductDto
        //     {
        //         Id = product.Id,
        //         Name = product.Name,
        //         Description = product.Description,
        //         Price = product.Price,
        //         Category = product.Category,
        //         StockQuantity = product.StockQuantity,
        //         ImageUrl = product.ImageUrl,
        //         IsActive = product.IsActive
        //     };
        // }
    }
}
