"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Users, Calendar, Stethoscope, Settings,
  LogOut, Heart, Menu, X, Sun, Moon, TrendingUp, Activity,
  Clock, CheckCircle, XCircle, ChevronRight, Star
} from "lucide-react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "https://newcarebackend.vercel.app";

function api() {
  return axios.create({
    baseURL: API,
    headers: {
      "Content-Type": "application/json",
      aToken: typeof window !== "undefined" ? (localStorage.getItem("aToken") || "") : "",
    },
  });
}

interface DashData {
  doctors: number;
  appointments: number;
  patients: number;
  latestAppointments: any[];
}

function Sidebar({ activeTab, onTab, collapsed }: { activeTab: string; onTab: (t: string) => void; collapsed: boolean }) {
  const router = useRouter();
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "doctors", label: "Doctors", icon: Stethoscope },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "specialties", label: "Specialties", icon: Heart },
  ];

  const handleLogout = () => {
    localStorage.removeItem("aToken");
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <aside style={{
      width: collapsed ? 60 : 240,
      background: "#0f172a",
      height: "100vh",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      transition: "width 0.3s ease",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <Heart size={16} color="white" fill="white" />
          </div>
          {!collapsed && (
            <span style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", whiteSpace: "nowrap" }}>
              NewCare <span style={{ color: "#6366f1" }}>Admin</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "4px" }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTab(id)}
            title={collapsed ? label : undefined}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: activeTab === id ? "rgba(99,102,241,0.15)" : "transparent",
              color: activeTab === id ? "#6366f1" : "#94a3b8",
              fontWeight: 600,
              fontSize: "0.875rem",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", width: "100%",
            border: "none", background: "none", cursor: "pointer",
            color: "#ef4444", fontWeight: 600, fontSize: "0.875rem",
            borderRadius: "10px", transition: "background 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

function StatCard({ icon: Icon, label, value, color, change }: any) {
  return (
    <div className="card" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "12px",
          background: `${color}18`,
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          fontSize: "0.78rem", fontWeight: 600, color: "#10b981"
        }}>
          <TrendingUp size={12} /> {change}
        </div>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--text)" }}>{value}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>{label}</div>
    </div>
  );
}

function DashboardTab({ data }: { data: DashData | null }) {
  if (!data) return <div style={{ color: "var(--text-secondary)", padding: "2rem" }}>Loading dashboard...</div>;

  const stats = [
    { icon: Stethoscope, label: "Total Doctors", value: data.doctors, color: "#6366f1", change: "+12%" },
    { icon: Calendar, label: "Total Appointments", value: data.appointments, color: "#0ea5e9", change: "+8%" },
    { icon: Users, label: "Total Patients", value: data.patients, color: "#10b981", change: "+15%" },
    { icon: Activity, label: "Completion Rate", value: "94%", color: "#f59e0b", change: "+2%" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.75rem" }}>Dashboard Overview</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} style={{ color: "var(--primary)" }} /> Recent Appointments
        </h2>
        {data.latestAppointments.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No recent appointments</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {data.latestAppointments.slice(0, 5).map((a: any) => (
              <div key={a._id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 1rem",
                background: "var(--bg-secondary)",
                borderRadius: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                    <Image
                      src={a.docData?.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop"}
                      alt="" fill style={{ objectFit: "cover" }} unoptimized
                    />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{a.docData?.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{a.slotDate} • {a.slotTime}</p>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 600,
                  background: a.cancelled ? "rgba(239,68,68,0.1)" : a.isCompleted ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                  color: a.cancelled ? "#ef4444" : a.isCompleted ? "#10b981" : "#0ea5e9",
                }}>
                  {a.cancelled ? "Cancelled" : a.isCompleted ? "Completed" : "Upcoming"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorsTab() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api().get("/api/admin/all-doctors");
        if (res.data.success) setDoctors(res.data.doctors);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = doctors.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality.toLowerCase().includes(search.toLowerCase())
  );

  const toggleAvailable = async (docId: string, current: boolean) => {
    try {
      const res = await api().post("/api/admin/change-availability", { docId });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d._id === docId ? { ...d, available: !current } : d));
        toast.success("Availability updated");
      }
    } catch { toast.error("Failed to update"); }
  };

  const deleteDoctor = async (docId: string) => {
    if (!confirm("Delete this doctor?")) return;
    try {
      const res = await api().post("/api/admin/delete-doctor", { docId });
      if (res.data.success) {
        setDoctors(prev => prev.filter(d => d._id !== docId));
        toast.success("Doctor deleted");
      }
    } catch { toast.error("Failed to delete"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Doctors ({filtered.length})</h1>
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ width: 240 }}
        />
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Doctor", "Specialty", "Experience", "Fees", "Available", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <tr key={doc._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "10px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                        <Image src={doc.image} alt={doc.name} fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{doc.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{doc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{doc.speciality}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{doc.experience} yrs</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>${doc.fees}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => toggleAvailable(doc._id, doc.available)}
                      style={{
                        width: 36, height: 20,
                        borderRadius: "10px",
                        border: "none",
                        background: doc.available ? "#10b981" : "var(--border)",
                        cursor: "pointer",
                        position: "relative",
                        transition: "background 0.2s ease",
                      }}
                    >
                      <div style={{
                        width: 14, height: 14,
                        borderRadius: "50%",
                        background: "white",
                        position: "absolute",
                        top: 3,
                        left: doc.available ? 19 : 3,
                        transition: "left 0.2s ease",
                      }} />
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => deleteDoctor(doc._id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No doctors found</p>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentsTab() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api().get("/api/admin/appointments");
        if (res.data.success) setAppointments(res.data.appointments.reverse());
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const cancel = async (id: string) => {
    try {
      const res = await api().post("/api/admin/cancel-appointment", { appointmentId: id });
      if (res.data.success) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, cancelled: true } : a));
        toast.success("Cancelled");
      }
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>
        All Appointments ({appointments.length})
      </h1>
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Patient", "Doctor", "Specialty", "Date & Time", "Fee", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {a.userData?.image && (
                        <div style={{ width: 32, height: 32, borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                          <Image src={a.userData.image} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                        </div>
                      )}
                      <span style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>{a.userData?.name || "—"}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text)" }}>{a.docData?.name}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a.docData?.speciality}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>{a.slotDate} • {a.slotTime}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>${a.amount}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "50px", fontSize: "0.72rem", fontWeight: 700,
                      background: a.cancelled ? "rgba(239,68,68,0.1)" : a.isCompleted ? "rgba(16,185,129,0.1)" : "rgba(14,165,233,0.1)",
                      color: a.cancelled ? "#ef4444" : a.isCompleted ? "#10b981" : "#0ea5e9",
                    }}>
                      {a.cancelled ? "Cancelled" : a.isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {!a.cancelled && !a.isCompleted && (
                      <button onClick={() => cancel(a._id)} className="btn-danger">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PatientsTab() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api().get("/api/admin/all-patients");
        if (res.data.success) setPatients(res.data.patients);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const deletePatient = async (userId: string) => {
    if (!confirm("Delete this patient account and all their appointments?")) return;
    try {
      const res = await api().post("/api/admin/delete-patient", { userId });
      if (res.data.success) {
        setPatients(prev => prev.filter(p => p._id !== userId));
        toast.success("Patient deleted");
      }
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)" }}>Patients ({filtered.length})</h1>
        <input type="text" placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)} className="input" style={{ width: 240 }} />
      </div>
      {loading ? <p style={{ color: "var(--text-secondary)" }}>Loading...</p> : (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-secondary)" }}>
                {["Patient", "Gender", "DOB", "Phone", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "10px", overflow: "hidden", position: "relative" }}>
                        <Image src={p.image || "https://i.pravatar.cc/80"} alt="" fill style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)" }}>{p.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{p.gender || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.dob || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{p.phone || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => deletePatient(p._id)} className="btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>No patients found</p>}
        </div>
      )}
    </div>
  );
}

