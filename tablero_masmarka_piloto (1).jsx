import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── CONTEXTO ────────────────────────────────────────────────────────────────
const PERIODO   = "Septiembre 2025";
const CATEGORIA = "Cuidado Personal — Categoría de Prueba";
const MERCADO   = "Canal Moderno · Paraguay";

// ─── TEMAS ───────────────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#F8FAFC", surface: "#FFFFFF", surfaceAlt: "#F1F5F9",
  border: "#E2E8F0", borderSub: "#CBD5E1",
  text: "#0F172A", textSub: "#475569", textMuted: "#94A3B8",
  accent: "#0D9488", accentSoft: "#F0FDFA",
  shadow: "0 2px 8px rgba(0,0,0,.05)", chartAxis: "#94A3B8",
};
const DARK = {
  bg: "#0D1117", surface: "#161B22", surfaceAlt: "#0D1117",
  border: "#21262D", borderSub: "#30363D",
  text: "#E6EDF3", textSub: "#8B949E", textMuted: "#484F58",
  accent: "#0D9488", accentSoft: "#0D948820",
  shadow: "0 2px 12px rgba(0,0,0,.4)", chartAxis: "#484F58",
};

// ─── DATOS DE PRUEBA ─────────────────────────────────────────────────────────
const resumen = {
  titular: "La Marca Analizada creció 13pp en un mes.",
  subtitular: "El líder sigue cediendo terreno. Marca C avanzó en cadenas. Los precios se mantienen estables.",
  highlights: [
    { valor: "+13pp",     etiqueta: "Variación mensual Marca Analizada",      tipo: "positivo",
      titulo: "Variación de share", info: "Diferencia en puntos porcentuales (pp) entre el share del mes actual y el mes anterior. Un cambio de +13pp en un solo mes es inusualmente alto y merece seguimiento." },
    { valor: "58.4%",     etiqueta: "Share Líder A — tendencia a la baja",    tipo: "neutro",
      titulo: "Share en volumen", info: "Porcentaje de unidades vendidas del total de la categoría. El Líder A sostuvo por años más del 62%, la caída sostenida a 58.4% indica presión competitiva real." },
    { valor: "Gs 39.900", etiqueta: "Precio promedio Marca Analizada",         tipo: "info",
      titulo: "Precio promedio unitario", info: "Precio promedio al que se vendió el producto, calculado como facturación total dividido unidades vendidas. Es 2.1x el precio del Líder A, lo que explica su concentración en cadenas." },
  ],
};

const shareData = [
  { empresa: "MARCA LÍDER A",   share: 58.4, anterior: 62.1, color: "#0D9488" },
  { empresa: "MARCA B",         share: 17.2, anterior: 18.3, color: "#6366F1" },
  { empresa: "MARCA C",         share:  8.1, anterior:  9.4, color: "#F59E0B" },
  { empresa: "MARCA D",         share:  3.8, anterior:  4.2, color: "#64748B" },
  { empresa: "MARCA ANALIZADA", share:  6.3, anterior:    0, color: "#0D9488" },
];

const evolucion = [
  { mes: "Ene", lider: 55.2, analizada: 0    },
  { mes: "Feb", lider: 60.3, analizada: 0    },
  { mes: "Mar", lider: 54.1, analizada: 0    },
  { mes: "Abr", lider: 65.9, analizada: 0    },
  { mes: "May", lider: 70.4, analizada: 1.2  },
  { mes: "Jun", lider: 79.8, analizada: 1.8  },
  { mes: "Jul", lider: 77.6, analizada: 2.4  },
  { mes: "Ago", lider: 76.9, analizada: 3.1  },
  { mes: "Sep", lider: 58.4, analizada: 16.5 },
];

const evolucionSemanal = [
  { sem: "S1 Ago", lider: 77.4, analizada: 2.8,  precio: 39200 },
  { sem: "S2 Ago", lider: 76.9, analizada: 3.0,  precio: 39500 },
  { sem: "S3 Ago", lider: 76.5, analizada: 3.1,  precio: 39400 },
  { sem: "S4 Ago", lider: 77.2, analizada: 3.5,  precio: 39900 },
  { sem: "S1 Sep", lider: 72.1, analizada: 5.8,  precio: 40100 },
  { sem: "S2 Sep", lider: 65.3, analizada: 9.4,  precio: 39800 },
  { sem: "S3 Sep", lider: 60.8, analizada: 13.2, precio: 38900 },
  { sem: "S4 Sep", lider: 58.4, analizada: 16.5, precio: 39900 },
];

