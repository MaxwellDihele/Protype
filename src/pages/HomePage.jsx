//Updated

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../data/seed";
import { Btn, Icon, SectionHeader, Spinner } from "../components/ui";
import { ProductCard, BrandCard } from "../components/cards";

export const HomePage = () => {
	console.log("HomePage loaded");
  const navigate = useNavigate();
  const [featuredBrands, setFeaturedBrands] = useState([]);
  const [popular,        setPopular]        = useState([]);
  const [latest,         setLatest]         = useState([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [{ data: featured }, { data: pop }, { data: lat }] = await Promise.all([
        supabase.from("brands").select("*").eq("status", "featured").limit(6),
        supabase.from("products").select("*, brands(*)").order("views", { ascending: false }).limit(4),
        supabase.from("products").select("*, brands(*)").order("created_at", { ascending: false }).limit(8),
      ]);
      setFeaturedBrands(featured || []);
      setPopular(pop || []);
      setLatest(lat || []);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{ background:"linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)", padding:"60px 16px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"var(--accent)", opacity:0.06, filter:"blur(80px)" }} />
        <div style={{ position:"absolute", bottom:-80, left:-40, width:250, height:250, borderRadius:"50%", background:"var(--accent2)", opacity:0.06, filter:"blur(80px)" }} />
        <div style={{ maxWidth:1200, margin:"0 auto", position:"relative" }}>
          <div style={{ fontSize:"0.8rem", color:"var(--accent)", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
            <Icon name="location_on" size={16} color="var(--accent)" />South Africa's Local Brand Marketplace
          </div>
          <h1 style={{ fontSize:"clamp(2.8rem, 8vw, 5.5rem)", color:"var(--text)", marginBottom:16, lineHeight:1 }}>
            DISCOVER<br /><span style={{ color:"var(--accent)" }}>MZANSI</span> BRANDS
          </h1>
          <p style={{ color:"var(--text2)", maxWidth:500, fontSize:"1rem", marginBottom:32, lineHeight:1.7 }}>
            Shop local. Support South African makers, designers, and entrepreneurs. Connect directly via WhatsApp.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Btn size="lg" onClick={() => navigate("/search")}><Icon name="explore" size={18} />Browse Products</Btn>
            <Btn size="lg" variant="secondary" onClick={() => navigate("/brands")}><Icon name="storefront" size={18} />View All Brands</Btn>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section style={{ borderBottom:"1px solid var(--border)", overflowX:"auto", background:"var(--bg2)" }}>
        <div style={{ display:"flex", maxWidth:1200, margin:"0 auto" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => navigate(`/search?category=${encodeURIComponent(cat)}`)}
              style={{ padding:"12px 20px", background:"none", border:"none", borderRight:"1px solid var(--border)", color:"var(--text2)", fontSize:"0.8rem", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", transition:"all 0.2s", flexShrink:0 }}
              onMouseEnter={e => { e.currentTarget.style.background="var(--bg3)"; e.currentTarget.style.color="var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="none"; e.currentTarget.style.color="var(--text2)"; }}
            >{cat}</button>
          ))}
        </div>
      </section>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"40px 16px" }}>
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:80 }}><Spinner /></div>
        ) : (
          <>
            {featuredBrands.length > 0 && (
              <section style={{ marginBottom:48 }}>
                <SectionHeader title="Featured Brands" sub="Premium verified sellers" action={{ label:"All Brands →", onClick:() => navigate("/brands") }} />
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
                  {featuredBrands.map(b => <BrandCard key={b.id} brand={b} />)}
                </div>
              </section>
            )}
            <section style={{ marginBottom:48 }}>
              <SectionHeader title="🔥 Trending Now" sub="Most viewed this week" action={{ label:"View All →", onClick:() => navigate("/search?sort=popular") }} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16 }}>
                {popular.map(p => <ProductCard key={p.id} product={{ ...p, brand: p.brand_id, brandData: p.brands }} />)}
              </div>
            </section>
            <section style={{ marginBottom:48 }}>
              <SectionHeader title="Latest Drops" sub="Freshest products" action={{ label:"View All →", onClick:() => navigate("/search?sort=newest") }} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16 }}>
                {latest.map(p => <ProductCard key={p.id} product={{ ...p, brand: p.brand_id, brandData: p.brands }} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};
