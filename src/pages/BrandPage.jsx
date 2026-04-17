import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Badge, Btn, Icon, EmptyState, Select, Spinner } from "../components/ui";
import { ProductCard } from "../components/cards";

const PAGE_SIZE = 12;

export const BrandPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand,    setBrand]    = useState(null);
  const [products, setProducts] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [sort,     setSort]     = useState("newest");
  const [loading,  setLoading]  = useState(true);
  const [prodLoad, setProdLoad] = useState(false);

  // Load brand once
  useEffect(() => {
    supabase.from("brands").select("*").eq("id", id).single()
      .then(({ data }) => { setBrand(data); setLoading(false); });
  }, [id]);

  const loadProducts = useCallback(async (pg) => {
    setProdLoad(true);
    let q = supabase.from("products").select("*, brands(*)", { count: "exact" }).eq("brand_id", id);
    if (sort === "newest")    q = q.order("created_at", { ascending: false });
    if (sort === "popular")   q = q.order("views",      { ascending: false });
    if (sort === "price_asc") q = q.order("price",      { ascending: true  });
    q = q.range(pg * PAGE_SIZE, (pg + 1) * PAGE_SIZE - 1);
    const { data, count } = await q;
    setProducts(prev => pg === 0 ? (data || []) : [...prev, ...(data || [])]);
    setTotal(count || 0);
    setPage(pg);
    setProdLoad(false);
  }, [id, sort]);

  useEffect(() => {
    setProducts([]); setPage(0);
    loadProducts(0);
  }, [sort, loadProducts]);

  if (loading) return <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner /></div>;
  if (!brand) return <EmptyState icon="storefront" title="Brand not found" sub="" action={<Btn onClick={() => navigate("/brands")}>View All Brands</Btn>} />;

  const wa = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(`Hi ${brand.name}! I found you on MzansiStreet and would like to know more about your products.`)}`;
  const hasMore = products.length < total;

  return (
    <>
      <style>{`
        .bp-banner{height:180px}
        .bp-identity{display:flex;flex-direction:column;align-items:flex-start;gap:12px;padding:16px;background:var(--card);border-bottom:1px solid var(--border)}
        .bp-logo{width:72px;height:72px;border-radius:14px;border:3px solid var(--card);background:var(--bg2);flex-shrink:0;margin-top:-36px;position:relative;z-index:2;box-shadow:0 4px 16px rgba(0,0,0,0.4)}
        .bp-name-row{display:flex;flex-direction:column;gap:6px;width:100%}
        .bp-name-badge{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
        .bp-cta-row{display:flex;gap:10px;flex-wrap:wrap;width:100%}
        .bp-cta-row a{flex:1;min-width:130px}
        .bp-cta-row a button,.bp-cta-row a>*{width:100%;justify-content:center}
        @media(min-width:640px){
          .bp-banner{height:240px}
          .bp-identity{flex-direction:row;align-items:flex-end;padding:0 24px 20px;background:transparent;border-bottom:none;margin-top:-56px;position:relative;z-index:2}
          .bp-logo{width:96px;height:96px;margin-top:0;border-radius:18px}
          .bp-name-row{flex:1;padding-bottom:4px}
          .bp-cta-row{width:auto;flex-wrap:nowrap}
          .bp-cta-row a{flex:none;min-width:auto}
          .bp-cta-row a button,.bp-cta-row a>*{width:auto}
        }
        @media(min-width:768px){.bp-banner{height:280px}}
        .bp-desktop-divider{display:none}
        @media(min-width:640px){.bp-desktop-divider{display:block}}
      `}</style>

      <div className="fade-in">
        <div className="bp-banner" style={{ position:"relative", overflow:"hidden", zIndex:0, background:"var(--bg3)" }}>
          <img src={brand.banner || `https://picsum.photos/seed/${brand.id}/800/200`} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.82) 100%)", zIndex:1 }} />
        </div>

        <div className="bp-identity">
          <img className="bp-logo" src={brand.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${brand.id}`} alt={brand.name} />
          <div className="bp-name-row">
            <div className="bp-name-badge">
              <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"clamp(1.6rem, 5vw, 2.4rem)", letterSpacing:"0.04em", lineHeight:1, color:"var(--text)", wordBreak:"break-word" }}>{brand.name}</h1>
              <Badge status={brand.status} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Icon name="category" size={13} color="var(--text3)" />
              <span style={{ color:"var(--text2)", fontSize:"0.85rem", fontWeight:500 }}>{brand.category}</span>
              <span style={{ color:"var(--border2)" }}>·</span>
              <span style={{ color:"var(--text3)", fontSize:"0.82rem" }}>{total} product{total!==1?"s":""}</span>
            </div>
          </div>
          <div className="bp-cta-row">
            {brand.whatsapp && (
              <a href={wa} target="_blank" rel="noopener noreferrer">
                <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 20px", borderRadius:12, background:"#25D366", border:"none", color:"#fff", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", width:"100%", WebkitTapHighlightColor:"transparent" }}>
                  <Icon name="chat" size={18} color="#fff" /> WhatsApp
                </button>
              </a>
            )}
            {brand.website && (
              <a href={brand.website} target="_blank" rel="noopener noreferrer">
                <button style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 20px", borderRadius:12, background:"var(--bg3)", border:"1px solid var(--border2)", color:"var(--text)", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", width:"100%", WebkitTapHighlightColor:"transparent" }}>
                  <Icon name="language" size={18} /> Website
                </button>
              </a>
            )}
          </div>
        </div>

        <div className="bp-desktop-divider" style={{ borderBottom:"1px solid var(--border)" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 16px" }}>
          <div style={{ background:"var(--bg2)", borderRadius:"var(--radius)", padding:"18px 20px", margin:"20px 0 28px", border:"1px solid var(--border)" }}>
            <p style={{ color:"var(--text2)", lineHeight:1.75, fontSize:"0.95rem", marginBottom:(brand.instagram||brand.twitter)?14:0 }}>{brand.description}</p>
            {(brand.instagram || brand.twitter) && (
              <div style={{ display:"flex", gap:16, flexWrap:"wrap", paddingTop:12, borderTop:"1px solid var(--border)" }}>
                {brand.instagram && <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noopener noreferrer" style={{ color:"var(--text2)", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:6, textDecoration:"none" }}><Icon name="photo_camera" size={15} color="var(--text3)" />@{brand.instagram}</a>}
                {brand.twitter   && <a href={`https://twitter.com/${brand.twitter}`}     target="_blank" rel="noopener noreferrer" style={{ color:"var(--text2)", fontSize:"0.85rem", display:"flex", alignItems:"center", gap:6, textDecoration:"none" }}><Icon name="alternate_email" size={15} color="var(--text3)" />@{brand.twitter}</a>}
              </div>
            )}
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, gap:12, flexWrap:"wrap" }}>
            <h2 style={{ fontSize:"clamp(1.4rem, 4vw, 1.8rem)" }}>Products ({total})</h2>
            <Select value={sort} onChange={v => { setSort(v); }} options={[{value:"newest",label:"Newest"},{value:"popular",label:"Most Popular"},{value:"price_asc",label:"Price: Low → High"}]} />
          </div>

          {products.length === 0 && !prodLoad
            ? <EmptyState icon="inventory_2" title="No products yet" sub="This brand hasn't listed any products" />
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:14, marginBottom:24 }}>
                {products.map(p => <ProductCard key={p.id} product={{ ...p, brand: p.brand_id, brandData: p.brands }} />)}
              </div>
          }

          {prodLoad && <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>}
          {hasMore && !prodLoad && (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:48 }}>
              <Btn variant="secondary" onClick={() => loadProducts(page + 1)}>
                <Icon name="expand_more" size={18} />Load More
              </Btn>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
