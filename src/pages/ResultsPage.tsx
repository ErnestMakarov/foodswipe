import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Clock3, Heart, RotateCcw, Sparkles, Star, Utensils } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { foods } from "../data/foods";
import type { Food, FoodCategory } from "../types/food";

type RestaurantRecommendation = {
  name: string;
  score: number;
  matchedFoods: Food[];
  likedFoods: Food[];
  categories: FoodCategory[];
  averageRating: number;
  deliveryMinutes: string;
  image: string;
  imageAlt: string;
  priceFrom: number;
};

function readLiked(): Food[] {
  try {
    const raw = sessionStorage.getItem("ernest-food-liked");
    if (!raw) return [];
    const ids: unknown = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    return ids
      .filter((item): item is { id: string } =>
        typeof item === "object" && item !== null && "id" in item && typeof item.id === "string",
      )
      .map((item) => foods.find((food) => food.id === item.id))
      .filter((food): food is Food => Boolean(food));
  } catch {
    return [];
  }
}

function buildRecommendations(liked: Food[]): RestaurantRecommendation[] {
  if (liked.length === 0) return [];

  const categoryCounts = new Map<FoodCategory, number>();
  const tagCounts = new Map<string, number>();
  liked.forEach((food) => {
    categoryCounts.set(food.category, (categoryCounts.get(food.category) ?? 0) + 1);
    food.tags.forEach((tag) => tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1));
  });
  const likedIds = new Set(liked.map((food) => food.id));
  const groups = new Map<string, Food[]>();
  foods.forEach((food) => {
    const group = groups.get(food.restaurant) ?? [];
    group.push(food);
    groups.set(food.restaurant, group);
  });

  return Array.from(groups.entries())
    .map(([name, restaurantFoods]) => {
      const foodScore = (food: Food) =>
        (categoryCounts.get(food.category) ?? 0) * 3 +
        food.tags.reduce((sum, tag) => sum + (tagCounts.get(tag) ?? 0), 0);
      const matchedFoods = restaurantFoods
        .filter((food) => foodScore(food) > 0)
        .sort((a, b) => foodScore(b) - foodScore(a));
      const likedFoods = restaurantFoods.filter((food) => likedIds.has(food.id));
      const similarityScore = matchedFoods.reduce((sum, food) => sum + foodScore(food), 0);
      const score = similarityScore + likedFoods.length * 4;
      const averageRating = restaurantFoods.reduce((sum, food) => sum + food.rating, 0) / restaurantFoods.length;
      const firstMatched = matchedFoods[0] ?? restaurantFoods[0];
      return {
        name,
        score,
        matchedFoods,
        likedFoods,
        categories: Array.from(new Set(restaurantFoods.map((food) => food.category))),
        averageRating,
        deliveryMinutes: firstMatched.deliveryMinutes,
        image: firstMatched.image,
        imageAlt: firstMatched.imageAlt,
        priceFrom: Math.min(...restaurantFoods.map((food) => food.price)),
      };
    })
    .filter((restaurant) => restaurant.matchedFoods.length > 0)
    .sort((a, b) => b.score - a.score || b.averageRating - a.averageRating)
    .slice(0, 5);
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Food[]>(readLiked);
  const recommendations = useMemo(() => buildRecommendations(liked), [liked]);
  const preferredCategories = useMemo(
    () => Array.from(new Set(liked.map((food) => food.category))),
    [liked],
  );

  function removeLiked(foodId: string) {
    setLiked((current) => {
      const next = current.filter((food) => food.id !== foodId);
      sessionStorage.setItem("ernest-food-liked", JSON.stringify(next));
      return next;
    });
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      <button onClick={() => navigate(-1)} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#758076] transition hover:text-[#1c261f]">
        <ArrowLeft size={16} /> Back to discovery
      </button>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f5ec] px-3 py-1.5 text-xs font-bold text-[#168447]"><Sparkles size={14} /> YOUR RESTAURANT MATCHES</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-[-2px] sm:text-5xl">Your taste, narrowed down.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#758076]">Based on the dishes you liked, here are restaurants with more food in a similar direction.</p>
        </div>
        <div className="rounded-2xl border border-[#e7ebe4] bg-white px-5 py-4">
          <p className="text-xs font-semibold text-[#758076]">Dishes you liked</p>
          <p className="mt-1 text-2xl font-black">{liked.length}</p>
          {preferredCategories.length > 0 && <p className="mt-2 max-w-56 text-xs leading-5 text-[#758076]">Taste signals: {preferredCategories.join(", ")}</p>}
        </div>
      </div>

      {liked.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-[#dce4d9] bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f5ec] text-[#168447]"><Heart size={24} /></span>
          <h2 className="mt-4 text-xl font-black">Let’s find your kind of food</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#758076]">Like a few dishes first. We’ll use them to suggest restaurants with similar options.</p>
          <Button onClick={() => navigate("/preferences")} className="mt-6">Start discovering <ArrowRight size={16} /></Button>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-[#dce4d9] bg-white px-6 py-14 text-center">
          <h2 className="text-xl font-black">No restaurant matches yet</h2>
          <p className="mt-2 text-sm text-[#758076]">Try liking a few more dishes to give the demo more signals.</p>
          <Button onClick={() => navigate("/discover")} className="mt-6">Keep discovering <ArrowRight size={16} /></Button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#e2ebdf] bg-[#f0f7ef] p-4 sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#168447]"><Sparkles size={19} /></span>
            <div>
              <p className="text-sm font-bold">Why these restaurants?</p>
              <p className="mt-1 text-sm leading-5 text-[#587461]">This demo looks for restaurants with dishes in the categories you liked. Matches are illustrative and aren’t connected to live menus or availability.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {recommendations.map((restaurant, index) => (
              <article key={restaurant.name} className="overflow-hidden rounded-3xl border border-[#e7ebe4] bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#263d2b]/5">
                <div className="relative h-52 overflow-hidden bg-[#e9eee6] sm:h-60">
                  <img src={restaurant.image} alt={restaurant.imageAlt} className="h-full w-full object-cover" loading={index > 1 ? "lazy" : "eager"} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 pt-16 text-white">
                    <span className="mb-2 inline-flex rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">{index === 0 ? "TOP MATCH" : `MATCH ${index + 1}`}</span>
                    <h2 className="text-2xl font-black tracking-tight">{restaurant.name}</h2>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-[#68736a]">
                    <span className="inline-flex items-center gap-1"><Star size={14} className="fill-[#e4aa35] text-[#e4aa35]" /> {restaurant.averageRating.toFixed(1)} demo rating</span>
                    <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {restaurant.deliveryMinutes}</span>
                    <span>From €{restaurant.priceFrom.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {restaurant.categories.map((category) => <span key={category} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${preferredCategories.includes(category) ? "bg-[#e9f5ec] text-[#168447]" : "bg-[#f1f4ef] text-[#68736a]"}`}>{category}</span>)}
                  </div>
                  <div className="mt-5 border-t border-[#edf0ea] pt-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#879087]">Dishes to check out</p>
                    <div className="mt-3 space-y-3">
                      {restaurant.matchedFoods.slice(0, 2).map((food) => (
                        <div key={food.id} className="flex items-center gap-3">
                          <img src={food.image} alt={food.imageAlt} className="size-14 shrink-0 rounded-xl object-cover" loading="lazy" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold">{food.name}</p>
                            <p className="mt-0.5 text-xs text-[#758076]">{food.category} · €{food.price.toFixed(2)}</p>
                          </div>
                          {liked.some((item) => item.id === food.id) && <span className="shrink-0 rounded-full bg-[#e9f5ec] px-2 py-1 text-[10px] font-bold text-[#168447]">Liked</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                  {restaurant.likedFoods.length > 0 && <p className="mt-4 text-xs leading-5 text-[#587461]">You liked {restaurant.likedFoods.length === 1 ? "a dish" : `${restaurant.likedFoods.length} dishes`} from this restaurant.</p>}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-[#e9f5ec] p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#168447]"><Utensils size={20} /></span>
              <div><p className="font-bold">A shorter path from craving to choice.</p><p className="mt-1 text-sm leading-5 text-[#587461]">The demo suggests places — it doesn’t place a real order.</p></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => navigate("/discover")} variant="secondary"><ArrowLeft size={15} /> More swipes</Button>
              <Button onClick={() => navigate("/preferences")} variant="secondary"><RotateCcw size={15} /> Start over</Button>
            </div>
          </div>

          <details className="mt-6 rounded-2xl border border-[#e7ebe4] bg-white p-4">
            <summary className="cursor-pointer text-sm font-bold text-[#68736a]">Review the dishes you liked ({liked.length})</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {liked.map((food) => (
                <div key={food.id} className="flex items-center gap-3 rounded-xl bg-[#f7f8f5] p-3">
                  <img src={food.image} alt={food.imageAlt} className="size-12 shrink-0 rounded-lg object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{food.name}</p><p className="mt-0.5 text-xs text-[#758076]">{food.restaurant} · €{food.price.toFixed(2)}</p></div>
                  <button onClick={() => removeLiked(food.id)} className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-[#b74432] hover:bg-white" aria-label={`Remove ${food.name} from liked dishes`}>Remove</button>
                </div>
              ))}
            </div>
          </details>
        </>
      )}
    </main>
  );
}
