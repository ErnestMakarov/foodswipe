import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Leaf, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../../components/ui/Button";
import type { FoodCategory, FoodPreferences } from "../../types/food";

const categories: { value: FoodCategory; emoji: string }[] = [
  { value: "Burgers", emoji: "🍔" },
  { value: "Asian", emoji: "🍜" },
  { value: "Italian", emoji: "🍝" },
  { value: "Healthy", emoji: "🥗" },
  { value: "Pizza", emoji: "🍕" },
  { value: "Desserts", emoji: "🍰" },
];

const budgetOptions = [10, 15, 20, 30];

export default function PreferenceForm() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState(20);
  const [excluded, setExcluded] = useState<FoodCategory[]>([]);
  const [vegetarianOnly, setVegetarianOnly] = useState(false);

  function toggleCategory(category: FoodCategory) {
    setExcluded((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  }

  function startDiscovery() {
    const preferences: FoodPreferences = {
      budget,
      excludedCategories: excluded,
      vegetarianOnly,
    };
    sessionStorage.setItem("ernest-food-preferences", JSON.stringify(preferences));
    navigate("/discover");
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <button
        onClick={() => navigate("/")}
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#758076] hover:text-[#1c261f]"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-8">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e7f3e9] px-3 py-1.5 text-xs font-bold text-[#168447]">
          <SlidersHorizontal size={14} /> QUICK SETUP · 20 SECONDS
        </span>
        <h1 className="text-3xl font-black tracking-[-1.5px] sm:text-5xl">Let's narrow it down.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#758076] sm:text-base">
          Just a couple of things so we don't show you food you won't want.
        </p>
      </div>

      <section className="rounded-3xl border border-[#e7ebe4] bg-white p-5 shadow-[0_12px_45px_rgba(34,52,36,0.035)] sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">What's your budget?</h2>
            <p className="mt-1 text-sm text-[#758076]">Maximum price per dish</p>
          </div>
          <span className="text-2xl font-black text-[#168447]">€{budget}</span>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {budgetOptions.map((option) => (
            <button
              key={option}
              onClick={() => setBudget(option)}
              aria-pressed={budget === option}
              className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${
                budget === option
                  ? "border-[#168447] bg-[#e9f5ec] text-[#168447]"
                  : "border-[#e5e9e2] text-[#657067] hover:border-[#b7c9b9]"
              }`}
            >
              €{option}
            </button>
          ))}
        </div>

        <div className="my-7 h-px bg-[#edf0eb]" />

        <div>
          <h2 className="text-lg font-bold">Anything you don't want?</h2>
          <p className="mt-1 text-sm text-[#758076]">Tap to exclude a category. You can skip this.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map(({ value, emoji }) => {
              const isExcluded = excluded.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => toggleCategory(value)}
                  aria-pressed={isExcluded}
                  className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                    isExcluded
                      ? "border-[#e7b7ae] bg-[#fff2ef] text-[#ad4a3a]"
                      : "border-[#e5e9e2] bg-white text-[#354037] hover:border-[#b7c9b9]"
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="flex-1 text-sm font-semibold">{value}</span>
                  {isExcluded && <Check size={15} />}
                </button>
              );
            })}
          </div>
          {excluded.length > 0 && (
            <p className="mt-3 text-xs text-[#ad4a3a]">
              Excluded: {excluded.join(", ")}
            </p>
          )}
        </div>

        <button
          onClick={() => setVegetarianOnly((current) => !current)}
          aria-pressed={vegetarianOnly}
          className={`mt-6 flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
            vegetarianOnly ? "border-[#168447] bg-[#e9f5ec]" : "border-[#e5e9e2] hover:bg-[#fafbf9]"
          }`}
        >
          <span className="grid size-10 place-items-center rounded-xl bg-[#e9f5ec] text-[#168447]">
            <Leaf size={19} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold">Vegetarian options only</span>
            <span className="mt-0.5 block text-xs text-[#758076]">Include vegetarian and vegan dishes</span>
          </span>
          <span className={`h-6 w-11 rounded-full p-1 transition ${vegetarianOnly ? "bg-[#168447]" : "bg-[#dce2da]"}`}>
            <span className={`block size-4 rounded-full bg-white transition ${vegetarianOnly ? "translate-x-5" : ""}`} />
          </span>
        </button>

        <Button onClick={startDiscovery} className="mt-7 w-full py-4">
          Find my food <ArrowRight size={17} />
        </Button>
        <p className="mt-3 text-center text-xs text-[#899189]">No account. No pressure. Just a few good options.</p>
      </section>
    </main>
  );
}