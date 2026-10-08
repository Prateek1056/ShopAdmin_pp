using MongoDB.Driver;
using System.Security.Claims;

namespace Net_Backend.Data
{
    public class RecordDB<T> where T : Record
    {
        protected readonly IMongoCollection<T> Collection;
        private readonly ClaimsPrincipal User;

        public RecordDB(MongoDBContext context, ClaimsPrincipal user)
        {
            User = user;
            Collection = context.Database.GetCollection<T>(CollectionName);
        }

        public virtual string CollectionName => typeof(T).Name;
        public virtual bool IsMatchDefaultFilter => false;
    }
}