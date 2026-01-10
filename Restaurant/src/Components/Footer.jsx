export default function Footer({ footerRef }) {
  return (
    <footer
      ref={footerRef}
      className="relative mt-16 overflow-hidden bg-[#140d08] text-white border-t border-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
      >
        <div className="absolute -top-16 left-207 h-44 w-44 -translate-x-1/2 rounded-full bg-orange-400/35 blur-3xl" />
      </div>


      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Datu's <span className="text-orange-400">Kitchen</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Authentic Georgian cuisine made with tradition, passion, and quality ingredients.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Menu
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              <li className="cursor-pointer transition hover:text-orange-400">Khinkali</li>
              <li className="cursor-pointer transition hover:text-orange-400">Khachapuri</li>
              <li className="cursor-pointer transition hover:text-orange-400">Specials</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Visit us
            </h4>
            <p className="mt-4 text-sm text-white/65">
              Vake–Saburtalo
              <br />
              Tbilisi, Georgia
            </p>
            <p className="mt-2 text-sm text-white/65">
              Daily · 12:00 – 23:00
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80">
              Order
            </h4>
            <p className="mt-4 text-sm text-white/65">
              Dine in or order takeaway
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-400 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#1b120c]"
            >
              Order now
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="text-xs text-white/50">
            © 2025 GeorgianTaste. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-white/50">
            <span className="cursor-pointer transition hover:text-orange-400">Privacy</span>
            <span className="cursor-pointer transition hover:text-orange-400">Terms</span>
            <span className="cursor-pointer transition hover:text-orange-400">Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
