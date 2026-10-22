namespace MyApp.Server.Utilities
{
    public static class ApiResponseExtensions
    {
        public static ApiResponse<T> ErrorResponse<T>(this ApiResponse<T> response, string message)
        {
            response.AddError(message);
            return response;
        }

        public static ApiResponse<T> ErrorResponse<T>(this ApiResponse<T> response, Exception ex)
        {
            response.AddError(ex);
            return response;
        }

        public static ApiResponse<T> AddErrors<T>(this ApiResponse<T> response, List<string> errors)
        {
            foreach (var error in errors)
            {
                response.AddError(error);
            }

            return response;
        }
    }
}