function SpecialtiesTab() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", image: "", description: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api().get("/api/admin/all-specialties");
        if (res.data.success) setSpecialties(res.data.specialties);
      } catch { }
      setLoading(false);
    };
    fetch();
  }, []);

  const addSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await api().post("/api/admin/add-specialty", form);
      if (res.data.success) {
        toast.success("Specialty added!");
        setForm({ name: "", image: "", description: "" });
        const updated = await api().get("/api/admin/all-specialties");
        if (updated.data.success) setSpecialties(updated.data.specialties);
      } else {
        toast.error(res.data.message);
      }
    } catch { toast.error("Failed to add"); }
    setAdding(false);
  };

  const deleteSpecialty = async (id: string) => {
    if (!confirm("Delete this specialty?")) return;
    try {
      const res = await api().post("/api/admin/delete-specialty", { id });
      if (res.data.success) {
        setSpecialties(prev => prev.filter(s => s._id !== id));
        toast.success("Deleted");
      }
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: "1.5rem" }}>Doctor Specialties</h1>

      {/* Add form */}
      <div className="card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.25rem" }}>Add New Specialty</h2>
        <form onSubmit={addSpecialty} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="e.g. Cardiologist" required />
          </div>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Icon URL</label>
            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="input" placeholder="https://..." />
          </div>
          <div>
            <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 5, display: "block" }}>Description *</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input" placeholder="Short description" required />
          </div>
          <button type="submit" disabled={adding} className="btn-primary">
            {adding ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
          {specialties.map((s) => (
            <div key={s._id} className="card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>{s.name}</h3>
                <button onClick={() => deleteSpecialty(s._id)} className="btn-danger" style={{ padding: "4px 10px" }}>×</button>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{s.description}</p>
            </div>
          ))}
          {specialties.length === 0 && <p style={{ color: "var(--text-muted)" }}>No specialties yet. Add one above.</p>}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashData, setDashData] = useState<DashData | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const token = localStorage.getItem("aToken");
    if (!token) { router.push("/login"); return; }
    loadDash(token);
    const saved = localStorage.getItem("adminTheme") as "light" | "dark" | null;
    if (saved) { setTheme(saved); document.documentElement.setAttribute("data-theme", saved); }
  }, []);

  const loadDash = async (token: string) => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard`, {
        headers: { aToken: token }
      });
      if (res.data.success) setDashData(res.data.dashData);
    } catch { }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("adminTheme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  const tabContent: Record<string, React.ReactNode> = {
    dashboard: <DashboardTab data={dashData} />,
    doctors: <DoctorsTab />,
    appointments: <AppointmentsTab />,
    patients: <PatientsTab />,
    specialties: <SpecialtiesTab />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} onTab={setActiveTab} collapsed={sidebarCollapsed} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <header style={{
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.5rem",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
            >
              <Menu size={20} />
            </button>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", textTransform: "capitalize" }}>
              {activeTab}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={toggleTheme}
              style={{
                width: 36, height: 36, borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-secondary)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text)",
              }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <div style={{
              width: 36, height: 36, borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "0.875rem"
            }}>A</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "2rem", overflowY: "auto", background: "var(--bg)" }}>
          {tabContent[activeTab]}
        </main>
      </div>
    </div>
  );
}
