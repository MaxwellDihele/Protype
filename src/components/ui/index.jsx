import { useState } from "react";

// ─── Icon ─────────────────────────────────────────────────────────────────────
export const Icon = ({ name, size = 20, color, style: sx = {} }) => (
  <span
    className="material-icons-round"
    style={{
      fontSize: size, color: color || "inherit", lineHeight: 1,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, userSelect: "none", ...sx,
    }}
  >
    {name}
  </span>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ status }) => {
  const map = {
    featured:     { label: "Featured",     icon: "star",         bg: "#f5b800",       color: "#000" },
    verified:     { label: "Verified",     icon: "verified",     bg: "#00d4aa",       color: "#000" },
    unverified:   { label: "Unverified",   icon: "pending",      bg: "var(--bg3)",    color: "var(--text2)" },
    in_stock:     { label: "In Stock",     icon: "check_circle", bg: "#22c55e22",     color: "#22c55e" },
    out_of_stock: { label: "Out of Stock", icon: "cancel",       bg: "#ff336622",     color: "#ff3366" },
  };
  const s = map[status] || map.unverified;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 8px", borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: "0.7rem", fontWeight: 600,
      whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif",
    }}>
      <Icon name={s.icon} size={12} color={s.color} />{s.label}
    </span>
  );
};

// ─── Btn ──────────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = "primary", size = "md", style: sx = {}, disabled, full, type = "button" }) => {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontFamily: "'Outfit', sans-serif", fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, transition: "all 0.2s",
    border: "none", whiteSpace: "nowrap",
    width: full ? "100%" : "auto",
  };
  const sizes = {
    sm: { padding: "6px 14px",  fontSize: "0.8rem",  borderRadius: 8  },
    md: { padding: "10px 20px", fontSize: "0.9rem",  borderRadius: 10 },
    lg: { padding: "14px 28px", fontSize: "1rem",    borderRadius: 12 },
  };
  const variants = {
    primary:   { background: "var(--accent)",  color: "#fff" },
    secondary: { background: "var(--bg3)",     color: "var(--text)",  border: "1px solid var(--border2)" },
    ghost:     { background: "transparent",    color: "var(--text2)", border: "1px solid var(--border)" },
    danger:    { background: "#ff336622",      color: "#ff3366",      border: "1px solid #ff336633" },
    whatsapp:  { background: "#25D366",        color: "#fff" },
    gold:      { background: "var(--gold)",    color: "#000" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant], ...sx }}
    >
      {children}
    </button>
  );
};

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ label, value, onChange, type = "text", placeholder, required, style: sx = {} }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}{required && " *"}
      </label>
    )}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      style={{
        background: "var(--bg3)", border: "1px solid var(--border2)",
        borderRadius: 10, padding: "10px 14px",
        color: "var(--text)", fontSize: "0.95rem",
        outline: "none", transition: "border-color 0.2s", width: "100%", ...sx,
      }}
      onFocus={e => e.target.style.borderColor = "var(--accent)"}
      onBlur={e  => e.target.style.borderColor = "var(--border2)"}
    />
  </div>
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, value, onChange, placeholder, rows = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
    )}
    <textarea
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{
        background: "var(--bg3)", border: "1px solid var(--border2)",
        borderRadius: 10, padding: "10px 14px",
        color: "var(--text)", fontSize: "0.95rem",
        outline: "none", resize: "vertical", width: "100%",
      }}
      onFocus={e => e.target.style.borderColor = "var(--accent)"}
      onBlur={e  => e.target.style.borderColor = "var(--border2)"}
    />
  </div>
);

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && (
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </label>
    )}
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{
        background: "var(--bg3)", border: "1px solid var(--border2)",
        borderRadius: 10, padding: "10px 14px",
        color: "var(--text)", fontSize: "0.95rem",
        outline: "none", width: "100%", cursor: "pointer",
      }}
    >
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
      ))}
    </select>
  </div>
);

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, style: sx = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius)", overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: onClick ? "pointer" : "default", ...sx,
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "none"; }}}
  >
    {children}
  </div>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
export const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, animation: "slideDown 0.3s ease",
      background: toast.type === "error" ? "#ff3366" : "#22c55e",
      color: "#fff", padding: "12px 24px", borderRadius: 12,
      fontWeight: 600, fontSize: "0.9rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
    }}>
      {toast.msg}
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <div style={{
    width: 32, height: 32,
    border: "3px solid var(--border)",
    borderTopColor: "var(--accent)",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }} />
);

// ─── EmptyState ───────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, sub, action }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: "50%", background: "var(--bg3)" }}>
      <Icon name={icon} size={36} color="var(--text3)" />
    </div>
    <h3 style={{ color: "var(--text)", fontSize: "1.2rem" }}>{title}</h3>
    <p style={{ color: "var(--text2)", fontSize: "0.9rem", maxWidth: 300 }}>{sub}</p>
    {action}
  </div>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ title, sub, action }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
    <div>
      <h2 style={{ fontSize: "1.8rem", color: "var(--text)" }}>{title}</h2>
      {sub && <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginTop: 2 }}>{sub}</p>}
    </div>
    {action && (
      <button onClick={action.onClick} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", padding: "4px 0" }}>
        {action.label}
      </button>
    )}
  </div>
);
