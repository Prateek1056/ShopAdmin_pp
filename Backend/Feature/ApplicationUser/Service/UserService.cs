
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Dto.Request;
using Net_Backend.Feature.ApplicationUser.Dto.Response;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Authentication;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.ApplicationUser.Service
{
    public class UserService
    {
        private readonly UserDB _userDB;
        private readonly PasswordService _passwordService;

        public UserService(
            DBConfiguration dbConfig,
            PasswordService passwordService)
        {
            _userDB = new UserDB(dbConfig, RequestUser.Principal);
            _passwordService = passwordService;
        }

        // GET ALL USERS
        public async Task<ApiResponse<List<UserDto>>> GetAllAsync()
        {
            var response = new ApiResponse<List<UserDto>>();

            try
            {
                var users = await _userDB.GetAllAsync(
                    x => !x.IsDeleted
                );

                response.Data = users.Select(x => MapToDto(x)).ToList();
                response.Success = true;
                response.Message = "Users retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // GET USER BY ID
        public async Task<ApiResponse<UserDto>> GetByIdAsync(string id)
        {
            var response = new ApiResponse<UserDto>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid user ID.");

                var user = await _userDB.GetAsync(id);

                if (user == null || user.IsDeleted)
                    return response.ErrorResponse("User not found.");

                response.Data = MapToDto(user);
                response.Success = true;
                response.Message = "User retrieved successfully";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // CREATE OR UPDATE USER
        public async Task<ApiResponse<bool>> SaveAsync(SaveUserRequest item)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (item == null)
                    return response.ErrorResponse("Invalid user data.");

                if (string.IsNullOrWhiteSpace(item.Name) ||
                    string.IsNullOrWhiteSpace(item.Email) ||
                    string.IsNullOrWhiteSpace(item.ContactNumber))
                {
                    return response.ErrorResponse(
                        "Name, email and contact number are required."
                    );
                }

                if (!Enum.IsDefined(typeof(UserRole), item.Role))
                    return response.ErrorResponse("Invalid user role.");

                var email = item.Email.Trim().ToLowerInvariant();

                var existingEmail = await _userDB.GetAsync(
                    x => x.Email == email
                );

                // CREATE
                if (string.IsNullOrWhiteSpace(item.Id))
                {
                    if (existingEmail != null)
                        return response.ErrorResponse("Email already exists.");

                    if (string.IsNullOrWhiteSpace(item.Password))
                        return response.ErrorResponse("Password is required.");

                    var user = new User
                    {
                        Name = item.Name.Trim(),
                        Email = email,
                        Phone = item.ContactNumber.Trim(),
                        PasswordHash = _passwordService.HashPassword(item.Password),
                        Gender = item.Gender,
                        Address = item.Address ?? new(),
                        DateofBirth = item.DateofBirth ?? DateTime.MinValue,
                        Role = item.Role,
                        IsActive = true,
                        IsDeleted = false
                    };

                    response.Data = await _userDB.AddAsync(user);
                    response.Success = response.Data;

                    response.Message = response.Success
                        ? "User created successfully"
                        : "Failed to create user.";
                }
                // UPDATE
                else
                {
                    var user = await _userDB.GetAsync(item.Id);

                    if (user == null || user.IsDeleted)
                        return response.ErrorResponse("User not found.");

                    if (existingEmail != null &&
                        existingEmail.Id != user.Id)
                    {
                        return response.ErrorResponse("Email already exists.");
                    }

                    // Prevent demoting the last active Admin.
                    if (user.Role == UserRole.Admin &&
                        item.Role != UserRole.Admin &&
                        user.IsActive)
                    {
                        var activeAdmins = await _userDB.GetAllAsync(
                            x => x.Role == UserRole.Admin &&
                                 x.IsActive &&
                                 !x.IsDeleted
                        );

                        if (activeAdmins.Count <= 1)
                            return response.ErrorResponse(
                                "At least one active Admin must remain."
                            );
                    }

                    user.Name = item.Name.Trim();
                    user.Email = email;
                    user.Phone = item.ContactNumber.Trim();
                    user.Gender = item.Gender;
                    user.Address = item.Address ?? new();
                    user.DateofBirth = item.DateofBirth ?? user.DateofBirth;
                    user.Role = item.Role;

                    // Only change password when a new one is provided.
                    if (!string.IsNullOrWhiteSpace(item.Password))
                    {
                        user.PasswordHash =
                            _passwordService.HashPassword(item.Password);
                    }

                    response.Data = await _userDB.UpdateAsync(user);
                    response.Success = response.Data;

                    response.Message = response.Success
                        ? "User updated successfully"
                        : "Failed to update user.";
                }
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // SOFT DELETE USER
        public async Task<ApiResponse<bool>> DeleteAsync(string id)
        {
            var response = new ApiResponse<bool>();

            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return response.ErrorResponse("Invalid user ID.");

                var user = await _userDB.GetAsync(id);

                if (user == null || user.IsDeleted)
                    return response.ErrorResponse("User not found.");

                if (user.Id == RequestUser.UserId)
                    return response.ErrorResponse(
                        "You cannot delete your own account."
                    );

                if (user.Role == UserRole.Admin && user.IsActive)
                {
                    var activeAdmins = await _userDB.GetAllAsync(
                        x => x.Role == UserRole.Admin &&
                             x.IsActive &&
                             !x.IsDeleted
                    );

                    if (activeAdmins.Count <= 1)
                        return response.ErrorResponse(
                            "Cannot delete the last active Admin."
                        );
                }

                user.IsDeleted = true;
                user.IsActive = false;

                response.Data = await _userDB.UpdateAsync(user);
                response.Success = response.Data;

                response.Message = response.Success
                    ? "User deleted successfully"
                    : "Failed to delete user.";
            }
            catch (Exception ex)
            {
                response.AddError(ex.Message);
            }

            return response;
        }

        // ENTITY TO RESPONSE DTO
        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id ?? string.Empty,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Gender = user.Gender,
                Address = user.Address,
                DateofBirth = user.DateofBirth,
                Role = user.Role,
                IsActive = user.IsActive
            };
        }
    }
}
