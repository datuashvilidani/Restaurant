import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function money(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toFixed(2) : "0.00";
}


function priceFromId(id) {
  const s = String(id ?? "");
  let sum = 0;
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  const v = 4.99 + (sum % 1400) / 100;
  return Math.round(v * 100) / 100;
}

export default function FullMenu() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [page, setPage] = useState(1);

  const [toast, setToast] = useState("");
  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("https://dummyjson.com/recipes?limit=0");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data?.recipes) ? data.recipes : [];
        if (!alive) return;
        setRecipes(list);
      } catch {
        if (!alive) return;
        setErr("Failed to load menu.");
        setRecipes([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, []);


  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return recipes.filter((r) => {
      const name = String(r?.name ?? "").toLowerCase();
      const cuisine = String(r?.cuisine ?? "").toLowerCase();
      const tagsArr = Array.isArray(r?.tags) ? r.tags.map((x) => String(x).toLowerCase()) : [];
      const okQ =
        !qq ||
        name.includes(qq) ||
        cuisine.includes(qq) ||
        tagsArr.some((t) => t.includes(qq));
      const okTag = tag === "All" || tagsArr.includes(String(tag).toLowerCase());
      return okQ && okTag;
    });
  }, [recipes, q, tag]);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [totalPages]);

  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage]);

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(""), 1100);
  }

  function addRecipeToCart(r) {
    const id = String(r?.id ?? r?.name ?? "");
    const name = String(r?.name ?? "Item");
    const image = String(r?.image ?? "");
    const price = priceFromId(id);

    const ok = addToCartIfLoggedIn(navigate, { id, name, price, image });
    if (!ok) return;
    showToast(`${name} added`);
  }

  return (
    <main className="bg-[#140d08] text-white mt-16 min-h-screen">

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">
              Full <span className="text-orange-400">Menu</span>
            </h1>
            <div className="mt-2 text-sm text-white/70">
              <Link to="/" className="underline underline-offset-4 hover:text-orange-300">
                ← Back
              </Link>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search (name, cuisine, tag)"
              className="w-full sm:w-[280px] rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:ring-2 focus:ring-orange-400/40"
            />
          </div>
        </div>


        {toast ? (
          <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {toast}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            Loading menu…
          </div>
        ) : err ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            {err}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            No items found.
          </div>
        ) : (
          <>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((r) => {
                const id = String(r?.id ?? r?.name ?? "");
                const name = String(r?.name ?? "Item");
                const image = String(r?.image ?? "");
                const cuisine = String(r?.cuisine ?? "");
                const difficulty = String(r?.difficulty ?? "");
                const prep = Number(r?.prepTimeMinutes ?? r?.prepTime ?? 0);
                const cook = Number(r?.cookTimeMinutes ?? r?.cookTime ?? 0);
                const price = priceFromId(id);

                return (
                  <div
                    key={id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#140d08] shadow-lg transition hover:shadow-2xl"
                  >
                    <div className="relative">
                      {image ? (
                        <img
                          src={image}
                          alt={name}
                          className="h-56 w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-56 w-full bg-white/5" />
                      )}

                      {cuisine ? (
                        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                          {cuisine}
                        </span>
                      ) : null}
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold">{name}</h3>
                          <div className="mt-1 text-sm text-white/70">
                            {difficulty ? <span>{difficulty}</span> : null}
                            {difficulty && (prep || cook) ? <span> · </span> : null}
                            {prep || cook ? (
                              <span>
                                {prep ? `${prep}m prep` : ""}
                                {prep && cook ? " · " : ""}
                                {cook ? `${cook}m cook` : ""}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-xs text-white/60">Price</div>
                          <div className="text-xl font-extrabold text-orange-400">
                            ${money(price)}
                          </div>
                        </div>
                      </div>

                      {Array.isArray(r?.tags) && r.tags.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.tags.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
                            >
                              {String(t)}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="my-4 h-px w-full bg-white/10" />

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => addRecipeToCart(r)}
                          className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-orange-400/40"
                        >
                          Add to cart
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (cuisine) {
                              setQ("");
                              setTag("All");
                              setPage(1);
                            }
                          }}
                          className="inline-flex w-full cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3 pb-12">
              <div className="text-sm text-white/70">
                {filtered.length} items · Page {safePage} / {totalPages}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
