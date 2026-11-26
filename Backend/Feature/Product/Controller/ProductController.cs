
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Dto.Response;
using Net_Backend.Feature.Products.Services;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.Products.Controller
{
    [Route("api/[controller]")]
    [Authorize(Roles = nameof(UserRole.Admin))]
    [ApiController]
    public class ProductController : ApiControllerBase
    {
        private readonly ProductServices _productServices;

        public ProductController(DBConfiguration dbConfig)
            : base(dbConfig)
        {
            _productServices = new ProductServices(dbConfig);
        }

        // GET ALL PRODUCTS
        [AllowAnonymous]
        [HttpGet("GetAll")]
        public async Task<ApiResponse<List<ProductDto>>> GetAll()
        {
            return await _productServices.GetAllAsync();
        }

        // GET PRODUCT BY ID
        [AllowAnonymous]
        [HttpGet("GetById/{id}")]
        public async Task<ApiResponse<ProductDto>> GetById(string id)
        {
            return await _productServices.GetByIdAsync(id);
        }

        // CREATE OR UPDATE PRODUCT
        [HttpPost("Save")]
        public async Task<ApiResponse<bool>> Save(
            [FromBody] SaveProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                response = await _productServices.SaveAsync(item);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // SOFT DELETE PRODUCT
        [HttpPost("Delete")]
        public async Task<ApiResponse<bool>> Delete(
            [FromBody] DeleteProductRequestDto item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (!ValidateModelState(response))
                    return response;

                if (item == null)
                    return response.ErrorResponse("Invalid product data.");

                response = await _productServices.DeleteAsync(item.Id);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}
