"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Heart, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://newcarebackend.vercel.app";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/admin/login`, form);
      if (res.data.success) {
        localStorage.setItem("aToken", res.data.token);
        toast.success("Welcome to Admin Panel!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      padding: "2rem",
    }}>
      {/* Glow effects */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle at 30% 40%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(139,92,246,0.1) 0%, transparent 50%)"
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            borderRadius: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem",
            boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
          }}>
            <Heart size={26} color="white" fill="white" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "white", marginBottom: "0.4rem" }}>
            NewCare Admin
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Secure administrator access
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "2.5rem",
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: "10px",
            padding: "10px 16px",
            marginBottom: "1.75rem",
          }}>
            <Shield size={16} style={{ color: "#6366f1" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
              Admin credentials required
            </span>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 6, display: "block" }}>
                Admin Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  type="email"
                  placeholder="admin@newcare.health"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 6, display: "block" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your admin password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                    padding: "0.75rem 2.5rem 0.75rem 2.5rem",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "white",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.95rem",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease",
                boxShadow: "0 6px 20px rgba(99,102,241,0.35)",
              }}
            >
              {loading ? "Signing in..." : "Sign In to Admin Panel"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
          © {new Date().getFullYear()} NewCare — Restricted Access
        </p>
      </div>
    </div>
  );
}
