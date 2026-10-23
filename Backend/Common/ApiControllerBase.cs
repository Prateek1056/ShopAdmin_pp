using Microsoft.AspNetCore.Mvc;
using Net_Backend.Data;
using Net_Backend.Utilities;

namespace Net_Backend.Common
{
    public class ApiControllerBase : ControllerBase
    {
        protected readonly DBConfiguration _dbConfig;

        protected ApiControllerBase(DBConfiguration dbConfig)
        {
            _dbConfig = dbConfig;
        }

        protected bool ValidateModelState<T>(ApiResponse<T> response)
        {
            if (ModelState.IsValid)
                return true;

            foreach (var error in ModelState.Values.SelectMany(x => x.Errors))
                response.AddError(error.ErrorMessage);

            return false;
        }

        protected string? GetIpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"].ToString();

            return HttpContext.Connection.RemoteIpAddress?
                .MapToIPv4().ToString();
        }

        protected string? GetUserAgent()
        {
            if (Request.Headers.ContainsKey("User-Agent"))
                return Request.Headers["User-Agent"].ToString();

            return null;
        }
    }
}