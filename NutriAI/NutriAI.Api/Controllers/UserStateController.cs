using System.Security.Claims;using Microsoft.AspNetCore.Authorization;using Microsoft.AspNetCore.Mvc;using Microsoft.EntityFrameworkCore;using NutriAI.Api.Data;
namespace NutriAI.Api.Controllers;
[ApiController][Authorize][Route("api/[controller]")]
public class UserStateController(NutriDbContext db):ControllerBase
{
 Guid UserId()=>Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)??User.FindFirstValue("sub")!);
 [HttpGet]public async Task<IActionResult> Get(){var id=UserId();var x=await db.UserStates.AsNoTracking().FirstOrDefaultAsync(z=>z.UserId==id);return x==null?NotFound():Ok(new{x.DataJson,x.UpdatedAt});}
 [HttpPut]public async Task<IActionResult> Put([FromBody]System.Text.Json.JsonElement body){var id=UserId();var x=await db.UserStates.FirstOrDefaultAsync(z=>z.UserId==id);if(x==null){x=new UserState{UserId=id};db.UserStates.Add(x);}x.DataJson=body.GetRawText();x.UpdatedAt=DateTime.UtcNow;await db.SaveChangesAsync();return Ok(new{success=true,x.UpdatedAt});}
}
