namespace Net_Backend.Middleware.ReqContext
{
    public class RequestContextMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestContextMiddleware> _logger;

        public RequestContextMiddleware(RequestDelegate next, ILogger<RequestContextMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                RequestContext.CurrentUser = context.User;

                _logger.LogDebug("Request user set: {User}", context.User.Identity?.Name);

                await _next(context);
            }
            finally
            {
                RequestContext.Clear();
            }
        }
    }
}