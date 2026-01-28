"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Key, Loader2, User } from "lucide-react";
import { useAppStore } from "@/lib/store/appStore";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, user } = useAppStore();

  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const view = searchParams.get("view");
    if (view === "login") {
      setAuthMode("login");
    } else if (view === "register" || view === "signup") {
      setAuthMode("signup");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await signup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        router.push("/onboarding");
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-8 justify-center items-center">
      <div className="w-full max-w-sm space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">
            {authMode === "signup" ? "Begin Journey" : "Welcome Back"}
          </h2>
          <p className="text-slate-500 text-sm">
            Purity and discipline in every prayer.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === "signup" && (
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                required
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500"
              />
            </div>
          )}
          <div className="relative">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              required
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <Key
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-900 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500"
            />
          </div>
          {authMode === "signup" && (
            <div className="relative">
              <Key
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                required
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-800 p-5 pl-12 rounded-2xl text-white outline-none focus:border-emerald-500"
              />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-xs text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Loading...
              </>
            ) : authMode === "signup" ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <button
          type="button"
          onClick={() =>
            setAuthMode((m) => (m === "signup" ? "login" : "signup"))
          }
          className="w-full cursor-pointer text-slate-500 text-[10px] font-black uppercase tracking-widest"
        >
          {authMode === "signup"
            ? "Already have an account? Sign In"
            : "New here? Create an Account"}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          Loading...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
