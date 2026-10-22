namespace MyApp.Server.Utilities
{
    public class ApiError
    {
        public string Message { get; set; }
        public ApiError(string message)
        {
            Message = message;
        }
    }
}
