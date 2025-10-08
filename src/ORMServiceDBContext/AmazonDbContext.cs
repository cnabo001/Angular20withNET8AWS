using Microsoft.EntityFrameworkCore;
using ORMServiceDBContext.Models;

namespace ORMServiceDBContext.Data;

public class AmazonDbContext: DbContext
{
    public AmazonDbContext(DbContextOptions<AmazonDbContext> options): base(options) { }

    public DbSet<StoreModel> Items => Set<StoreModel>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<StoreModel>()
            .HasKey(f => f.Id);
    }

}
