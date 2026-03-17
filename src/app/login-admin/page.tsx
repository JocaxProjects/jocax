"use client";
// app/login-admin/page.tsx
//
// Admin login page — lives outside /admin/* so it is never wrapped by
// the admin auth layout and never triggers the middleware guard.
//  ✦ Submits credentials to /api/auth/admin-login
//  ✦ On success: redirects to ?from= param or /admin/dashboard
//  ✦ On failure: shows inline error message

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router     = useRouter();
  const params     = useSearchParams();
  const redirectTo = params.get("from") ?? "/admin/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .login-shell {
          min-height: 100vh;
          background: #0a0a0b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: "DM Sans", system-ui, sans-serif;
        }
        .login-card {
          width: 100%;
          max-width: 380px;
          background: #111114;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 2.5rem 2rem;
        }
        .login-logo {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #e8a020, #c47800);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 900; color: #0a0a0b;
          margin: 0 auto 1.25rem;
        }
        .login-title {
          font-size: 1.15rem; font-weight: 800;
          color: #e8e8e8; text-align: center;
          margin-bottom: 0.3rem;
        }
        .login-sub {
          font-size: 0.75rem; color: rgba(255,255,255,0.3);
          text-align: center; margin-bottom: 2rem; font-weight: 500;
        }
        .login-label {
          display: block;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 0.4rem; margin-top: 1rem;
        }
        .login-label:first-of-type { margin-top: 0; }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 7px;
          padding: 0.65rem 0.85rem;
          color: #e8e8e8; font-size: 0.85rem;
          outline: none;
          transition: border-color 140ms ease;
        }
        .login-input:focus { border-color: rgba(232,160,32,0.5); }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
        .login-error {
          background: rgba(248,113,113,0.1);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 6px;
          padding: 0.6rem 0.85rem;
          font-size: 0.78rem; color: #f87171;
          margin-bottom: 1rem;
        }
        .login-btn {
          width: 100%;
          background: #e8a020; color: #0a0a0b;
          font-weight: 800; font-size: 0.85rem;
          padding: 0.72rem;
          border-radius: 7px; border: none;
          cursor: pointer; margin-top: 1.5rem;
          letter-spacing: 0.04em;
          transition: opacity 140ms ease;
        }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .login-btn:hover:not(:disabled) { opacity: 0.9; }
      `}</style>

      <div className="login-shell">
        <div className="login-card">
          <div className="login-logo">J</div>
          <h1 className="login-title">Admin Login</h1>
          <p className="login-sub">Jocax Solutions · Kitchen Platform</p>

          <form onSubmit={handleSubmit} noValidate>
            {error && <div className="login-error">{error}</div>}

            <label className="login-label" htmlFor="email">Email</label>
            <input
              id="email" type="email" required
              autoComplete="email" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="admin@jocax.com"
            />

            <label className="login-label" htmlFor="password">Password</label>
            <input
              id="password" type="password" required
              autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              placeholder="••••••••"
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}