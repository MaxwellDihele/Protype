import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Badge, Icon } from "../ui";

// products fetched with a join include a `brands` key — normalise it here
const resolveBrand = (product) => product.brandData || product.brands || null;

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const brand = resolveBrand(product);
  const [imgErr, setImgErr] = useState(false);
  const images = Array.isArray(product.images) ? product.images : [product.images].filter(Boolean);
  const src = imgErr ? `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}` : (images[0] || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`);

  return (
    <Card onClick={() => navigate(`/product/${product.id}`)} style={{ display:"flex", flexDirection:"column" }}>
      <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden", background:"var(--bg2)" }}>
        <img src={src} alt={product.name} onError={() => setImgErr(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
          onMouseEnter={e => e.target.style.transform="scale(1.05)"}
          onMouseLeave={e => e.target.style.transform="scale(1)"}
        />
        <div style={{ position:"absolute", top:8, right:8 }}><Badge status={product.stock} /></div>
        {brand?.status === "featured" && (
          <div style={{ position:"absolute", top:8, left:8, background:"var(--gold)", color:"#000", fontSize:"0.65rem", fontWeight:700, padding:"2px 7px", borderRadius:6 }}>FEATURED</div>
        )}
      </div>
      <div style={{ padding:"12px 14px 14px", flex:1, display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {brand && (
            <img src={brand.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${brand.id}`} alt={brand.name}
              style={{ width:18, height:18, borderRadius:"50%", flexShrink:0 }} onError={e => e.target.style.display="none"} />
          )}
          <span style={{ fontSize:"0.72rem", color:"var(--text2)", fontWeight:500, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{brand?.name}</span>
          {brand && <Badge status={brand.status} />}
        </div>
        <div style={{ fontWeight:600, fontSize:"0.95rem", lineHeight:1.3, color:"var(--text)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.name}</div>
        <div style={{ marginTop:"auto", paddingTop:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"1.3rem", color:"var(--accent)", letterSpacing:"0.05em" }}>R {Number(product.price).toLocaleString()}</span>
          <span style={{ fontSize:"0.72rem", color:"var(--text3)", display:"flex", alignItems:"center", gap:3 }}><Icon name="visibility" size={13} color="var(--text3)" />{product.views||0}</span>
        </div>
      </div>
    </Card>
  );
};

export const BrandCard = ({ brand }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/brand/${brand.id}`)} style={{ overflow:"hidden" }}>
      <div style={{ height:80, overflow:"hidden", position:"relative" }}>
        <img src={brand.banner || `https://picsum.photos/seed/${brand.id}/800/200`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))" }} />
      </div>
      <div style={{ padding:"0 16px 16px", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:12, marginTop:-24, marginBottom:10 }}>
          <img src={brand.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${brand.id}`} alt={brand.name}
            style={{ width:48, height:48, borderRadius:12, border:"2px solid var(--card)", flexShrink:0 }} />
          <div style={{ paddingBottom:2 }}>
            <div style={{ fontWeight:700, fontSize:"0.95rem" }}>{brand.name}</div>
            <Badge status={brand.status} />
          </div>
        </div>
        <p style={{ fontSize:"0.8rem", color:"var(--text2)", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", lineHeight:1.5 }}>{brand.description}</p>
        <div style={{ marginTop:10, fontSize:"0.75rem", color:"var(--text3)", fontWeight:500 }}>{brand.category}</div>
      </div>
    </Card>
  );
};
