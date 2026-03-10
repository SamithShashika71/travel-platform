"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handle = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(""); };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/feed");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show ? (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </>
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&auto=format&fit=crop" alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-2xl">✈️</span>
            <span className="text-xl font-black text-white">Wandr</span>
          </Link>
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-white/60 mt-1 text-sm">Start sharing your travel experiences</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          {error && <div className="mb-5 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Full Name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handle} placeholder="John Doe" required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handle} placeholder="john@example.com" required
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" value={form.password}
                  onChange={handle} placeholder="Min. 6 characters" required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} name="confirm" value={form.confirm}
                  onChange={handle} placeholder="Repeat password" required
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 pr-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-colors mt-2">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}