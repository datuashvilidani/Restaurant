import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Khinkali from "../assets/khinkali.jpg";
import mtsvadi from "../assets/mwvadi.jpg";
import kartofili from "../assets/kartofili.jpg";
import churchxela from "../assets/churchxela.png";
import drop from "../assets/drop.png";

const SESSION_KEY = "session";
const CART_KEY = "dk-cart";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function readCart(email) {
  const key = email ? `${CART_KEY}:${email}` : CART_KEY;
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeCart(email, items) {
  const key = email ? `${CART_KEY}:${email}` : CART_KEY;
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event("dk-cart"));
}

function addToCartIfLoggedIn(navigate, item) {
  const session = getSession();
  const email = session?.email;

  if (!email) {
    navigate("/login");
    return false;
  }

  const cart = readCart(email);
  const idx = cart.findIndex((x) => x.id === item.id);

  if (idx === -1) cart.push({ ...item, qty: 1 });
  else cart[idx] = { ...cart[idx], qty: Number(cart[idx].qty ?? 1) + 1 };

  writeCart(email, cart);
  return true;
}

export default function Menu() {
  const navigate = useNavigate();

  const droplets = [
    { top: "55%", left: "65%", size: 90 },
    { top: "40%", left: "53%", size: 120 },
    { top: "42%", left: "70%", size: 110 },
    { top: "100%", left: "53%", size: 80 },
    { top: "90%", left: "79%", size: 130 },
  ];

  const items = useMemo(
    () => [
      {
        id: "khinkali",
        name: "Khinkali",
        description: "Traditional Georgian dumplings filled with spiced meat.",
        price: 1.99,
        unitLabel: "Each",
        badge: "Georgian Classic",
        image: Khinkali,
      },
      {
        id: "mtsvadi",
        name: "Mtsvadi",
        description: "Grilled skewered meat, marinated in traditional spices.",
        price: 8.99,
        unitLabel: "",
        badge: "Georgian Classic",
        image: mtsvadi,
      },
      {
        id: "kartofili",
        name: "Kartofili",
        description: "Roasted potatoes seasoned with herbs and spices.",
        price: 15.99,
        unitLabel: "",
        badge: "Georgian Classic",
        image: kartofili,
      },
    ],
    []
  );

  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1100);
  }

  function addToCartFromMenu(it) {
    const ok = addToCartIfLoggedIn(navigate, {
      id: it.id,
      name: it.name,
      price: it.price,
      image: it.image,
    });
    if (!ok) return;
    showToast(`${it.name} added`);
  }

  function addChurchkhela() {
    const ok = addToCartIfLoggedIn(navigate, {
      id: "churchkhela",
      name: "Churchkhela",
      price: 4.99,
      image: churchxela,
    });
    if (!ok) return;
    showToast("Churchkhela added");
  }

  const fullMenuLinkClass =
    "inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer";

  return (
    <section className="bg-[#140d08] text-white pt-20 mx-auto max-w" id="menu">
      <p className="text-center font-bold text-2xl">
        Our <span className="text-orange-400">Menu</span>
      </p>
      <br />

      {toast ? (
        <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
          {toast}
        </div>
      ) : null}

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.id}
            className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-[#140d08] shadow-lg transition hover:shadow-2xl"
          >
            <div className="relative">
              <img
                src={it.image}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                alt={it.name}
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur">
                {it.badge}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-white">{it.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{it.description}</p>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs text-white/60">Price</div>
                  <div className="text-xl font-extrabold text-orange-400">
                    ${it.price.toFixed(2)}{" "}
                    {it.unitLabel ? <span className="text-sm">{it.unitLabel}</span> : null}
                  </div>
                </div>
              </div>

              <div className="my-4 h-px w-full bg-white/10" />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => addToCartFromMenu(it)}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition cursor-pointer hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                >
                  Add to cart
                </button>

                <Link to="/full-menu" className={fullMenuLinkClass}>
                  Full Menu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 z-20">
          {droplets.map((d, i) => (
            <img
              key={i}
              src={drop}
              alt=""
              className="absolute select-none"
              style={{
                top: d.top,
                left: d.left,
                width: d.size,
                height: d.size,
                opacity: d.opacity,
                filter:
                  "drop-shadow(0 2 20px rgba(216,102,35,0.45)) drop-shadow(0 0 32px rgba(216,102,35,0.25))",
              }}
            />
          ))}
        </div>

        <div
          id="specials"
          className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-[#140d08] p-6 shadow-2xl md:p-10 mt-20 mb-20"
        >
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Our <span className="text-orange-400">Special</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/75">
                <span className="font-semibold text-white">Churchkhela</span>{" "}
                is a traditional Georgian sweet made by threading walnuts or hazelnuts on a string,
                dipping them in thickened grape juice called{" "}
                <span className="font-semibold text-white">tatara</span>, then drying until a firm
                outer layer forms.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-orange-400">Taste & texture</div>
                  <div className="mt-1 text-sm leading-relaxed text-white/70">
                    Sweet grape outside, nutty inside. Slightly chewy. Not overly sugary.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-orange-400">Main ingredients</div>
                  <ul className="mt-2 space-y-1 text-sm text-white/70">
                    <li>• Grape juice</li>
                    <li>• Walnuts or hazelnuts</li>
                    <li>• Flour (to thicken)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addChurchkhela}
                  className="inline-flex items-center justify-center rounded-xl bg-orange-400 px-6 py-3 text-sm font-semibold text-white transition cursor-pointer hover:text-black hover:bg-white focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                >
                  Add to cart
                </button>

                <Link
                  to="/full-menu"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 cursor-pointer"
                >
                  View Full Menu
                </Link>

                <span className="text-sm text-white/55">Traditional · Sweet · Nut-based</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-orange-400/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <img
                  src={churchxela}
                  alt="Churchkhela"
                  className="h-[320px] w-full object-cover md:h-[420px]"
                />
                <div className="pointer-events-none absolute inset-0 from-[#140d08]/65 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-[#140d08] p-6 shadow-2xl md:p-10 ">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="relative">
              <div className="absolute -inset-2 rounded-3xl bg-orange-400/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="flex h-[320px] w-full items-center justify-center md:h-[420px]">
                  <iframe
                    title="Map"
                    src="https://www.google.com/maps?q=Vake-Saburtalo,Tbilisi,Georgia&output=embed"
                    className="h-full w-full border-0 grayscale contrast-125"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div id="location">
              <h2 className="animate-pulse text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                Our <span className="text-orange-400">Location</span>
              </h2>

              <p className="mt-4 text-base leading-relaxed text-white/75">
                Visit us to experience authentic Georgian cuisine in a warm and elegant atmosphere.
                We are located in a central area with easy access and comfortable surroundings.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-orange-400">Address</div>
                  <div className="mt-1 text-sm text-white/70">
                    Vake-Saburtalo, Tbilisi, Georgia
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold text-orange-400">Opening hours</div>
                  <div className="mt-1 text-sm text-white/70">Daily · 12:00 – 23:00</div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="text-sm text-white/55">Parking available · Central area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
