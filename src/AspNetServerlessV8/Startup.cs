using Microsoft.OpenApi.Models;
using ServiceLayer.Implementations;
using ServiceLayer.Interfaces;
using Microsoft.EntityFrameworkCore;
using ORMServiceDBContext.Data;

namespace AspNetServerlessV8;

public class Startup
{
    public Startup(IConfiguration configuration) => Configuration = configuration;
    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IStoreService, StoreService>();

        services.AddDbContext<AmazonDbContext>(opt =>
            opt.UseNpgsql(Configuration.GetConnectionString("AmazonProgreSql"))
        );

        services.AddControllers();
        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "AspNetServerlessV8", Version = "v1" });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment()) app.UseDeveloperExceptionPage();

        // 1) Read stage prefix from env: e.g., "/Prod" or "/Dev"
        var pathBase = Environment.GetEnvironmentVariable("ASPNETCORE_PATHBASE");
        if (!string.IsNullOrWhiteSpace(pathBase))
        {
            app.UsePathBase(pathBase);
        }

        // 2) (Optional) redirect "/" -> "/{stage}/swagger"
        app.Use(async (ctx, next) =>
        {
            if (ctx.Request.Path == "/" || string.Equals(ctx.Request.Path.Value, "/index.html", StringComparison.OrdinalIgnoreCase))
            {
                ctx.Response.Redirect($"{ctx.Request.PathBase}/swagger", false);
                return;
            }
            await next();
        });

        app.UseRouting();

        // 3) Generate swagger.json and set Servers[] properly (use PathBase instead of guessing headers)
        app.UseSwagger(c =>
        {
            c.PreSerializeFilters.Add((swagger, req) =>
            {
                var scheme = req.Scheme;
                var host = req.Host.Value;
                var basePath = req.PathBase.HasValue ? req.PathBase.Value : string.Empty;
                swagger.Servers = new List<OpenApiServer> { new() { Url = $"{scheme}://{host}{basePath}" } };
            });
        });

        // 4) UI at /{stage}/swagger; JSON is /{stage}/swagger/v1/swagger.json
        app.UseSwaggerUI(c =>
        {
            c.RoutePrefix = "swagger";
            c.SwaggerEndpoint("v1/swagger.json", "AspNetServerlessV8 v1");
        });

        app.UseAuthorization();
        app.UseEndpoints(endpoints => endpoints.MapControllers());
    }
}
