using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace NutriAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PricesController : ControllerBase
{
    private static readonly HttpClient Http = new();

    [HttpGet]
    public async Task<IActionResult> GetPrices([FromQuery] string items, [FromQuery] double? latitude = null, [FromQuery] double? longitude = null)
    {
        if (string.IsNullOrWhiteSpace(items))
            return BadRequest(new { success = false, message = "items parametresi gerekli." });

        var requestedItems = items
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        var results = new List<ShoppingPriceItem>();

        foreach (var item in requestedItems)
        {
            try
            {
                var response = await SearchMarketFiyati(item, latitude ?? 41.0082, longitude ?? 28.9784);
                var products = response?.GetProperty("content");

                if (products is null || products.Value.ValueKind != JsonValueKind.Array)
                {
                    results.Add(CreateEmpty(item));
                    continue;
                }

                JsonElement? bestProduct = null;
                decimal bestScore = decimal.MinValue;

                foreach (var product in products.Value.EnumerateArray())
                {
                    var title = GetString(product, "title");
                    if (string.IsNullOrWhiteSpace(title)) continue;

                    var score = MatchScore(item, title);
                    if (score > bestScore)
                    {
                        bestScore = score;
                        bestProduct = product;
                    }
                }

                if (bestProduct is null || bestScore <= 0)
                {
                    results.Add(CreateEmpty(item));
                    continue;
                }

                var prices = new List<MarketPrice>();
                if (bestProduct.Value.TryGetProperty("productDepotInfoList", out var depotList) &&
                    depotList.ValueKind == JsonValueKind.Array)
                {
                    foreach (var depot in depotList.EnumerateArray())
                    {
                        var market = NormalizeMarket(GetString(depot, "marketAdi"));
                        var price = GetDecimal(depot, "price");

                        if (market is null || price <= 0) continue;
                                                prices.Add(new MarketPrice
                        {
                            Market = market,
                            Price = price,
                            Unit = GetString(depot, "unitPrice") ?? "",
                            Product = GetString(bestProduct.Value, "title") ?? item,
                            UpdatedAt = GetString(depot, "indexTime") ?? DateTime.UtcNow.ToString("O")
                        });
                    }
                }

                prices = prices
                    .GroupBy(x => x.Market, StringComparer.OrdinalIgnoreCase)
                    .Select(g => g.OrderBy(x => x.Price).First())
                    .OrderBy(x => x.Price)
                    .ToList();

                results.Add(new ShoppingPriceItem
                {
                    Name = item,
                    Quantity = DefaultQuantity(item),
                    Unit = DefaultUnit(item),
                    Prices = prices
                });
            }
            catch
            {
                // Bir market sorgusu hata verse bile diğer ürünlerin fiyatları gelmeye devam etsin.
                results.Add(CreateEmpty(item));
            }
        }

        return Ok(new
        {
            success = true,
            lastUpdated = DateTime.UtcNow,
            items = results
        });
    }

    private static async Task<JsonElement?> SearchMarketFiyati(string keyword, double latitude, double longitude)
    {
        var payload = new
        {
            keywords = keyword,
            pages = 0,
            size = 24,
            latitude,
            longitude,
            distance = 10
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.marketfiyati.org.tr/api/v2/search");

        request.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        request.Headers.TryAddWithoutValidation("Accept", "application/json, text/plain, */*");
        request.Headers.TryAddWithoutValidation("Origin", "https://marketfiyati.org.tr");
        request.Headers.TryAddWithoutValidation("Referer", "https://marketfiyati.org.tr/");
        request.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");

        using var response = await Http.SendAsync(request);
        if (!response.IsSuccessStatusCode) return null;

        await using var stream = await response.Content.ReadAsStreamAsync();
        var json = await JsonDocument.ParseAsync(stream);
        return json.RootElement.Clone();
    }

    private static decimal MatchScore(string wanted, string title)
    {
        var a = NormalizeText(wanted);
        var b = NormalizeText(title);

        if (b == a) return 100;
        if (b.Contains(a)) return 80;

        var tokens = a.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var matches = tokens.Count(t => b.Contains(t));
        return tokens.Length == 0 ? 0 : (decimal)matches / tokens.Length * 60;
    }

    private static string NormalizeText(string value)
    {
        return value.Trim().ToLowerInvariant()
            .Replace("ı", "i")
            .Replace("ş", "s")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ö", "o")
            .Replace("ç", "c");
    }

    private static string? NormalizeMarket(string? market)
    {
        if (string.IsNullOrWhiteSpace(market)) return null;
        var m = NormalizeText(market);

        if (m.Contains("a101")) return "A101";
        if (m.Contains("bim")) return "BİM";
        if (m.Contains("sok")) return "ŞOK";
        if (m.Contains("carrefour")) return "CarrefourSA";
        if (m.Contains("migros")) return "Migros";
        return null;
    }

    private static string? GetString(JsonElement element, string property)
    {
        return element.TryGetProperty(property, out var value) && value.ValueKind != JsonValueKind.Null
            ? value.ToString()
            : null;
    }

    private static decimal GetDecimal(JsonElement element, string property)
    {
        if (!element.TryGetProperty(property, out var value)) return 0;
        if (value.ValueKind == JsonValueKind.Number && value.TryGetDecimal(out var number)) return number;
        return decimal.TryParse(value.ToString(), System.Globalization.NumberStyles.Any,
            System.Globalization.CultureInfo.InvariantCulture, out var parsed) ? parsed : 0;
    }

    private static ShoppingPriceItem CreateEmpty(string item) => new()
    {
        Name = item,
        Quantity = DefaultQuantity(item),
        Unit = DefaultUnit(item),
        Prices = new List<MarketPrice>()
    };

    private static decimal DefaultQuantity(string item)
    {
        var n = NormalizeText(item);

        // Bu değerler 1 kişi / 1 haftalık yaklaşık alışveriş miktarıdır.
        // Mobil uygulama kişi sayısına göre miktarı çarpar.
        if (n.Contains("tavuk")) return 1.5m;
        if (n.Contains("dana") || n.Contains("et")) return 0.75m;
        if (n.Contains("somon") || n.Contains("balik")) return 0.75m;
        if (n.Contains("ton baligi")) return 2;
        if (n.Contains("yumurta")) return 1;
        if (n.Contains("yogurt")) return 1.5m;
        if (n.Contains("bitkisel sut") || n.Contains("sut")) return 1;
        if (n.Contains("yulaf")) return 1;
        if (n.Contains("peynir")) return 0.5m;
        if (n.Contains("pirinc") || n.Contains("bulgur") || n.Contains("kinoa")) return 1;
        if (n.Contains("mercimek") || n.Contains("nohut") || n.Contains("fasulye")) return 1;
        if (n.Contains("tofu")) return 2;
        if (n.Contains("avokado")) return 2;
        if (n.Contains("muz") || n.Contains("elma")) return 1;
        if (n.Contains("domates") || n.Contains("salatalik") || n.Contains("sebze")) return 1;
        if (n.Contains("ceviz") || n.Contains("chia")) return 0.25m;
        return 1;
    }

    private static string DefaultUnit(string item)
    {
        var n = NormalizeText(item);
        if (n.Contains("yumurta")) return "paket";
        if (n.Contains("ton baligi") || n.Contains("tofu") || n.Contains("avokado")) return "adet/paket";
        if (n.Contains("tavuk") || n.Contains("dana") || n.Contains("et") || n.Contains("somon") ||
            n.Contains("balik") || n.Contains("peynir") || n.Contains("yogurt") || n.Contains("pirinc") ||
            n.Contains("bulgur") || n.Contains("kinoa") || n.Contains("mercimek") || n.Contains("nohut") ||
            n.Contains("fasulye") || n.Contains("domates") || n.Contains("salatalik") || n.Contains("sebze") ||
            n.Contains("muz") || n.Contains("elma") || n.Contains("ceviz") || n.Contains("chia"))
            return "kg";
        if (n.Contains("sut")) return "L";
        return "adet/paket";
    }

    public class ShoppingPriceItem
    {
        public string Name { get; set; } = "";
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "";
        public List<MarketPrice> Prices { get; set; } = new();
    }

    public class MarketPrice
    {
        public string Market { get; set; } = "";
        public decimal Price { get; set; }
        public string Unit { get; set; } = "";
        public string Product { get; set; } = "";
        public string UpdatedAt { get; set; } = "";
    }
}
