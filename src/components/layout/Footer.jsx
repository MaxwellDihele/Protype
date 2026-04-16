import { useNavigate } from "react-router-dom";
import { Icon } from "../ui";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer style={{ background:"var(--bg2)", borderTop:"1px solid var(--border)", padding:"40px 16px 24px", marginTop:48 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:32, marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:"1.8rem", letterSpacing:"0.06em", color:"var(--accent)", marginBottom:8 }}>MzansiStreet</div>
            <p style={{ color:"var(--text2)", fontSize:"0.85rem", lineHeight:1.7 }}>South Africa's local brand discovery platform. Shop local, support Mzansi.</p>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text2)", marginBottom:12 }}>Discover</div>
            {[["Home","/"],["Brands","/brands"],["Categories","/categories"],["Search","/search"]].map(([l,p]) => (
              <div key={p} onClick={() => navigate(p)} style={{ cursor:"pointer", color:"var(--text2)", fontSize:"0.85rem", marginBottom:8 }}
                onMouseEnter={e => e.target.style.color="var(--accent)"}
                onMouseLeave={e => e.target.style.color="var(--text2)"}
              >{l}</div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:"0.85rem", textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text2)", marginBottom:12 }}>Sellers</div>
            {[["Seller Login","/login"],["Dashboard","/dashboard"]].map(([l,p]) => (
              <div key={p} onClick={() => navigate(p)} style={{ cursor:"pointer", color:"var(--text2)", fontSize:"0.85rem", marginBottom:8 }}
                onMouseEnter={e => e.target.style.color="var(--accent)"}
                onMouseLeave={e => e.target.style.color="var(--text2)"}
              >{l}</div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid var(--border)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <span style={{ color:"var(--text3)", fontSize:"0.8rem", display:"flex", alignItems:"center", gap:6 }}>
            © 2025 MzansiStreet.mobi • Built with <Icon name="favorite" size={14} color="#ff3366" /> for South Africa
          </span>
          <span style={{ color:"var(--text3)", fontSize:"0.75rem", fontFamily:"'JetBrains Mono'" }}>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
