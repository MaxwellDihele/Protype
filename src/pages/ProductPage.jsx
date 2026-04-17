import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";
import { Badge, Btn, Icon, EmptyState, SectionHeader, Spinner } from "../components/ui";
import { ProductCard } from "../components/cards";

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incrementViews } = useApp();
  const [product,  setProduct]  = useState(null);
  const [brand,    setBrand]    = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIdx,   setImgIdx]   = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: prod } = await supabase
        .from("products")
        .select("*, brands(*)")
        .eq("id", id)
        .single();
      if (!prod) { setLoading(false); return; }

      setProduct(prod);
      setBrand(prod.brands);

      // increment views (fire-and-forget)
      incrementViews(id);

      // related products
      const { data: rel } = await supabase
        .from("products")
        .select("*, brands(*)")
        .eq("category", prod.category)
        .neq("id", id)
        .limit(4);
      setRelated(rel || []);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner /></div>;
  if (!product) return <EmptyState icon="inventory_2" title="Product not found" sub="" action={<Btn onClick={() => navigate("/")}>Go Home</Btn>} />;

  const images = Array.isArray(product.images) ? product.images : [product.images].filter(Boolean);
  const wa     = `https://wa.me/${brand?.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in "${product.name}" (R${product.price}) from your MzansiStreet listing. Is it available?`)}`;
  const hasCTA = brand?.whatsapp || brand?.website;

  return (
    <>
      <style>{`
        .product-layout{display:flex;flex-direction:column;gap:0}
        .product-gallery-col{width:100%}
        .product-detail-col{width:100%;padding:20px 16px 0}
        .product-meta-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
        .product-cta-desktop{display:none}
        .product-cta-mobile{position:fixed;bottom:0;left:0;right:0;z-index:90;background:var(--bg);border-top:1px solid var(--border);padding:12px 16px calc(12px + env(safe-area-inset-bottom));display:flex;gap:10px}
        .product-thumb{width:56px;height:56px}
        @media(min-width:768px){
          .product-layout{flex-direction:row;align-items:flex-start;gap:40px;padding:32px 16px}
          .product-gallery-col{width:46%;flex-shrink:0;position:sticky;top:80px}
          .product-detail-col{flex:1;padding:0}
          .product-cta-desktop{display:flex!important}
          .product-cta-mobile{display:none!important}
          .product-thumb{width:72px;height:72px}
        }
      `}</style>

      <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", padding:"14px 16px", fontSize:"0.8rem", color:"var(--text2)", borderBottom:"1px solid var(--border)" }}>
          <span onClick={() => navigate("/")} style={{ cursor:"pointer", color:"var(--accent)", display:"flex", alignItems:"center", gap:4 }}><Icon name="home" size={14} color="var(--accent)" />Home</span>
          <Icon name="chevron_right" size={14} color="var(--text3)" />
          <span onClick={() => navigate(`/search?category=${encodeURIComponent(product.category)}`)} style={{ cursor:"pointer", color:"var(--accent)" }}>{product.category}</span>
          <Icon name="chevron_right" size={14} color="var(--text3)" />
          <span style={{ color:"var(--text2)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"40vw" }}>{product.name}</span>
        </div>

        <div className="product-layout">
          {/* Gallery */}
          <div className="product-gallery-col">
            <div style={{ aspectRatio:"1/1", overflow:"hidden", background:"var(--bg2)" }}>
              <img src={images[imgIdx] || `https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            </div>
            {images.length > 1 && (
              <div style={{ display:"flex", gap:8, padding:"10px 16px", overflowX:"auto", background:"var(--bg2)", borderBottom:"1px solid var(--border)" }}>
                {images.map((img,i) => (
                  <div key={i} onClick={() => setImgIdx(i)} className="product-thumb"
                    style={{ borderRadius:8, overflow:"hidden", flexShrink:0, cursor:"pointer", border:`2px solid ${imgIdx===i?"var(--accent)":"var(--border)"}`, opacity:imgIdx===i?1:0.6, transition:"border-color 0.2s, opacity 0.2s" }}>
                    <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="product-detail-col">
            {brand && (
              <div onClick={() => navigate(`/brand/${brand.id}`)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"pointer", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                <img src={brand.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${brand.id}`} alt={brand.name} style={{ width:36, height:36, borderRadius:8, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:"0.9rem", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{brand.name}</div>
                  <div style={{ fontSize:"0.72rem", color:"var(--text3)" }}>View brand profile →</div>
                </div>
                <Badge status={brand.status} />
              </div>
            )}

            <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(2rem, 6vw, 3rem)", lineHeight:1.05, letterSpacing:"0.03em", color:"var(--text)", marginBottom:12, wordBreak:"break-word" }}>{product.name}</h1>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, flexWrap:"wrap" }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:"2.4rem", color:"var(--accent)", letterSpacing:"0.04em", lineHeight:1 }}>R {Number(product.price).toLocaleString()}</span>
              <Badge status={product.stock} />
            </div>

            <div style={{ background:"var(--bg2)", borderRadius:12, padding:"14px 16px", marginBottom:18, border:"1px solid var(--border)" }}>
              <div style={{ fontSize:"0.72rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:8 }}>Description</div>
              <p style={{ color:"var(--text)", lineHeight:1.75, fontSize:"0.95rem", margin:0 }}>{product.description}</p>
            </div>

            <div className="product-meta-grid" style={{ marginBottom:24 }}>
              {[["category","Category",product.category],["event_note","Listed",product.created_at?.split("T")[0]],["visibility","Views",(product.views||0).toLocaleString()]].map(([icon,k,v]) => (
                <div key={k} style={{ background:"var(--bg3)", padding:"12px 14px", borderRadius:10, border:"1px solid var(--border)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
                    <Icon name={icon} size={13} color="var(--text3)" />
                    <span style={{ fontSize:"0.68rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.1em" }}>{k}</span>
                  </div>
                  <div style={{ color:"var(--text)", fontWeight:600, fontSize:"0.88rem", wordBreak:"break-word" }}>{v}</div>
                </div>
              ))}
            </div>

            <div className="product-cta-desktop" style={{ flexDirection:"column", gap:10 }}>
              {brand?.whatsapp && <a href={wa} target="_blank" rel="noopener noreferrer" style={{ display:"block" }}><Btn variant="whatsapp" size="lg" full><Icon name="chat" size={18} color="#fff" /> Chat on WhatsApp</Btn></a>}
              {brand?.website  && <a href={brand.website} target="_blank" rel="noopener noreferrer" style={{ display:"block" }}><Btn variant="secondary" size="lg" full><Icon name="language" size={18} /> Visit Website</Btn></a>}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ padding:"32px 16px", borderTop:"1px solid var(--border)" }}>
            <SectionHeader title="More in This Category" sub="" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:14 }}>
              {related.map(p => <ProductCard key={p.id} product={{ ...p, brand: p.brand_id, brandData: p.brands }} />)}
            </div>
          </section>
        )}

        {hasCTA && <div className="product-cta-mobile" style={{ position:"static", visibility:"hidden", pointerEvents:"none", background:"none", border:"none" }} />}
      </div>

      {hasCTA && (
        <div className="product-cta-mobile">
          {brand?.whatsapp && (
            <a href={wa} target="_blank" rel="noopener noreferrer" style={{ flex:1 }}>
              <button style={{ width:"100%", padding:"15px 10px", background:"#25D366", border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, WebkitTapHighlightColor:"transparent" }}>
                <Icon name="chat" size={20} color="#fff" />WhatsApp
              </button>
            </a>
          )}
          {brand?.website && (
            <a href={brand.website} target="_blank" rel="noopener noreferrer" style={{ flex:brand?.whatsapp?"0 0 auto":1 }}>
              <button style={{ width:"100%", padding:"15px 16px", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:14, color:"var(--text)", fontWeight:700, fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, whiteSpace:"nowrap", WebkitTapHighlightColor:"transparent" }}>
                <Icon name="language" size={20} />Website
              </button>
            </a>
          )}
        </div>
      )}
    </>
  );
};
