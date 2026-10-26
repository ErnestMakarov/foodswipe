import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Heart, RotateCcw, SlidersHorizontal, X, Sparkles, Clock3, Star } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import { foods } from "../../data/foods";
import { filterFoods, shuffleFoods } from "./filterFoods";
import type { Food, FoodPreferences } from "../../types/food";

const defaultPreferences: FoodPreferences = {
  budget: 20,
  excludedCategories: [],
  vegetarianOnly: false,
};

function readPreferences(): FoodPreferences {
  try {
    const raw = sessionStorage.getItem("ernest-food-preferences");
    if (!raw) return defaultPreferences;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "budget" in parsed &&
      "excludedCategories" in parsed &&
      "vegetarianOnly" in parsed
    ) {
      return parsed as FoodPreferences;
    }
  } catch {
    // Fall back to the safe demo defaults if session storage is unavailable or malformed.
  }
  return defaultPreferences;
}

export default function DiscoveryView() {
  const navigate = useNavigate();
  const [preferences] = useState<FoodPreferences>(readPreferences);
  const [deck, setDeck] = useState<Food[]>([]);
  const [position, setPosition] = useState(0);
  const [liked, setLiked] = useState<Food[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const latestDragX = useRef(0);

  useEffect(() => {
    setDeck(shuffleFoods(filterFoods(foods, preferences)));
  }, [preferences]);

  const currentFood = deck[position];
  const nextFood = deck[position + 1];
  const progress = deck.length ? Math.min(position / deck.length, 1) : 1;

  function decide(isLiked: boolean) {
    if (!currentFood) return;
    if (isLiked) {
      setLiked((current) =>
        current.some((food) => food.id === currentFood.id)
          ? current
          : [...current, currentFood],
      );
    } else {
      setSkipped((current) => current + 1);
    }
    setPosition((current) => current + 1);
    latestDragX.current = 0;
    setDragX(0);
  }

  function finishDiscovery() {
    sessionStorage.setItem("ernest-food-liked", JSON.stringify(liked));
    navigate("/results");
  }

  function restart() {
    setDeck(shuffleFoods(filterFoods(foods, preferences)));
    setPosition(0);
    setLiked([]);
    setSkipped(0);
    latestDragX.current = 0;
    setDragX(0);
  }

  // Mouse users on desktop use the explicit buttons; touch dragging stays available on phones/tablets.
  function onPointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse") return;
    pointerStart.current = event.clientX;
    latestDragX.current = 0;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (pointerStart.current === null) return;
    const nextX = event.clientX - pointerStart.current;
    latestDragX.current = nextX;
    setDragX(nextX);
  }

  function onPointerUp() {
    if (pointerStart.current === null) return;
    const delta = latestDragX.current;
    pointerStart.current = null;
    latestDragX.current = 0;
    setDragging(false);
    if (delta > 90) decide(true);
    else if (delta < -90) decide(false);
    else setDragX(0);
  }

  function onPointerCancel() {
    pointerStart.current = null;
    latestDragX.current = 0;
    setDragging(false);
    setDragX(0);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button onClick={() => navigate("/preferences")} className="inline-flex items-center gap-2 text-sm font-semibold text-[#758076] hover:text-[#1c261f]">
            <ArrowLeft size={16} /> Preferences
          </button>
          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#68736a] ring-1 ring-[#e7ebe4]">
            <SlidersHorizontal size={14} /> Up to €{preferences.budget}
            {preferences.excludedCategories.length > 0 && <span>· {preferences.excludedCategories.length} excluded</span>}
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold tracking-[1.8px] text-[#168447]">YOUR DISCOVERY MIX</span>
            <h1 className="mt-2 text-3xl font-black tracking-[-1.5px] sm:text-4xl">Go with your gut.</h1>
            <p className="mt-2 text-sm text-[#758076]">Swipe right for a yes. Left for a no.</p>
          </div>
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold">{Math.min(position + 1, deck.length)} <span className="font-normal text-[#8b948b]">/ {deck.length}</span></div>
            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-[#e4e9e1]">
              <div className="h-full rounded-full bg-[#168447] transition-all" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
          <div className="mx-auto w-full max-w-[430px]">
            {currentFood ? (
              <div className="relative mx-auto">
                {nextFood && (
                  <div className="absolute inset-x-3 top-3 h-full rounded-[28px] border border-[#e8ebe5] bg-white/70" />
                )}
                <article
                  key={currentFood.id}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                  className={`card-enter relative z-10 touch-pan-y select-none overflow-hidden rounded-[28px] border border-[#e7ebe4] bg-white shadow-[0_20px_60px_rgba(34,52,36,0.10)] ${dragging ? "cursor-grabbing" : "cursor-grab md:cursor-default"}`}
                  style={{
                    transform: `translateX(${dragX}px) rotate(${dragX * 0.035}deg)`,
                    transition: dragging ? "none" : "transform 180ms ease",
                  }}
                >
                  <div className="relative h-[300px] overflow-hidden bg-[#e9eee6] sm:h-[360px]">
                    <img src={currentFood.image} alt={currentFood.imageAlt} draggable={false} className="h-full w-full object-cover" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#354037] shadow-sm">{currentFood.category}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#354037] shadow-sm"><Star size={13} className="fill-[#f3b944] text-[#f3b944]" /> {currentFood.rating.toFixed(1)}</span>
                    </div>
                    {dragX > 40 && <div className="absolute left-5 top-16 rotate-[-12deg] rounded-xl border-4 border-[#168447] px-4 py-2 text-xl font-black tracking-widest text-[#168447]">LIKE</div>}
                    {dragX < -40 && <div className="absolute right-5 top-16 rotate-[12deg] rounded-xl border-4 border-[#d65d4d] px-4 py-2 text-xl font-black tracking-widest text-[#d65d4d]">SKIP</div>}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#354037]">
                      <Clock3 size={13} /> {currentFood.deliveryMinutes}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#168447]">{currentFood.restaurant}</p>
                        <h2 className="mt-1.5 text-2xl font-black tracking-[-0.8px]">{currentFood.name}</h2>
                      </div>
                      <span className="shrink-0 pt-1 text-xl font-black">€{currentFood.price.toFixed(2)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#758076]">{currentFood.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentFood.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#f1f4ef] px-2.5 py-1 text-[11px] font-semibold text-[#68736a]">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>

                <div className="relative z-10 mt-5 flex items-center justify-center gap-4">
                  <button onClick={() => decide(false)} aria-label="Skip this dish" className="grid size-14 place-items-center rounded-full border border-[#f0d6d1] bg-white text-[#d65d4d] shadow-sm transition hover:scale-105 hover:bg-[#fff2ef]">
                    <X size={23} />
                  </button>
                  <button onClick={() => decide(true)} aria-label="Like this dish" className="grid size-[68px] place-items-center rounded-full bg-[#168447] text-white shadow-[0_8px_22px_rgba(22,132,71,.25)] transition hover:scale-105 hover:bg-[#106b38]">
                    <Heart size={27} />
                  </button>
                  <button onClick={finishDiscovery} aria-label="Finish discovery" className="grid size-14 place-items-center rounded-full border border-[#e5e9e2] bg-white text-[#758076] shadow-sm transition hover:scale-105 hover:bg-[#f0f3ee]">
                    <ArrowRight size={22} />
                  </button>
                </div>
                <p className="mt-3 text-center text-[11px] text-[#8a938b]">Use the buttons here, or swipe the card on your phone.</p>
              </div>
            ) : deck.length === 0 ? (
              <div className="rounded-[28px] border border-[#e7ebe4] bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f5ec] text-[#168447]"><SlidersHorizontal size={23} /></div>
                <h2 className="mt-4 text-2xl font-black tracking-[-.8px]">No matches just yet.</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#758076]">Try a higher budget or remove a category filter to see more dishes.</p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => navigate("/preferences")}>Adjust preferences <ArrowRight size={16} /></Button>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] border border-[#e7ebe4] bg-white px-6 py-12 text-center shadow-sm">
                <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9f5ec] text-[#168447]"><Sparkles size={24} /></div>
                <h2 className="mt-4 text-2xl font-black tracking-[-.8px]">That's the mix!</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#758076]">
                  {liked.length > 0 ? `You saved ${liked.length} ${liked.length === 1 ? "dish" : "dishes"}. Let's see your shortlist.` : "No favourites yet. You can restart or see your shortlist anyway."}
                </p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  <Button onClick={finishDiscovery}>See my shortlist <ArrowRight size={16} /></Button>
                  <Button variant="secondary" onClick={restart}><RotateCcw size={15} /> Start again</Button>
                </div>
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="rounded-3xl border border-[#e7ebe4] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Your shortlist</h2>
                <span className="grid size-7 place-items-center rounded-full bg-[#e9f5ec] text-xs font-extrabold text-[#168447]">{liked.length}</span>
              </div>
              {liked.length === 0 ? (
                <div className="py-8 text-center">
                  <Heart className="mx-auto text-[#b4beb4]" size={25} />
                  <p className="mt-3 text-sm font-semibold">Nothing saved yet</p>
                  <p className="mt-1 text-xs leading-5 text-[#879087]">Tap the heart when a dish catches your eye.</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {liked.map((food) => (
                    <div key={food.id} className="flex items-center gap-3">
                      <img src={food.image} alt="" className="size-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold">{food.name}</p>
                        <p className="text-xs text-[#758076]">€{food.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => setLiked((current) => current.filter((item) => item.id !== food.id))} aria-label={`Remove ${food.name}`} className="rounded-lg p-2 text-[#8a938b] hover:bg-[#fff2ef] hover:text-[#b74432]"><X size={15} /></button>
                    </div>
                  ))}
                </div>
              )}
              <Button onClick={finishDiscovery} variant="secondary" className="mt-5 w-full">View shortlist <ArrowRight size={15} /></Button>
            </div>
            <div className="mt-4 rounded-2xl bg-[#e9f5ec] p-4">
              <p className="text-sm font-bold text-[#20683c]">A little less scrolling.</p>
              <p className="mt-1 text-xs leading-5 text-[#4d775a]">Just a few options that fit what you're in the mood for.</p>
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-7 flex max-w-[430px] items-center justify-between text-xs text-[#899189]">
          <span>{skipped} skipped</span>
          <button onClick={restart} className="inline-flex items-center gap-1.5 font-semibold hover:text-[#168447]"><RotateCcw size={13} /> Restart mix</button>
          <span>{liked.length} liked</span>
        </div>
      </div>
    </main>
  );
}