const canales = [
  { canal: "Cadenas SPM",    analizada: 11.2, lider: 38.5 },
  { canal: "AyGas / Mixtos", analizada:  7.8, lider: 55.0 },
  { canal: "Asu Minoristas", analizada:  1.1, lider: 82.4 },
  { canal: "Interior",       analizada:  2.9, lider: 78.6 },
];

const preciosReporte = [
  { marca: "MARCA LÍDER A",   precio: 18500 },
  { marca: "MARCA B",         precio: 14200 },
  { marca: "MARCA C",         precio: 15800 },
  { marca: "MARCA ANALIZADA", precio: 39900 },
];

const movimientos = [
  { marca: "MARCA LÍDER A", hecho: "Bajó de 62.1% a 58.4% en el año.",                badge: "↓ CEDIENDO", bc: "#F59E0B" },
  { marca: "MARCA B",       hecho: "Cayó de 16.2% a 8.9% en el interior del país.",   badge: "↓ INTERIOR", bc: "#64748B" },
  { marca: "MARCA C",       hecho: "Subió de 7.8% a 12.1% en cadenas el último mes.", badge: "↑ CADENAS",  bc: "#10B981" },
];

const preciosOnline = [
  { cadena: "Stock Center", sku: "Producto X1 — Marca Analizada", precioReporte: 39900, precioOnline: 38500, disponible: true,  enOferta: false },
  { cadena: "Los Jardines", sku: "Producto X1 — Marca Analizada", precioReporte: 39900, precioOnline: 34500, disponible: true,  enOferta: true  },
  { cadena: "Superseis",    sku: "Producto X1 — Marca Analizada", precioReporte: 39900, precioOnline: null,  disponible: false, enOferta: false },
  { cadena: "Stock Center", sku: "Producto A1 — Líder A",         precioReporte: 18500, precioOnline: 18900, disponible: true,  enOferta: false },
  { cadena: "Los Jardines", sku: "Producto A1 — Líder A",         precioReporte: 18500, precioOnline: 18500, disponible: true,  enOferta: false },
  { cadena: "Superseis",    sku: "Producto A1 — Líder A",         precioReporte: 18500, precioOnline: 17800, disponible: true,  enOferta: true  },
];

const espaciosPublicitarios = [
  { cadena: "Stock Center", marca: "MARCA LÍDER A",   tipo: "Banner principal",    activo: true,  semanas: 3, posicion: "Destacado" },
  { cadena: "Stock Center", marca: "MARCA ANALIZADA", tipo: "Banner categoría",    activo: true,  semanas: 2, posicion: "Categoría" },
  { cadena: "Los Jardines", marca: "MARCA LÍDER A",   tipo: "Oferta destacada",    activo: true,  semanas: 1, posicion: "Home"      },
  { cadena: "Los Jardines", marca: "MARCA C",          tipo: "Notificación push",   activo: false, semanas: 0, posicion: "—"         },
  { cadena: "Superseis",    marca: "MARCA B",          tipo: "Banner principal",    activo: true,  semanas: 4, posicion: "Destacado" },
  { cadena: "Superseis",    marca: "MARCA ANALIZADA", tipo: "Listing patrocinado", activo: false, semanas: 0, posicion: "—"         },
];

const CONTEXTO_IA = `Sos el asistente de análisis de MASMARKA. Respondé en español, de forma clara y concisa. Todos los datos son ficticios de prueba.

Período: ${PERIODO}. Categoría: ${CATEGORIA}. Mercado: ${MERCADO}.
Share en volumen: Líder A 58.4% (antes 62.1%), Marca B 17.2%, Marca C 8.1%, Marca D 3.8%, Marca Analizada 6.3% (nueva).
Evolución Marca Analizada: Ene-Abr 0%, May 1.2%, Jun 1.8%, Jul 2.4%, Ago 3.1%, Sep 16.5%.
Canales Marca Analizada: Cadenas 11.2%, AyGas 7.8%, Minoristas Asu 1.1%, Interior 2.9%.
Precios: Líder A Gs 18.500, B Gs 14.200, C Gs 15.800, Analizada Gs 39.900.
Precios online Analizada: Stock Gs 38.500, Los Jardines Gs 34.500 (oferta), Superseis sin stock.
Espacios pub.: Analizada activa en Stock (banner cat.) pero inactiva en Superseis. Líder A activo en Stock y Los Jardines.
Movimientos: Líder A bajó todo el año. Marca B retrocedió en interior. Marca C subió en cadenas.`;

