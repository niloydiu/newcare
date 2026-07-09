"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff, Heart, Mail, Lock, User } from "lucide-react";
import api from "@/lib/api";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleGoogleLogin = async (response: any) => {
    setLoading(true);
    try {
      const res = await api.post("/api/user/google-auth", {
        credential: response.credential,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        if (res.data.userData) localStorage.setItem("userData", JSON.stringify(res.data.userData));
        window.dispatchEvent(new Event("authChange"));
        toast.success("Welcome back!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Google authentication failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1089608603127-v3lig04qohrvth72o4gefodv559gh936.apps.googleusercontent.com";
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLogin,
        });
        const container = document.getElementById("googleSignInButton");
        if (container) {
          (window as any).google.accounts.id.renderButton(
            container,
            { theme: "outline", size: "large", width: 340 }
          );
        }
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (mode === "register" && !form.name) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/user/login" : "/api/user/register";
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        if (res.data.userData) localStorage.setItem("userData", JSON.stringify(res.data.userData));
        window.dispatchEvent(new Event("authChange"));
        toast.success(mode === "login" ? "Welcome back!" : "Account created successfully!");
        router.push("/");
      } else {
        toast.error(res.data.message || "Authentication failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
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
      background: "var(--bg)",
      padding: "2rem",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none"
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600,
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-10%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", marginBottom: "1rem" }}>
            <Image
              src="https://res.cloudinary.com/dg5gwims9/image/upload/v1783617203/newcare_assets/newCare.png"
              alt="NewCare Logo"
              width={150}
              height={38}
              style={{ objectFit: "contain", height: "38px", width: "auto" }}
              unoptimized
            />
          </Link>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.4rem" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            {mode === "login" ? "Sign in to your account" : "Join thousands of patients today"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "24px",
          padding: "2rem",
          boxShadow: "var(--shadow-lg)",
        }}>
          {/* Mode toggle */}
          <div style={{
            display: "flex",
            background: "var(--bg-secondary)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "1.75rem",
          }}>
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: "none",
                  background: mode === m ? "var(--primary)" : "transparent",
                  color: mode === m ? "white" : "var(--text-secondary)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textTransform: "capitalize",
                }}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {mode === "register" && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px", display: "block" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "Min. 8 characters" : "Your password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input"
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)"
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div style={{ textAlign: "right" }}>
                <a href="#" style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: "center", width: "100%", padding: "14px", fontSize: "0.95rem", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "10px" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "1rem" }}>
            <div id="googleSignInButton" />
          </div>

          <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", fontSize: "0.85rem" }}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          By continuing, you agree to NewCare's{" "}
          <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Terms of Service</a>{" "}
          and{" "}
          <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
