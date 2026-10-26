import { ArrowRight, Check, Heart, Sparkles, SlidersHorizontal, Utensils } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";

const steps = [
  { icon: SlidersHorizontal, number: "01", title: "Set your vibe", description: "Pick a budget and rule out anything you're not craving." },
  { icon: Heart, number: "02", title: "Go with your gut", description: "Swipe through dishes. Keep the ones that make you hungry." },
  { icon: Sparkles, number: "03", title: "Choose your favourite", description: "Get a shortlist without scrolling through endless menus." },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-20 size-[440px] rounded-full bg-[#e8f3e7] blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 size-[340px] rounded-full bg-[#f4ead8]/70 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="float-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dce9dc] bg-white/80 px-3.5 py-2 text-xs font-bold text-[#287447] shadow-sm">
              <Sparkles size={14} /> LESS SCROLLING, MORE CRAVING
            </div>
            <h1 className="max-w-2xl text-[clamp(42px,7vw,76px)] font-black leading-[.99] tracking-[-3.8px]">
              Hungry, but
              <span className="block text-[#168447]">no idea what</span>
              <span className="block">to eat?</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#6f7a70] sm:text-lg sm:leading-8">
              Skip the endless menus. Discover food that fits your mood, your taste and your budget — one swipe at a time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate("/preferences")} className="min-h-14 justify-center px-6 text-base">
                Find something to eat <ArrowRight size={18} />
              </Button>
              <div className="flex items-center justify-center gap-2 px-2 text-xs font-medium text-[#7d877d] sm:justify-start">
                <Check size={15} className="text-[#168447]" /> No account needed
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-[#e4e9e1] pt-6">
              <div className="flex -space-x-2">
                <span className="grid size-9 place-items-center rounded-full border-2 border-[#f7f8f5] bg-[#f4d9c4] text-sm">🍜</span>
                <span className="grid size-9 place-items-center rounded-full border-2 border-[#f7f8f5] bg-[#e1eecf] text-sm">🥗</span>
                <span className="grid size-9 place-items-center rounded-full border-2 border-[#f7f8f5] bg-[#f4e5ba] text-sm">🍕</span>
              </div>
              <p className="text-xs leading-5 text-[#7d877d]">A little inspiration for<br /><span className="font-bold text-[#354037]">your next favourite meal.</span></p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[460px] lg:ml-auto">
            <div className="absolute inset-8 rounded-[42px] bg-[#e3eee0] rotate-[-7deg]" />
            <div className="absolute -right-2 top-10 z-20 hidden rounded-2xl border border-[#e6ebe3] bg-white px-4 py-3 shadow-lg sm:block">
              <div className="flex items-center gap-2 text-sm font-bold"><Heart size={16} className="fill-[#168447] text-[#168447]" /> That's a yes</div>
              <p className="mt-1 text-xs text-[#7d877d]">Keep what looks good</p>
            </div>
            <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white p-3 shadow-[0_30px_80px_rgba(34,52,36,.14)]">
              <div className="relative h-[330px] overflow-hidden rounded-[26px] bg-[#e7e9df] sm:h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85"
                  alt="A colourful bowl of fresh food"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">Fresh · Feel-good</span>
                  <h2 className="mt-3 text-3xl font-black tracking-[-1px]">Salmon poke bowl</h2>
                  <p className="mt-1 text-sm text-white/80">Bowl Theory · €13.90</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-5 py-4">
                <span className="grid size-12 place-items-center rounded-full border border-[#f1d9d4] text-[#d65d4d]"><span className="text-xl">×</span></span>
                <span className="grid size-14 place-items-center rounded-full bg-[#168447] text-white shadow-lg shadow-[#168447]/20"><Heart size={23} /></span>
                <span className="grid size-12 place-items-center rounded-full border border-[#d9e9dc] text-[#168447]"><ArrowRight size={20} /></span>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 z-20 hidden items-center gap-3 rounded-2xl border border-[#e6ebe3] bg-white px-4 py-3 shadow-lg sm:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-[#e9f5ec] text-[#168447]"><Utensils size={18} /></span>
              <span><span className="block text-sm font-bold">Your taste, your call</span><span className="mt-0.5 block text-xs text-[#7d877d]">A shortlist made by you</span></span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8ebe5] bg-white/65">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="max-w-xl">
            <p className="text-[11px] font-extrabold tracking-[1.8px] text-[#168447]">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-1.4px] sm:text-4xl">Three steps. One less decision.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description }) => (
              <article key={number} className="rounded-2xl border border-[#e8ebe5] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-[#263d2b]/5">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#e9f5ec] text-[#168447]"><Icon size={20} /></span>
                  <span className="text-xs font-extrabold tracking-widest text-[#b0b9af]">{number}</span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#758076]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}