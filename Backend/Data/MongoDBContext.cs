using MongoDB.Driver;

namespace Net_Backend.Data
{
    public class MongoDBContext
    {
        private readonly IMongoDatabase _database;

        public MongoDBContext(DBConfiguration dbConfig)
        {
            var client = new MongoClient(dbConfig.ConnectionString);

            _database = client.GetDatabase(dbConfig.Database);
        }

        public IMongoDatabase Database => _database;
    }
}