using Net_Backend.Data;

namespace Net_Backend
{
    public class AppConfig
    {
        public string AppUrl { get; set; }
        public string DeveloperEmail { get; set; }
        public AppConfigJwt Jwt { get; set; }
        public DBConfiguration DBConfig { get; set; }
        public static AppConfig Current { get; protected set; }

        public static void Init(IConfiguration configuration)
        {
            var appConfig = configuration
                .GetSection("AppConfig")
                .Get<AppConfig>() ?? new AppConfig();

            appConfig.DBConfig = configuration
                .GetSection("DBConfiguration")
                .Get<DBConfiguration>() ?? new DBConfiguration();

            appConfig.Jwt = configuration
                .GetSection("Jwt")
                .Get<AppConfigJwt>() ?? new AppConfigJwt();

            Current = appConfig;
        }
    }

    public class AppConfigJwt
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
    }
}