const LABELS = ["Este mes", "Share", "Por canal", "Precios", "Online & Publicidad", "Competencia"];

// ─── INFO TIP ────────────────────────────────────────────────────────────────
function InfoTip({ texto, T }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setVisible(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setVisible(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", color: T.textMuted, fontSize: 11, lineHeight: 1, padding: "0 2px", display: "inline-flex", alignItems: "center" }}
        title="¿Qué mide esto?"
      >ⓘ</button>
      {visible && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
          width: 240, background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 8, padding: "10px 12px", fontSize: 11, color: T.textSub,
          lineHeight: 1.6, boxShadow: "0 8px 24px rgba(0,0,0,.12)", zIndex: 50,
        }}>
          <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: T.surface, border: `1px solid ${T.border}`, borderBottom: "none", borderRight: "none", rotate: "45deg" }} />
          {texto}
        </div>
      )}
    </span>
  );
}

// ─── CHART TOOLTIP ───────────────────────────────────────────────────────────
function CTip({ active, payload, label, T }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 11, boxShadow: T.shadow, minWidth: 180 }}>
      <div style={{ color: T.textMuted, marginBottom: 8, fontWeight: 600, fontFamily: "monospace" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: p.color, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />
            {p.name}
          </span>
          <span style={{ fontWeight: 700, color: T.text }}>{p.value?.toFixed(1)}%</span>
        </div>
      ))}
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.textMuted, lineHeight: 1.5 }}>
        Share en volumen: % de unidades vendidas sobre el total de la categoría en el mes.
      </div>
    </div>
  );
}

