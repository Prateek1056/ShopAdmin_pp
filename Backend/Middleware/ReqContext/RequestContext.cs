using System.Security.Claims;

namespace Net_Backend.Middleware.ReqContext
{
    public class RequestContext
    {
        private static readonly AsyncLocal<ClaimsPrincipal?> _currentUser = new();

        public static ClaimsPrincipal? CurrentUser
        {
            get => _currentUser.Value;
            set => _currentUser.Value = value;
        }

        public static void Clear()
        {
            _currentUser.Value = null;
        }
    }
}