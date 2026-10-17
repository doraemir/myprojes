using System.Security.Claims;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;using Microsoft.EntityFrameworkCore;using NutriAI.Api.Data;
namespace NutriAI.Api.Controllers;
[ApiController][Authorize][Route("api/garden")]
public class GardenController(NutriDbContext db):ControllerBase
{
 Guid UserId()=>Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)??User.FindFirstValue("sub")!);
 public record XpEvent(string Type,int Calories=0);
 [HttpPost("event")] public async Task<IActionResult> Event(XpEvent e){var amount=e.Type switch{"meal_completed"=>35,"honest_extra"=>10,"day_closed"=>50,_=>0};if(e.Type=="honest_extra"&&e.Calories>400)amount=5;if(amount==0)return BadRequest(new{message="Geçersiz XP olayı."});var id=UserId();db.XPTransactions.Add(new XPTransaction{UserId=id,Amount=amount,Reason=e.Type});await db.SaveChangesAsync();var total=await db.XPTransactions.Where(x=>x.UserId==id).SumAsync(x=>x.Amount);return Ok(new{amount,total});}
 [HttpGet] public async Task<IActionResult> Get(){var id=UserId();var total=await db.XPTransactions.Where(x=>x.UserId==id).SumAsync(x=>x.Amount);var history=await db.XPTransactions.Where(x=>x.UserId==id).OrderByDescending(x=>x.CreatedAt).Take(30).ToListAsync();return Ok(new{total,history});}
}