// ─── CHAT IA ─────────────────────────────────────────────────────────────────
function ChatIA({ visible, onClose, T }) {
  const [msgs, setMsgs] = useState([{ rol: "a", txt: "Hola. Preguntame sobre los datos de este período." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef(null);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const sugs = ["¿Qué pasó con el Líder A?", "¿Dónde está disponible la Marca Analizada?", "¿Quién invierte más en publicidad online?"];

  async function send(txt) {
    const q = txt || input.trim(); if (!q) return;
    setInput("");
    const upd = [...msgs, { rol: "u", txt: q }];
    setMsgs(upd); setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 600,
          system: CONTEXTO_IA,
          messages: upd.map(m => ({ role: m.rol === "u" ? "user" : "assistant", content: m.txt })),
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { rol: "a", txt: data.content?.[0]?.text || "Sin respuesta." }]);
    } catch { setMsgs(p => [...p, { rol: "a", txt: "Error de conexión." }]); }
    finally { setLoading(false); }
  }

  if (!visible) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, width: 340, zIndex: 100, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.15)", display: "flex", flexDirection: "column", maxHeight: 480 }}>
      <div style={{ padding: "13px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>Asistente MASMARKA</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      <div style={{ padding: "8px 12px 0", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {sugs.map((s, i) => <button key={i} onClick={() => send(s)} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 20, padding: "4px 10px", fontSize: 9, color: T.textSub, cursor: "pointer" }}>{s}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10, minHeight: 180 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.rol === "u" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", padding: "9px 12px", borderRadius: m.rol === "u" ? "12px 4px 12px 12px" : "4px 12px 12px 12px", background: m.rol === "u" ? T.accentSoft : T.surfaceAlt, border: `1px solid ${T.border}`, fontSize: 11, color: T.text, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{m.txt}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", gap: 4, padding: "4px 8px" }}>{[0,1,2].map(j => <div key={j} style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: `mmPulse 1.2s ${j*0.2}s infinite ease-in-out` }} />)}</div>}
        <div ref={bottom} />
      </div>
      <div style={{ padding: "10px 12px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Escribí tu pregunta..." style={{ flex: 1, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 11, color: T.text, outline: "none" }} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: loading || !input.trim() ? T.border : T.accent, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#fff", cursor: loading || !input.trim() ? "not-allowed" : "pointer" }}>→</button>
      </div>
    </div>
  );
}

// ─── GRÁFICO SEMANAL ─────────────────────────────────────────────────────────
function SemanalChart({ T }) {
  const [metrica, setMetrica] = useState("share");

  const opciones = [
    { id: "share",  label: "Share en volumen",      info: "% de unidades vendidas sobre el total de la categoría. Dato estimado por semana a partir del panel de auditoría." },
    { id: "precio", label: "Precio promedio",        info: "Precio promedio unitario de la Marca Analizada por semana, en guaraníes." },
  ];

  const configs = {
    share: {
      series: [
        { key: "lider",     name: "Líder A",         color: "#0D9488", dash: false },
        { key: "analizada", name: "Marca Analizada",  color: "#6366F1", dash: true  },
      ],
      formatter: v => `${v?.toFixed(1)}%`,
      yFormatter: v => `${v}%`,
      nota: "Share en volumen semanal — % de unidades vendidas sobre el total de la categoría.",
    },
    precio: {
      series: [
        { key: "precio", name: "Precio Marca Analizada", color: "#F59E0B", dash: false },
      ],
      formatter: v => `Gs ${v?.toLocaleString("es-PY")}`,
      yFormatter: v => `${(v / 1000).toFixed(0)}k`,
      nota: "Precio promedio unitario semanal de la Marca Analizada, en guaraníes.",
    },
  };

  const cfg = configs[metrica];

  function WeekTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 11, boxShadow: T.shadow, minWidth: 190 }}>
        <div style={{ color: T.textMuted, marginBottom: 8, fontWeight: 600, fontFamily: "monospace" }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
            <span style={{ color: p.color, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />{p.name}
            </span>
            <span style={{ fontWeight: 700, color: T.text }}>{cfg.formatter(p.value)}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, fontSize: 10, color: T.textMuted, lineHeight: 1.5 }}>{cfg.nota}</div>
      </div>
    );
  }

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "22px 26px", marginBottom: 24, boxShadow: T.shadow, transition: "background .3s" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
            Evolutivo semanal — últimas 8 semanas
            <InfoTip texto="Vista semanal de las métricas clave. A diferencia del informe de mercado mensual, este evolutivo permite detectar cambios dentro del mes — una ventaja que el panel tradicional no ofrece." T={T} />
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>Ago – Sep · Datos de prueba</div>
        </div>
        {/* Toggle métrica */}
        <div style={{ display: "flex", gap: 4, background: T.surfaceAlt, padding: 3, borderRadius: 8, border: `1px solid ${T.border}` }}>
          {opciones.map(o => (
            <button key={o.id} onClick={() => setMetrica(o.id)} style={{
              background: metrica === o.id ? T.accent : "transparent",
              border: "none", borderRadius: 6, padding: "5px 12px",
              fontSize: 10, fontWeight: 600,
              color: metrica === o.id ? "#fff" : T.textSub,
              cursor: "pointer", transition: "all .18s"
            }}>{o.label}</button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 4 }}>
        {cfg.series.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textSub }}>
            <div style={{ width: 14, height: 2, borderRadius: 1, background: s.color, borderTop: s.dash ? "none" : undefined, borderStyle: s.dash ? "dashed" : "solid", borderColor: s.color, borderWidth: s.dash ? "0 0 2px 0" : 0 }} />
            {s.name}
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: T.border, margin: "10px 0" }} />

      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={evolucionSemanal}>
          <defs>
            {cfg.series.map((s, i) => (
              <linearGradient key={i} id={`sw${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={s.color} stopOpacity={0.13} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0}    />
              </linearGradient>
            ))}
          </defs>
          <XAxis dataKey="sem" tick={{ fill: T.chartAxis, fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={cfg.yFormatter} width={40} />
          <Tooltip content={<WeekTooltip />} />
          {cfg.series.map((s, i) => (
            <Area key={i} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2}
              strokeDasharray={s.dash ? "5 3" : "0"} fill={`url(#sw${i})`} name={s.name} dot={{ r: 3, fill: s.color, strokeWidth: 0 }} />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <div style={{ marginTop: 10, padding: "8px 12px", background: T.surfaceAlt, borderRadius: 8, fontSize: 10, color: T.textMuted, borderLeft: `3px solid ${T.accent}` }}>
        {metrica === "share"
          ? "La Marca Analizada aceleró de forma sostenida desde S1 Sep. El Líder A perdió 13.7pp en el mismo período — el movimiento fue inverso y simultáneo."
          : "El precio se mantuvo estable entre Gs 38.900 y Gs 40.100. Sin variaciones significativas que expliquen el cambio de share."}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
  const [sec, setSec]   = useState(0);
  const [chat, setChat] = useState(false);
  const [dark, setDark] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const ref = useRef(null);
  const T = dark ? DARK : LIGHT;

  function nav(i) { setSec(i); setAnimKey(k => k + 1); ref.current?.scrollTo({ top: 0, behavior: "smooth" }); }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg, fontFamily: "'Georgia', serif", color: T.text, overflow: "hidden", transition: "background .3s, color .3s" }}>
      <style>{`
        @keyframes mmFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes mmPulse  { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        .mm1{animation:mmFadeUp .4s ease both}
        .mm2{animation:mmFadeUp .4s .08s ease both}
        .mm3{animation:mmFadeUp .4s .16s ease both}
        .mm4{animation:mmFadeUp .4s .24s ease both}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{border-radius:2px;background:#94A3B8}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ padding: "11px 28px", borderBottom: `1px solid ${T.border}`, background: T.surface, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, transition: "background .3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: T.text, textTransform: "uppercase" }}>MASMARKA</span>
          <span style={{ color: T.borderSub, margin: "0 2px" }}>|</span>
          <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>{CATEGORIA}</span>
          <span style={{ color: T.borderSub, margin: "0 4px" }}>·</span>
          <span style={{ fontSize: 11, color: T.textMuted }}>{MERCADO}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, color: T.textMuted, fontFamily: "monospace" }}>{PERIODO} · DATOS DE PRUEBA</span>
          <button onClick={() => setDark(d => !d)} style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", fontSize: 11, color: T.textSub, cursor: "pointer", transition: "all .2s" }}>
            {dark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
          <button onClick={() => setChat(v => !v)} style={{ background: chat ? T.accent : T.accentSoft, border: `1px solid ${T.accent}55`, borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 600, color: chat ? "#fff" : T.accent, cursor: "pointer", transition: "all .2s", fontFamily: "Georgia" }}>✦ Consultar con IA</button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── NAV LATERAL ── */}
        <div style={{ width: 152, borderRight: `1px solid ${T.border}`, background: T.surface, padding: "24px 0", display: "flex", flexDirection: "column", gap: 2, flexShrink: 0, transition: "background .3s" }}>
          {LABELS.map((label, i) => (
            <button key={i} onClick={() => nav(i)} style={{ background: "none", border: "none", cursor: "pointer", padding: "9px 18px 9px 22px", textAlign: "left", fontSize: 12, fontWeight: sec === i ? 700 : 400, color: sec === i ? T.accent : T.textSub, borderLeft: `2px solid ${sec === i ? T.accent : "transparent"}`, transition: "all .18s", fontFamily: "Georgia" }}
              onMouseEnter={e => { if (sec !== i) e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { if (sec !== i) e.currentTarget.style.color = T.textSub; }}
            >{label}</button>
          ))}
        </div>

        {/* ── CONTENIDO ── */}
        <div ref={ref} style={{ flex: 1, overflowY: "auto", padding: "38px 48px" }}>

          {/* ESTE MES */}
          {sec === 0 && (
            <div key={`r${animKey}`}>
              <div className="mm1" style={{ marginBottom: 36 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14, fontFamily: "monospace" }}>Lo que pasó este mes</div>
                <h1 style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.25, color: T.text, marginBottom: 12, maxWidth: 540 }}>{resumen.titular}</h1>
                <p style={{ fontSize: 14, color: T.textSub, lineHeight: 1.9, maxWidth: 490 }}>{resumen.subtitular}</p>
              </div>

              <div className="mm2" style={{ display: "flex", gap: 14, marginBottom: 34 }}>
                {resumen.highlights.map((h, i) => {
                  const top = h.tipo === "positivo" ? "#10B981" : h.tipo === "neutro" ? "#F59E0B" : T.accent;
                  return (
                    <div key={i} style={{ flex: 1, padding: "18px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, borderTop: `3px solid ${top}`, boxShadow: T.shadow, transition: "background .3s" }}>
                      <div style={{ fontSize: 10, color: T.textMuted, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
                        {h.titulo} <InfoTip texto={h.info} T={T} />
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 700, color: T.text, marginBottom: 6, letterSpacing: -0.5 }}>{h.valor}</div>
                      <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.5 }}>{h.etiqueta}</div>
                    </div>
                  );
                })}
              </div>

              <div className="mm3" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "22px 26px", marginBottom: 24, boxShadow: T.shadow, transition: "background .3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>Share en volumen — evolución mensual</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Porcentaje de unidades vendidas sobre el total de la categoría, mes a mes.</div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", flexShrink: 0 }}>
                    {[{ color: T.accent, label: "Líder A" }, { color: "#6366F1", label: "Marca Analizada" }].map((l, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.textSub }}>
                        <div style={{ width: 10, height: 3, borderRadius: 2, background: l.color }} />{l.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={evolucion}>
                    <defs>
                      <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.accent} stopOpacity={0.12}/><stop offset="95%" stopColor={T.accent} stopOpacity={0}/></linearGradient>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.14}/><stop offset="95%" stopColor="#6366F1" stopOpacity={0}/></linearGradient>
                    </defs>
                    <XAxis dataKey="mes" tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} width={36} />
                    <Tooltip content={props => <CTip {...props} T={T} />} />
                    <Area type="monotone" dataKey="lider"     stroke={T.accent} strokeWidth={1.5} fill="url(#gl)" name="Líder A"    dot={false} />
                    <Area type="monotone" dataKey="analizada" stroke="#6366F1"  strokeWidth={2}   fill="url(#ga)" name="Analizada"  dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* GRÁFICO SEMANAL */}
              <SemanalChart T={T} />

              <div className="mm4" style={{ display: "flex", gap: 8 }}>
                {LABELS.slice(1).map((l, i) => (
                  <button key={i} onClick={() => nav(i + 1)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "7px 13px", fontSize: 11, color: T.textSub, cursor: "pointer", transition: "all .18s", fontFamily: "Georgia" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}
                  >Ver {l} →</button>
                ))}
              </div>
            </div>
          )}

          {/* SHARE */}
          {sec === 1 && (
            <div key={`s${animKey}`}>
              <div className="mm1" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>Share en volumen · {CATEGORIA}</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>El mapa del mercado</h2>
                <p style={{ fontSize: 13, color: T.textSub, maxWidth: 440, lineHeight: 1.8 }}>Distribución del share total Paraguay. La Marca Analizada entró este período — el Líder A cedió 3.7pp en el año.</p>
              </div>

              <div className="mm2" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 14, boxShadow: T.shadow }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>
                    Share en volumen por empresa <InfoTip texto="Porcentaje de unidades vendidas de cada empresa sobre el total de la categoría. Se calcula mensualmente a partir del panel de auditoría de punto de venta." T={T} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>Año en curso vs. año anterior · Total Paraguay Minoristas</div>
                </div>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={shareData} layout="vertical" margin={{ left: 0, right: 52 }}>
                    <XAxis type="number" domain={[0, 75]} tick={{ fill: T.chartAxis, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="empresa" type="category" width={140} tick={{ fill: T.textSub, fontSize: 11, fontFamily: "Georgia" }} axisLine={false} tickLine={false} />
                    <Tooltip content={props => <CTip {...props} T={T} />} />
                    <Bar dataKey="share" radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: "right", fill: T.textMuted, fontSize: 11, formatter: v => `${v}%` }}>
                      {shareData.map((e, i) => <Cell key={i} fill={e.color} fillOpacity={0.8} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mm3" style={{ display: "flex", gap: 10 }}>
                {shareData.map((e, i) => {
                  const diff = e.share - e.anterior;
                  return (
                    <div key={i} style={{ flex: 1, padding: "13px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, boxShadow: T.shadow }}>
                      <div style={{ fontSize: 9, color: T.textMuted, marginBottom: 5, letterSpacing: 1, textTransform: "uppercase", fontFamily: "monospace" }}>{e.empresa.replace("MARCA ", "")}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: T.text }}>{e.share}%</div>
                      <div style={{ fontSize: 10, color: diff > 0 ? "#10B981" : diff < 0 ? "#EF4444" : T.textMuted, marginTop: 3 }}>
                        {diff > 0 ? "▲" : diff < 0 ? "▼" : "—"} {Math.abs(diff).toFixed(1)}pp vs año ant.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CANALES */}
          {sec === 2 && (
            <div key={`c${animKey}`}>
              <div className="mm1" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>Por canal · {CATEGORIA}</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>Dónde está cada marca</h2>
                <p style={{ fontSize: 13, color: T.textSub, maxWidth: 440, lineHeight: 1.8 }}>La Marca Analizada concentra su presencia en el canal moderno. En minoristas y el interior, el Líder A domina ampliamente.</p>
              </div>
              <div className="mm2" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {canales.map((c, i) => (
                  <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "18px 22px", boxShadow: T.shadow }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 12 }}>
                      {c.canal}
                      <span style={{ fontSize: 10, color: T.textMuted, fontWeight: 400, marginLeft: 8 }}>— share en volumen por empresa</span>
                    </div>
                    {[{ label: "Marca Analizada", val: c.analizada, color: "#6366F1" }, { label: "Líder A", val: c.lider, color: T.accent }].map((b, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: j === 0 ? 8 : 0 }}>
                        <div style={{ width: 116, fontSize: 11, color: T.textSub }}>{b.label}</div>
                        <div style={{ flex: 1, height: 6, background: T.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${b.val}%`, height: "100%", background: b.color, borderRadius: 3, opacity: 0.8 }} />
                        </div>
                        <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: T.text, textAlign: "right" }}>{b.val}%</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRECIOS */}
          {sec === 3 && (
            <div key={`p${animKey}`}>
              <div className="mm1" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>Precios · {CATEGORIA}</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>El posicionamiento en guaraníes</h2>
                <p style={{ fontSize: 13, color: T.textSub, maxWidth: 440, lineHeight: 1.8 }}>La Marca Analizada está 2.1x por encima del Líder A. Eso explica su concentración en cadenas y ausencia en minoristas.</p>
              </div>
              <div className="mm2" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 0, boxShadow: T.shadow, maxWidth: 520 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                  Precio promedio unitario por empresa <InfoTip texto="Precio promedio al que se vendió cada unidad, calculado como facturación total dividido unidades vendidas, según el informe de mercado del período." T={T} />
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 16 }}>En guaraníes · Período actual · Total Paraguay</div>
                {preciosReporte.map((p, i) => {
                  const pct = (p.precio / 39900) * 100;
                  const isA = p.marca === "MARCA ANALIZADA";
                  return (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: isA ? T.accent : T.textSub, fontWeight: isA ? 700 : 400 }}>{p.marca}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "monospace" }}>Gs {p.precio.toLocaleString("es-PY")}</span>
                      </div>
                      <div style={{ height: 6, background: T.surfaceAlt, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: isA ? T.accent : "#6366F1", borderRadius: 3, opacity: 0.7 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ONLINE & PUBLICIDAD */}
          {sec === 4 && (
            <div key={`o${animKey}`}>
              <div className="mm1" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>Online & Publicidad · {CATEGORIA}</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>Presencia digital en cadenas</h2>
                <p style={{ fontSize: 13, color: T.textSub, maxWidth: 480, lineHeight: 1.8 }}>Dos fuentes que el informe de mercado no incluye: el precio real en la góndola digital, y qué marcas están invirtiendo en visibilidad online.</p>
              </div>

              {/* Precios online */}
              <div className="mm2" style={{ marginBottom: 28 }}>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                      💻 Precios online vs. precio del informe de mercado
                      <InfoTip texto="Compara el precio que reporta el informe de mercado (promedio de ventas) con el precio observable hoy en la tienda online de cada cadena. Una diferencia importante puede indicar promociones, descuentos no capturados, o problemas de medición en la muestra." T={T} />
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Fuente: relevamiento web · Stock, Los Jardines, Superseis</div>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                        {["Cadena", "SKU", "Precio reporte", "Precio online", "Diferencia", "Estado"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preciosOnline.map((row, i) => {
                        const diff = row.disponible && row.precioOnline ? row.precioOnline - row.precioReporte : null;
                        const diffPct = diff ? ((diff / row.precioReporte) * 100).toFixed(1) : null;
                        const est = !row.disponible
                          ? { label: "Sin stock",   color: "#EF4444", bg: "#FEF2F2" }
                          : row.enOferta
                          ? { label: "En oferta",   color: "#F59E0B", bg: "#FFFBEB" }
                          : Math.abs(diff) < 500
                          ? { label: "Consistente", color: "#10B981", bg: "#F0FDF4" }
                          : { label: "Diferencia",  color: "#6366F1", bg: "#EEF2FF" };
                        return (
                          <tr key={i} style={{ borderBottom: i < preciosOnline.length - 1 ? `1px solid ${T.border}` : "none", background: i % 2 === 0 ? T.surface : T.surfaceAlt + "55" }}>
                            <td style={{ padding: "9px 14px", color: T.text, fontWeight: 500 }}>{row.cadena}</td>
                            <td style={{ padding: "9px 14px", color: T.textSub, fontSize: 10 }}>{row.sku}</td>
                            <td style={{ padding: "9px 14px", color: T.textSub, fontFamily: "monospace" }}>Gs {row.precioReporte.toLocaleString()}</td>
                            <td style={{ padding: "9px 14px", fontFamily: "monospace", color: row.disponible ? T.text : T.textMuted }}>
                              {row.disponible && row.precioOnline ? `Gs ${row.precioOnline.toLocaleString()}` : "—"}
                            </td>
                            <td style={{ padding: "9px 14px", fontFamily: "monospace", color: diff > 0 ? "#EF4444" : diff < 0 ? "#10B981" : T.textMuted, fontWeight: 600 }}>
                              {diffPct ? `${diff > 0 ? "+" : ""}${diffPct}%` : "—"}
                            </td>
                            <td style={{ padding: "9px 14px" }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: est.color, background: est.bg, border: `1px solid ${est.color}33`, borderRadius: 10, padding: "2px 8px" }}>{est.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Espacios publicitarios */}
              <div className="mm3">
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", boxShadow: T.shadow }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3, display: "flex", alignItems: "center", gap: 6 }}>
                      📢 Espacios publicitarios activos en cadenas
                      <InfoTip texto="Relevamiento de banners, listings patrocinados y promociones destacadas en las tiendas online de las cadenas. Indica qué marcas están invirtiendo en visibilidad digital en el mismo punto de venta donde compite la Marca Analizada." T={T} />
                    </div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>Inversión en visibilidad digital detectada al momento del relevamiento</div>
                  </div>
                  <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {espaciosPublicitarios.map((e, i) => (
                      <div key={i} style={{ background: T.surfaceAlt, border: `1px solid ${e.activo ? T.accent + "44" : T.border}`, borderRadius: 10, padding: "13px 15px", opacity: e.activo ? 1 : 0.55 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                          <span style={{ fontSize: 10, color: T.textMuted }}>{e.cadena}</span>
                          <span style={{ fontSize: 8, fontWeight: 700, color: e.activo ? "#10B981" : T.textMuted, background: e.activo ? "#F0FDF4" : T.surface, border: `1px solid ${e.activo ? "#10B98133" : T.border}`, borderRadius: 8, padding: "1px 6px" }}>{e.activo ? "● ACTIVO" : "○ INACTIVO"}</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, marginBottom: 3 }}>{e.marca}</div>
                        <div style={{ fontSize: 11, color: T.textSub, marginBottom: e.activo ? 8 : 0 }}>{e.tipo}</div>
                        {e.activo && (
                          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 9, color: T.accent, background: T.accentSoft, border: `1px solid ${T.accent}33`, borderRadius: 8, padding: "1px 7px" }}>{e.posicion}</span>
                            <span style={{ fontSize: 9, color: T.textMuted, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "1px 7px" }}>{e.semanas} sem.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMPETENCIA */}
          {sec === 5 && (
            <div key={`m${animKey}`}>
              <div className="mm1" style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, color: T.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12, fontFamily: "monospace" }}>Competencia · {CATEGORIA}</div>
                <h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, marginBottom: 6 }}>Lo que se movió este período</h2>
                <p style={{ fontSize: 13, color: T.textSub, maxWidth: 440, lineHeight: 1.8 }}>Tres señales que vale la pena tener en el radar.</p>
              </div>
              <div className="mm2" style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 540 }}>
                {movimientos.map((m, i) => (
                  <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: T.shadow }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: T.border, flexShrink: 0, fontFamily: "monospace" }}>{String(i + 1).padStart(2, "0")}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{m.marca}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: m.bc, background: m.bc + "18", border: `1px solid ${m.bc}33`, borderRadius: 10, padding: "2px 8px", fontFamily: "monospace" }}>{m.badge}</span>
                      </div>
                      <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.7, margin: 0 }}>{m.hecho}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <div style={{ padding: "8px 28px", borderTop: `1px solid ${T.border}`, background: T.surface, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, transition: "background .3s" }}>
        <span style={{ fontSize: 10, color: T.textMuted }}>MASMARKA · Retail Intelligence Paraguay · Confidencial</span>
        <span style={{ fontSize: 10, color: T.textMuted }}>⚠ Todos los datos son de prueba</span>
      </div>

      <ChatIA visible={chat} onClose={() => setChat(false)} T={T} />
    </div>
  );
}
