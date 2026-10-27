using MongoDB.Bson;
using MongoDB.Driver;
using Net_Backend.Middleware.ReqContext;
using System.Linq.Expressions;
using System.Security.Claims;

namespace Net_Backend.Data
{
    public class RecordDB<T> where T : Record
    {
        protected readonly IMongoCollection<T> Collection;
        protected readonly ClaimsPrincipal? User;
        protected readonly DBConfiguration DbConfig;

        public RecordDB(DBConfiguration dbConfig, ClaimsPrincipal? user)
        {
            DbConfig = dbConfig;
            User = user;

            var client = new MongoClient(dbConfig.ConnectionString);
            var database = client.GetDatabase(dbConfig.Database);

            Collection = database.GetCollection<T>(CollectionName);
        }

        public virtual string CollectionName => typeof(T).Name;
        public virtual bool IsMatchDefaultFilter => false;


        #region Add

        public virtual async Task<bool> AddAsync(T document)
        {
            try
            {
                if (document == null)
                    return false;

                if (string.IsNullOrEmpty(document.Id))
                    document.Id = ObjectId.GenerateNewId().ToString();

                SetCreatedBy(document);

                await Collection.InsertOneAsync(document);

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #endregion


        #region Get

        public virtual async Task<T?> GetAsync(string id, bool bypassDefaultFilter = false)
        {
            try
            {
                var filter = Builders<T>.Filter.Eq(
                    x => x.Id,
                    id);

                return await Collection
                    .Find(filter)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<T?> GetAsync(
            Expression<Func<T, bool>> filter,
            bool bypassDefaultFilter = false)
        {
            try
            {
                if (filter == null)
                    return null;

                return await Collection
                    .Find(filter)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<List<T>> GetAllAsync(
            Expression<Func<T, bool>> filter,
            bool bypassDefaultFilter = false,
            int start = 0,
            int length = 0)
        {
            try
            {
                if (filter == null)
                    return new List<T>();

                var query = Collection.Find(filter);

                if (start > 0)
                    query = query.Skip(start);

                if (length > 0)
                    query = query.Limit(length);

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #endregion


        #region Update

        public virtual async Task<bool> UpdateAsync(T document)
        {
            try
            {
                if (document == null)
                    return false;

                SetUpdatedBy(document);

                var filter = Builders<T>.Filter.Eq(x => x.Id, document.Id);

                var result = await Collection.ReplaceOneAsync(filter, document);

                return result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public virtual async Task<bool> UpdateAsync(
            string id,
            UpdateDefinition<T> update)
        {
            try
            {
                if (string.IsNullOrEmpty(id) || update == null)
                    return false;

                var filter = Builders<T>.Filter.Eq(x => x.Id, id);

                var result = await Collection.UpdateOneAsync(filter, update);

                return result.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #endregion


        #region Delete

        public virtual async Task<bool> DeleteAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    return false;

                var filter = Builders<T>.Filter.Eq(
                    x => x.Id,
                    id);

                var result = await Collection.DeleteOneAsync(filter);

                return result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        #endregion


        #region Audit

        protected virtual void SetCreatedBy(T document)
        {
            if (document == null)
                return;

            var userId = User?.GetUserId();
            var userName = User?.GetUserName();

            if (string.IsNullOrEmpty(userId))
            {
                if (document.GetType().Name == "User" && !string.IsNullOrEmpty(document.Id))
                {
                    userId = document.Id;
                }
                else
                {
                    userId = null;
                }
            }

            if (string.IsNullOrEmpty(userName))
            {
                var nameProp = document.GetType().GetProperty("Name");
                var nameVal = nameProp?.GetValue(document) as string;
                userName = !string.IsNullOrWhiteSpace(nameVal) ? nameVal : "System";
            }

            document.CreatedBy = new RecordUpdateInfo
            {
                UserId = string.IsNullOrEmpty(userId) ? null : userId,
                UserName = userName,
                Date = DateTime.UtcNow
            };
        }

        protected virtual void SetUpdatedBy(T document)
        {
            if (document == null)
                return;

            var userId = User?.GetUserId();
            var userName = User?.GetUserName();

            document.UpdatedBy = new RecordUpdateInfo
            {
                UserId = string.IsNullOrEmpty(userId) ? null : userId,
                UserName = string.IsNullOrEmpty(userName) ? "System" : userName,
                Date = DateTime.UtcNow
            };
        }

        #endregion
    }
}
