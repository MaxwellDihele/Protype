import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/seed";
import { Icon, Btn, Card, EmptyState, Input, Spinner } from "../components/ui";
import { BrandCard } from "../components/cards";

const PAGE_SIZE = 12;

// ─── BrandsPage ───────────────────────────────────────────────────────────────
export const BrandsPage = () => {
  const navigate = useNavigate();
  const [filter,  setFilter]  = useState("all");
  const [query,   setQuery]   = useState("");
  const [brands,  setBrands]  = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (pg) => {
    setLoading(true);
    let q = supabase.from("brands").select("*", { count:"exact" });
    if (filter === "featured") q = q.eq("status","featured");
    if (filter === "verified") q = q.in("status",["verified","featured"]);
    if (query) q = q.ilike("name", `%${query}%`);
    q = q.order("created_at",{ascending:false}).range(pg*PAGE_SIZE,(pg+1)*PAGE_SIZE-1);
    const { data, count } = await q;
    setBrands(prev => pg===0?(data||[]):[...prev,...(data||[])]);
    setTotal(count||0); setPage(pg); setLoading(false);
  }, [filter, query]);

  useEffect(() => { setBrands([]); setPage(0); load(0); }, [load]);

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.5rem", marginBottom:8 }}>All Brands</h1>
      <p style={{ color:"var(--text2)", marginBottom:24 }}>Discover South African local brands</p>
      <div style={{ display:"flex", gap:12, marginBottom:24, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:"1 1 220px" }}>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search brands..."
            style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"10px 16px 10px 40px", color:"var(--text)", fontSize:"0.9rem", outline:"none" }} />
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", display:"flex" }}>
            <Icon name="search" size={18} color="var(--text3)" />
          </span>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {[["all","All"],["featured","Featured"],["verified","Verified"]].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              style={{ padding:"8px 16px", borderRadius:10, border:`1px solid ${filter===v?"var(--accent)":"var(--border)"}`, background:filter===v?"var(--accent)":"var(--bg3)", color:filter===v?"#fff":"var(--text2)", fontWeight:600, fontSize:"0.85rem", cursor:"pointer" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {brands.length===0&&!loading
        ? <EmptyState icon="storefront" title="No brands found" sub="Try different filters" />
        : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:16, marginBottom:24 }}>
            {brands.map(b=><BrandCard key={b.id} brand={b} />)}
          </div>
      }
      {loading && <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>}
      {brands.length<total&&!loading && (
        <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
          <Btn variant="secondary" onClick={() => load(page+1)}>
            <Icon name="expand_more" size={18} />Load More Brands
          </Btn>
        </div>
      )}
    </div>
  );
};

