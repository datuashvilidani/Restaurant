import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/plain.jpg"

const USERS_KEY = "users";
const SESSION_KEY = "session";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  window.dispatchEvent(new Event("session"));
}

export default function Login() {
  const [mode, setMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { email: "", password: "", deposit: "" } });

  const onSubmit = (data) => {
    setAuthError("");

    const email = data.email.trim().toLowerCase();
    const password = data.password;

    if (mode === "register") {
      const users = getUsers();
      if (users.some((u) => u.email === email)) {
        setAuthError("Account already exists");
        return;
      }

      const balance = Number(data.deposit || 0);
      saveUsers([...users, { email, password, balance }]);
      saveSession(email);
      reset();
      navigate("/");
    } else {
      const users = getUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        setAuthError("Account does not exist");
        return;
      }

      if (user.password !== password) {
        setAuthError("Wrong password");
        return;
      }

      saveSession(email);
      reset();
      navigate("/");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 text-white bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black p-8 shadow-2xl backdrop-blur-md">
        <div className="mb-6 text-2xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </div>

        {authError && (
          <p className="mb-4 text-sm text-orange-300 bg-orange-900/20 rounded-lg px-3 py-2">{authError}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-white/80 font-medium">Email</label>
            <input
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-orange-400/50 placeholder:text-white/40"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-orange-300">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-white/80 font-medium">Password</label>
            <input
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-orange-400/50 placeholder:text-white/40"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-orange-300">{errors.password.message}</p>
            )}
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1.5 block text-sm text-white/80 font-medium">Starting Balance</label>
              <input
                className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 transition-all focus:ring-2 focus:ring-orange-400/50 placeholder:text-white/40"
                type="number"
                step="0.01"
                placeholder="Enter amount (e.g., 100.00)"
                {...register("deposit", {
                  required: "Deposit is required",
                  validate: (v) => Number(v) >= 0 || "Must be ≥ 0",
                })}
              />
              {errors.deposit && (
                <p className="mt-1 text-sm text-orange-300">{errors.deposit.message}</p>
              )}
            </div>
          )}

          <button
            className="cursor-pointer mt-4 w-full rounded-2xl bg-orange-400 py-3 text-sm font-semibold hover:brightness-110 transition-all duration-200"
            type="submit"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === "login" ? "register" : "login"));
            setAuthError("");
          }}
          className="cursor-pointer mt-4 w-full rounded-2xl bg-white/10 py-3 text-sm font-medium hover:bg-white/15 transition-all duration-200"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}