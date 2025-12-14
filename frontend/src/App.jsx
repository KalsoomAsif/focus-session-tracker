import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Footer text
const FOOTER_TEXT = "Kalsoom Asif • CS137 Final Project • Fall 2025";

// Session color map
const ratingToVar = (rating) => {
  if (rating === 1) return "var(--s1)";
  if (rating === 2) return "var(--s2)";
  if (rating === 3) return "var(--s3)";
  if (rating === 4) return "var(--s4)";
  return "var(--s5)";
};

function formatDateTime(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString();
  } catch {
    return isoString;
  }
}

function Stars({ value, onChange }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="starRow">
      <div className="stars">
        {stars.map((s) => {
          const filled = s <= value;
          return (
            <button
              key={s}
              type="button"
              className="starBtn"
              onClick={() => onChange(s)}
              aria-label={`Set focus rating to ${s}`}
              title={`${s} / 5`}
            >
              <span className="star">{filled ? "★" : "☆"}</span>
            </button>
          );
        })}
      </div>
      <div className="cardHint">{value} / 5</div>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("fst_theme");
    return saved === "dark" ? "dark" : "light";
  });

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("General");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [focusRating, setFocusRating] = useState(3);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fst_theme", theme);
  }, [theme]);

  const canSubmit = useMemo(() => {
    const mins = Number(durationMinutes);
    return title.trim().length > 0 && Number.isFinite(mins) && mins > 0;
  }, [title, durationMinutes]);

  async function fetchSessions() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/sessions`);
      const data = await res.json();
      setSessions(Array.isArray(data) ? data : []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

    async function addSession() {
    if (!canSubmit) return;

    const payload = {
      title: title.trim(),
      subject: subject.trim().length ? subject.trim() : "General",
      durationMinutes: Number(durationMinutes),
      focusRating: Number(focusRating),
    };

    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("POST /sessions failed:", res.status, txt);
        alert("Add Session failed. Check Console for details.");
        return;
      }

      // reset form
      setTitle("");
      setSubject("General");
      setDurationMinutes("");
      setFocusRating(3);

      await fetchSessions();
    } catch (err) {
      console.error("POST /sessions error:", err);
      alert("Add Session failed. Check Console for details.");
    }
  }

  async function markDone(id, completed) {
    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (res.ok) fetchSessions();
    } catch {
      // no-op
    }
  }

  async function deleteSession(id) {
    const ok = window.confirm("Delete this session?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/sessions/${id}`, { method: "DELETE" });
      if (res.ok) fetchSessions();
    } catch {
      // no-op
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div />

        <div className="titleWrap">
          <h1 className="title">Focus Session Tracker</h1>
          <p className="subtitle">Lock In!</p>
        </div>

        <div className="headerRight">
          <div className="pill">
            <span style={{ fontWeight: 700 }}>API</span>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>
              {API_BASE}
            </span>
          </div>

          <button
            className="button"
            type="button"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title="Toggle dark mode"
          >
            {theme === "dark" ? "☾ Dark" : "☀ Light"}
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="cardTitleRow">
            <h2 className="cardTitle">New Session</h2>
            <span className="cardHint"></span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addSession();
            }}
          >
            <div className="formRow">
              <div className="label">Title</div>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Data Structures review"
              />
            </div>

            <div className="formRow">
              <div className="label">Subject</div>
              <input
                className="input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., CS / Math / Writing"
              />
            </div>

            <div className="formRow">
              <div className="label">Duration (minutes) *</div>
              <input
                className="input"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="25"
                inputMode="numeric"
              />
            </div>

            <div className="formRow">
              <div className="label">Focus rating (1–5)</div>
              <Stars value={focusRating} onChange={setFocusRating} />
            </div>

            <button
              className="primaryBtn"
              disabled={!canSubmit}
              type="button"
              onClick={addSession}
            >
              Add Session
            </button>


            <div className="cardHint" style={{ marginTop: 10 }}>
        
            </div>
          </form>
        </div>

        <div className="card">
          <div className="cardTitleRow">
            <h2 className="cardTitle">Recent Sessions</h2>
            <span className="cardHint">{loading ? "Loading..." : `${sessions.length} total`}</span>
          </div>

          <div className="sessionList">
            {sessions.length === 0 ? (
              <div className="cardHint">No sessions yet. Add your first one ✨</div>
            ) : (
              sessions.map((s) => {
                const rating = Number(s.focusRating || 3);
                const bg = ratingToVar(rating);
                const completed = Boolean(s.completed);

                return (
                  <div
                    key={s._id}
                    className="sessionItem"
                    style={{
                      background: `linear-gradient(180deg, ${bg}, var(--surface-2))`,
                    }}
                  >
                    <div className="sessionTop">
                      <div>
                        <p className="sessionTitle">{s.title || "Focus Session"}</p>

                        <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <span className={`badge ${completed ? "badgeDone" : "badgeActive"}`}>
                            {completed ? "✓ Completed" : "• Active"}
                          </span>

                          <span className="badge" style={{ background: "rgba(255,255,255,0.25)" }}>
                            {"★".repeat(Math.max(1, Math.min(5, rating)))}{"☆".repeat(5 - Math.max(1, Math.min(5, rating)))}
                          </span>
                        </div>

                        <div className="sessionMeta">
                          <span>{s.subject || "General"}</span>
                          <span>• {s.durationMinutes} min</span>
                          <span>• {formatDateTime(s.createdAt || s.startedAt)}</span>
                        </div>
                      </div>

                      <div className="sessionActions">
                        <button
                          className="smallBtn"
                          type="button"
                          onClick={() => markDone(s._id, completed)}
                        >
                          {completed ? "Undo" : "Done"}
                        </button>

                        <button
                          className="smallBtn dangerBtn"
                          type="button"
                          onClick={() => deleteSession(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="footer">{FOOTER_TEXT}</div>
    </div>
  );
}
