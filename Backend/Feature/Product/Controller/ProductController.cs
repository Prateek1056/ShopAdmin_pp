using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Net_Backend.Feature.Product.Dto.Request;
using Net_Backend.Feature.Product.Services;

namespace Net_Backend.Feature.Product.Controller
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
        public async Task<IActionResult> CreateProduct(
            [FromBody] CreateProductRequestDto request)
        {
            var createdProduct = await _productService.CreateAsync(request);

            return CreatedAtAction(
                nameof(CreateProduct),
                new { id = createdProduct.Id },
                createdProduct
            );
        }
    }
}
