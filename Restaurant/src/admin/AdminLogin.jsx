import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_PASSWORD } from "./adminEmails";
import { isAdminEmail, setSessionEmail, getSessionEmail } from "./auth";


export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState(getSessionEmail());
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const ok = useMemo(() => isAdminEmail(email), [email]);

    function submit(e) {
        e.preventDefault();
        setErr("");

        const normalizedEmail = email.trim().toLowerCase();

        if (!isAdminEmail(normalizedEmail)) {
            setErr("Not an admin email");
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            setErr("Wrong admin password");
            return;
        }

        setSessionEmail(normalizedEmail);
        navigate("/admin", { replace: true });
    }
    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center p-4">
            <form
                onSubmit={submit}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6"
            >
                <h1 className="text-xl font-bold">Admin Login</h1>
                <p className="mt-1 text-sm text-white/70">Enter admin email + password.</p>

                <label className="mt-4 block text-sm text-white/80">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
                    placeholder="admin@example.com"
                    autoComplete="username"
                />

                <label className="mt-4 block text-sm text-white/80">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
                    placeholder="********"
                    autoComplete="current-password"
                />

                {err ? <div className="mt-3 text-sm text-red-400">{err}</div> : null}

                <button
                    type="submit"
                    disabled={!email.trim() || !password}
                    className="mt-5 w-full rounded-xl bg-white text-black font-semibold py-2 disabled:opacity-50"
                >
                    Continue
                </button>
            </form>
        </div>
    );
}
