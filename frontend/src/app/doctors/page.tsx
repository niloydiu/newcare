"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Filter, X, ChevronDown } from "lucide-react";
import api from "@/lib/api";

const SPECIALTIES = [
  "All",
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Cardiologist",
  "Orthopedic",
  "Psychiatrist",
  "ENT Specialist",
  "Oncologist",
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
  degree?: string;
}

function DoctorsContent() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "All");
  const [sortBy, setSortBy] = useState("default");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/doctor/list");
        if (res.data.success) {
          setDoctors(res.data.doctors);
          setFiltered(res.data.doctors);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...doctors];

    if (specialty && specialty !== "All") {
      result = result.filter((d) =>
        d.speciality.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.speciality.toLowerCase().includes(q) ||
          (d.degree || "").toLowerCase().includes(q)
      );
    }

    if (availableOnly) {
      result = result.filter((d) => d.available);
    }

    switch (sortBy) {
      case "fees-asc":
        result.sort((a, b) => a.fees - b.fees);
        break;
      case "fees-desc":
        result.sort((a, b) => b.fees - a.fees);
        break;
      case "experience":
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
    }

    setFiltered(result);
    setPage(1);
  }, [doctors, specialty, search, availableOnly, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
        padding: "3rem 0",
        textAlign: "center",
      }}>
        <div className="container">
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900, color: "white", marginBottom: "0.5rem" }}>
            Find Your Doctor
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "2rem" }}>
            Browse {doctors.length}+ verified specialists across all fields
          </p>

          {/* Search */}
          <div style={{
            background: "white", borderRadius: "14px",
            padding: "8px", display: "flex", gap: "8px",
            maxWidth: 560, margin: "0 auto",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={17} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, specialty..."
                style={{
                  width: "100%", border: "none", outline: "none",
                  paddingLeft: 38, height: 42, fontSize: "0.9rem", color: "#0f172a",
                  background: "transparent"
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button className="btn-primary" style={{ borderRadius: "8px", padding: "0 20px" }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        {/* Filter bar */}
        <div style={{
          display: "flex", gap: "0.75rem", alignItems: "center",
          flexWrap: "wrap", marginBottom: "2rem"
        }}>
          {/* Specialty pills */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", flex: 1 }}>
            {SPECIALTIES.map((s) => (
              <button
                key={s}
                onClick={() => setSpecialty(s)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "50px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: specialty === s ? "none" : "1px solid var(--border)",
                  background: specialty === s
                    ? "linear-gradient(135deg, #0ea5e9, #6366f1)"
                    : "var(--bg-card)",
                  color: specialty === s ? "white" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sort & filter */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                style={{ accentColor: "var(--primary)", width: 14, height: 14 }}
              />
              Available only
            </label>

            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 32px 8px 12px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  appearance: "none",
                  outline: "none",
                }}
              >
                <option value="default">Sort: Default</option>
                <option value="rating">Sort: Rating</option>
                <option value="experience">Sort: Experience</option>
                <option value="fees-asc">Sort: Fee ↑</option>
                <option value="fees-desc">Sort: Fee ↓</option>
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>

        {/* Results count */}
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Showing <strong style={{ color: "var(--text)" }}>{filtered.length}</strong> doctor{filtered.length !== 1 ? "s" : ""}
          {specialty !== "All" ? ` in ${specialty}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: "var(--bg-card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
                <div style={{ height: 200, background: "var(--border)", animation: "pulse 1.5s infinite" }} />
                <div style={{ padding: "1rem" }}>
                  <div style={{ height: 12, background: "var(--border)", borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 10, background: "var(--border)", borderRadius: 6, width: "60%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <Search size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: "var(--text)" }}>No doctors found</h3>
            <p>Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(""); setSpecialty("All"); setAvailableOnly(false); }} className="btn-primary" style={{ marginTop: "1rem" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
              {paginated.map((doctor) => (
                <Link key={doctor._id} href={`/appointment/${doctor._id}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ overflow: "hidden", cursor: "pointer" }}>
                    <div style={{ position: "relative", height: 200, background: "var(--bg-secondary)" }}>
                      <DoctorImage doctor={doctor} />
                      
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
                      <p style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>
                        {doctor.speciality}
                      </p>
                      <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                        {doctor.name}
                      </h3>
                      {doctor.degree && (
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6 }}>{doctor.degree}</p>
                      )}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Star size={12} fill="#f59e0b" style={{ color: "#f59e0b" }} />
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text)" }}>
                            {(doctor.rating || 4.5).toFixed(1)}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                            ({doctor.reviewCount || 80})
                          </span>
                        </div>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--primary)" }}>${doctor.fees}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 4 }}>
                        {doctor.experience} yr{doctor.experience !== 1 ? "s" : ""} experience
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary"
                >
                  Load More Doctors
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DoctorImage({ doctor }: { doctor: Doctor }) {
  const [imgSrc, setImgSrc] = useState(doctor.image);
  const fallbackImg = "https://i.pravatar.cc/400?img=1";
  return (
    <Image
      src={imgSrc}
      alt={doctor.name}
      fill
      style={{ objectFit: "cover" }}
      unoptimized
      onError={() => setImgSrc(fallbackImg)}
    />
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--text-secondary)" }}>Loading...</div>
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}
