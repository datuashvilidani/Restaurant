import { clearSession, getSessionEmail } from "./auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CART_PREFIX = "dk-cart:";

function readCartForEmail(email) {
  if (!email) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(`${CART_PREFIX}${email}`));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function cartSummary(cart) {
  const items = Array.isArray(cart) ? cart : [];
  const count = items.reduce((sum, it) => sum + Number(it?.qty ?? 1), 0);
  const subtotal = items.reduce((sum, it) => {
    const price = Number(it?.price ?? 0);
    const qty = Number(it?.qty ?? 1);
    return sum + price * qty;
  }, 0);
  return { count, subtotal };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const email = getSessionEmail();
  const [users, setUsers] = useState([]);
  const [openEmail, setOpenEmail] = useState(""); 

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    }
  }, []);

  function handleLogout() {
    clearSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6 mt-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 text-sm text-white/60">
          Logged in as: <span className="text-white">{email}</span>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 w-[60px]">#</th>
                <th className="p-4">Email</th>
                <th className="p-4">Password</th>
                <th className="p-4">Balance</th>
                <th className="p-4">Cart</th>
                <th className="p-4 w-[140px]">View</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-white/50">
                    No users found
                  </td>
                </tr>
              )}

              {users.map((u, i) => {
                const cart = readCartForEmail(u.email);
                const { count, subtotal } = cartSummary(cart);
                const isOpen = openEmail === u.email;

                return (
                  <>
                    <tr key={u.email ?? i} className="border-t border-white/10">
                      <td className="p-4">{i + 1}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">{u.password || "—"}</td>
                      <td className="p-4">{u.balance}</td>

                      <td className="p-4 text-sm text-white/80">
                        {count} items · ${subtotal.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setOpenEmail(isOpen ? "" : u.email)}
                          className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-sm hover:bg-white/15"
                        >
                          {isOpen ? "Hide" : "Show"}
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr key={`${u.email}-cart`} className="border-t border-white/10">
                        <td colSpan="6" className="p-4 bg-white/5">
                          {cart.length === 0 ? (
                            <div className="text-sm text-white/60">Cart is empty.</div>
                          ) : (
                            <div className="overflow-auto">
                              <table className="w-full text-left text-sm">
                                <thead>
                                  <tr className="text-white/70">
                                    <th className="py-2 pr-4">Item</th>
                                    <th className="py-2 pr-4 w-[90px]">Qty</th>
                                    <th className="py-2 pr-4 w-[120px]">Price</th>
                                    <th className="py-2 pr-0 w-[140px]">Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cart.map((it, idx) => {
                                    const name = String(it?.name ?? it?.title ?? "Item");
                                    const qty = Number(it?.qty ?? 1);
                                    const price = Number(it?.price ?? 0);
                                    const total = qty * price;

                                    return (
                                      <tr key={it?.id ?? idx} className="border-t border-white/10">
                                        <td className="py-2 pr-4">{name}</td>
                                        <td className="py-2 pr-4">{qty}</td>
                                        <td className="py-2 pr-4">${price.toFixed(2)}</td>
                                        <td className="py-2 pr-0">${total.toFixed(2)}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              <div className="mt-3 flex justify-end text-sm">
                                <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-2">
                                  Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
