import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/DanisKitchen_small_-removebg-preview.png";

const SESSION_KEY = "session";
const USERS_KEY = "users";
const CART_KEY = "dk-cart";

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

function getUserBalance(email) {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find((u) => u.email === email);
    return user?.balance ?? 0;
  } catch {
    return 0;
  }
}

function logoutSession() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("dk-session"));
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

function removeCartItem(email, id) {
  const cart = readCart(email).filter((x) => x.id !== id);
  writeCart(email, cart);
}

function clearCart(email) {
  writeCart(email, []);
}

function getCartCount(items) {
  return (items || []).reduce((sum, it) => {
    const q = Number(it?.qty ?? it?.quantity ?? 1);
    return sum + (Number.isFinite(q) && q > 0 ? q : 1);
  }, 0);
}

function money(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toFixed(2) : "0.00";
}

function KebabIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}

function XIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [balance, setBalance] = useState(0);

  const [mobileOpen, setMobileOpen] = useState(false);


  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const mobilePanelRef = useRef(null);
  const cartPanelRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const readSession = () => {
    const session = getSession();
    if (!session?.email) {
      setEmail("");
      setBalance(0);
      return "";
    }
    setEmail(session.email);
    setBalance(getUserBalance(session.email));
    return session.email;
  };

  const syncCart = (sessionEmail) => {
    if (!sessionEmail) {
      setCartItems([]);
      return;
    }
    setCartItems(readCart(sessionEmail));
  };

  useEffect(() => {
    const sessionEmail = readSession();
    syncCart(sessionEmail);

    const onStorage = () => {
      const se = readSession();
      syncCart(se);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("dk-session", onStorage);
    window.addEventListener("dk-cart", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("dk-session", onStorage);
      window.removeEventListener("dk-cart", onStorage);
    };
  }, []);

  useEffect(() => {
    const sessionEmail = readSession();
    syncCart(sessionEmail);
    setMobileOpen(false);
    setCartOpen(false);
  }, [location.pathname]);


  useEffect(() => {
    const onDown = (e) => {
      if (!mobileOpen) return;
      const el = mobilePanelRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setMobileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [mobileOpen]);


  useEffect(() => {
    const onDown = (e) => {
      if (!cartOpen) return;
      const el = cartPanelRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setCartOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [cartOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const removeOne = (id) => {
    if (!email) return;
    removeCartItem(email, id);
    setCartItems(readCart(email));
  };

  const deleteAll = () => {
    if (!email) return;
    clearCart(email);
    setCartItems([]);
  };

  const linkClass =
    "group relative px-1 py-2 text-sm font-medium transition-colors hover:text-orange-300";

  const headerBg = isScrolled ? "bg-[#a04804]/90 py-2 shadow-lg backdrop-blur" : "bg-transparent py-4";

  const count = email ? getCartCount(cartItems) : 0;

  const subtotal = cartItems.reduce((sum, it) => {
    const price = Number(it?.price ?? 0);
    const q = Number(it?.qty ?? it?.quantity ?? 1);
    const qq = Number.isFinite(q) && q > 0 ? q : 1;
    const pp = Number.isFinite(price) ? price : 0;
    return sum + pp * qq;
  }, 0);

  return (
    <header className={`fixed top-0 z-50 w-full text-white transition-all duration-300 ${headerBg}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} width={50} alt="Datu's Kitchen logo" />
          <div className="leading-tight">
            <div className="text-lg font-bold">Datu's Kitchen</div>
            <div className="text-xs text-white/80">Restaurant • Delivery</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/full-menu" className={linkClass}>
            Menu
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <a href="#specials" className={linkClass}>
            Specials
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-400 transition-all duration-300 group-hover:w-full" />
          </a>
          <a href="#location" className={linkClass}>
            Location
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-400 transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {email ? (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex flex-col leading-tight">
                <span className="max-w-[200px] truncate text-sm font-semibold">{email}</span>
                <span className="text-xs text-orange-300">${Number(balance).toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  logoutSession();
                  setEmail("");
                  setBalance(0);
                  setCartItems([]);
                  navigate("/");
                }}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex group h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#a04804]"
              aria-label="Account"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </Link>
          )}

          <button
            type="button"
            onClick={() => {
              if (!email) {
                navigate("/login");
                return;
              }
              syncCart(email);
              setCartOpen((v) => !v);
              setMobileOpen(false);
            }}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#a04804]"
            aria-label="Cart"
            aria-expanded={cartOpen}
            title={email ? "Cart" : "Login required"}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 cursor-pointer transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6l-2-2H2" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-[10px] font-bold text-white ring-2 ring-[#a04804]">
              {count}
            </span>
          </button>

          <a
            href="#order"
            className="hidden cursor-default rounded-full bg-orange-400 px-6 py-2.5 text-sm font-bold text-white shadow-md  md:block"
          >
            We Deliver Quality
          </a>
          <button
            type="button"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#a04804]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={() => {
              setMobileOpen((v) => !v);
              setCartOpen(false);
            }}
          >
            <KebabIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`pointer-events-none fixed inset-0 z-[60] ${cartOpen ? "" : "hidden"}`}>
        <div
          className="pointer-events-auto absolute inset-0 bg-black/40"
          onClick={() => setCartOpen(false)}
          aria-hidden="true"
        />
        <div
          ref={cartPanelRef}
          className="pointer-events-auto absolute right-3 top-[72px] w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-white/10 bg-[#140d08] shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-sm font-bold">Cart</div>
            <button
              type="button"
              onClick={() => setCartOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#a04804]"
              aria-label="Close cart"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[320px] overflow-auto px-4 py-3">
            {cartItems.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                Cart is empty.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {cartItems.map((it, idx) => {
                  const title = String(it?.name ?? it?.title ?? "Item");
                  const price = Number(it?.price ?? 0);
                  const q = Number(it?.qty ?? it?.quantity ?? 1);
                  const qty = Number.isFinite(q) && q > 0 ? q : 1;

                  return (
                    <div
                      key={it?.id ?? `${title}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{title}</div>
                        <div className="text-xs text-white/70">
                          {qty} × ${money(price)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="shrink-0 text-sm font-bold">${money(price * qty)}</div>

                        <button
                          type="button"
                          onClick={() => removeOne(it.id)}
                          className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#a04804]"
                          aria-label={`Remove ${title}`}
                          title="Remove"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-white/10 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Subtotal</span>
              <span className="font-bold">${money(subtotal)}</span>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={deleteAll}
                className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/20 disabled:opacity-60"
                disabled={cartItems.length === 0}
              >
                Delete all
              </button>

              <button
                type="button"
                onClick={() => {
                  setCartOpen(false);
                  navigate("/cart");
                }}
                className="flex-1 rounded-xl bg-orange-400 px-3 py-2 text-sm font-bold text-white transition hover:ring-2 hover:ring-white/40 disabled:opacity-60"
                disabled={cartItems.length === 0}
              >
                Go to cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${mobileOpen ? "max-h-[520px]" : "max-h-0"
          }`}
      >
        <div
          ref={mobilePanelRef}
          className="border-t border-white/10 bg-[#a04804]/95 backdrop-blur px-4 pb-4 pt-3"
        >
          <nav className="flex flex-col gap-2">
            <a
              href="#menu"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Menu
            </a>
            <a
              href="#specials"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Specials
            </a>
            <a
              href="#location"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Location
            </a>
            <a
              href="#order"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl bg-orange-400 px-3 py-2 text-sm font-bold text-white"
            >
              We Deliver Quality
            </a>
          </nav>

          <div className="mt-3 border-t border-white/10 pt-3">
            {email ? (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{email}</div>
                  <div className="text-xs text-orange-200">${Number(balance).toFixed(2)}</div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logoutSession();
                    setEmail("");
                    setBalance(0);
                    setCartItems([]);
                    setMobileOpen(false);
                    navigate("/");
                  }}
                  className="shrink-0 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10"
              >
                Account
                <span className="text-white/70">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
