
using Net_Backend.Data;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Dto.Response;
using Net_Backend.Feature.Products.Entity;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Products.Services
{
    public class ProductServices
    {
        private readonly ProductDb _productDB;

        public ProductServices(DBConfiguration dbConfig)
        {
            _productDB = new ProductDb(
                dbConfig,
                RequestUser.Principal
            );
        }

        // GET ALL PRODUCTS
        public async Task<ApiResponse<List<ProductDto>>> GetAllAsync()
        {
            var response = new ApiResponse<List<ProductDto>>();

            try
            {
                var isAdmin = IsAdmin();

                var products = await _productDB.GetAllAsync(
                    x => !x.IsDeleted && (isAdmin || x.IsActive)
                );

                response.Data = products.Select(
                    product => MapToDto(product)
                ).ToList();

                response.Success = true;
                response.Message = "Products retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // GET PRODUCT BY ID
        public async Task<ApiResponse<ProductDto>> GetByIdAsync(string id)
        {
            var response = new ApiResponse<ProductDto>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid product ID.");

                var product = await _productDB.GetAsync(id);

                if (product == null ||
                    product.IsDeleted ||
                    (!IsAdmin() && !product.IsActive))
                {
                    return response.ErrorResponse("Product not found.");
                }

                response.Data = MapToDto(product);
                response.Success = true;
                response.Message = "Product retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // CREATE OR UPDATE PRODUCT
        public async Task<ApiResponse<bool>> SaveAsync(
            SaveProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                if (!IsAdmin())
                    return response.ErrorResponse(
                        "Only Admin can save products."
                    );

                if (string.IsNullOrWhiteSpace(item.Name))
                    return response.ErrorResponse(
                        "Product name is required."
                    );

                if (string.IsNullOrWhiteSpace(item.Category))
                    return response.ErrorResponse(
                        "Product category is required."
                    );

                if (item.Price <= 0)
                    return response.ErrorResponse(
                        "Product price must be greater than zero."
                    );

                if (item.StockQuantity < 0)
                    return response.ErrorResponse(
                        "Stock quantity cannot be negative."
                    );

                // CREATE PRODUCT
                if (string.IsNullOrWhiteSpace(item.Id))
                {
                    var product = new Product
                    {
                        Name = item.Name.Trim(),
                        Description = item.Description ?? string.Empty,
                        Price = item.Price,
                        Category = item.Category.Trim(),
                        StockQuantity = item.StockQuantity,
                        ImageUrl = item.ImageUrl ?? string.Empty,
                        IsActive = item.IsActive,
                        IsDeleted = false
                    };

                    response.Data = await _productDB.AddAsync(product);
                    response.Success = response.Data;

                    response.Message = response.Success
                        ? "Product created successfully"
                        : "Failed to create product.";
                }
                // UPDATE PRODUCT
                else
                {
                    var product = await _productDB.GetAsync(item.Id);

                    if (product == null || product.IsDeleted)
                        return response.ErrorResponse(
                            "Product not found."
                        );

                    product.Name = item.Name.Trim();
                    product.Description = item.Description ?? string.Empty;
                    product.Price = item.Price;
                    product.Category = item.Category.Trim();
                    product.StockQuantity = item.StockQuantity;
                    product.ImageUrl = item.ImageUrl ?? string.Empty;
                    product.IsActive = item.IsActive;

                    response.Data = await _productDB.UpdateAsync(product);
                    response.Success = response.Data;

                    response.Message = response.Success
                        ? "Product updated successfully"
                        : "Failed to update product.";
                }
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // SOFT DELETE PRODUCT
        public async Task<ApiResponse<bool>> DeleteAsync(string id)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid product ID.");

                if (!IsAdmin())
                    return response.ErrorResponse(
                        "Only Admin can delete products."
                    );

                var product = await _productDB.GetAsync(id);

                if (product == null || product.IsDeleted)
                    return response.ErrorResponse("Product not found.");

                product.IsDeleted = true;
                product.IsActive = false;

                response.Data = await _productDB.UpdateAsync(product);
                response.Success = response.Data;

                response.Message = response.Success
                    ? "Product deleted successfully"
                    : "Failed to delete product.";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // CHECK ADMIN ROLE
        private static bool IsAdmin()
        {
            return RequestUser.Principal?.Identity?.IsAuthenticated == true
                && RequestUser.Principal.IsInRole(nameof(UserRole.Admin));
        }

        // ENTITY TO RESPONSE DTO
        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id ?? string.Empty,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Category = product.Category,
                StockQuantity = product.StockQuantity,
                IsActive = product.IsActive,
                ImageUrl = product.ImageUrl
            };
        }
    }
}
