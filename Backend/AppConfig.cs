using Net_Backend.Data;

namespace Net_Backend
{
    public class AppConfig
    {
        public string AppUrl { get; set; } = string.Empty;

        public string DeveloperEmail { get; set; } = string.Empty;

        public AppConfigJwt Jwt { get; set; } = new();

        public DBConfiguration DBConfig { get; set; } = new();

        public static AppConfig Current { get; protected set; } = new();

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
        public string Key { get; set; } = string.Empty;

        public string Issuer { get; set; } = string.Empty;
    }
}
