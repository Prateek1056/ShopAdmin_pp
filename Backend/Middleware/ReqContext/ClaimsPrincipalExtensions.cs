using System.Security.Claims;

namespace Net_Backend.Middleware.ReqContext
{
    public static class ClaimsPrincipalExtensions
    {
        public static string? GetUserId(this ClaimsPrincipal principal)
        {
            return principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        public static string? GetUserName(this ClaimsPrincipal principal)
        {
            return principal?.FindFirst(ClaimTypes.Name)?.Value;
        }
    }
}