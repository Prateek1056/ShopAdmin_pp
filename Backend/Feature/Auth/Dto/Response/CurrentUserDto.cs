namespace Net_Backend.Feature.Auth.DTO.Response
{
    public class CurrentUserDto
    {
        public string UserId { get; set; } = string.Empty;

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Phone { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string ProfilePic { get; set; } = string.Empty;
    }
}