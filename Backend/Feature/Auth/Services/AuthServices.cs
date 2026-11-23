
using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Feature.Auth.DTO.Response;
using Net_Backend.Feature.Auth.Entity;
using Net_Backend.Middleware.ReqContext;
using Net_Backend.Services.Authentication;

namespace Net_Backend.Feature.Auth.Services
{
    public class AuthServices
    {
        private readonly LoginSessionDB _loginSessionDB;
        private readonly UserDB _userDB;
        private readonly JwtTokenService _jwtTokenService;

        public AuthServices(
            DBConfiguration dbConfig,
            JwtTokenService jwtTokenService)
        {
            _loginSessionDB = new LoginSessionDB(dbConfig);

            _userDB = new UserDB(
                dbConfig,
                RequestUser.Principal
            );

            _jwtTokenService = jwtTokenService;
        }

        public async Task<AuthResponseDto> IssueTokensAsync(
            User user,
            string? sessionId = null)
        {
            if (string.IsNullOrWhiteSpace(user.Id))
            {
                throw new InvalidOperationException(
                    "Invalid user ID."
                );
            }

            var accessToken =
                _jwtTokenService.GenerateAccessToken(
                    user.Id,
                    user.Name,
                    user.Role
                );

            var refreshToken =
                _jwtTokenService.GenerateRefreshToken();

            var tokenHash =
                _jwtTokenService.HashRefreshToken(
                    refreshToken
                );

            var session = new LoginSession
            {
                UserId = user.Id,

                SessionId = string.IsNullOrWhiteSpace(sessionId)
                    ? Guid.NewGuid().ToString("N")
                    : sessionId,

                TokenHash = tokenHash,

                ExpiresAt = DateTime.UtcNow.Add(
                    JwtTokenService.RefreshTokenLifetime
                ),

                IsRevoked = false,

                CreatedAt = DateTime.UtcNow
            };

            var saved = await _loginSessionDB.CreateAsync(session);

            if (!saved)
            {
                throw new InvalidOperationException(
                    "Unable to create login session."
                );
            }

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task<AuthResponseDto?> RefreshAsync(
            string? refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return null;

            var tokenHash =
                _jwtTokenService.HashRefreshToken(
                    refreshToken
                );

            // Atomically revoke and consume the old refresh token.
            var existingSession =
                await _loginSessionDB.ConsumeAsync(tokenHash);

            if (existingSession == null)
                return null;

            var user = await _userDB.GetAsync(
                existingSession.UserId
            );

            if (user == null ||
                !user.IsActive ||
                user.IsDeleted)
            {
                return null;
            }

            // Preserve the original login session identity.
            var newTokens = await IssueTokensAsync(
                user,
                existingSession.SessionId
            );

            // Link the old token to its replacement.
            existingSession.ReplacedByTokenHash =
                _jwtTokenService.HashRefreshToken(
                    newTokens.RefreshToken
                );

            await _loginSessionDB.UpdateSessionAsync(
                existingSession
            );

            return newTokens;
        }

        public async Task LogoutAsync(string? refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return;

            var tokenHash =
                _jwtTokenService.HashRefreshToken(
                    refreshToken
                );

            await _loginSessionDB.RevokeAsync(tokenHash);
        }
    }
}
