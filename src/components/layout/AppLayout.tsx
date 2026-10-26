import { ArrowUpRight, Heart, UtensilsCrossed } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-[#1c261f]">
      <header className="sticky top-0 z-30 border-b border-[#e8ebe5]/90 bg-[#f7f8f5]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="ERNEST home">
            <span className="grid size-9 place-items-center rounded-xl bg-[#168447] text-white">
              <UtensilsCrossed size={18} strokeWidth={2.4} />
            </span>
            <span className="text-[19px] font-black tracking-[-1px]">ERNEST<span className="text-[#168447]">.</span></span>
          </Link>

          <div className="hidden items-center gap-2 text-xs font-medium text-[#758076] sm:flex">
            <span className="size-2 rounded-full bg-[#168447]" />
            Independent concept prototype
          </div>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "text-[#168447]" : "text-[#69736b] hover:bg-white"}`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/results"
              aria-label="Saved dishes"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "text-[#168447]" : "text-[#69736b] hover:bg-white"}`
              }
            >
              <Heart size={16} />
              <span className="hidden sm:inline">Saved</span>
            </NavLink>

          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-[#e8ebe5] px-5 py-6 text-[11px] leading-relaxed text-[#879087] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-1">
          <span className="font-bold text-[#58635a]">ERNEST · An independent food discovery concept</span>
          <span>Demo dishes, prices and restaurants are illustrative. Not affiliated with Bolt Food.</span>
        </div>
        <a href="https://www.ernestmakarov.ee/contacts" target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#dce7da] bg-white px-3.5 py-2 font-bold text-[#168447] transition hover:border-[#168447] hover:bg-[#f0f7ef] hover:text-[#106b38]">
          Built by Ernest · Get in touch <ArrowUpRight size={13} />
        </a>
      </footer>
    </div>
  );
}