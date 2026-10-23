using Net_Backend.Data;
using Net_Backend.Feature.ApplicationUser.Model;
using Net_Backend.Middleware.ReqContext;

namespace Net_Backend.Feature.ApplicationUser.Service
{
    public class UserService
    {
        private readonly UserDB _userDB;
        private readonly DBConfiguration _dbConfig;

        public UserService(DBConfiguration dbConfig)
        {
            _dbConfig = dbConfig;
            _userDB = new UserDB(dbConfig, RequestUser.Principal);
        }
    }
}