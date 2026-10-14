
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Net_Backend.Data
{
    public class Record
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = string.Empty;

        public RecordUpdateInfo? CreatedBy { get; set; }

        public RecordUpdateInfo? UpdatedBy { get; set; }
    }

    public class RecordUpdateInfo
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }

        public string UserName { get; set; } = string.Empty;

        public DateTime Date { get; set; }
    }
}