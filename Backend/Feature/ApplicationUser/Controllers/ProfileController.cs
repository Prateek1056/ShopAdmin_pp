
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Net_Backend.Common;
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Cloudinary;
using Net_Backend.Utilities;

namespace Net_Backend.Feature.ApplicationUser.Controller
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class ProfileController : ApiControllerBase
    {
        private readonly CloudinaryImageService _cloudinaryImageService;
        private readonly ILogger<ProfileController> _logger;

        public ProfileController(
            DBConfiguration dbConfig,
            CloudinaryImageService cloudinaryImageService,
            ILogger<ProfileController> logger)
            : base(dbConfig)
        {
            _cloudinaryImageService = cloudinaryImageService;
            _logger = logger;
        }

        // UPLOAD PROFILE PICTURE
        [HttpPost("UploadProfilePicture")]
        [Consumes("multipart/form-data")]
        public async Task<ApiResponse<string>> UploadProfilePicture(
     IFormFile file)
        {
            var response = new ApiResponse<string>();

            CloudinaryImageResult? uploadedImage = null;

            try
            {
                // Get the logged-in user's ID from JWT claims.
                var userId = HttpContext.User.GetUserId();

                if (string.IsNullOrWhiteSpace(userId))
                {
                    return response.ErrorResponse(
                        "Unable to identify the logged-in user.");
                }

                // Access the authenticated user's database record.
                var userDB = new UserDB(_dbConfig, HttpContext.User);

                var user = await userDB.GetAsync(userId);

                if (user == null || user.IsDeleted || !user.IsActive)
                {
                    return response.ErrorResponse(
                        "User account not found or inactive.");
                }

                // Upload the new image to Cloudinary.
                uploadedImage =
                    await _cloudinaryImageService.UploadProfileImageAsync(file);

                // Prepare audit information.
                var updatedBy = new RecordUpdateInfo
                {
                    UserId = userId,
                    UserName = HttpContext.User.GetUserName()
                        ?? user.Name,
                    Date = DateTime.UtcNow
                };

                // Update only the profile picture fields.
                var update = Builders<User>.Update
                    .Set(x => x.ProfilePic, uploadedImage.Url)
                    .Set(x => x.ProfilePicPublicId, uploadedImage.PublicId)
                    .Set(x => x.UpdatedBy, updatedBy);

                var isUpdated = await userDB.UpdateAsync(userId, update);

                if (!isUpdated)
                {
                    await TryDeleteUploadedImageAsync(
                        uploadedImage.PublicId);

                    return response.ErrorResponse(
                        "Unable to update profile picture.");
                }

                // Delete the previous image only after MongoDB succeeds.
                if (!string.IsNullOrWhiteSpace(user.ProfilePicPublicId))
                {
                    await TryDeleteOldImageAsync(
                        user.ProfilePicPublicId);
                }

                return ApiResponse<string>.SuccessResponse(
                    uploadedImage.Url,
                    "Profile picture updated successfully.");
            }
            catch (ArgumentException ex)
            {
                response.AddError(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while uploading profile picture.");

                if (uploadedImage != null)
                {
                    await TryDeleteUploadedImageAsync(
                        uploadedImage.PublicId);
                }

                response.AddError(
                    "Unable to upload profile picture. Please try again.");
            }

            return response;
        }


        [HttpPost("RemoveProfilePicture")]
        public async Task<ApiResponse<bool>> RemoveProfilePicture()
        {
            var response = new ApiResponse<bool>();

            try
            {
                // Get the logged-in user's ID from JWT claims.
                var userId = HttpContext.User.GetUserId();

                if (string.IsNullOrWhiteSpace(userId))
                {
                    return response.ErrorResponse(
                        "Unable to identify the logged-in user.");
                }

                // Get the user's database record.
                var userDB = new UserDB(_dbConfig, HttpContext.User);

                var user = await userDB.GetAsync(userId);

                if (user == null || user.IsDeleted || !user.IsActive)
                {
                    return response.ErrorResponse(
                        "User account not found or inactive.");
                }

                // Check whether a profile picture exists.
                if (string.IsNullOrWhiteSpace(user.ProfilePic) &&
                    string.IsNullOrWhiteSpace(user.ProfilePicPublicId))
                {
                    return ApiResponse<bool>.SuccessResponse(
                        true,
                        "No profile picture is currently set.");
                }

                // Keep the old Cloudinary Public ID for deletion.
                var oldPublicId = user.ProfilePicPublicId;

                // Prepare audit information.
                var updatedBy = new RecordUpdateInfo
                {
                    UserId = userId,
                    UserName = HttpContext.User.GetUserName()
                        ?? user.Name,
                    Date = DateTime.UtcNow
                };

                // Clear the profile picture fields in MongoDB.
                var update = Builders<User>.Update
                    .Set(x => x.ProfilePic, string.Empty)
                    .Set(x => x.ProfilePicPublicId, string.Empty)
                    .Set(x => x.UpdatedBy, updatedBy);

                var isUpdated = await userDB.UpdateAsync(userId, update);

                if (!isUpdated)
                {
                    return response.ErrorResponse(
                        "Unable to remove profile picture.");
                }

                // Delete the old Cloudinary image after MongoDB succeeds.
                if (!string.IsNullOrWhiteSpace(oldPublicId))
                {
                    await TryDeleteOldImageAsync(oldPublicId);
                }

                return ApiResponse<bool>.SuccessResponse(
                    true,
                    "Profile picture removed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error while removing profile picture.");

                response.AddError(
                    "Unable to remove profile picture. Please try again.");
            }

            return response;
        }


        private async Task TryDeleteOldImageAsync(string publicId)
        {
            try
            {
                await _cloudinaryImageService.DeleteImageAsync(publicId);
            }
            catch (Exception ex)
            {
                // The new profile picture is already saved.
                // Cleanup failure should not undo a successful update.
                _logger.LogWarning(
                    ex,
                    "Unable to delete old Cloudinary image: {PublicId}",
                    publicId);
            }
        }

        private async Task TryDeleteUploadedImageAsync(string publicId)
        {
            try
            {
                await _cloudinaryImageService.DeleteImageAsync(publicId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(
                    ex,
                    "Unable to clean up uploaded Cloudinary image: {PublicId}",
                    publicId);
            }
        }
    }
}
