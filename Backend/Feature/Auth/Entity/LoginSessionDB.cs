
using MongoDB.Driver;
using Net_Backend.Data;

namespace Net_Backend.Feature.Auth.Entity
{
    public class LoginSessionDB : RecordDB<LoginSession>
    {
        public LoginSessionDB(DBConfiguration dbConfig)
            : base(dbConfig, null)
        {
        }

        public override string CollectionName => "LoginSessions";

        public async Task<LoginSession?> ConsumeAsync(string tokenHash)
        {
            var filter = Builders<LoginSession>.Filter.And(
                Builders<LoginSession>.Filter.Eq(
                    x => x.TokenHash, tokenHash),

                Builders<LoginSession>.Filter.Eq(
                    x => x.IsRevoked, false),

                Builders<LoginSession>.Filter.Gt(
                    x => x.ExpiresAt, DateTime.UtcNow)
            );

            var update = Builders<LoginSession>.Update
                .Set(x => x.IsRevoked, true)
                .Set(x => x.RevokedAt, DateTime.UtcNow);

            return await Collection.FindOneAndUpdateAsync(
                filter,
                update,
                new FindOneAndUpdateOptions<LoginSession>
                {
                    ReturnDocument = ReturnDocument.After
                }
            );
        }

        public async Task<bool> RevokeAsync(string tokenHash)
        {
            var filter = Builders<LoginSession>.Filter.And(
                Builders<LoginSession>.Filter.Eq(
                    x => x.TokenHash, tokenHash),

                Builders<LoginSession>.Filter.Eq(
                    x => x.IsRevoked, false)
            );

            var update = Builders<LoginSession>.Update
                .Set(x => x.IsRevoked, true)
                .Set(x => x.RevokedAt, DateTime.UtcNow);

            var result = await Collection.UpdateOneAsync(
                filter,
                update
            );

            return result.ModifiedCount > 0;
        }

        public async Task<bool> CreateAsync(LoginSession session)
        {
            return await AddAsync(session);
        }

        public async Task<bool> UpdateSessionAsync(LoginSession session)
        {
            return await UpdateAsync(session);
        }

        public async Task EnsureIndexesAsync()
        {
            var tokenIndex = new CreateIndexModel<LoginSession>(
                Builders<LoginSession>.IndexKeys
                    .Ascending(x => x.TokenHash),
                new CreateIndexOptions
                {
                    Unique = true,
                    Name = "Unique_TokenHash"
                }
            );

            var userIndex = new CreateIndexModel<LoginSession>(
                Builders<LoginSession>.IndexKeys
                    .Ascending(x => x.UserId),
                new CreateIndexOptions
                {
                    Name = "UserId_Index"
                }
            );

            await Collection.Indexes.CreateManyAsync(
                new[] { tokenIndex, userIndex }
            );
        }
    }
}
