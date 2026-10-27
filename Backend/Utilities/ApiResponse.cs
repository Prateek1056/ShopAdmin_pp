using System.ComponentModel.DataAnnotations.Schema;

namespace Net_Backend.Utilities
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public ApiResponse()
        {
            Errors = new List<ApiError>();
        }

        public ApiResponse(bool success, string? message, T? data)
        {
            Success = success;
            Message = message;
            Data = data;
            Errors = new List<ApiError>();
        }

        public static ApiResponse<T> SuccessResponse(
            T? data,
            string message = "Success")
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                Errors = new List<ApiError>()
            };
        }

        [NotMapped]
        public List<ApiError>? Errors { get; set; }

        public void AddError(Exception ex)
        {
            Errors ??= new List<ApiError>();
            Errors.Add(new ApiError(ex.Message));
        }

        public void AddError(string message)
        {
            Errors ??= new List<ApiError>();
            Errors.Add(new ApiError(message));
        }
    }
}
