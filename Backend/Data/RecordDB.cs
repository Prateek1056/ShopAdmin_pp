
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

        private readonly ILogger<RecordDB<T>>? _logger;

        public RecordDB(
    MongoDBContext context,
    ClaimsPrincipal? user,
    DBConfiguration? dbConfig = null,
    ILogger<RecordDB<T>>? logger = null)
        {
            ArgumentNullException.ThrowIfNull(context);

            User = user;
            DbConfig = dbConfig ?? new DBConfiguration();
            _logger = logger;

            Collection = context.Database.GetCollection<T>(
                CollectionName
            );
        }

        public virtual string CollectionName => typeof(T).Name;

        public virtual bool IsMatchDefaultFilter => false;

        #region Add

        public virtual async Task<bool> AddAsync(T document)
        {
            ArgumentNullException.ThrowIfNull(document);

            try
            {
                if (string.IsNullOrWhiteSpace(document.Id))
                {
                    document.Id = ObjectId.GenerateNewId().ToString();
                }

                SetCreatedBy(document);

                await Collection.InsertOneAsync(document);

                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to add document to collection {CollectionName}",
                    CollectionName
                );

                throw;
            }
        }

        #endregion

        #region Get

        public virtual async Task<T?> GetAsync(
            string id,
            bool bypassDefaultFilter = false)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                return null;
            }

            if (!ObjectId.TryParse(id, out _))
            {
                return null;
            }

            try
            {
                var filter = Builders<T>.Filter.Eq(
                    document => document.Id,
                    id
                );

                return await Collection
                    .Find(filter)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to get document {DocumentId} from {CollectionName}",
                    id,
                    CollectionName
                );

                throw;
            }
        }

        public virtual async Task<T?> GetAsync(
            Expression<Func<T, bool>> filter,
            bool bypassDefaultFilter = false)
        {
            ArgumentNullException.ThrowIfNull(filter);

            try
            {
                return await Collection
                    .Find(filter)
                    .FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to query collection {CollectionName}",
                    CollectionName
                );

                throw;
            }
        }

        public virtual async Task<List<T>> GetAllAsync(
            Expression<Func<T, bool>> filter,
            bool bypassDefaultFilter = false,
            int start = 0,
            int length = 0)
        {
            ArgumentNullException.ThrowIfNull(filter);

            if (start < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(start));
            }

            if (length < 0)
            {
                throw new ArgumentOutOfRangeException(nameof(length));
            }

            try
            {
                var query = Collection.Find(filter);

                if (start > 0)
                {
                    query = query.Skip(start);
                }

                if (length > 0)
                {
                    query = query.Limit(length);
                }

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to retrieve documents from {CollectionName}",
                    CollectionName
                );

                throw;
            }
        }

        #endregion

        #region Update

        public virtual async Task<bool> UpdateAsync(T document)
        {
            ArgumentNullException.ThrowIfNull(document);

            if (string.IsNullOrWhiteSpace(document.Id) ||
                !ObjectId.TryParse(document.Id, out _))
            {
                return false;
            }

            try
            {
                var existingDocument = await GetAsync(document.Id);

                if (existingDocument == null)
                {
                    return false;
                }

                // Preserve the original creation audit information.
                document.CreatedBy = existingDocument.CreatedBy;

                SetUpdatedBy(document);

                var filter = Builders<T>.Filter.Eq(
                    item => item.Id,
                    document.Id
                );

                var result = await Collection.ReplaceOneAsync(
                    filter,
                    document
                );

                return result.MatchedCount > 0;
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to update document {DocumentId} in {CollectionName}",
                    document.Id,
                    CollectionName
                );

                throw;
            }
        }

        public virtual async Task<bool> UpdateAsync(
            string id,
            UpdateDefinition<T> update)
        {
            if (string.IsNullOrWhiteSpace(id) ||
                !ObjectId.TryParse(id, out _) ||
                update == null)
            {
                return false;
            }

            try
            {
                var updatedBy = CreateUpdateInfo();

                var finalUpdate = Builders<T>.Update.Combine(
                    update,
                    Builders<T>.Update.Set(
                        document => document.UpdatedBy,
                        updatedBy
                    )
                );

                var filter = Builders<T>.Filter.Eq(
                    document => document.Id,
                    id
                );

                var result = await Collection.UpdateOneAsync(
                    filter,
                    finalUpdate
                );

                return result.MatchedCount > 0;
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to update document {DocumentId} in {CollectionName}",
                    id,
                    CollectionName
                );

                throw;
            }
        }

        #endregion

        #region Delete

        public virtual async Task<bool> DeleteAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id) ||
                !ObjectId.TryParse(id, out _))
            {
                return false;
            }

            try
            {
                var filter = Builders<T>.Filter.Eq(
                    document => document.Id,
                    id
                );

                var result = await Collection.DeleteOneAsync(filter);

                return result.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                _logger?.LogError(
                    ex,
                    "Failed to delete document {DocumentId} from {CollectionName}",
                    id,
                    CollectionName
                );

                throw;
            }
        }

        #endregion

        #region Audit

        protected virtual void SetCreatedBy(T document)
        {
            ArgumentNullException.ThrowIfNull(document);

            document.CreatedBy = CreateUpdateInfo();
        }

        protected virtual void SetUpdatedBy(T document)
        {
            ArgumentNullException.ThrowIfNull(document);

            document.UpdatedBy = CreateUpdateInfo();
        }

        private RecordUpdateInfo CreateUpdateInfo()
        {
            return new RecordUpdateInfo
            {
                UserId = User?.GetUserId(),
                UserName = User?.GetUserName() ?? string.Empty,
                Date = DateTime.UtcNow
            };
        }



        #endregion
    }
}