import React, { useEffect, useState } from "react";
import API from "../services/api";

import "./Dashboard.css"; // add the CSS below in src/components/Dashboard.css

export default function Dashboard() {
  const [adminSummary, setAdminSummary] = useState(null);
  const [maintenanceSummary, setMaintenanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        // call both endpoints in parallel
        const [adminRes, maintenanceRes] = await Promise.allSettled([
          API.get("/admin/summary"),
          API.get("/maintenance/summary"),
        ]);

        if (mounted) {
          if (adminRes.status === "fulfilled") {
            setAdminSummary(adminRes.value.data);
          } else {
            // not fatal: maybe user is not admin
            console.warn("admin summary error", adminRes.reason);
          }

          if (maintenanceRes.status === "fulfilled") {
            setMaintenanceSummary(maintenanceRes.value.data);
          } else {
            console.error("maintenance summary error", maintenanceRes.reason);
            setErr("Failed to load maintenance summary (check token/authorization).");
          }
        }
      } catch (e) {
        if (mounted) setErr("Unexpected error loading data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (!user) {
    return <div className="dash-wrap"><p className="msg">Please login to view dashboard.</p></div>;
  }

  return (
    <div className="dash-wrap">
      <div className="dash-container">
        {/* Header */}
        <header className="dash-header glass">
          <div className="profile">
            <div className="avatar">
              {/* fallback initials */}
              {user.name ? user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase() : "AD"}
            </div>
            <div className="profile-info">
              <div className="welcome">Welcome back,</div>
              <div className="admin-name">{user.name}</div>
              <div className="role">{user.role?.toUpperCase()}</div>
            </div>
          </div>

          <div className="header-right">
            <div className="small-card">
              <div className="small-title">Flat</div>
              <div className="small-value">{user.flatNumber}</div>
            </div>
            <div className="small-card">
              <div className="small-title">Email</div>
              <div className="small-value">{user.email}</div>
            </div>
          </div>
        </header>

        {/* General Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card glass floating">
              <div className="stat-icon">👥</div>
              <div className="stat-body">
                <div className="stat-label">Total Users</div>
                <div className="stat-number">{adminSummary?.totalUsers ?? "—"}</div>
              </div>
            </div>

            <div className="stat-card glass floating">
              <div className="stat-icon">🏘️</div>
              <div className="stat-body">
                <div className="stat-label">Total Members</div>
                <div className="stat-number">{adminSummary?.totalMembers ?? "—"}</div>
              </div>
            </div>

            <div className="stat-card glass floating">
              <div className="stat-icon">🧾</div>
              <div className="stat-body">
                <div className="stat-label">This Month Bills</div>
                <div className="stat-number">{maintenanceSummary?.totalBills ?? "—"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Maintenance Section (Large Panel) */}
        <section className="maintenance-panel glass large-panel">
          <div className="panel-header">
            <h3>Maintenance Overview</h3>
            <div className="panel-sub">Current month summary</div>
          </div>

          <div className="panel-content">
            <div className="maint-card neon tile">
              <div className="tile-icon">🧾</div>
              <div className="tile-body">
                <div className="tile-title">Total Bills</div>
                <div className="tile-number">{loading ? "..." : (maintenanceSummary?.totalBills ?? 0)}</div>
              </div>
            </div>

            <div className="maint-card neon tile">
              <div className="tile-icon">🔴</div>
              <div className="tile-body">
                <div className="tile-title">Pending</div>
                <div className="tile-number">{loading ? "..." : (maintenanceSummary?.pendingBills ?? 0)}</div>
              </div>
            </div>

            <div className="maint-card neon tile">
              <div className="tile-icon">🟢</div>
              <div className="tile-body">
                <div className="tile-title">Paid</div>
                <div className="tile-number">{loading ? "..." : (maintenanceSummary?.paidBills ?? 0)}</div>
              </div>
            </div>
          </div>

          {err && <div className="error">{err}</div>}
        </section>

        {/* Recent activity placeholder */}
        <section className="recent-activity glass">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            <div className="activity-item">Last bill generation: {new Date().toLocaleString()}</div>
            <div className="activity-item">Admin: {user.name}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
