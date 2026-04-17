import { Link } from "react-router-dom";
import { Icon, Badge } from "../ui";

// ─── ProductCard ──────────────────────────────────────────────────────────────
export function ProductCard({ product }) {
  const brand  = product.brands || product.brand_obj || null;
  const images = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);
  const thumb  = images[0] || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`;

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration:"none", display:"block" }}>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden", display:"flex", flexDirection:"column", transition:"transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}>

        {/* Image */}
        <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden", background:"var(--bg2)" }}>
          <img src={thumb} alt={product.name}
            style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
            onMouseEnter={e => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.target.style.transform = "scale(1)")}
            onError={e => (e.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`)}
          />
          <div style={{ position:"absolute", top:8, right:8 }}>
            <Badge status={product.stock} />
          </div>
          {(brand?.status === "featured" || product.brand_status === "featured") && (
            <div style={{ position:"absolute", top:8, left:8, background:"var(--gold)", color:"#000", fontSize:"0.65rem", fontWeight:700, padding:"2px 7px", borderRadius:6 }}>FEATURED</div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding:"12px 14px 14px", flex:1, display:"flex", flexDirection:"column", gap:6 }}>
          {brand && (
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <img src={brand.logo} alt={brand.name} style={{ width:18, height:18, borderRadius:"50%", flexShrink:0 }}
                onError={e => (e.target.style.display = "none")} />
              <span style={{ fontSize:"0.72rem", color:"var(--text2)", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{brand.name}</span>
              <Badge status={brand.status} />
            </div>
          )}
          <div style={{ fontWeight:600, fontSize:"0.95rem", lineHeight:1.3, color:"var(--text)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {product.name}
          </div>
          <div style={{ marginTop:"auto", paddingTop:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", color:"var(--accent)", letterSpacing:"0.05em" }}>
              R {Number(product.price).toLocaleString()}
            </span>
            <span style={{ fontSize:"0.72rem", color:"var(--text3)", display:"flex", alignItems:"center", gap:3 }}>
              <Icon name="visibility" size={13} color="var(--text3)" />{product.views || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── BrandCard ────────────────────────────────────────────────────────────────
export function BrandCard({ brand }) {
  return (
    <Link to={`/brand/${brand.id}`} style={{ textDecoration:"none", display:"block" }}>
      <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden", transition:"transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow="none"; }}>

        {/* Banner */}
        <div style={{ height:80, overflow:"hidden", position:"relative", background:"var(--bg3)" }}>
          <img src={brand.banner} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}
            onError={e => (e.target.style.display = "none")} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }} />
        </div>

        {/* Body */}
        <div style={{ padding:"0 16px 16px", position:"relative" }}>
          {/* Logo overlapping banner */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginTop:-24, marginBottom:10 }}>
            <img src={brand.logo} alt={brand.name}
              style={{ width:48, height:48, borderRadius:12, border:"2px solid var(--card)", flexShrink:0, background:"var(--bg2)" }}
              onError={e => (e.target.style.display = "none")} />
            <div style={{ paddingBottom:2 }}>
              <div style={{ fontWeight:700, fontSize:"0.95rem", color:"var(--text)" }}>{brand.name}</div>
              <Badge status={brand.status} />
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize:"0.8rem", color:"var(--text2)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", lineHeight:1.5, marginBottom:10 }}>
            {brand.description}
          </p>

          {/* Meta row: category + location */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", color:"var(--text3)", fontWeight:500 }}>
              <Icon name="category" size={13} color="var(--text3)" />
              {brand.category}
            </span>
            {brand.location && (
              <>
                <span style={{ color:"var(--border2)", fontSize:"0.75rem" }}>·</span>
                <span style={{ display:"flex", alignItems:"center", gap:4, fontSize:"0.75rem", color:"var(--text3)", fontWeight:500 }}>
                  <Icon name="location_on" size={13} color="var(--text3)" />
                  {brand.location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
