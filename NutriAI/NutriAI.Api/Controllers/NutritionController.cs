using Microsoft.AspNetCore.Mvc;

namespace NutriAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NutritionController : ControllerBase
{
    private sealed record MealOption(string Name, int Cost, string[] Diets);

    private static readonly MealOption[] BreakfastOptions =
    {
        new("Yumurta, peynir ve tam buğday ekmeği", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yulaf, yoğurt ve muz", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Menemen, peynir ve tam buğday ekmeği", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yoğurt, yulaf, elma ve ceviz", 2, new[]{"normal","vegetarian","pescetarian"}),
        new("Lor peyniri, domates, salatalık ve tam buğday ekmeği", 2, new[]{"normal","vegetarian","pescetarian"}),
        new("Omlet, domates ve tam buğday ekmeği", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Haşlanmış yumurta, domates, salatalık ve ekmek", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Peynir, zeytin, domates ve ekmek", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yoğurt, muz ve yulaf", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Avokado, yumurta ve tam buğday ekmeği", 3, new[]{"normal","vegetarian","pescetarian"}),
        new("Kefir, yulaf, muz ve ceviz", 2, new[]{"normal","vegetarian","pescetarian"}),
        new("Yulaf, bitkisel süt ve muz", 1, new[]{"vegan"}),
        new("Nohut ezmesi, domates, salatalık ve tam buğday ekmeği", 1, new[]{"vegan"}),
        new("Tofu, domates ve mevsim sebzeleri", 2, new[]{"vegan"}),
        new("Chia, bitkisel süt ve muz", 3, new[]{"vegan"}),
        new("Avokado, nohut ezmesi ve tam buğday ekmeği", 3, new[]{"vegan"}),
        new("Yulaf, elma ve ceviz", 1, new[]{"vegan"}),
        new("Muz, yulaf ve tarçın", 1, new[]{"vegan"}),
        new("Nohut ezmesi, salatalık ve ekmek", 1, new[]{"vegan"}),
        new("Yulaf, bitkisel süt ve elma", 1, new[]{"vegan"})
    };

    private static readonly MealOption[] LunchOptions =
    {
        new("Tavuk, bulgur ve salata", 1, new[]{"normal"}),
        new("Hindi, pirinç ve salata", 2, new[]{"normal"}),
        new("Dana eti, bulgur ve salata", 2, new[]{"normal"}),
        new("Tavuk, tam buğday makarna ve yoğurt", 2, new[]{"normal"}),
        new("Köfte, patates ve salata", 2, new[]{"normal"}),
        new("Tavuk, patates ve cacık", 1, new[]{"normal"}),
        new("Balık, pirinç ve salata", 2, new[]{"normal","pescetarian"}),
        new("Ton balığı, tam buğday makarna ve salata", 2, new[]{"normal","pescetarian"}),
        new("Somon, kinoa ve salata", 3, new[]{"normal","pescetarian"}),
        new("Mercimek, bulgur ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Nohut, pirinç ve cacık", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Kuru fasulye, pirinç ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Sebze yemeği, bulgur ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yumurta, bulgur ve salata", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yeşil mercimek, pirinç ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Peynirli salata, bulgur ve ayran", 2, new[]{"vegetarian","pescetarian"}),
        new("Kinoa, peynir, avokado ve salata", 3, new[]{"vegetarian","pescetarian"}),
        new("Mercimek, bulgur ve salata", 1, new[]{"vegan"}),
        new("Nohut, pirinç ve salata", 1, new[]{"vegan"}),
        new("Kuru fasulye, pirinç ve salata", 1, new[]{"vegan"}),
        new("Tofu, pirinç ve mevsim sebzeleri", 2, new[]{"vegan"}),
        new("Kinoa, nohut, avokado ve salata", 3, new[]{"vegan"}),
        new("Yeşil mercimek, bulgur ve mevsim sebzeleri", 1, new[]{"vegan"}),
        new("Bulgur, nohut ve mevsim sebzeleri", 1, new[]{"vegan"}),
        new("Mercimek çorbası, pirinç ve salata", 1, new[]{"vegan"})
    };

    private static readonly MealOption[] DinnerOptions =
    {
        new("Balık, bulgur ve mevsim sebzeleri", 2, new[]{"normal","pescetarian"}),
        new("Tavuk, mevsim sebzeleri ve yoğurt", 1, new[]{"normal"}),
        new("Dana eti, mevsim sebzeleri ve bulgur", 2, new[]{"normal"}),
        new("Hindi, sebze ve pirinç", 2, new[]{"normal"}),
        new("Köfte, sebze ve salata", 2, new[]{"normal"}),
        new("Tavuk, bulgur ve cacık", 1, new[]{"normal"}),
        new("Somon, patates ve salata", 3, new[]{"normal","pescetarian"}),
        new("Ton balığı, nohut ve salata", 2, new[]{"normal","pescetarian"}),
        new("Mercimek çorbası, salata ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Kabak yemeği, bulgur ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Nohut yemeği, salata ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Kuru fasulye, salata ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Sebze yemeği, pirinç ve cacık", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yumurta, mevsim sebzeleri ve yoğurt", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Yeşil mercimek, salata ve pirinç", 1, new[]{"normal","vegetarian","pescetarian","vegan"}),
        new("Fırın sebze, peynir ve salata", 2, new[]{"vegetarian","pescetarian"}),
        new("Kinoa, nohut ve yoğurt", 3, new[]{"vegetarian","pescetarian"}),
        new("Mercimek çorbası, salata ve bulgur", 1, new[]{"vegan"}),
        new("Nohut yemeği, bulgur ve salata", 1, new[]{"vegan"}),
        new("Kuru fasulye, salata ve pirinç", 1, new[]{"vegan"}),
        new("Tofu, mevsim sebzeleri ve bulgur", 2, new[]{"vegan"}),
        new("Sebze yemeği, pirinç ve salata", 1, new[]{"vegan"}),
        new("Kinoa, yeşil mercimek ve avokado", 3, new[]{"vegan"}),
        new("Nohut, mevsim sebzeleri ve pirinç", 1, new[]{"vegan"}),
        new("Mercimek, salata ve bulgur", 1, new[]{"vegan"})
    };

    private static readonly MealOption[] SnackOptions =
    {
        new("Yoğurt ve mevsim meyvesi", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Elma ve ceviz", 1, new[]{"normal","vegetarian","pescetarian","vegan"}),
        new("Muz ve kefir", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Ayran ve salatalık", 1, new[]{"normal","vegetarian","pescetarian"}),
        new("Mevsim meyvesi ve badem", 2, new[]{"normal","vegetarian","pescetarian","vegan"}),
        new("Muz", 1, new[]{"normal","vegetarian","pescetarian","vegan"}),
        new("Havuç ve humus", 1, new[]{"vegan","vegetarian","pescetarian","normal"}),
        new("Elma ve fıstık ezmesi", 2, new[]{"normal","vegetarian","pescetarian","vegan"}),
        new("Bitkisel yoğurt ve mevsim meyvesi", 2, new[]{"vegan"}),
        new("Avokado ve tam buğday kraker", 3, new[]{"vegan"})
    };

    [HttpGet("test")]
    public IActionResult Test() => Ok(new { success = true, message = "Nutrition API çalışıyor." });

    [HttpPost("create-plan")]
    public IActionResult CreatePlan([FromBody] PlanRequest request)
    {
        var dietaryType = NormalizeDietaryType(request.DietaryType, request.Vegetarian);
        var budgetMode = NormalizeBudgetMode(request.BudgetMode);
        var allergies = request.Allergies ?? new List<string>();
        var dislikes = SplitDislikes(request.DislikedFoods);
        var mealCount = Math.Clamp(request.MealCount <= 0 ? 3 : request.MealCount, 2, 5);

        var plan = new Dictionary<string, Dictionary<string, string>>();
        var days = new[] { "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" };
        var usedWeek = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        for (var i = 0; i < days.Length; i++)
        {
            var day = new Dictionary<string, string>();
            var usedToday = new List<string>();

            void AddMeal(string key, string mealType, int seed)
            {
                var meal = PickMeal(mealType, seed, dietaryType, budgetMode, allergies, dislikes, usedToday, usedWeek);
                day[key] = meal;
                if (!string.IsNullOrWhiteSpace(meal))
                {
                    usedToday.Add(meal);
                    usedWeek.Add(meal);
                }
            }

            if (mealCount == 2)
            {
                AddMeal("breakfast", "brunch", i * 3);
                AddMeal("dinner", "dinner", i * 3 + 2);
            }
            else
            {
                AddMeal("breakfast", "breakfast", i * 5);
                AddMeal("lunch", "lunch", i * 5 + 1);
                AddMeal("dinner", "dinner", i * 5 + 2);
            }

            if (mealCount >= 4)
                AddMeal("snack1", "snack", i * 5 + 3);

            if (mealCount >= 5)
                AddMeal("snack2", "snack", i * 5 + 4);

            plan[days[i]] = day;
        }

        return Ok(new
        {
            success = true,
            settings = new
            {
                dietaryType,
                budgetMode,
                mealCount,
                peopleCount = Math.Clamp(request.PeopleCount <= 0 ? 1 : request.PeopleCount, 1, 8),
                allergies,
                dislikedFoods = request.DislikedFoods ?? ""
            },
            plan
        });
    }

    private static string PickMeal(
        string mealType,
        int seed,
        string dietaryType,
        string budgetMode,
        List<string> allergies,
        List<string> dislikes,
        List<string> usedToday,
        HashSet<string> usedWeek)
    {
        var candidates = GetCandidates(mealType, dietaryType, budgetMode)
            .Where(x => IsMealAllowed(x, dietaryType, allergies, dislikes))
            .ToList();

        if (candidates.Count == 0)
        {
            candidates = GetSafeFallbacks(mealType)
                .Where(x => IsMealAllowed(x, dietaryType, allergies, dislikes))
                .ToList();
        }

        if (candidates.Count == 0)
            return mealType == "snack" ? "Mevsim meyvesi" : "Pirinç ve mevsim sebzeleri";

        // Öncelik 1: Aynı gün aynı ana besin/protein tekrar etmesin.
        var primaryFiltered = candidates
            .Where(x => usedToday.All(y => MainFoodKey(y) != MainFoodKey(x)))
            .ToList();
        if (primaryFiltered.Count > 0) candidates = primaryFiltered;

        // Öncelik 2: Hafta içinde birebir aynı öğünü mümkün olduğunca tekrar etme.
        var fresh = candidates.Where(x => !usedWeek.Contains(x)).ToList();
        if (fresh.Count > 0) candidates = fresh;

        // Sabit seed ile her plan üretiminde dengeli fakat günlere dağılmış seçim.
        var index = Math.Abs(seed) % candidates.Count;
        return candidates[index];
    }

    private static IEnumerable<string> GetCandidates(string mealType, string dietaryType, string budgetMode)
    {
        var source = mealType switch
        {
            "breakfast" or "brunch" => BreakfastOptions,
            "lunch" => LunchOptions,
            "dinner" => DinnerOptions,
            "snack" => SnackOptions,
            _ => DinnerOptions
        };

        var maxCost = budgetMode switch
        {
            "economic" => 1,
            "premium" => 3,
            _ => 2
        };

        var filtered = source
            .Where(x => x.Diets.Contains(dietaryType, StringComparer.OrdinalIgnoreCase))
            .Where(x => x.Cost <= maxCost)
            .Select(x => x.Name)
            .ToList();

        // Ekonomik havuz alerji/tercihler nedeniyle çok daralırsa standart seçeneklere açılabilsin.
        if (filtered.Count < 4 && budgetMode == "economic")
        {
            filtered = source
                .Where(x => x.Diets.Contains(dietaryType, StringComparer.OrdinalIgnoreCase))
                .Where(x => x.Cost <= 2)
                .Select(x => x.Name)
                .ToList();
        }

        return filtered;
    }

    private static IEnumerable<string> GetSafeFallbacks(string mealType)
    {
        if (mealType == "snack")
            return new[] { "Muz", "Elma", "Mevsim meyvesi" };

        if (mealType == "breakfast" || mealType == "brunch")
            return new[] { "Muz ve yulaf", "Domates ve mevsim sebzeleri", "Pirinç ve mevsim sebzeleri" };

        return new[]
        {
            "Pirinç ve mevsim sebzeleri",
            "Nohut, pirinç ve salata",
            "Mercimek, pirinç ve salata"
        };
    }

    private static string MainFoodKey(string meal)
    {
        var n = NormalizeText(meal);
        var groups = new (string Key, string[] Words)[]
        {
            ("chicken", new[]{"tavuk"}),
            ("turkey", new[]{"hindi"}),
            ("beef", new[]{"dana", "kofte", "et "}),
            ("fish", new[]{"balik", "somon", "ton baligi"}),
            ("egg", new[]{"yumurta", "omlet", "menemen"}),
            ("lentil", new[]{"mercimek"}),
            ("chickpea", new[]{"nohut", "humus"}),
            ("beans", new[]{"fasulye"}),
            ("tofu", new[]{"tofu"}),
            ("dairy", new[]{"yogurt", "peynir", "kefir", "ayran"}),
            ("oat", new[]{"yulaf"})
        };

        foreach (var group in groups)
            if (group.Words.Any(n.Contains)) return group.Key;

        return n.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? n;
    }

    private static bool IsMealAllowed(
        string meal,
        string dietaryType,
        List<string> allergies,
        List<string> dislikes)
    {
        var normalized = NormalizeText(meal);

        string[] animalMeat = { "tavuk", "dana", "hindi", "kofte", "et ", "kiyma" };
        string[] fishFoods = { "balik", "somon", "ton baligi", "karides" };
        string[] dairyEgg = { "yumurta", "omlet", "menemen", "peynir", "yogurt", "sut", "ayran", "kefir", "cacik" };

        if (dietaryType == "vegan" && animalMeat.Concat(fishFoods).Concat(dairyEgg).Any(normalized.Contains))
            return false;

        if (dietaryType == "vegetarian" && animalMeat.Concat(fishFoods).Any(normalized.Contains))
            return false;

        if (dietaryType == "pescetarian" && animalMeat.Any(normalized.Contains))
            return false;

        foreach (var allergy in allergies)
        {
            var a = NormalizeText(allergy);
            var blocked = a switch
            {
                "milk" or "sut" or "sut urunleri" => new[] { "sut", "yogurt", "peynir", "ayran", "kefir", "cacik" },
                "egg" or "yumurta" => new[] { "yumurta", "omlet", "menemen" },
                "gluten" => new[] { "ekmek", "bulgur", "makarna", "kraker" },
                "peanut" or "yer fistigi" => new[] { "yer fistigi", "fistik ezmesi" },
                "nuts" or "kuruyemis" => new[] { "ceviz", "badem", "findik", "kuruyemis" },
                "fish" or "balik" => new[] { "balik", "somon", "ton baligi" },
                "shellfish" or "kabuklu deniz urunleri" => new[] { "karides", "midye", "kalamar" },
                "soy" or "soya" => new[] { "soya", "tofu" },
                "sesame" or "susam" => new[] { "susam", "tahin" },
                "mustard" or "hardal" => new[] { "hardal" },
                "celery" or "kereviz" => new[] { "kereviz" },
                "corn" or "misir" => new[] { "misir" },
                "strawberry" or "cilek" => new[] { "cilek" },
                _ => new[] { a }
            };

            if (blocked.Any(x => !string.IsNullOrWhiteSpace(x) && normalized.Contains(x)))
                return false;
        }

        foreach (var dislike in dislikes)
        {
            if (!string.IsNullOrWhiteSpace(dislike) && normalized.Contains(NormalizeText(dislike)))
                return false;
        }

        return true;
    }

    private static List<string> SplitDislikes(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return new List<string>();
        return value
            .Split(new[] { ',', ';', '\n' }, StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .ToList();
    }

    private static string NormalizeDietaryType(string? value, bool vegetarian)
    {
        var n = NormalizeText(value ?? "");
        if (n is "vegetarian" or "vejetaryen") return "vegetarian";
        if (n is "vegan") return "vegan";
        if (n is "pescetarian" or "pesketaryen" or "pesketaryan") return "pescetarian";
        return vegetarian ? "vegetarian" : "normal";
    }

    private static string NormalizeBudgetMode(string? value)
    {
        var n = NormalizeText(value ?? "");
        if (n is "economic" or "ekonomik" or "cheap" or "ucuz") return "economic";
        if (n is "premium" or "luxury" or "luks") return "premium";
        return "standard";
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

    public record PlanRequest(
        string Goal,
        int Age,
        int Height,
        int Weight,
        int WeeklyBudget,
        bool Vegetarian = false,
        string? DietaryType = null,
        List<string>? Allergies = null,
        string? DislikedFoods = null,
        int MealCount = 3,
        int PeopleCount = 1,
        string? BudgetMode = "standard"
    );
}
