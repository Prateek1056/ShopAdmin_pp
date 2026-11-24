using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Net_Backend.Configuration;

namespace Net_Backend.Services.Cloudinary
{
    public record CloudinaryImageResult(
        string Url,
        string PublicId
    );

    public class CloudinaryImageService
    {
        private readonly CloudinaryDotNet.Cloudinary _cloudinary;

        private const long MaxFileSize = 5 * 1024 * 1024;

        private static readonly string[] AllowedContentTypes =
        {
            "image/jpeg",
            "image/png",
            "image/webp"
        };

        public CloudinaryImageService(
            IOptions<CloudinarySettings> options)
        {
            var settings = options.Value;

            var account = new Account(
                settings.CloudName,
                settings.ApiKey,
                settings.ApiSecret
            );

            _cloudinary = new CloudinaryDotNet.Cloudinary(account);
        }

        public async Task<CloudinaryImageResult> UploadProfileImageAsync(
            IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Please select an image.");
            }

            if (file.Length > MaxFileSize)
            {
                throw new ArgumentException(
                    "Image size cannot exceed 5 MB."
                );
            }

            if (!AllowedContentTypes.Contains(file.ContentType))
            {
                throw new ArgumentException(
                    "Only JPG, PNG and WEBP images are allowed."
                );
            }

            var publicId = $"profile_{Guid.NewGuid():N}";

            await using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "shopadmin/profile-images",
                PublicId = publicId,
                Transformation = new Transformation()
                    .Quality("auto")
                    .FetchFormat("auto")
            };

            var result = await _cloudinary.UploadAsync(uploadParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    result.Error.Message
                );
            }

            return new CloudinaryImageResult(
                result.SecureUrl.ToString(),
                result.PublicId
            );
        }

        public async Task DeleteImageAsync(string publicId)
        {
            if (string.IsNullOrWhiteSpace(publicId))
            {
                return;
            }

            var deletionParams = new DeletionParams(publicId);

            var result = await _cloudinary.DestroyAsync(deletionParams);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    result.Error.Message
                );
            }
        }
    }
}
