using System.Security.Claims;

namespace Net_Backend.Middleware.ReqContext
{
    public static class RequestUser
    {
        public static ClaimsPrincipal? Principal => RequestContext.CurrentUser;
        public static string? UserId => RequestContext.CurrentUser?.GetUserId();
        public static string? UserName => RequestContext.CurrentUser?.GetUserName();
    }
}