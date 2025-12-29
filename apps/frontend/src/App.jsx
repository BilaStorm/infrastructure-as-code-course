import React, { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [info, setInfo] = useState(null);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");

  const endpoints = useMemo(() => {
    return {
      health: `${API_URL}/health`,
      info: `${API_URL}/api/info`,
      quote: `${API_URL}/api/quote`
    };
  }, []);

  async function loadAll() {
    setError("");
    try {
      const [h, i, q] = await Promise.all([
        fetchJson(endpoints.health),
        fetchJson(endpoints.info),
        fetchJson(endpoints.quote)
      ]);
      setHealth(h);
      setInfo(i);
      setQuote(q);
    } catch (e) {
      setError(e?.message || String(e));
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoints.health]);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 900 }}>
      <h1>CI/CD Training App</h1>
      <p style={{ opacity: 0.8 }}>
        Front React (Vite) ↔ Back Express. Aucune base de données. Tout est configuré via variables
        d’environnement.
      </p>

      <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Chip label="API URL" value={API_URL} />
        <Chip label="Health endpoint" value="/health" />
        <Chip label="Info endpoint" value="/api/info" />
        <Chip label="Quote endpoint" value="/api/quote" />
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ccc" }}>
          <strong>Erreur :</strong> {error}
        </div>
      )}

      <div style={{ marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "1fr" }}>
        <Card title="Health">
          <pre>{health ? JSON.stringify(health, null, 2) : "Chargement..."}</pre>
        </Card>

        <Card title="Info (version / env / sha)">
          <pre>{info ? JSON.stringify(info, null, 2) : "Chargement..."}</pre>
        </Card>

        <Card title="Quote (donnée simulée)">
          <pre>{quote ? JSON.stringify(quote, null, 2) : "Chargement..."}</pre>
        </Card>
      </div>

      <button
        onClick={loadAll}
        style={{ marginTop: 16, padding: "10px 14px", cursor: "pointer" }}
      >
        Recharger
      </button>

      <p style={{ marginTop: 24, opacity: 0.7 }}>
        Astuce CI/CD : injecter <code>APP_VERSION</code>, <code>GIT_SHA</code>, <code>BUILD_DATE</code>{" "}
        côté back pour visualiser les déploiements.
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
      <h2 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>{title}</h2>
      {children}
    </div>
  );
}

function Chip({ label, value }) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 999, padding: "6px 10px" }}>
      <strong>{label}:</strong> <span style={{ opacity: 0.8 }}>{value}</span>
    </div>
  );
}
