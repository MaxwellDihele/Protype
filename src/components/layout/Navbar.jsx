import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Icon, Btn } from "../ui";
import { CATEGORIES } from "../../data/seed";

const NavIconBtn = ({ iconName, onClick, badge, style: sx = {} }) => (
  <button onClick={onClick} style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", width:44, height:44, borderRadius:10, background:"transparent", border:"none", cursor:"pointer", color:"var(--text)", flexShrink:0, WebkitTapHighlightColor:"transparent", transition:"background 0.15s", ...sx }}
    onTouchStart={e => e.currentTarget.style.background="var(--bg3)"}
    onTouchEnd={e => e.currentTarget.style.background="transparent"}
    onMouseEnter={e => e.currentTarget.style.background="var(--bg3)"}
    onMouseLeave={e => e.currentTarget.style.background="transparent"}
  >
    <Icon name={iconName} size={22} />
    {badge && <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"var(--accent)", border:"2px solid var(--bg)" }} />}
  </button>
);

const DrawerLink = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:14, width:"100%", padding:"13px 12px", borderRadius:10, border:"none", background:active?"var(--accent)18":"transparent", color:active?"var(--accent)":"var(--text)", fontWeight:active?700:500, fontSize:"0.95rem", cursor:"pointer", textAlign:"left", borderLeft:active?"3px solid var(--accent)":"3px solid transparent", transition:"background 0.15s", WebkitTapHighlightColor:"transparent" }}
    onTouchStart={e => { if(!active) e.currentTarget.style.background="var(--bg3)"; }}
    onTouchEnd={e => { if(!active) e.currentTarget.style.background="transparent"; }}
  >
    <Icon name={icon} size={20} color={active?"var(--accent)":"var(--text2)"} />
    {label}
  </button>
);

