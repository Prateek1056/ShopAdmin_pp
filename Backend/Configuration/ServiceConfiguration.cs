using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Net_Backend.Data;

namespace Net_Backend.Configuration
{
    public static class ServiceConfiguration
    {
        public static void AddAppConfiguration(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var dbConfig = configuration
                .GetSection("DBConfiguration")
                .Get<DBConfiguration>()
                ?? throw new InvalidOperationException(
                    "DBConfiguration section is missing.");

            services.AddSingleton(dbConfig);
        }
    }
}