
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Services;
using Net_Backend.Utilities;
using Net_Backend.Feature.Products.Entity;
using Microsoft.AspNetCore.Authorization;
using Net_Backend.Middleware.ReqContext;

namespace Net_Backend.Feature.Products.Controller
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProductController : ApiControllerBase
    {
        private readonly ProductServices _productServices;

        public ProductController(DBConfiguration dbConfig)
            : base(dbConfig)
        {
            _productServices = new ProductServices(dbConfig);
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> Create(
            [FromBody] CreateProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                var product = new Product
                {
                    Name = item.Name,
                    Description = item.Description,
                    Price = item.Price,
                    Category = item.Category,
                    StockQuantity = item.StockQuantity,
                    ImageUrl = item.ImageUrl ?? string.Empty,
                    IsActive = true,
                    CreatedBy = new RecordUpdateInfo
                    {
                        UserId = RequestUser.Principal?.GetUserId(),
                        UserName = RequestUser.Principal?.GetUserName(),
                        Date = DateTime.UtcNow
                    }
                };

                response = await _productServices.CreateAsync(product);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        [HttpPut("{id}")]
        public async Task<ApiResponse<bool>> Update(
            string id,
            [FromBody] UpdateProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                response = await _productServices.UpdateAsync(id, item);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        [HttpDelete("{id}")]
        public async Task<ApiResponse<bool>> Delete(string id)
        {
            var response = new ApiResponse<bool>();

            try
            {
                response = await _productServices.DeleteAsync(id);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}
