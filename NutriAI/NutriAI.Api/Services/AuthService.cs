using System.IdentityModel.Tokens.Jwt;using System.Security.Claims;using System.Security.Cryptography;using System.Text;using Microsoft.IdentityModel.Tokens;using NutriAI.Api.Data;
namespace NutriAI.Api.Services;
public class AuthService(IConfiguration cfg)
{
    public string HashPassword(string password){var salt=RandomNumberGenerator.GetBytes(16);var hash=Rfc2898DeriveBytes.Pbkdf2(password,salt,210000,HashAlgorithmName.SHA256,32);return $"pbkdf2-sha256$210000${Convert.ToBase64String(salt)}${Convert.ToBase64String(hash)}";}
    public bool VerifyPassword(string password,string stored){try{var p=stored.Split('$');var salt=Convert.FromBase64String(p[2]);var expected=Convert.FromBase64String(p[3]);var actual=Rfc2898DeriveBytes.Pbkdf2(password,salt,int.Parse(p[1]),HashAlgorithmName.SHA256,32);return CryptographicOperations.FixedTimeEquals(actual,expected);}catch{return false;}}
    public string AccessToken(AppUser u){var key=cfg["Jwt:Key"]??throw new InvalidOperationException("Jwt:Key secret is missing");var creds=new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),SecurityAlgorithms.HmacSha256);var claims=new[]{new Claim(JwtRegisteredClaimNames.Sub,u.Id.ToString()),new Claim(JwtRegisteredClaimNames.Email,u.Email),new Claim("name",u.DisplayName)};return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(claims:claims,expires:DateTime.UtcNow.AddMinutes(20),signingCredentials:creds));}
    public (string raw,string hash) NewRefresh(){var raw=Convert.ToBase64String(RandomNumberGenerator.GetBytes(48));return(raw,Hash(raw));}
    public static string Hash(string s)=>Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(s)));
}
