using Net_Backend.Data;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Dto.Response;
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

        public async Task<ApiResponse<List<ProductDto>>> GetAllAsync()
        {
            var response = new ApiResponse<List<ProductDto>>();

            try
            {
                var products = await _productDB.GetAllAsync(x => x.IsActive);

                response.Data = products.Select(p => new ProductDto
                {
                    Id = p.Id ?? string.Empty,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    Category = p.Category,
                    StockQuantity = p.StockQuantity,
                    IsActive = p.IsActive
                }).ToList();

                response.Success = true;
                response.Message = "Products retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        public async Task<ApiResponse<ProductDto>> GetByIdAsync(string id)
        {
            var response = new ApiResponse<ProductDto>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid product ID.");

                var product = await _productDB.GetAsync(id);

                if (product == null || !product.IsActive)
                    return response.ErrorResponse("Product not found.");

                response.Data = new ProductDto
                {
                    Id = product.Id ?? string.Empty,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Category = product.Category,
                    StockQuantity = product.StockQuantity,
                    IsActive = product.IsActive
                };

                response.Success = true;
                response.Message = "Product retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        public async Task<ApiResponse<bool>> UpdateAsync(
            string id,
            UpdateProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid product ID.");

                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                if (string.IsNullOrWhiteSpace(item.Name))
                    return response.ErrorResponse("Product name is required.");

                if (item.Price < 0)
                    return response.ErrorResponse("Product price cannot be negative.");

                if (item.StockQuantity < 0)
                    return response.ErrorResponse("Stock quantity cannot be negative.");

                var product = await _productDB.GetAsync(id);

                if (product == null || !product.IsActive)
                    return response.ErrorResponse("Product not found.");

                product.Name = item.Name;
                product.Description = item.Description;
                product.Price = item.Price;
                product.Category = item.Category;
                product.StockQuantity = item.StockQuantity;
                product.ImageUrl = item.ImageUrl ?? string.Empty;

                response.Data = await _productDB.UpdateAsync(product);
                response.Success = response.Data;

                if (response.Success)
                    response.Message = "Product updated successfully";
                else
                    response.AddError("Failed to update product.");
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        public async Task<ApiResponse<bool>> DeleteAsync(string id)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid product ID.");

                var product = await _productDB.GetAsync(id);

                if (product == null)
                    return response.ErrorResponse("Product not found.");

                response.Data = await _productDB.DeleteAsync(id);
                response.Success = response.Data;

                if (response.Success)
                    response.Message = "Product deleted successfully";
                else
                    response.AddError("Failed to delete product.");
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}