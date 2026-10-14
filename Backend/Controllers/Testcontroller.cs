using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Net_Backend.Data;
using System.Security.Claims;

namespace Net_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly MongoDBContext _mongoDBContext;

        public TestController(MongoDBContext mongoDBContext)
        {
            _mongoDBContext = mongoDBContext;
        }

        // Test backend and MongoDB connection
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _mongoDBContext.Database
                    .RunCommandAsync<BsonDocument>(
                        new BsonDocument("ping", 1));

                return Ok(new
                {
                    message = "Backend and MongoDB connected successfully!",
                    status = true,
                    database = "Connected"
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    message = "Backend is running, but MongoDB connection failed.",
                    status = false
                });
            }
        }

        // Test JWT authentication
        [Authorize]
        [HttpGet("protected")]
        public IActionResult GetProtected()
        {
            return Ok(new
            {
                message = "JWT authentication successful!",
                userId = User.FindFirst(
                    ClaimTypes.NameIdentifier
                )?.Value,
                userName = User.Identity?.Name
            });
        }
    }
}
