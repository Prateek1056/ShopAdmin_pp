using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Net_Backend.Data
{
    public class Record
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonIgnoreIfNull]
        public RecordUpdateInfo? CreatedBy { get; set; }

        [BsonIgnoreIfNull]
        public RecordUpdateInfo? UpdatedBy { get; set; }
    }

    public class IdName
    {
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string? Id { get; set; }

        public string? Name { get; set; }
    }

    public class RecordUpdateInfo
    {
        [BsonRepresentation(BsonType.ObjectId)]
        [BsonIgnoreIfNull]
        public string? UserId { get; set; }

        public string? UserName { get; set; }

        public DateTime Date { get; set; }
    }
}
