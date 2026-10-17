using Microsoft.EntityFrameworkCore;
namespace NutriAI.Api.Data;

public class NutriDbContext : DbContext
{
    public NutriDbContext(DbContextOptions<NutriDbContext> o):base(o){}
    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<UserState> UserStates => Set<UserState>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<XPTransaction> XPTransactions => Set<XPTransaction>();
    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AppUser>().HasIndex(x=>x.Email).IsUnique();
        b.Entity<UserState>().HasIndex(x=>x.UserId).IsUnique();
        b.Entity<RefreshToken>().HasIndex(x=>x.TokenHash).IsUnique();
        b.Entity<XPTransaction>().HasIndex(x=>new{x.UserId,x.CreatedAt});
        b.Entity<UserState>().Property(x=>x.DataJson).HasColumnType("jsonb");
    }
}
public class AppUser { public Guid Id{get;set;}=Guid.NewGuid(); public string Email{get;set;}=""; public string PasswordHash{get;set;}=""; public string DisplayName{get;set;}=""; public bool EmailVerified{get;set;}=false; public DateTime CreatedAt{get;set;}=DateTime.UtcNow; }
public class UserState { public int Id{get;set;} public Guid UserId{get;set;} public string DataJson{get;set;}="{}"; public DateTime UpdatedAt{get;set;}=DateTime.UtcNow; }
public class RefreshToken { public long Id{get;set;} public Guid UserId{get;set;} public string TokenHash{get;set;}=""; public DateTime ExpiresAt{get;set;} public DateTime CreatedAt{get;set;}=DateTime.UtcNow; public DateTime? RevokedAt{get;set;} }
public class XPTransaction { public long Id{get;set;} public Guid UserId{get;set;} public int Amount{get;set;} public string Reason{get;set;}=""; public DateTime CreatedAt{get;set;}=DateTime.UtcNow; }
