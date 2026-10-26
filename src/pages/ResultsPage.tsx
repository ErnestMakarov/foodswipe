import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Sparkles, Utensils } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { foods } from "../data/foods";
import type { Food } from "../types/food";

function readLiked(): Food[] {
  try {
    const raw = sessionStorage.getItem("ernest-food-liked");
    if (!raw) return [];
    const ids: unknown = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    return ids.filter((item): item is Food =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string" &&
      foods.some((food) => food.id === item.id),
    ).map((item) => foods.find((food) => food.id === item.id)!);
  } catch {
    return [];
  }
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Food[]>(readLiked);

  useEffect(() => {
    sessionStorage.setItem("ernest-food-liked", JSON.stringify(liked));
  }, [liked]);

  const total = liked.reduce((sum, food) => sum + food.price, 0);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <button onClick={() => navigate(-1)} className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#758076] hover:text-[#1c261f]">
        <ArrowLeft size={16} /> Back to discovery
      </button>

      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e9f5ec] px-3 py-1.5 text-xs font-bold text-[#168447]"><Sparkles size={14} /> YOUR PERSONAL SHORTLIST</span>
          <h1 className="mt-4 text-4xl font-black tracking-[-2px] sm:text-5xl">These caught your eye.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#758076]">Your yeses, all in one place. Pick the one you're craving most.</p>
        </div>
        <div className="rounded-2xl border border-[#e7ebe4] bg-white px-5 py-4">
          <p className="text-xs font-semibold text-[#758076]">Saved dishes</p>
          <p className="mt-1 text-2xl font-black">{liked.length}</p>
          {liked.length > 0 && <p className="mt-1 text-xs text-[#758076]">Combined menu price: €{total.toFixed(2)}</p>}
        </div>
      </div>

      {liked.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-[#dce4d9] bg-white px-6 py-14 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f5ec] text-[#168447]"><Heart size={24} /></span>
          <h2 className="mt-4 text-xl font-black">Your shortlist is waiting</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#758076]">Head back to discovery and tap the heart on any dish that looks good.</p>
          <Button onClick={() => navigate("/preferences")} className="mt-6">Start discovering <ArrowRight size={16} /></Button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liked.map((food) => (
              <article key={food.id} className="overflow-hidden rounded-2xl border border-[#e7ebe4] bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#263d2b]/5">
                <div className="relative h-48 overflow-hidden bg-[#e9eee6]">
                  <img src={food.image} alt={food.imageAlt} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#354037]">{food.category}</span>
                  <button onClick={() => setLiked((current) => current.filter((item) => item.id !== food.id))} aria-label={`Remove ${food.name} from shortlist`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 text-[#168447] hover:text-[#b74432]"><Heart size={17} className="fill-current" /></button>
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-[#168447]">{food.restaurant}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h2 className="font-extrabold">{food.name}</h2>
                    <span className="shrink-0 font-black">€{food.price.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-5 text-[#758076]">{food.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {food.tags.map((tag) => <span key={tag} className="rounded-full bg-[#f1f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#68736a]">{tag}</span>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col justify-between gap-3 rounded-2xl bg-[#e9f5ec] p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white text-[#168447]"><Utensils size={20} /></span>
              <div><p className="font-bold">Decision made a little easier.</p><p className="mt-1 text-sm text-[#587461]">Choose your favourite — the demo doesn't place a real order.</p></div>
            </div>
            <Button onClick={() => navigate("/preferences")} variant="secondary"><RotateCcw size={15} /> Try another mix</Button>
          </div>
        </>
      )}
    </main>
  );
}