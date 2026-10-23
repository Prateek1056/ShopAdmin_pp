using Net_Backend.Data;
using Net_Backend.Feature.Products.Entity;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Products.Services
{
    public class ProductServices
    {
        private readonly DBConfiguration _dbConfig;
        private readonly ProductDb _productDB;

        public ProductServices(DBConfiguration dbConfig)
        {
            _dbConfig = dbConfig;
            _productDB = new ProductDb(dbConfig, RequestUser.Principal);
        }

        public async Task<ApiResponse<bool>> CreateAsync(Product item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                if (string.IsNullOrWhiteSpace(item.Name))
                    return response.ErrorResponse("Product name is required.");

                if (item.Price < 0)
                    return response.ErrorResponse("Product price cannot be negative.");

                if (item.StockQuantity < 0)
                    return response.ErrorResponse("Stock quantity cannot be negative.");

                response.Data = await _productDB.AddAsync(item);
                response.Success = response.Data;

                if (response.Success)
                    response.Message = "Product created successfully";
                else
                    response.AddError("Failed to create product.");
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}