// ─── CategoriesPage ───────────────────────────────────────────────────────────
const CAT_ICONS  = { Fashion:"checkroom", Sneakers:"directions_walk", Streetwear:"style", Accessories:"watch", Beauty:"face_retouching_natural", "Food & Drink":"restaurant", Tech:"devices", "Home Decor":"chair", Art:"palette", Music:"library_music" };
const CAT_COLORS = { Fashion:"#f43f5e", Sneakers:"#f97316", Streetwear:"#8b5cf6", Accessories:"#f5b800", Beauty:"#ec4899", "Food & Drink":"#22c55e", Tech:"#3b82f6", "Home Decor":"#14b8a6", Art:"#a855f7", Music:"#06b6d4" };

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState(CATEGORIES.map(c=>({name:c,count:0})));

  useEffect(() => {
    supabase.from("products").select("category").then(({data}) => {
      if (!data) return;
      const counts = {};
      data.forEach(r => { counts[r.category]=(counts[r.category]||0)+1; });
      setCats(CATEGORIES.map(c=>({name:c,count:counts[c]||0})));
    });
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.5rem", marginBottom:8 }}>Categories</h1>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>Browse by product category</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:16 }}>
        {cats.map(c => {
          const color = CAT_COLORS[c.name]||"var(--accent)";
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

// ─── LoginPage (Sign In + Sign Up) ────────────────────────────────────────────
export const LoginPage = () => {
  const { login, signUp, showToast } = useApp();
  const navigate = useNavigate();
  const [tab,       setTab]       = useState("login");
  const [loading,   setLoading]   = useState(false);
  // Login fields
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  // Sign-up extra fields
  const [name,      setName]      = useState("");
  const [brandName, setBrandName] = useState("");
  const [category,  setCategory]  = useState(CATEGORIES[0]);
  const [confirmPw, setConfirmPw] = useState("");

  const handleLogin = async () => {
    if (!email||!password) return;
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) showToast(error.message, "error");
    else { showToast("Welcome back!"); navigate("/"); }
  };

  const handleSignUp = async () => {
    if (!email||!password||!name||!brandName) { showToast("Please fill in all fields", "error"); return; }
    if (password.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    if (password !== confirmPw) { showToast("Passwords do not match", "error"); return; }
    setLoading(true);
    const { error } = await signUp({ email, password, name, brandName, category });
    setLoading(false);
    if (error) showToast(error.message, "error");
    else showToast("Account created! Check your email to confirm before logging in.");
  };

  return (
    <div className="fade-in" style={{ minHeight:"calc(100vh - 120px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ width:"100%", maxWidth:460 }}>
        <Card style={{ overflow:"visible" }}>
          {/* Tab switcher */}
          <div style={{ display:"flex", borderBottom:"1px solid var(--border)" }}>
            {[["login","Sign In"],["signup","Create Account"]].map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ flex:1, padding:"14px 20px", background:"none", border:"none", borderBottom:`3px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", transition:"all 0.2s" }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ padding:"28px 28px 32px" }}>
            {tab === "login" ? (
              <>
                <h2 style={{ fontSize:"1.8rem", marginBottom:4 }}>Welcome back</h2>
                <p style={{ color:"var(--text2)", fontSize:"0.88rem", marginBottom:24 }}>Sign in to your seller account</p>
                <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>
                  <Input label="Email"    value={email}    onChange={setEmail}    type="email"    placeholder="you@brand.co.za" />
                  <Input label="Password" value={password} onChange={v => { setPassword(v); if(v.length && v.length<6) {} }} type="password" placeholder="••••••••" />
                </div>
                <Btn variant="primary" size="lg" full onClick={handleLogin} disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </Btn>
                <p style={{ textAlign:"center", marginTop:16, fontSize:"0.83rem", color:"var(--text3)" }}>
                  Don't have an account?{" "}
                  <span onClick={() => setTab("signup")} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:600 }}>Create one →</span>
                </p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize:"1.8rem", marginBottom:4 }}>List your brand</h2>
                <p style={{ color:"var(--text2)", fontSize:"0.88rem", marginBottom:24 }}>Create a free seller account to start listing products</p>
                <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:22 }}>
                  <Input label="Your Name"  value={name}      onChange={setName}      placeholder="Siya Ndlovu" required />
                  <Input label="Email"      value={email}     onChange={setEmail}     type="email"    placeholder="you@brand.co.za" required />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                    <Input label="Password"         value={password}  onChange={setPassword}  type="password" placeholder="Min 6 chars" required />
                    <Input label="Confirm Password" value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Repeat password" required />
                  </div>
                  <Input label="Brand Name" value={brandName} onChange={setBrandName} placeholder="e.g. Skhokho Studios" required />
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <label style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Brand Category *</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)}
                      style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"10px 14px", color:"var(--text)", fontSize:"0.95rem", outline:"none", width:"100%", cursor:"pointer" }}>
                      {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <Btn variant="primary" size="lg" full onClick={handleSignUp} disabled={loading}>
                  {loading ? "Creating account…" : "Create Account"}
                </Btn>
                <p style={{ textAlign:"center", marginTop:16, fontSize:"0.83rem", color:"var(--text3)" }}>
                  Already have an account?{" "}
                  <span onClick={() => setTab("login")} style={{ color:"var(--accent)", cursor:"pointer", fontWeight:600 }}>Sign in →</span>
                </p>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
