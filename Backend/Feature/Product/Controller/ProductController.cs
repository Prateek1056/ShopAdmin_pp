using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Services;
using Net_Backend.Feature.Products.Entity;
using Net_Backend.Utilities;

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
                    IsActive = true
                };

                response = await _productServices.CreateAsync(product, User);
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

                response = await _productServices.UpdateAsync(id, item, User);
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