import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/seed";
import { Icon, Btn, Card, EmptyState, Input } from "../components/ui";
import { BrandCard } from "../components/cards";

// ─── BrandsPage ───────────────────────────────────────────────────────────────
export const BrandsPage = () => {
  const { brands } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [query,  setQuery]  = useState("");

  const filtered = useMemo(() => {
    let res = [...brands];
    if (filter === "featured") res = res.filter(b => b.status === "featured");
    if (filter === "verified") res = res.filter(b => b.status === "verified" || b.status === "featured");
    if (query) res = res.filter(b => b.name.toLowerCase().includes(query.toLowerCase()));
    return res;
  }, [brands, filter, query]);

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.5rem", marginBottom:8 }}>All Brands</h1>
      <p style={{ color:"var(--text2)", marginBottom:24 }}>Discover South African local brands</p>
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 220px" }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search brands..."
            style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"10px 16px 10px 40px", color:"var(--text)", fontSize:"0.9rem", outline:"none" }} />
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", display:"flex" }}><Icon name="search" size={18} color="var(--text3)" /></span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[["all","All"],["featured","Featured"],["verified","Verified"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding:"8px 16px", borderRadius:10, border:`1px solid ${filter===v?"var(--accent)":"var(--border)"}`, background:filter===v?"var(--accent)":"var(--bg3)", color:filter===v?"#fff":"var(--text2)", fontWeight:600, fontSize:"0.85rem", cursor:"pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      {filtered.length === 0
        ? <EmptyState icon="storefront" title="No brands found" sub="Try different filters" />
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16 }}>{filtered.map(b => <BrandCard key={b.id} brand={b} />)}</div>
      }
    </div>
  );
};

// ─── CategoriesPage ───────────────────────────────────────────────────────────
const CAT_ICONS  = { Fashion:"checkroom", Sneakers:"directions_walk", Streetwear:"style", Accessories:"watch", Beauty:"face_retouching_natural", "Food & Drink":"restaurant", Tech:"devices", "Home Decor":"chair", Art:"palette", Music:"library_music" };
const CAT_COLORS = { Fashion:"#f43f5e", Sneakers:"#f97316", Streetwear:"#8b5cf6", Accessories:"#f5b800", Beauty:"#ec4899", "Food & Drink":"#22c55e", Tech:"#3b82f6", "Home Decor":"#14b8a6", Art:"#a855f7", Music:"#06b6d4" };

export const CategoriesPage = () => {
  const { products } = useApp();
  const navigate = useNavigate();
  const cats = CATEGORIES.map(c => ({ name:c, count:products.filter(p => p.category===c).length }));

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.5rem", marginBottom:8 }}>Categories</h1>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>Browse by product category</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:16 }}>
        {cats.map(c => {
          const color = CAT_COLORS[c.name] || "var(--accent)";
          return (
            <Card key={c.name} onClick={() => navigate(`/search?category=${encodeURIComponent(c.name)}`)} style={{ padding:28, textAlign:"center" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:60, height:60, borderRadius:16, background:`${color}18`, margin:"0 auto 14px", border:`1.5px solid ${color}33` }}>
                <Icon name={CAT_ICONS[c.name]||"category"} size={30} color={color} />
              </div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{c.name}</div>
              <div style={{ fontSize:"0.8rem", color:"var(--text2)" }}>{c.count} product{c.count!==1?"s":""}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ─── LoginPage ────────────────────────────────────────────────────────────────
export const LoginPage = () => {
  //const { login, showToast } = useApp();
  const { supabase, showToast } = useApp();
  
  const navigate = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  /*const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const ok = login(email, password);
    setLoading(false);
    if (ok) { showToast("Logged in!"); navigate("/"); }
    else showToast("Invalid credentials", "error");
  }; */
  
  const handleSubmit = async () => {
    if (!email || !password) return;
  
    setLoading(true);
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
  
    setLoading(false);
  
    if (error) {
      showToast("Invalid credentials", "error");
      return;
    }
  
    showToast("Logged in!");
    navigate("/");
  };

  return (
    <div className="fade-in" style={{ minHeight:"calc(100vh - 120px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ background:"var(--card)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden", padding:32 }}>
          <h2 style={{ fontSize:"2rem", marginBottom:4 }}>Sign In</h2>
          <p style={{ color:"var(--text2)", fontSize:"0.9rem", marginBottom:28 }}>Access your seller dashboard</p>
          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
            <Input label="Email"    value={email}    onChange={setEmail}    type="email"    placeholder="you@brand.co.za" />
            <Input label="Password" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
          </div>
          <Btn variant="primary" size="lg" full onClick={handleSubmit} disabled={loading}>{loading?"Signing in...":"Sign In"}</Btn>
          <div style={{ marginTop:20, padding:16, background:"var(--bg2)", borderRadius:10, fontSize:"0.8rem", color:"var(--text2)" }}>
            <div style={{ fontWeight:700, marginBottom:8, color:"var(--text3)", display:"flex", alignItems:"center", gap:6 }}><Icon name="info" size={14} color="var(--text3)" />Demo Accounts</div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}><Icon name="admin_panel_settings" size={14} color="var(--text3)" /> Admin: admin@mzansistreet.mobi / admin123</div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><Icon name="storefront" size={14} color="var(--text3)" /> Seller: seller@skhokho.co.za / pass123</div>
          </div>
        </div>
      </div>
    </div>
  );
};
