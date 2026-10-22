using System.ComponentModel.DataAnnotations.Schema;

namespace MyApp.Server.Utilities
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T? Data { get; set; }

        public ApiResponse() { }

        public ApiResponse(bool success, string message, T? data)
        {
            Success = success;
            Message = message;
            Data = data;
        }

        public static ApiResponse<T> SuccessResponse(T? data, string message = "Success")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
        }

        [NotMapped]
        public List<ApiError> Errors { get; set; }

        public void AddError(Exception ex)
        {
            if (Errors == null)
            {
                Errors = new List<ApiError>();
            }

            Errors.Add(new ApiError(ex.Message));
        }

        public void AddError(string message)
        {
            if (Errors == null)
            {
                Errors = new List<ApiError>();
            }

            Errors.Add(new ApiError(message));
        }
    }
}