export const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout, theme, setTheme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  const closeAll = () => { setDrawerOpen(false); setSearchOpen(false); };

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal(""); closeAll();
    }
  };

  const handleLogout = () => { logout(); navigate("/"); closeAll(); };
  const isActive = (path) => path === "/" ? pathname === "/" : pathname.startsWith(path);

  const navLinks = [
    { label:"Home",       path:"/",           icon:"home" },
    { label:"Brands",     path:"/brands",     icon:"storefront" },
    { label:"Categories", path:"/categories", icon:"category" },
  ];

  return (
    <>
      <style>{`
        @media(min-width:768px){.desktop-nav{display:flex!important}.desktop-search{display:flex!important}.mobile-only{display:none!important}.nav-wordmark{display:inline!important}}
        @media(max-width:767px){.desktop-nav{display:none!important}.desktop-search{display:none!important}.mobile-only{display:flex!important}}
      `}</style>

      <nav style={{ position:"sticky", top:0, zIndex:200, background:"var(--bg)", borderBottom:"1px solid var(--border)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 12px", display:"flex", alignItems:"center", height:58, gap:4 }}>
          <div onClick={() => { navigate("/"); closeAll(); }} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", flexShrink:0, marginRight:4 }}>
            <div style={{ background:"var(--accent)", borderRadius:9, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize:"1.15rem", color:"#fff", letterSpacing:"0.05em" }}>M</div>
            <span className="nav-wordmark" style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"1.25rem", letterSpacing:"0.07em", color:"var(--text)", display:"none" }}>MzansiStreet</span>
          </div>

          <div className="desktop-nav" style={{ display:"none", gap:2, flex:1 }}>
            {navLinks.map(l => (
              <button key={l.path} onClick={() => navigate(l.path)} style={{ background:"none", border:"none", cursor:"pointer", color:isActive(l.path)?"var(--accent)":"var(--text2)", fontWeight:600, fontSize:"0.875rem", padding:"8px 14px", borderRadius:8, transition:"color 0.2s", borderBottom:isActive(l.path)?"2px solid var(--accent)":"2px solid transparent" }}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="desktop-search" style={{ display:"none", flex:1, maxWidth:340, position:"relative", margin:"0 8px" }}>
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={handleSearch} placeholder="Search products, brands…"
              style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:99, padding:"8px 16px 8px 38px", color:"var(--text)", fontSize:"0.875rem", outline:"none" }} />
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", display:"flex" }}><Icon name="search" size={17} color="var(--text3)" /></span>
          </div>

          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:2 }}>
            <div className="mobile-only"><NavIconBtn iconName="search" onClick={() => { setSearchOpen(true); setDrawerOpen(false); }} /></div>
            <NavIconBtn iconName={theme==="dark"?"light_mode":"dark_mode"} onClick={() => setTheme(t => t==="dark"?"light":"dark")} />
            {user && (
              <button className="desktop-nav" onClick={() => navigate(user.role==="admin"?"/admin":"/dashboard")}
                style={{ display:"none", alignItems:"center", gap:6, background:"var(--accent)", border:"none", borderRadius:9, padding:"6px 14px", color:"#fff", fontWeight:600, fontSize:"0.85rem", cursor:"pointer" }}>
                <Icon name="person" size={16} color="#fff" />{user.name.split(" ")[0]}
              </button>
            )}
            {!user && <div className="desktop-nav" style={{ display:"none" }}><Btn size="sm" onClick={() => navigate("/login")}>Sign In</Btn></div>}
            <div className="mobile-only"><NavIconBtn iconName={drawerOpen?"close":"menu"} onClick={() => { setDrawerOpen(d => !d); setSearchOpen(false); }} badge={!!user} /></div>
          </div>
        </div>
      </nav>

      {searchOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:300, background:"var(--bg)", display:"flex", flexDirection:"column", animation:"slideDown 0.2s ease" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderBottom:"1px solid var(--border)", height:58 }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", gap:10, background:"var(--bg3)", borderRadius:12, border:"1px solid var(--accent)", padding:"0 14px" }}>
              <Icon name="search" size={20} color="var(--accent)" />
              <input ref={searchInputRef} value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={handleSearch} placeholder="Search products, brands…"
                style={{ flex:1, background:"none", border:"none", outline:"none", color:"var(--text)", fontSize:"1rem", padding:"12px 0" }} />
              {searchVal && <button onClick={() => setSearchVal("")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", padding:4 }}><Icon name="cancel" size={18} color="var(--text3)" /></button>}
            </div>
            <button onClick={() => { setSearchOpen(false); setSearchVal(""); }} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--accent)", fontWeight:600, fontSize:"0.95rem", padding:"8px 4px", whiteSpace:"nowrap" }}>Cancel</button>
          </div>
          <div style={{ padding:"16px 12px 8px", borderBottom:"1px solid var(--border)" }}>
            <div style={{ fontSize:"0.75rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Browse Categories</div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => { navigate(`/search?category=${encodeURIComponent(cat)}`); closeAll(); setSearchVal(""); }}
                  style={{ padding:"7px 14px", borderRadius:99, border:"1px solid var(--border2)", background:"var(--bg3)", color:"var(--text2)", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {searchVal.trim() && (
            <div style={{ padding:"16px 12px" }}>
              <button onClick={handleSearch} style={{ width:"100%", padding:"14px", borderRadius:12, background:"var(--accent)", border:"none", color:"#fff", fontWeight:700, fontSize:"1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <Icon name="search" size={20} color="#fff" />Search "{searchVal}"
              </button>
            </div>
          )}
        </div>
      )}

      {drawerOpen && <div onClick={() => setDrawerOpen(false)} style={{ position:"fixed", inset:0, zIndex:250, background:"rgba(0,0,0,0.6)", animation:"fadeIn 0.2s ease" }} />}

      <div style={{ position:"fixed", top:0, right:0, bottom:0, zIndex:260, width:"min(300px, 85vw)", background:"var(--card)", borderLeft:"1px solid var(--border)", display:"flex", flexDirection:"column", transform:drawerOpen?"translateX(0)":"translateX(100%)", transition:"transform 0.28s cubic-bezier(0.4,0,0.2,1)", overflowY:"auto" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1px solid var(--border)", height:58 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ background:"var(--accent)", borderRadius:8, width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize:"1rem", color:"#fff" }}>M</div>
            <span style={{ fontFamily:"'Bebas Neue'", fontSize:"1.1rem", letterSpacing:"0.06em" }}>MzansiStreet</span>
          </div>
          <NavIconBtn iconName="close" onClick={() => setDrawerOpen(false)} />
        </div>

        {user ? (
          <div style={{ padding:"16px", borderBottom:"1px solid var(--border)", background:"var(--bg2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon name="person" size={22} color="#fff" /></div>
              <div>
                <div style={{ fontWeight:700, fontSize:"0.95rem" }}>{user.name}</div>
                <div style={{ fontSize:"0.75rem", color:"var(--text2)", textTransform:"capitalize" }}>{user.role}</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding:"16px", borderBottom:"1px solid var(--border)" }}>
            <button onClick={() => { navigate("/login"); closeAll(); }} style={{ width:"100%", padding:"13px", borderRadius:12, background:"var(--accent)", border:"none", color:"#fff", fontWeight:700, fontSize:"0.95rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Icon name="login" size={18} color="#fff" /> Sign In as Seller
            </button>
          </div>
        )}

        <div style={{ flex:1, padding:"10px 8px" }}>
          <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.12em", padding:"8px 10px 6px" }}>Discover</div>
          {[...navLinks, { label:"Search", path:"/search", icon:"search" }].map(l => (
            <DrawerLink key={l.path} label={l.label} icon={l.icon} active={isActive(l.path)} onClick={() => { navigate(l.path); closeAll(); }} />
          ))}
          {user && (
            <>
              <div style={{ borderTop:"1px solid var(--border)", margin:"10px 0 6px" }} />
              <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.12em", padding:"2px 10px 6px" }}>Account</div>
              {user.role === "seller" && <DrawerLink label="Seller Dashboard" icon="dashboard" active={isActive("/dashboard")} onClick={() => { navigate("/dashboard"); closeAll(); }} />}
              {user.role === "admin"  && <DrawerLink label="Admin Panel" icon="admin_panel_settings" active={isActive("/admin")} onClick={() => { navigate("/admin"); closeAll(); }} />}
            </>
          )}
        </div>

        <div style={{ padding:"12px 16px 20px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={() => setTheme(t => t==="dark"?"light":"dark")} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"10px 14px", cursor:"pointer", color:"var(--text)", fontWeight:600, fontSize:"0.85rem" }}>
            <Icon name={theme==="dark"?"light_mode":"dark_mode"} size={18} />
            {theme==="dark"?"Light mode":"Dark mode"}
          </button>
          {user && (
            <button onClick={handleLogout} style={{ display:"flex", alignItems:"center", gap:6, background:"#ff336618", border:"1px solid #ff336633", borderRadius:10, padding:"10px 14px", cursor:"pointer", color:"#ff3366", fontWeight:600, fontSize:"0.85rem" }}>
              <Icon name="logout" size={16} color="#ff3366" /> Log out
            </button>
          )}
        </div>
      </div>
    </>
  );
};
