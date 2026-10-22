using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MyApp.Server.Utilities;
using Net_Backend.Feature.Products.Dto.Request;
using Net_Backend.Feature.Products.Entity;
using Net_Backend.Feature.Products.Services;

namespace Net_Backend.Feature.Products.Controller
{
    [ApiController]
    [Authorize]
    [Route("api/product")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> CreateProduct([FromBody] CreateProductRequestDto request)
        {
            var response = new ApiResponse<bool>();

            try
            {
                return await _productService.CreateAsync(request);
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }
    }
}