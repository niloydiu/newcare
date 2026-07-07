"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Search, Star, ArrowRight, Shield, Clock, Award, Users,
  Stethoscope, Brain, Heart, Baby, Bone, Eye, Ear, Activity
} from "lucide-react";
import api from "@/lib/api";

const specialties = [
  { name: "General physician", icon: Stethoscope, color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
  { name: "Gynecologist", icon: Heart, color: "#ec4899", bg: "rgba(236,72,153,0.1)" },
  { name: "Dermatologist", icon: Activity, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { name: "Pediatricians", icon: Baby, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { name: "Neurologist", icon: Brain, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { name: "Cardiologist", icon: Heart, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
  { name: "Orthopedic", icon: Bone, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  { name: "ENT Specialist", icon: Ear, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
];

interface Doctor {
  _id: string;
  name: string;
  image: string;
  speciality: string;
  experience: number;
  fees: number;
  available: boolean;
  rating?: number;
  reviewCount?: number;
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data.success) {
          const all: Doctor[] = res.data.doctors;
          // Shuffle and pick 6 for featured
          const shuffled = [...all].sort(() => Math.random() - 0.5);
          setFeaturedDoctors(shuffled.slice(0, 6));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const stats = [
    { icon: Users, value: "200+", label: "Expert Doctors" },
    { icon: Award, value: "50K+", label: "Happy Patients" },
    { icon: Clock, value: "24/7", label: "Online Support" },
    { icon: Shield, value: "100%", label: "Verified Doctors" },
  ];

  return (
    <div>
      {/* ── Hero Section ── */}
      <section style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)",
        padding: "5rem 0 7rem",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)",
        }} />

        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: 600, color: "white" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
              borderRadius: "50px", padding: "6px 16px",
              fontSize: "0.85rem", fontWeight: 600,
              marginBottom: "1.5rem",
            }}>
              <span style={{ width: 8, height: 8, background: "#4ade80", borderRadius: "50%" }} />
              Trusted by 50,000+ patients worldwide
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1.25rem" }}>
              Book Your Doctor<br />
              <span style={{ opacity: 0.85 }}>Appointment in</span>{" "}
              <span style={{
                background: "rgba(255,255,255,0.25)", borderRadius: "8px",
                padding: "2px 12px", fontStyle: "italic"
              }}>60 seconds</span>
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: 1.7, marginBottom: "2rem" }}>
              Connect with verified, expert doctors across 10+ specialties. Convenient online booking, real patient reviews, and flexible scheduling.
            </p>

            {/* Search bar */}
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "8px",
              display: "flex",
              gap: "8px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              maxWidth: 520,
            }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={18} style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "#94a3b8"
                }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search doctors, specialties..."
                  style={{
                    width: "100%", border: "none", outline: "none",
                    paddingLeft: 40, paddingRight: 12, height: 44,
                    fontSize: "0.9rem", color: "#0f172a",
                    background: "transparent",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search) {
                      window.location.href = `/doctors?search=${encodeURIComponent(search)}`;
                    }
                  }}
                />
              </div>
              <Link
                href={search ? `/doctors?search=${encodeURIComponent(search)}` : "/doctors"}
                className="btn-primary"
                style={{ textDecoration: "none", borderRadius: "10px", padding: "0 20px" }}
              >
                Search
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ marginTop: "-3rem", marginBottom: "5rem", position: "relative", zIndex: 10 }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            background: "var(--bg-card)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}>
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  width: 48, height: 48,
                  background: "rgba(14,165,233,0.1)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 0.75rem"
                }}>
                  <Icon size={22} style={{ color: "var(--primary)" }} />
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text)" }}>{value}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialties ── */}
      <section style={{ paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
              Browse by <span className="gradient-text">Specialty</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto" }}>
              Choose from 10+ medical specialties and find the right expert for your health needs.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "1rem",
          }}>
            {specialties.map(({ name, icon: Icon, color, bg }) => (
              <Link
                key={name}
                href={`/doctors?specialty=${encodeURIComponent(name)}`}
                style={{
                  textDecoration: "none",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "16px",
                  padding: "1.5rem 1rem",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  display: "block",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "var(--shadow-lg)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.transform = "";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                }}
              >
                <div style={{
                  width: 56, height: 56,
                  background: bg,
                  borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 0.75rem"
                }}>
                  <Icon size={26} style={{ color }} />
                </div>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Doctors ── */}
      <section style={{
        paddingTop: "5rem", paddingBottom: "5rem",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.5rem" }}>
                Top <span className="gradient-text">Doctors</span>
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>Handpicked experts with proven track records</p>
            </div>
            <Link href="/doctors" className="btn-secondary" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem"
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{
                  background: "var(--bg-card)", borderRadius: 16,
                  overflow: "hidden", border: "1px solid var(--border)", height: 300
                }}>
                  <div style={{ height: 200, background: "var(--border)" }} />
                  <div style={{ padding: "1rem" }}>
                    <div style={{ height: 12, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 10, background: "var(--border)", borderRadius: 6, width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.5rem"
            }}>
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.75rem" }}>
              How <span className="gradient-text">NewCare</span> Works
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto" }}>
              Book your appointment in just 3 simple steps
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            {[
              { step: "01", title: "Search a Doctor", desc: "Browse by specialty, name, or location to find the perfect doctor for your needs." },
              { step: "02", title: "Book Appointment", desc: "Choose a convenient time slot from the doctor's real-time availability calendar." },
              { step: "03", title: "Get Consultation", desc: "Visit the doctor in-person or opt for a virtual consultation from home." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -10, right: -10,
                  fontSize: "5rem", fontWeight: 900, color: "var(--border)",
                  lineHeight: 1, userSelect: "none"
                }}>{step}</div>
                <div style={{
                  width: 48, height: 48,
                  background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.25rem",
                  color: "white", fontWeight: 700, fontSize: "1.1rem"
                }}>{step}</div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text)" }}>{title}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "5rem 0",
        background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", marginBottom: "1rem" }}>
            Ready to take control of your health?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", marginBottom: "2rem" }}>
            Join thousands of patients already using NewCare
          </p>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "white", color: "#0ea5e9",
              padding: "14px 32px", borderRadius: "12px",
              fontWeight: 700, fontSize: "1rem",
              textDecoration: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transition: "transform 0.2s ease",
            }}
          >
            Book Your First Appointment <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const [imgSrc, setImgSrc] = useState(doctor.image);
  const fallbackImg = "https://i.pravatar.cc/400?img=1";
  
  return (
    <Link
      href={`/appointment/${doctor._id}`}
      style={{ textDecoration: "none" }}
    >
      <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
        <div style={{ position: "relative", height: 200, background: "var(--bg-secondary)" }}>
          <Image
            src={imgSrc}
            alt={doctor.name}
            fill
            style={{ objectFit: "cover" }}
            unoptimized
            onError={() => setImgSrc(fallbackImg)}
          />
          {/* Online indicator */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            display: "flex", alignItems: "center", gap: "5px",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            borderRadius: "20px", padding: "4px 10px",
            fontSize: "0.72rem", fontWeight: 600, color: "white"
          }}>
            <span
              className="pulse-dot"
              style={{
                width: 7, height: 7, borderRadius: "50%",
                background: doctor.available ? "#4ade80" : "#f87171",
                display: "inline-block"
              }}
            />
            {doctor.available ? "Available" : "Busy"}
          </div>
        </div>

        <div style={{ padding: "1rem" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, marginBottom: "4px" }}>
            {doctor.speciality}
          </p>
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>
            {doctor.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Star size={13} fill="#f59e0b" style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                {doctor.rating?.toFixed(1) || "4.8"}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                ({doctor.reviewCount || 124})
              </span>
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
              ${doctor.fees}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "6px" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {doctor.experience} yr{doctor.experience !== 1 ? "s" : ""} experience
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
