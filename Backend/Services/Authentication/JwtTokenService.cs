
using Microsoft.IdentityModel.Tokens;
using Net_Backend.Feature.ApplicationUser.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Net_Backend.Services.Authentication
{
    public class JwtTokenService
    {
        public static readonly TimeSpan AccessTokenLifetime =
            TimeSpan.FromMinutes(15);

        public static readonly TimeSpan RefreshTokenLifetime =
            TimeSpan.FromDays(7);

        public string GenerateAccessToken(
            string userId,
            string userName,
            UserRole role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Role, role.ToString())
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(AppConfig.Current.Jwt.Key)
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: AppConfig.Current.Jwt.Issuer,
                claims: claims,
                expires: DateTime.UtcNow.Add(AccessTokenLifetime),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var randomBytes = RandomNumberGenerator.GetBytes(64);

            return Convert.ToBase64String(randomBytes);
        }

        public string HashRefreshToken(string refreshToken)
        {
            var tokenBytes = Encoding.UTF8.GetBytes(refreshToken);

            var hashBytes = SHA256.HashData(tokenBytes);

            return Convert.ToHexString(hashBytes);
        }
    }
}
