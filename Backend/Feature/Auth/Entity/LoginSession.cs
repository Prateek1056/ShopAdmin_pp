
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Net_Backend.Data;

namespace Net_Backend.Feature.Auth.Entity
{
    public class LoginSession : Record
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } = string.Empty;

        public string SessionId { get; set; } = string.Empty;

        public string TokenHash { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }

        public bool IsRevoked { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? RevokedAt { get; set; }

        public string? ReplacedByTokenHash { get; set; }
    }
}
