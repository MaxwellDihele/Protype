import { useState, useEffect, useRef } from "react";

/* ─────────────── INJECT FONTS + MATERIAL ICONS ─────────────── */
if (typeof document !== "undefined" && !document.getElementById("umlinked-fonts")) {
  const fonts = document.createElement("link");
  fonts.id = "umlinked-fonts";
  fonts.rel = "stylesheet";
  fonts.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700;800&display=swap";
  document.head.appendChild(fonts);
}
if (typeof document !== "undefined" && !document.getElementById("material-icons")) {
  const mi = document.createElement("link");
  mi.id = "material-icons";
  mi.rel = "stylesheet";
  mi.href = "https://fonts.googleapis.com/icon?family=Material+Icons+Round";
  document.head.appendChild(mi);
}
if (typeof document !== "undefined" && !document.getElementById("umlinked-responsive")) {
  const s = document.createElement("style");
  s.id = "umlinked-responsive";
  s.textContent = `
    *,*::before,*::after{box-sizing:border-box;}
    html,body{max-width:100vw;overflow-x:hidden;}
    /* Clamp profile name so it never overflows on tiny screens */
    .uml-profile-name{font-size:clamp(15px,4.5vw,20px)!important;word-break:break-word;}
    /* Stat bar numbers */
    .uml-stat-num{font-size:clamp(14px,4vw,17px)!important;}
    /* Nav logo text */
    .uml-logo-text{font-size:clamp(15px,4.5vw,19px)!important;}
    /* Drawer width: never wider than 90vw */
    .uml-drawer{width:min(280px,90vw)!important;}
    /* Kebab dropdown: never wider than viewport minus a margin */
    .uml-kebab-dropdown{min-width:min(210px,calc(100vw - 32px))!important;max-width:calc(100vw - 32px)!important;}
    /* Body container: fluid below 420px, comfortable above */
    .uml-body-inner{width:100%!important;max-width:480px!important;}
    /* MiniProfile inner */
    .uml-mini-inner{max-width:480px!important;}
    /* Edit profile sheet: full-width on mobile */
    .uml-edit-sheet{width:100%!important;max-width:520px!important;}
    /* Footer grid: single column on very small screens */
    @media(max-width:340px){.uml-footer-grid{grid-template-columns:1fr!important;}}
    /* Ensure inputs never overflow their containers */
    input,textarea,select{max-width:100%;}
    /* Handle bar for bottom sheets */
    .uml-handle{touch-action:none;}
    /* Toast: cap width so it doesn't overflow on 320px */
    .uml-toast{max-width:calc(100vw - 32px)!important;white-space:normal!important;text-align:center!important;}
  `;
  document.head.appendChild(s);
}

/* ─────────────── MI COMPONENT ─────────────── */
const MI = ({ name, size = 20, color = "currentColor", style = {} }) => (
  <span className="material-icons-round" style={{ fontSize: size, color, lineHeight: 1, display: "inline-flex", alignItems: "center", userSelect: "none", ...style }}>{name}</span>
);

/* ─────────────── LAZY IMAGE ─────────────── */
function LazyImg({ src, alt, style, onError, className }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "120px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ ...style, position: "relative", overflow: "hidden", background: "rgba(120,130,160,0.1)" }}>
      {!loaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "22px", height: "22px", border: "2px solid rgba(42,138,90,0.2)", borderTopColor: "#2a8a5a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      )}
      {visible && (
        <img src={src} alt={alt || ""} onLoad={() => setLoaded(true)} onError={onError}
          style={{ ...style, position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }} />
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ─────────────── LAZY AVATAR ─────────────── */
function LazyAvatar({ src, alt, size, border, borderRadius = "50%" }) {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { rootMargin: "120px" });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: size, height: size, borderRadius, border, background: "rgba(120,130,160,0.12)", flexShrink: 0, position: "relative", overflow: "hidden" }}>
      {!loaded && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 16, height: 16, border: "2px solid rgba(42,138,90,0.2)", borderTopColor: "#2a8a5a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /></div>}
      {visible && <img src={src} alt={alt || ""} onLoad={() => setLoaded(true)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }} />}
    </div>
  );
}

const INDUSTRY_CATEGORIES = [
  "Photography","Videography","Modeling","Fashion Design","Makeup & Beauty",
  "Styling","Art Direction","Content Creation","Music & Entertainment","Acting & Performance",
  "Graphic Design","Illustration","Brand Strategy","Event Management","Hair & Beauty",
  "Fitness & Wellness","Interior Design","Architecture","Journalism & Media",
  "Film & Production","Dance & Choreography","Voice & Narration","Digital Marketing","Other",
];

/* ─────────────── THEME ─────────────── */
function makeTheme(dark) {
  return {
    dark,
    bodyBg:       dark ? "#0d1018"  : "#f4f6fb",
    cardBg:       dark ? "linear-gradient(145deg,#1c2130,#1a1f2e)" : "#ffffff",
    cardShadow:   dark ? "0 4px 32px rgba(0,0,0,0.45)" : "0 2px 20px rgba(30,40,80,0.08)",
    cardBorder:   dark ? "rgba(255,255,255,0.06)" : "rgba(200,210,235,0.6)",
    navBg:        dark ? "rgba(13,16,24,0.96)"   : "rgba(255,255,255,0.96)",
    navBorder:    dark ? "rgba(255,255,255,0.07)" : "rgba(200,210,235,0.7)",
    text:         dark ? "#e8eaf0"  : "#1a1d2e",
    subText:      dark ? "#9ba3b8"  : "#5c647e",
    mutedText:    dark ? "#5a6278"  : "#9ba3c0",
    inputBg:      dark ? "rgba(255,255,255,0.05)" : "#f0f3fc",
    inputBorder:  dark ? "rgba(255,255,255,0.1)"  : "#d4daf0",
    divider:      dark ? "rgba(255,255,255,0.07)" : "rgba(200,210,235,0.6)",
    hoverBg:      dark ? "rgba(255,255,255,0.04)" : "rgba(42,138,90,0.04)",
    linkCard:     dark ? "linear-gradient(145deg,#1c2130,#1a1f2e)" : "#ffffff",
    linkCardHov:  dark ? "linear-gradient(145deg,#1e2436,#1c2133)" : "#f7f9ff",
    linkBorder:   dark ? "rgba(255,255,255,0.07)" : "rgba(200,210,235,0.5)",
    drawerBg:     dark ? "linear-gradient(180deg,#161b27,#111520)" : "#ffffff",
    drawerBorder: dark ? "rgba(255,255,255,0.08)" : "rgba(200,210,235,0.8)",
    footerBg:     dark ? "linear-gradient(145deg,#111520,#0f1219)" : "#eef1fa",
    footerBorder: dark ? "rgba(255,255,255,0.06)" : "rgba(200,210,235,0.7)",
    modalBg:      dark ? "linear-gradient(160deg,#1e2538,#181d2b)" : "#ffffff",
    handleBar:    dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
    white:        dark ? "#ffffff"  : "#1a1d2e",
    green:        "#2a8a5a",
    tagBg:        dark ? "rgba(42,138,90,0.12)" : "rgba(42,138,90,0.08)",
    tagBorder:    "rgba(42,138,90,0.28)",
    kebabBg:      dark ? "linear-gradient(145deg,#1e2538,#191e2c)" : "#ffffff",
    sectionBg:    dark ? "rgba(255,255,255,0.03)" : "#f7f9ff",
    emptyBorder:  dark ? "rgba(255,255,255,0.1)"  : "rgba(200,210,235,0.7)",
  };
}

/* ─────────────── PEOPLE DATA ─────────────── */
const PEOPLE = [
  { id:1,  name:"Zinhle Dube",       handle:"@zinhle_d",      avatar:"https://picsum.photos/seed/zinhle1/200/200",   role:"Model",            location:"Cape Town, ZA",    bio:"Fashion & commercial model. Lover of art, culture and the African sun.",        followers:8400,    following:210, projects:22,  rating:4.7, reviews:41,  verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/z1a/300/300","https://picsum.photos/seed/z1b/300/300","https://picsum.photos/seed/z1c/300/300","https://picsum.photos/seed/z1d/300/300"] , receiveEmails:true },
  { id:2,  name:"Kagiso Sithole",    handle:"@kagiso_s",      avatar:"https://picsum.photos/seed/kagiso2/200/200",   role:"Fashion Designer",  location:"Durban, ZA",       bio:"Designing bold African fashion for the modern world. Streetwear meets heritage.", followers:3200,    following:180, projects:15,  rating:4.5, reviews:28,  verified:false, isFollowing:false, portfolio:["https://picsum.photos/seed/k2a/300/300","https://picsum.photos/seed/k2b/300/300","https://picsum.photos/seed/k2c/300/300","https://picsum.photos/seed/k2d/300/300"] , receiveEmails:false },
  { id:3,  name:"Naledi Mokoena",    handle:"@naledi.m",      avatar:"https://picsum.photos/seed/naledi3/200/200",   role:"Makeup Artist",     location:"Pretoria, ZA",     bio:"Bridal, editorial & SFX makeup. Over 200 happy clients.",                      followers:12100,   following:304, projects:67,  rating:4.9, reviews:93,  verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/n3a/300/300","https://picsum.photos/seed/n3b/300/300","https://picsum.photos/seed/n3c/300/300","https://picsum.photos/seed/n3d/300/300"] , receiveEmails:true },
  { id:4,  name:"Bongani Khumalo",   handle:"@bongani_k",     avatar:"https://picsum.photos/seed/bongani4/200/200",  role:"Videographer",      location:"Johannesburg, ZA", bio:"Cinematic storytelling for brands, events & music videos.",                     followers:5700,    following:260, projects:34,  rating:4.6, reviews:52,  verified:false, isFollowing:false, portfolio:["https://picsum.photos/seed/b4a/300/300","https://picsum.photos/seed/b4b/300/300","https://picsum.photos/seed/b4c/300/300","https://picsum.photos/seed/b4d/300/300"] , receiveEmails:false },
  { id:5,  name:"Lerato Ntuli",      handle:"@lerato.ntuli",  avatar:"https://picsum.photos/seed/lerato5/200/200",   role:"Stylist",           location:"Sandton, ZA",      bio:"Celebrity stylist. Fashion week veteran.",                                      followers:9300,    following:190, projects:44,  rating:4.8, reviews:76,  verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/l5a/300/300","https://picsum.photos/seed/l5b/300/300","https://picsum.photos/seed/l5c/300/300","https://picsum.photos/seed/l5d/300/300"] , receiveEmails:true },
  { id:6,  name:"Sipho Nkosi",       handle:"@sipho_n",       avatar:"https://picsum.photos/seed/sipho6/200/200",    role:"Art Director",      location:"Cape Town, ZA",    bio:"Creative direction for lifestyle brands.",                                      followers:4100,    following:142, projects:19,  rating:4.4, reviews:33,  verified:false, isFollowing:false, portfolio:["https://picsum.photos/seed/s6a/300/300","https://picsum.photos/seed/s6b/300/300","https://picsum.photos/seed/s6c/300/300","https://picsum.photos/seed/s6d/300/300"] , receiveEmails:false },
  { id:7,  name:"Ayanda Mthembu",    handle:"@ayanda.m",      avatar:"https://picsum.photos/seed/ayanda7/200/200",   role:"Content Creator",   location:"Durban, ZA",       bio:"Travel & lifestyle content creator. Exploring Africa one post at a time 🌍",   followers:31000,   following:520, projects:88,  rating:4.7, reviews:110, verified:true,  isFollowing:false, portfolio:["https://picsum.photos/seed/a7a/300/300","https://picsum.photos/seed/a7b/300/300","https://picsum.photos/seed/a7c/300/300","https://picsum.photos/seed/a7d/300/300"] , receiveEmails:true },
  { id:8,  name:"Thabo Dlamini",     handle:"@thabo_d",       avatar:"https://picsum.photos/seed/thabo8/200/200",    role:"Photographer",      location:"Pretoria, ZA",     bio:"Documentary & street photographer. Telling South Africa's untold stories.",    followers:7200,    following:388, projects:29,  rating:4.8, reviews:64,  verified:false, isFollowing:true,  portfolio:["https://picsum.photos/seed/t8a/300/300","https://picsum.photos/seed/t8b/300/300","https://picsum.photos/seed/t8c/300/300","https://picsum.photos/seed/t8d/300/300"] , receiveEmails:false },
  { id:9,  name:"Minnie Dlamini",    handle:"@minniedlamini", avatar:"https://picsum.photos/seed/minnie9/200/200",   role:"TV Presenter",      location:"Johannesburg, ZA", bio:"TV presenter, actress & entrepreneur. Living my best life. ✨",               followers:2100000, following:890, projects:120, rating:4.9, reviews:202, verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/m9a/300/300","https://picsum.photos/seed/m9b/300/300","https://picsum.photos/seed/m9c/300/300","https://picsum.photos/seed/m9d/300/300"] , receiveEmails:true },
  { id:10, name:"Trevor Noah",       handle:"@trevornoah",    avatar:"https://picsum.photos/seed/trevor10/200/200",  role:"Comedian",          location:"New York / SA",    bio:"Comedian, author. Proudly South African 🇿🇦",                                 followers:8900000, following:420, projects:55,  rating:4.9, reviews:312, verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/tr10a/300/300","https://picsum.photos/seed/tr10b/300/300","https://picsum.photos/seed/tr10c/300/300","https://picsum.photos/seed/tr10d/300/300"] , receiveEmails:true },
  { id:11, name:"Nomzamo Mbatha",    handle:"@nomzamo_m",     avatar:"https://picsum.photos/seed/nomzamo11/200/200", role:"Actress",           location:"Los Angeles / SA", bio:"Actress, humanitarian & UNHCR Goodwill Ambassador. 🌍",                        followers:3400000, following:660, projects:78,  rating:5.0, reviews:188, verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/no11a/300/300","https://picsum.photos/seed/no11b/300/300","https://picsum.photos/seed/no11c/300/300","https://picsum.photos/seed/no11d/300/300"] , receiveEmails:true },
  { id:12, name:"DJ Zinhle",         handle:"@djzinhle",      avatar:"https://picsum.photos/seed/djzinhle12/200/200",role:"DJ & Entrepreneur", location:"Johannesburg, ZA", bio:"Award-winning DJ, entrepreneur & mother. Era by DJ Zinhle. 🎧",               followers:4200000, following:730, projects:96,  rating:4.8, reviews:174, verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/dj12a/300/300","https://picsum.photos/seed/dj12b/300/300","https://picsum.photos/seed/dj12c/300/300","https://picsum.photos/seed/dj12d/300/300"] , receiveEmails:true },
  { id:13, name:"Riky Rick Studio",  handle:"@rikyrickworld", avatar:"https://picsum.photos/seed/riky13/200/200",    role:"Creative Studio",   location:"Johannesburg, ZA", bio:"A creative collective honouring Riky Rick's legacy.",                          followers:980000,  following:310, projects:44,  rating:4.7, reviews:89,  verified:false, isFollowing:true,  portfolio:["https://picsum.photos/seed/rk13a/300/300","https://picsum.photos/seed/rk13b/300/300","https://picsum.photos/seed/rk13c/300/300","https://picsum.photos/seed/rk13d/300/300"] , receiveEmails:false },
  { id:14, name:"Sho Madjozi",       handle:"@shomadjozi",    avatar:"https://picsum.photos/seed/sho14/200/200",     role:"Musician",          location:"Johannesburg, ZA", bio:"BET Award winner. Tsonga girl changing the world through music 🎶",            followers:1700000, following:480, projects:62,  rating:4.9, reviews:143, verified:true,  isFollowing:true,  portfolio:["https://picsum.photos/seed/sh14a/300/300","https://picsum.photos/seed/sh14b/300/300","https://picsum.photos/seed/sh14c/300/300","https://picsum.photos/seed/sh14d/300/300"] , receiveEmails:true },
];
const FOLLOWERS_IDS = [1,2,3,4,5,6,7,8];
const FOLLOWING_IDS = [9,10,11,12,13,14];

/* ─────────────── PLATFORM PRESETS ─────────────── */
const PLATFORM_PRESETS = [
  { id:"instagram", label:"Instagram",   placeholder:"@yourhandle",           color:"#E1306C", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", baseUrl:"https://instagram.com/",   icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
  { id:"tiktok",    label:"TikTok",      placeholder:"@yourhandle",           color:"#69C9D0", gradient:"linear-gradient(135deg,#010101,#69C9D0)",                          baseUrl:"https://tiktok.com/@",     icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg> },
  { id:"whatsapp",  label:"WhatsApp",    placeholder:"+27 81 234 5678",       color:"#25D366", gradient:"linear-gradient(135deg,#128C7E,#25D366)",                          baseUrl:"https://wa.me/",           icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
  { id:"twitter",   label:"X / Twitter", placeholder:"@yourhandle",           color:"#1DA1F2", gradient:"linear-gradient(135deg,#000,#1DA1F2)",                             baseUrl:"https://x.com/",           icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id:"facebook",  label:"Facebook",    placeholder:"facebook.com/yourpage", color:"#1877F2", gradient:"linear-gradient(135deg,#1877F2,#0a58ca)",                          baseUrl:"https://facebook.com/",    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id:"linkedin",  label:"LinkedIn",    placeholder:"linkedin.com/in/you",   color:"#0A66C2", gradient:"linear-gradient(135deg,#0A66C2,#004182)",                          baseUrl:"https://linkedin.com/in/", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id:"youtube",   label:"YouTube",     placeholder:"@yourchannel",          color:"#FF0000", gradient:"linear-gradient(135deg,#c4302b,#FF0000)",                          baseUrl:"https://youtube.com/@",    icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id:"website",   label:"Website",     placeholder:"https://yoursite.com",  color:"#6366f1", gradient:"linear-gradient(135deg,#6366f1,#4338ca)",                          baseUrl:"",                         icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { id:"custom",    label:"Custom Link", placeholder:"https://...",           color:"#8b5cf6", gradient:"linear-gradient(135deg,#7c3aed,#8b5cf6)",                          baseUrl:"",                         icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
];

const INITIAL_LINKS = [
  { uid:"l1", platformId:"instagram", label:"Instagram", handle:"@thandiwe_captures", url:"https://instagram.com/thandiwe_captures" },
  { uid:"l2", platformId:"tiktok",    label:"TikTok",    handle:"@thandiwe.nkosi",    url:"https://tiktok.com/@thandiwe.nkosi" },
  { uid:"l3", platformId:"whatsapp",  label:"WhatsApp",  handle:"+27 81 234 5678",    url:"https://wa.me/27812345678" },
];

const fmtN = n => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1000 ? (n/1000).toFixed(1)+"k" : n;
const getPlatform = id => PLATFORM_PRESETS.find(p => p.id === id) || PLATFORM_PRESETS[PLATFORM_PRESETS.length-1];

/* ─────────────── MINI PROFILE ─────────────── */
function MiniProfile({ person, onBack, showToast, T, onOpenMenu, myProfile }) {
  const [isFollowing, setIsFollowing] = useState(person.isFollowing);
  const [followerCount, setFollowerCount] = useState(person.followers);
  // Nested people modal & profile drill-down
  const [peopleModal, setPeopleModal] = useState(null);
  const [nestedProfile, setNestedProfile] = useState(null);
  // Email compose state
  const [showEmail, setShowEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  // Derive follower/following IDs for this person
  const personFollowerIds = PEOPLE.filter(p => p.id !== person.id && p.isFollowing).map(p=>p.id);
  const personFollowingIds = PEOPLE.filter(p => p.id !== person.id).slice(0, 6).map(p=>p.id);

  // Email rules:
  // - recipient must be verified AND have receiveEmails on (for PEOPLE, simulate via person.verified + a flag we add)
  // - sender (myProfile) must be verified
  const recipientCanReceive = person.verified && (person.receiveEmails !== false);
  const senderIsVerified = myProfile?.verified === true;
  const canEmail = recipientCanReceive && senderIsVerified;

  const sendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) { showToast("Please fill in subject and message"); return; }
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setShowEmail(false);
      setEmailSubject("");
      setEmailBody("");
      showToast(`Email sent to ${person.name}!`);
    }, 1200);
  };

  const subLinks = [
    { uid:"s1", platformId:"instagram", label:"Instagram", handle:`@${person.handle.replace("@","")}`, url:"https://instagram.com" },
    { uid:"s2", platformId:"whatsapp",  label:"WhatsApp",  handle:"+27 80 000 0000", url:"https://wa.me/27800000000" },
  ];
  const [previewLink, setPreviewLink] = useState(null);
  const [miniTab, setMiniTab] = useState("links"); // "links" | "portfolio"
  const toggleFollow = () => {
    const next = !isFollowing; setIsFollowing(next); setFollowerCount(n => next ? n+1 : n-1);
    showToast(next ? `Now following ${person.name}` : `Unfollowed ${person.name}`);
  };

  // Drill into a nested profile full-screen
  if (nestedProfile) {
    return <MiniProfile person={nestedProfile} onBack={()=>setNestedProfile(null)} showToast={showToast} T={T} onOpenMenu={onOpenMenu} myProfile={myProfile} />;
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:700, background:T.bodyBg, overflowY:"auto", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:T.text }}>

      {/* ── NAV ── */}
      <div style={{ position:"sticky", top:0, zIndex:10, display:"flex", alignItems:"center", gap:"12px", padding:"0 16px", height:"56px", background:T.navBg, backdropFilter:"blur(16px)", borderBottom:`1px solid ${T.navBorder}` }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
          <MI name="arrow_back" size={18} color={T.text} />
        </button>
        {/* Name + handle */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"15px", fontWeight:"800", color:T.white, fontFamily:"'Playfair Display',Georgia,serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{person.name}</div>
          <div style={{ fontSize:"11px", color:T.subText }}>{person.handle}</div>
        </div>
        {/* Hamburger — same style as main nav */}
        <button style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px", flexShrink:0 }} onClick={onOpenMenu}>
          {[22,22,15].map((w,i)=><div key={i} style={{ width:w, height:2, background:T.text, borderRadius:2 }} />)}
        </button>
      </div>

      {/* ── BODY ── */}
      <div className="uml-mini-inner" style={{ padding:"20px 16px 50px", maxWidth:"480px", margin:"0 auto" }}>
        {/* Profile card */}
        <div style={{ background:T.cardBg, borderRadius:"22px", padding:"22px", marginBottom:"14px", border:`1px solid ${T.cardBorder}`, boxShadow:T.cardShadow }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", marginBottom:"14px" }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <LazyAvatar src={person.avatar} alt={person.name} size={72} border="3px solid #2a8a5a" />
              {person.verified && <div style={{ position:"absolute", bottom:2, right:2, background:"#2a8a5a", borderRadius:"50%", width:"18px", height:"18px", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${T.dark?"#1a1f2e":"#fff"}` }}><MI name="check" size={11} color="white" /></div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
                <span className="uml-profile-name" style={{ fontSize:"17px", fontWeight:"800", color:T.white, fontFamily:"'Playfair Display',Georgia,serif" }}>{person.name}</span>
                {person.verified && <MI name="verified" size={16} color="#2a8a5a" />}
              </div>
              <div style={{ fontSize:"12px", color:T.subText, marginBottom:"3px" }}>{person.handle}</div>
              <div style={{ fontSize:"11px", color:T.subText, display:"flex", alignItems:"center", gap:"3px" }}><MI name="location_on" size={13} color={T.subText} />{person.location}</div>
              <div style={{ marginTop:"6px", display:"inline-flex", alignItems:"center", gap:"5px", background:T.tagBg, border:`1px solid ${T.tagBorder}`, borderRadius:"20px", padding:"3px 10px" }}>
                <span style={{ fontSize:"11px", color:T.green, fontWeight:"600" }}>{person.role}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize:"13px", color:T.subText, lineHeight:1.6, margin:"0 0 16px" }}>{person.bio}</p>
          {/* Follow + Email Me */}
          <div style={{ display:"flex", gap:"10px", marginBottom:showEmail?"10px":"16px" }}>
            <button onClick={toggleFollow} style={{ flex:1, padding:"11px", borderRadius:"12px", border:"none", fontSize:"14px", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", background:isFollowing?"linear-gradient(135deg,#1d6b44,#155235)":"linear-gradient(135deg,#2a8a5a,#1e6b44)", color:"#fff", boxShadow:isFollowing?"none":"0 4px 14px rgba(42,138,90,0.3)" }}>
              <MI name={isFollowing?"how_to_reg":"person_add"} size={16} color="#fff" />
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button
              onClick={()=>{ if(canEmail) setShowEmail(e=>!e); }}
              title={!senderIsVerified?"You need a verified ID to send emails":!recipientCanReceive?`${person.name} is not accepting emails`:""}
              style={{ flex:1, padding:"11px", borderRadius:"12px", fontSize:"14px", fontWeight:"700", cursor:canEmail?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", background:showEmail?T.tagBg:"transparent", border:showEmail?`1.5px solid ${T.tagBorder}`:`1.5px solid ${T.inputBorder}`, color:canEmail?T.green:T.mutedText, opacity:canEmail?1:0.55, transition:"all .15s" }}>
              <MI name="mail_outline" size={16} color={canEmail?T.green:T.mutedText} />
              Email Me
            </button>
          </div>

          {/* Disabled reason hint */}
          {!canEmail && (
            <div style={{ display:"flex", alignItems:"center", gap:"7px", padding:"8px 12px", borderRadius:"10px", background:"rgba(248,113,113,0.07)", border:"1px solid rgba(248,113,113,0.2)", marginBottom:"14px" }}>
              <MI name="lock" size={14} color="#f87171" />
              <span style={{ fontSize:"11px", color:"#f87171", fontWeight:"500" }}>
                {!recipientCanReceive
                  ? `${person.name} is not accepting emails${person.verified?"":" · unverified profile"}`
                  : "You need a verified ID to send emails"}
              </span>
            </div>
          )}

          {/* Email compose panel */}
          {showEmail && canEmail && (
            <div style={{ background:T.sectionBg, borderRadius:"16px", padding:"16px", marginBottom:"16px", border:`1px solid ${T.cardBorder}` }}>
              <div style={{ fontSize:"12px", fontWeight:"700", color:T.green, marginBottom:"12px", display:"flex", alignItems:"center", gap:"6px" }}>
                <MI name="mail" size={14} color={T.green} />
                Email {person.name}
                <span style={{ marginLeft:"auto", fontSize:"10px", color:T.mutedText, fontWeight:"500" }}>Sent to their registered email</span>
              </div>
              {/* Subject */}
              <div style={{ marginBottom:"10px" }}>
                <div style={{ fontSize:"11px", color:T.subText, marginBottom:"5px", fontWeight:"600" }}>Subject</div>
                <input
                  value={emailSubject}
                  onChange={e=>setEmailSubject(e.target.value)}
                  placeholder="What's this about?"
                  maxLength={120}
                  style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", padding:"10px 12px", fontSize:"13px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color .15s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(42,138,90,0.5)"}
                  onBlur={e=>e.target.style.borderColor=T.inputBorder}
                />
              </div>
              {/* Body */}
              <div style={{ marginBottom:"12px" }}>
                <div style={{ fontSize:"11px", color:T.subText, marginBottom:"5px", fontWeight:"600" }}>Message</div>
                <textarea
                  value={emailBody}
                  onChange={e=>setEmailBody(e.target.value)}
                  placeholder={`Write your message to ${person.name}…`}
                  rows={4}
                  maxLength={1000}
                  style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", padding:"10px 12px", fontSize:"13px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical", lineHeight:1.6, transition:"border-color .15s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(42,138,90,0.5)"}
                  onBlur={e=>e.target.style.borderColor=T.inputBorder}
                />
                <div style={{ fontSize:"10px", color:T.mutedText, textAlign:"right", marginTop:"3px" }}>{emailBody.length}/1000</div>
              </div>
              {/* Verified sender badge */}
              <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"7px 10px", borderRadius:"8px", background:T.tagBg, border:`1px solid ${T.tagBorder}`, marginBottom:"12px" }}>
                <MI name="verified" size={13} color={T.green} />
                <span style={{ fontSize:"11px", color:T.green, fontWeight:"600" }}>Sending as {myProfile?.handle || "you"} · Verified ID</span>
              </div>
              {/* Send + Cancel */}
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={()=>{ setShowEmail(false); setEmailSubject(""); setEmailBody(""); }} style={{ flex:1, padding:"10px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", color:T.subText, fontSize:"13px", fontWeight:"600", cursor:"pointer" }}>Cancel</button>
                <button onClick={sendEmail} disabled={emailSending||!emailSubject.trim()||!emailBody.trim()}
                  style={{ flex:2, padding:"10px", background:emailSending||!emailSubject.trim()||!emailBody.trim()?T.inputBg:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", borderRadius:"10px", color:emailSending||!emailSubject.trim()||!emailBody.trim()?T.mutedText:"#fff", fontSize:"13px", fontWeight:"700", cursor:emailSending||!emailSubject.trim()||!emailBody.trim()?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", transition:"all .15s", boxShadow:emailSending||!emailSubject.trim()||!emailBody.trim()?"none":"0 3px 12px rgba(42,138,90,0.28)" }}>
                  <MI name={emailSending?"hourglass_empty":"send"} size={14} color={emailSending||!emailSubject.trim()||!emailBody.trim()?T.mutedText:"#fff"} />
                  {emailSending ? "Sending…" : "Send Email"}
                </button>
              </div>
            </div>
          )}
          {/* Stats — Followers + Following clickable */}
          <div style={{ display:"flex", paddingTop:"14px", borderTop:`1px solid ${T.divider}` }}>
            {[
              {n:fmtN(followerCount), l:"Followers", action:()=>setPeopleModal({title:`Followers · ${fmtN(followerCount)}`, ids:personFollowerIds})},
              {n:fmtN(person.following), l:"Following", action:()=>setPeopleModal({title:`Following · ${fmtN(person.following)}`, ids:personFollowingIds})},
            ].map((s,i) => (
              <button key={s.l} onClick={s.action||undefined} disabled={!s.action}
                style={{ flex:1, background:"none", border:"none", cursor:s.action?"pointer":"default", padding:"8px 0", borderRight:i<1?`1px solid ${T.divider}`:"none", borderRadius:"8px" }}
                onMouseEnter={e=>{if(s.action)e.currentTarget.style.background=T.hoverBg;}}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>
                <div style={{ fontSize:"16px", fontWeight:"800", color:T.white }}>{s.n}</div>
                <div style={{ fontSize:"11px", color:s.action?T.green:T.subText, display:"flex", alignItems:"center", justifyContent:"center", gap:"2px" }}>
                  {s.l}{s.action&&<MI name="arrow_forward" size={11} color={T.green} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB SWITCHER ── */}
        <div>
          {/* Pill tab bar */}
          <div style={{ display:"flex", background:T.dark?"rgba(255,255,255,0.06)":"rgba(200,210,235,0.35)", borderRadius:"16px", padding:"4px", marginBottom:"16px", gap:"0" }}>
            {[{key:"links",label:"Social Links"},{key:"portfolio",label:"Portfolio"}].map(tab=>(
              <button key={tab.key} onClick={()=>setMiniTab(tab.key)}
                style={{ flex:1, padding:"11px 0", borderRadius:"12px", border:"none", fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"background 0.2s,color 0.2s,box-shadow 0.2s",
                  background: miniTab===tab.key ? "linear-gradient(135deg,#2a8a5a,#1e6b44)" : "transparent",
                  color:       miniTab===tab.key ? "#ffffff" : T.subText,
                  boxShadow:   miniTab===tab.key ? "0 4px 16px rgba(42,138,90,0.35)" : "none",
                }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── SOCIAL LINKS TAB ── */}
          {miniTab==="links"&&(
            <div>
              {subLinks.length===0?(
                <div style={{ textAlign:"center", padding:"32px 20px", background:T.cardBg, borderRadius:"18px", border:`1px dashed ${T.emptyBorder}` }}>
                  <MI name="link" size={32} color={T.subText} style={{ marginBottom:"8px", display:"block" }} />
                  <div style={{ fontSize:"14px", fontWeight:"600", color:T.subText, marginBottom:"4px" }}>No links yet</div>
                  <div style={{ fontSize:"12px", color:T.mutedText }}>This person hasn't added any social links</div>
                </div>
              ):(
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {subLinks.map(link => {
                    const plat = getPlatform(link.platformId);
                    return (
                      <button key={link.uid} onClick={()=>setPreviewLink(link)}
                        style={{ display:"flex", alignItems:"center", gap:"14px", padding:"16px 18px", borderRadius:"16px", background:T.linkCard, border:`1px solid ${T.linkBorder}`, cursor:"pointer", boxShadow:T.dark?"none":"0 1px 8px rgba(30,40,80,0.06)", textAlign:"left", width:"100%", transition:"border-color .15s,background .15s" }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=`${plat.color}60`;e.currentTarget.style.background=T.linkCardHov;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.linkBorder;e.currentTarget.style.background=T.linkCard;}}>
                        <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:plat.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 16px ${plat.color}40` }}>{plat.icon}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:"15px", fontWeight:"700", color:T.white }}>{link.label}</div>
                          <div style={{ fontSize:"12px", color:T.subText, marginTop:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.handle}</div>
                        </div>
                        <MI name="arrow_forward" size={18} color={plat.color} style={{ flexShrink:0 }} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── PORTFOLIO TAB ── */}
          {miniTab==="portfolio"&&(
            <div>
              {person.portfolio&&person.portfolio.length>0?(
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"8px" }}>
                  {person.portfolio.map((img,i)=>(
                    <LazyImg key={i} src={img} alt={`Portfolio ${i+1}`}
                      style={{ width:"100%", aspectRatio:"1", borderRadius:"12px", cursor:"pointer", overflow:"hidden" }}
                    />
                  ))}
                </div>
              ):(
                <div style={{ textAlign:"center", padding:"32px 20px", background:T.cardBg, borderRadius:"18px", border:`1px dashed ${T.emptyBorder}` }}>
                  <MI name="photo_library" size={32} color={T.subText} style={{ marginBottom:"8px", display:"block" }} />
                  <div style={{ fontSize:"14px", fontWeight:"600", color:T.subText, marginBottom:"4px" }}>No portfolio yet</div>
                  <div style={{ fontSize:"12px", color:T.mutedText }}>This person hasn't added any work</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Social preview modal */}
      {previewLink && <SocialPreviewModal link={previewLink} T={T} onClose={()=>setPreviewLink(null)} />}

      {/* Nested followers/following modal */}
      {peopleModal && (
        <PeopleModal
          title={peopleModal.title}
          ids={peopleModal.ids}
          onClose={()=>setPeopleModal(null)}
          showToast={showToast}
          onViewProfile={p=>{ setPeopleModal(null); setNestedProfile(p); }}
          T={T}
        />
      )}
    </div>
  );
}

/* ─────────────── SOCIAL PREVIEW MODAL ─────────────── */
function SocialPreviewModal({ link, T, onClose }) {
  const plat = getPlatform(link.platformId);
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}
      onClick={e=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div style={{ width:"100%", maxWidth:"480px", background:T.dark?"linear-gradient(160deg,#1e2538,#181d2b)":"#ffffff", borderRadius:"24px 24px 0 0", padding:"0 0 36px", boxShadow:"0 -12px 60px rgba(0,0,0,0.3)", border:`1px solid ${T.cardBorder}` }}>
        {/* Handle */}
        <div style={{ display:"flex", justifyContent:"center", paddingTop:"12px", paddingBottom:"4px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:T.handleBar }} />
        </div>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 20px 0" }}>
          <span style={{ fontSize:"15px", fontWeight:"800", color:T.white, fontFamily:"'Playfair Display',serif" }}>Connect via {plat.label}</span>
          <button onClick={onClose} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"50%", width:"30px", height:"30px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <MI name="close" size={16} color={T.subText} />
          </button>
        </div>
        {/* Platform preview card */}
        <div style={{ margin:"18px 20px 0" }}>
          <div style={{ borderRadius:"18px", overflow:"hidden", border:`1px solid ${T.cardBorder}`, boxShadow:T.dark?"none":"0 2px 16px rgba(30,40,80,0.08)" }}>
            {/* Gradient banner */}
            <div style={{ height:"90px", background:plat.gradient, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              <div style={{ width:"56px", height:"56px", borderRadius:"16px", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", boxShadow:`0 6px 24px rgba(0,0,0,0.2)` }}>
                <span style={{ transform:"scale(1.3)", display:"flex" }}>{plat.icon}</span>
              </div>
            </div>
            {/* Info */}
            <div style={{ background:T.cardBg, padding:"16px 18px 18px" }}>
              <div style={{ fontSize:"17px", fontWeight:"800", color:T.white, marginBottom:"3px" }}>{link.label}</div>
              <div style={{ fontSize:"13px", color:T.subText, marginBottom:"10px", display:"flex", alignItems:"center", gap:"5px" }}>
                <MI name="alternate_email" size={13} color={T.mutedText} />
                {link.handle}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 12px", borderRadius:"10px", background:T.tagBg, border:`1px solid ${T.tagBorder}` }}>
                <MI name="open_in_new" size={13} color={T.green} />
                <span style={{ fontSize:"12px", color:T.green, fontWeight:"600", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.url}</span>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div style={{ padding:"18px 20px 0", display:"flex", flexDirection:"column", gap:"10px" }}>
          <a href={link.url} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
            <button style={{ width:"100%", padding:"14px", background:`linear-gradient(135deg,${plat.color},${plat.color}cc)`, border:"none", borderRadius:"14px", color:"#fff", fontSize:"15px", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", boxShadow:`0 6px 20px ${plat.color}45` }}>
              <span style={{ display:"flex", transform:"scale(0.9)" }}>{plat.icon}</span>
              Open {plat.label}
              <MI name="open_in_new" size={16} color="#fff" />
            </button>
          </a>
          <button onClick={onClose} style={{ width:"100%", padding:"12px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"14px", color:T.subText, fontSize:"14px", fontWeight:"600", cursor:"pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── PEOPLE MODAL ─────────────── */
function PeopleModal({ title, ids, onClose, showToast, onViewProfile, T }) {
  const list = ids.map(id => PEOPLE.find(p => p.id===id));
  const [search, setSearch] = useState("");
  const [followStates, setFollowStates] = useState(Object.fromEntries(list.map(p=>[p.id,p.isFollowing])));
  const [subTab, setSubTab] = useState("all");
  const filtered = list.filter(p => {
    const q = search.toLowerCase();
    const match = p.name.toLowerCase().includes(q)||p.handle.toLowerCase().includes(q)||p.role.toLowerCase().includes(q);
    if (subTab==="following") return match && followStates[p.id];
    if (subTab==="not_following") return match && !followStates[p.id];
    return match;
  });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600, backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ width:"100%", maxWidth:"480px", background:T.modalBg, borderRadius:"22px 22px 0 0", border:`1px solid ${T.cardBorder}`, maxHeight:"88vh", display:"flex", flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}><div style={{ width:"36px", height:"4px", borderRadius:"2px", background:T.handleBar }} /></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 20px 12px" }}>
          <div>
            <div style={{ fontSize:"17px", fontWeight:"800", color:T.white }}>{title}</div>
            <div style={{ fontSize:"12px", color:T.subText }}>{list.length} people · tap to view profile</div>
          </div>
          <button onClick={onClose} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"50%", width:"30px", height:"30px", cursor:"pointer", color:T.subText, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <MI name="close" size={16} color={T.subText} />
          </button>
        </div>
        <div style={{ padding:"0 20px 10px" }}>
          <div style={{ position:"relative" }}>
            <MI name="search" size={16} color={T.subText} style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search people…" style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"10px 12px 10px 36px", fontSize:"13px", color:T.text, outline:"none", boxSizing:"border-box" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:"6px", padding:"0 20px 12px" }}>
          {[["all","All"],["following","Following"],["not_following","Not Following"]].map(([key,lbl])=>(
            <button key={key} onClick={()=>setSubTab(key)} style={{ padding:"5px 12px", borderRadius:"20px", border:"none", fontSize:"11px", fontWeight:"600", cursor:"pointer", background:subTab===key?"linear-gradient(135deg,#2a8a5a,#1e6b44)":T.inputBg, color:subTab===key?"#fff":T.subText }}>{lbl}</button>
          ))}
        </div>
        <div style={{ overflowY:"auto", flex:1, padding:"0 16px 24px", display:"flex", flexDirection:"column", gap:"8px" }}>
          {filtered.map(person=>(
            <div key={person.id} onClick={()=>onViewProfile(person)} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"14px", background:T.cardBg, border:`1px solid ${T.cardBorder}`, cursor:"pointer", boxShadow:T.dark?"none":"0 1px 6px rgba(30,40,80,0.05)" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <LazyAvatar src={person.avatar} alt={person.name} size={46} border="2px solid rgba(42,138,90,0.5)" />
                {person.verified && <div style={{ position:"absolute", bottom:0, right:0, background:"#2a8a5a", borderRadius:"50%", width:"16px", height:"16px", display:"flex", alignItems:"center", justifyContent:"center", border:`1.5px solid ${T.dark?"#1a1f2e":"#fff"}` }}><MI name="check" size={9} color="white" /></div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"14px", fontWeight:"700", color:T.white, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{person.name}</div>
                <div style={{ fontSize:"12px", color:T.subText }}>{person.handle} · {fmtN(person.followers)} followers</div>
                <div style={{ fontSize:"11px", color:T.green, background:T.tagBg, display:"inline-block", padding:"1px 7px", borderRadius:"10px", marginTop:"3px" }}>{person.role}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", flexShrink:0 }}>
                <button onClick={e=>{ e.stopPropagation(); const next=!followStates[person.id]; setFollowStates(s=>({...s,[person.id]:next})); showToast(next?`Now following ${person.name}`:`Unfollowed ${person.name}`); }}
                  style={{ padding:"6px 12px", borderRadius:"20px", border:followStates[person.id]?`1.5px solid ${T.inputBorder}`:"none", fontSize:"11px", fontWeight:"700", cursor:"pointer", background:followStates[person.id]?"transparent":"linear-gradient(135deg,#2a8a5a,#1e6b44)", color:followStates[person.id]?T.subText:"#fff" }}>
                  {followStates[person.id]?"Following":"Follow"}
                </button>
                <MI name="chevron_right" size={18} color={T.subText} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── ADD LINK MODAL ─────────────── */
function AddLinkModal({ onClose, onAdd, T }) {
  const [step, setStep] = useState("pick");
  const [selectedPlat, setSelectedPlat] = useState(null);
  const [handle, setHandle] = useState("");
  const confirm = () => {
    if (!handle.trim()) return;
    const url = selectedPlat.baseUrl ? selectedPlat.baseUrl+handle.trim().replace(/^@/,"") : handle.trim();
    onAdd({ uid:Date.now().toString(), platformId:selectedPlat.id, label:selectedPlat.label, handle:handle.trim(), url });
    onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:800, backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ width:"100%", maxWidth:"480px", background:T.modalBg, borderRadius:"22px 22px 0 0", border:`1px solid ${T.cardBorder}`, boxShadow:"0 -20px 60px rgba(0,0,0,0.2)", maxHeight:"88vh", display:"flex", flexDirection:"column" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}><div style={{ width:"36px", height:"4px", borderRadius:"2px", background:T.handleBar }} /></div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 20px 16px" }}>
          <div style={{ fontSize:"17px", fontWeight:"800", color:T.white }}>{step==="pick"?"Choose Platform":`Add ${selectedPlat?.label}`}</div>
          <button onClick={onClose} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"50%", width:"30px", height:"30px", cursor:"pointer", color:T.subText, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <MI name="close" size={16} color={T.subText} />
          </button>
        </div>
        {step==="pick" && (
          <div style={{ overflowY:"auto", flex:1, padding:"0 16px 24px", display:"flex", flexDirection:"column", gap:"8px" }}>
            {PLATFORM_PRESETS.map(plat=>(
              <button key={plat.id} onClick={()=>{setSelectedPlat(plat);setHandle("");setStep("fill");}}
                style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 16px", borderRadius:"14px", background:T.inputBg, border:`1px solid ${T.cardBorder}`, cursor:"pointer", textAlign:"left", width:"100%" }}>
                <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:plat.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 14px ${plat.color}35` }}>{plat.icon}</div>
                <span style={{ fontSize:"15px", fontWeight:"600", color:T.text }}>{plat.label}</span>
                <MI name="chevron_right" size={18} color={T.subText} style={{ marginLeft:"auto" }} />
              </button>
            ))}
          </div>
        )}
        {step==="fill" && selectedPlat && (
          <div style={{ padding:"0 20px 32px", display:"flex", flexDirection:"column", gap:"16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"14px", padding:"14px 16px", borderRadius:"14px", background:T.inputBg, border:`1px solid ${T.cardBorder}` }}>
              <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:selectedPlat.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 16px ${selectedPlat.color}40` }}>{selectedPlat.icon}</div>
              <div>
                <div style={{ fontSize:"15px", fontWeight:"700", color:T.white }}>{selectedPlat.label}</div>
                <div style={{ fontSize:"12px", color:T.subText }}>Enter your handle or URL below</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize:"12px", color:T.subText, marginBottom:"7px" }}>Your handle or URL</div>
              <input value={handle} onChange={e=>setHandle(e.target.value)} placeholder={selectedPlat.placeholder} autoFocus
                style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"13px 15px", fontSize:"15px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}
                onKeyDown={e=>{if(e.key==="Enter")confirm();}} />
            </div>
            {handle.trim() && (
              <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"12px 14px", borderRadius:"12px", background:"rgba(42,138,90,0.07)", border:"1px solid rgba(42,138,90,0.2)" }}>
                <span style={{ fontSize:"12px", color:"#2a8a5a" }}>Preview →</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:T.white }}>{selectedPlat.label}</div>
                  <div style={{ fontSize:"11px", color:T.subText }}>{handle.trim()}</div>
                </div>
              </div>
            )}
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={()=>setStep("pick")} style={{ flex:1, padding:"12px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", color:T.subText, fontSize:"14px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" }}>
                <MI name="arrow_back" size={16} color={T.subText} /> Back
              </button>
              <button onClick={confirm} disabled={!handle.trim()} style={{ flex:2, padding:"12px", background:handle.trim()?"linear-gradient(135deg,#2a8a5a,#1e6b44)":T.inputBg, border:"none", borderRadius:"12px", color:handle.trim()?"#fff":T.subText, fontSize:"14px", fontWeight:"700", cursor:handle.trim()?"pointer":"default", boxShadow:handle.trim()?"0 4px 14px rgba(42,138,90,0.3)":"none" }}>Add Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────── MAIN ─────────────── */
export default function ProfilePage() {
  const [theme, setTheme] = useState("light");
  const T = makeTheme(theme === "dark");

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [showAddLink, setShowAddLink] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deletingUid, setDeletingUid] = useState(null);
  const [previewLink, setPreviewLink] = useState(null);
  const [portfolio, setPortfolio] = useState([
    "https://picsum.photos/seed/th1/400/400",
    "https://picsum.photos/seed/th2/400/400",
    "https://picsum.photos/seed/th3/400/400",
    "https://picsum.photos/seed/th4/400/400",
  ]);
  const [portfolioEditMode, setPortfolioEditMode] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [profileTab, setProfileTab] = useState("links"); // "links" | "portfolio"
  const [kebabOpen, setKebabOpen] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [profileData, setProfileData] = useState({
    name:"Thandiwe Nkosi", handle:"@thandiwe", role:"Freelance Photographer",
    showRole: true,         // toggle whether role appears on profile
    receiveEmails: true,    // opt-in: allow verified users to email this profile
    location:"Johannesburg, South Africa", bio:"📷 Capturing the beauty of South Africa. Available for shoots!",
    avatar:"https://picsum.photos/seed/thandiwe/200/200", email:"thandiwe@example.com", industry:"Photography",
    verified: true,         // main profile owner verified status
  });
  const [editDraft, setEditDraft] = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(()=>setToast(null),2500); };

  const openEditProfile = () => { setEditDraft({...profileData}); setShowEditProfile(true); setKebabOpen(false); };
  const saveEditProfile = () => { setProfileData({...editDraft}); setShowEditProfile(false); showToast("Profile updated!"); };
  const handleAvatarChange = e => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setEditDraft(d=>({...d,avatar:ev.target.result}));
    reader.readAsDataURL(file);
  };

  // Kebab items — no emoji, no "Update Profile Picture"
  const KEBAB_ITEMS = [
    { icon:"workspace_premium", label:"Get Verified",    action:()=>{setKebabOpen(false);showToast("Verification coming soon!");}, highlight:true },
    { icon:"edit",              label:"Edit Profile",    action:openEditProfile },
    { icon:"link",              label:"Copy Profile Link", action:()=>{setKebabOpen(false);navigator.clipboard?.writeText("https://umlinked.co.za/@thandiwe").catch(()=>{});showToast("Link copied!");} },
    { icon:"share",             label:"Share Profile",   action:()=>{setKebabOpen(false);showToast("Opening share sheet…");} },
    { icon:"bar_chart",         label:"View Analytics",  action:()=>{setKebabOpen(false);showToast("Opening analytics…");} },
    { icon:"lock",              label:"Privacy Settings",action:()=>{setKebabOpen(false);showToast("Opening privacy settings…");} },
    { icon:"logout",            label:"Log Out",         action:()=>{setKebabOpen(false);showToast("Logged out. Bye!");}, danger:true },
  ];

  const addLink = link => { setLinks(l=>[...l,link]); showToast(`${link.label} added!`); };
  const deleteLink = uid => { setLinks(l=>l.filter(x=>x.uid!==uid)); setDeletingUid(null); showToast("Link removed"); };

  const ov = { position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, backdropFilter:"blur(6px)" };
  const mb = { background:T.modalBg, borderRadius:"22px", padding:"26px 22px", width:"calc(100% - 40px)", maxWidth:"360px", border:`1px solid ${T.cardBorder}`, boxShadow:"0 24px 60px rgba(0,0,0,0.2)", maxHeight:"88vh", overflowY:"auto" };
  const inp = { width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", padding:"11px 13px", fontSize:"14px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };

  return (
    <div style={{ minHeight:"100vh", background:T.bodyBg, fontFamily:"'DM Sans','Segoe UI',sans-serif", color:T.text, transition:"background 0.25s,color 0.25s" }}>

      {/* ── NAV ── */}
      <nav style={{ position:"sticky", top:0, zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 max(12px, env(safe-area-inset-right, 12px))", height:"56px", background:T.navBg, backdropFilter:"blur(16px)", borderBottom:`1px solid ${T.navBorder}`, transition:"background 0.25s" }}>
        {/* Home button */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <button onClick={() => showToast("Going home…")} title="Home" style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", width:"36px", height:"36px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <MI name="home" size={20} color={T.text} />
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
            <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            </div>
            <span className="uml-logo-text" style={{ fontSize:"19px", fontWeight:"800", letterSpacing:"-0.5px", background:"linear-gradient(135deg,#2a8a5a,#1a6640)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>UmLinked</span>
          </div>
        </div>
        {/* Hamburger */}
        <button style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", width:"36px", height:"36px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px" }} onClick={()=>setModal("menu")}>
          {[22,22,15].map((w,i)=><div key={i} style={{ width:w, height:2, background:T.text, borderRadius:2 }} />)}
        </button>
      </nav>

      {/* ── BODY ── */}
      <div style={{ display:"flex", justifyContent:"center", padding:"20px max(12px,3vw) 40px" }}>
        <div className="uml-body-inner" style={{ width:"100%", maxWidth:"420px" }}>

          {/* ── PROFILE CARD ── */}
          <div style={{ background:T.cardBg, borderRadius:"24px", padding:"22px", marginBottom:"14px", border:`1px solid ${T.cardBorder}`, boxShadow:T.cardShadow, position:"relative" }}>

            {/* KEBAB — icons only, no emoji */}
            <div style={{ position:"absolute", top:"16px", right:"16px", zIndex:10 }}>
              <button onClick={()=>setKebabOpen(o=>!o)} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", width:"34px", height:"34px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"3.5px", cursor:"pointer" }}>
                {[0,1,2].map(i=><div key={i} style={{ width:"4px", height:"4px", background:T.subText, borderRadius:"50%" }} />)}
              </button>
              {kebabOpen && (
                <>
                  <div style={{ position:"fixed", inset:0, zIndex:9 }} onClick={()=>setKebabOpen(false)} />
                  <div className="uml-kebab-dropdown" style={{ position:"absolute", top:"40px", right:0, zIndex:10, background:T.kebabBg, border:`1px solid ${T.cardBorder}`, borderRadius:"16px", minWidth:"210px", boxShadow:T.dark?"0 16px 48px rgba(0,0,0,0.6)":"0 8px 32px rgba(30,40,80,0.14)", overflow:"hidden" }}>
                    <div style={{ padding:"11px 16px 9px", borderBottom:`1px solid ${T.divider}` }}>
                      <div style={{ fontSize:"11px", color:T.mutedText, fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.06em" }}>Profile Options</div>
                    </div>
                    {KEBAB_ITEMS.map((item,i)=>(
                      <button key={i} onClick={item.action}
                        style={{ display:"flex", alignItems:"center", gap:"11px", width:"100%", padding:"11px 16px", background:item.highlight?T.tagBg:"none", border:"none", cursor:"pointer", fontSize:"13px", fontWeight:"500", color:item.danger?"#f87171":item.highlight?T.green:T.text, borderBottom:i<KEBAB_ITEMS.length-1?`1px solid ${T.divider}`:"none", textAlign:"left" }}
                        onMouseEnter={e=>e.currentTarget.style.background=item.danger?"rgba(248,113,113,0.08)":T.hoverBg}
                        onMouseLeave={e=>e.currentTarget.style.background=item.highlight?T.tagBg:"none"}>
                        <MI name={item.icon} size={17} color={item.danger?"#f87171":item.highlight?T.green:T.subText} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div style={{ display:"flex", alignItems:"flex-start", gap:"16px", marginBottom:"16px" }}>
              <div style={{ position:"relative", flexShrink:0 }}>
                <LazyAvatar src={profileData.avatar} alt={profileData.name} size={76} border="3px solid #2a8a5a" />
                <button onClick={openEditProfile} title="Update photo" style={{ position:"absolute", bottom:2, right:2, background:"#2a8a5a", borderRadius:"50%", width:"22px", height:"22px", display:"flex", alignItems:"center", justifyContent:"center", border:`2px solid ${T.dark?"#1a1f2e":"#fff"}`, cursor:"pointer", padding:0 }}>
                  <MI name="photo_camera" size={12} color="white" />
                </button>
              </div>
              <div style={{ flex:1, paddingRight:"30px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"2px" }}>
                  <span className="uml-profile-name" style={{ fontSize:"20px", fontWeight:"900", color:T.white, fontFamily:"'Playfair Display',Georgia,serif", letterSpacing:"-0.3px" }}>{profileData.name}</span>
                  <MI name="verified" size={17} color="#2a8a5a" />
                </div>
                <div style={{ fontSize:"12px", color:T.subText, marginBottom:"4px" }}>{profileData.handle}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"3px", fontSize:"12px", color:T.subText }}>
                  <MI name="location_on" size={13} color={T.subText} />{profileData.location}
                </div>
              </div>
            </div>

            {/* Role (only if showRole is true) + industry badge */}
            <div style={{ display:"flex", flexDirection:"column", gap:"6px", marginBottom:"12px" }}>
              {profileData.showRole && (
                <div style={{ fontSize:"13px", color:T.subText }}>{profileData.role}</div>
              )}
              <span style={{ fontSize:"11px", color:T.green, background:T.tagBg, padding:"3px 11px", borderRadius:"20px", border:`1px solid ${T.tagBorder}`, fontWeight:"600", letterSpacing:"0.04em", alignSelf:"flex-start", display:"flex", alignItems:"center", gap:"5px" }}>
                <MI name="business_center" size={13} color={T.green} />{profileData.industry||"Photography"}
              </span>
            </div>

            <div style={{ fontSize:"13px", color:T.subText, lineHeight:1.6, marginBottom:"18px" }}>{profileData.bio}</div>

            <div style={{ display:"flex", borderTop:`1px solid ${T.divider}`, paddingTop:"14px" }}>
              {[
                {n:fmtN(12500), l:"Followers", action:()=>setModal("followers")},
                {n:"320",       l:"Following", action:()=>setModal("following")},
                {n:portfolio.length, l:"Portfolio", action:null},
              ].map((s,i)=>(
                <button key={s.l} onClick={s.action||undefined} disabled={!s.action}
                  style={{ flex:1, background:"none", border:"none", cursor:s.action?"pointer":"default", padding:"8px 0", borderRight:i<2?`1px solid ${T.divider}`:"none", borderRadius:"8px" }}
                  onMouseEnter={e=>{if(s.action)e.currentTarget.style.background=T.hoverBg;}}
                  onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <div className="uml-stat-num" style={{ fontSize:"17px", fontWeight:"800", color:T.white }}>{s.n}</div>
                  <div style={{ fontSize:"11px", color:s.action?T.green:T.subText, display:"flex", alignItems:"center", justifyContent:"center", gap:"2px" }}>
                    {s.l}{s.action&&<MI name="arrow_forward" size={11} color={T.green} />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── TAB SWITCHER + CONTENT ── */}
          <div style={{ marginBottom:"14px" }}>

            {/* Pill tab bar — matches screenshot style */}
            <div style={{ display:"flex", background:T.dark?"rgba(255,255,255,0.06)":"rgba(200,210,235,0.35)", borderRadius:"16px", padding:"4px", marginBottom:"16px", gap:"0" }}>
              {[{key:"links",label:"Social Links"},{key:"portfolio",label:"Portfolio"}].map(tab=>(
                <button key={tab.key} onClick={()=>setProfileTab(tab.key)}
                  style={{ flex:1, padding:"11px 0", borderRadius:"12px", border:"none", fontSize:"15px", fontWeight:"700", cursor:"pointer", transition:"background 0.2s,color 0.2s,box-shadow 0.2s",
                    background: profileTab===tab.key ? "linear-gradient(135deg,#2a8a5a,#1e6b44)" : "transparent",
                    color:       profileTab===tab.key ? "#ffffff" : T.subText,
                    boxShadow:   profileTab===tab.key ? "0 4px 16px rgba(42,138,90,0.35)" : "none",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── SOCIAL LINKS TAB ── */}
            {profileTab==="links"&&(
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px", padding:"0 2px" }}>
                  <div style={{ fontSize:"11px", color:T.mutedText }}>{links.length} link{links.length!==1?"s":""}</div>
                  <div style={{ display:"flex", gap:"7px" }}>
                    {links.length>0&&(
                      <button onClick={()=>{setEditMode(m=>!m);setDeletingUid(null);}}
                        style={{ padding:"6px 14px", borderRadius:"20px", background:editMode?"rgba(220,38,38,0.08)":T.inputBg, border:editMode?"1px solid rgba(220,38,38,0.3)":`1px solid ${T.inputBorder}`, color:editMode?"#dc2626":T.subText, fontSize:"12px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                        <MI name={editMode?"check":"edit"} size={14} color={editMode?"#dc2626":T.subText} />
                        {editMode?"Done":"Edit"}
                      </button>
                    )}
                    <button onClick={()=>setShowAddLink(true)} style={{ padding:"6px 14px", borderRadius:"20px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", color:"#fff", fontSize:"12px", fontWeight:"700", cursor:"pointer", boxShadow:"0 3px 12px rgba(42,138,90,0.28)", display:"flex", alignItems:"center", gap:"5px" }}>
                      <MI name="add" size={16} color="#fff" /> Add Link
                    </button>
                  </div>
                </div>

                {links.length===0?(
                  <div style={{ textAlign:"center", padding:"32px 20px", background:T.cardBg, borderRadius:"18px", border:`1px dashed ${T.emptyBorder}` }}>
                    <MI name="link" size={32} color={T.subText} style={{ marginBottom:"8px", display:"block" }} />
                    <div style={{ fontSize:"14px", fontWeight:"600", color:T.subText, marginBottom:"4px" }}>No links yet</div>
                    <div style={{ fontSize:"12px", color:T.mutedText }}>Add your social media links above</div>
                  </div>
                ):(
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {links.map(link=>{
                      const plat=getPlatform(link.platformId);
                      const isDeleting=deletingUid===link.uid;
                      return (
                        <div key={link.uid} style={{ position:"relative" }}>
                          {editMode&&isDeleting&&(
                            <div style={{ position:"absolute", inset:0, zIndex:5, background:"rgba(20,10,10,0.9)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", gap:"10px", backdropFilter:"blur(4px)" }}>
                              <span style={{ fontSize:"13px", color:"#fca5a5" }}>Remove this link?</span>
                              <button onClick={()=>deleteLink(link.uid)} style={{ padding:"6px 14px", background:"#dc2626", border:"none", borderRadius:"8px", color:"#fff", fontSize:"12px", fontWeight:"700", cursor:"pointer" }}>Remove</button>
                              <button onClick={()=>setDeletingUid(null)} style={{ padding:"6px 12px", background:"rgba(255,255,255,0.15)", border:"none", borderRadius:"8px", color:"#e8eaf0", fontSize:"12px", cursor:"pointer" }}>Cancel</button>
                            </div>
                          )}
                          <a href={editMode?undefined:"#"} onClick={e=>{ e.preventDefault(); if(!editMode) setPreviewLink(link); }} style={{ textDecoration:"none", display:"block" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"15px", padding:"14px 16px", borderRadius:"16px", background:T.linkCard, border:`1px solid ${editMode?"rgba(220,38,38,0.25)":T.linkBorder}`, cursor:editMode?"default":"pointer", transition:"border-color .15s,background .15s", boxShadow:T.dark?"none":"0 1px 8px rgba(30,40,80,0.06)" }}
                              onMouseEnter={e=>{if(!editMode){e.currentTarget.style.borderColor=`${plat.color}60`;e.currentTarget.style.background=T.linkCardHov;}}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor=editMode?"rgba(220,38,38,0.25)":T.linkBorder;e.currentTarget.style.background=T.linkCard;}}>
                              {editMode&&(<div style={{ display:"flex", flexDirection:"column", gap:"3px", flexShrink:0, opacity:0.4 }}>{[0,1,2].map(i=><div key={i} style={{ width:"14px", height:"2px", background:T.subText, borderRadius:"1px" }} />)}</div>)}
                              <div style={{ width:"50px", height:"50px", borderRadius:"14px", background:plat.gradient, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", flexShrink:0, boxShadow:`0 4px 18px ${plat.color}40` }}>{plat.icon}</div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:"15px", fontWeight:"700", color:T.white, marginBottom:"2px" }}>{link.label}</div>
                                <div style={{ fontSize:"13px", color:T.subText, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link.handle}</div>
                              </div>
                              {editMode?(
                                <button onClick={()=>setDeletingUid(link.uid)} style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(220,38,38,0.12)", border:"1px solid rgba(220,38,38,0.3)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
                                  <MI name="close" size={13} color="#f87171" />
                                </button>
                              ):(
                                <MI name="arrow_forward" size={18} color={plat.color} style={{ flexShrink:0, opacity:0.85 }} />
                              )}
                            </div>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
                {!editMode&&links.length>0&&(
                  <button onClick={()=>setShowAddLink(true)} style={{ width:"100%", marginTop:"10px", padding:"12px", background:"transparent", border:`1px dashed ${T.emptyBorder}`, borderRadius:"14px", color:T.mutedText, fontSize:"13px", fontWeight:"500", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=T.tagBg;e.currentTarget.style.borderColor="rgba(42,138,90,0.3)";e.currentTarget.style.color=T.green;}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=T.emptyBorder;e.currentTarget.style.color=T.mutedText;}}>
                    <MI name="add" size={15} color="currentColor" /> Add another link
                  </button>
                )}
              </div>
            )}

            {/* ── PORTFOLIO TAB ── */}
            {profileTab==="portfolio"&&(
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px", padding:"0 2px" }}>
                  <div style={{ fontSize:"11px", color:T.mutedText }}>{portfolio.length}/6 images</div>
                  <div style={{ display:"flex", gap:"7px" }}>
                    {portfolio.length>0&&(
                      <button onClick={()=>setPortfolioEditMode(m=>!m)}
                        style={{ padding:"6px 14px", borderRadius:"20px", background:portfolioEditMode?"rgba(220,38,38,0.08)":T.inputBg, border:portfolioEditMode?"1px solid rgba(220,38,38,0.3)":`1px solid ${T.inputBorder}`, color:portfolioEditMode?"#dc2626":T.subText, fontSize:"12px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                        <MI name={portfolioEditMode?"check":"edit"} size={14} color={portfolioEditMode?"#dc2626":T.subText} />
                        {portfolioEditMode?"Done":"Edit"}
                      </button>
                    )}
                    {portfolio.length<6&&(
                      <label style={{ padding:"6px 14px", borderRadius:"20px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", color:"#fff", fontSize:"12px", fontWeight:"700", cursor:"pointer", boxShadow:"0 3px 12px rgba(42,138,90,0.28)", display:"flex", alignItems:"center", gap:"5px" }}>
                        <MI name="add_photo_alternate" size={16} color="#fff" /> Add
                        <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e=>{
                          const files=Array.from(e.target.files||[]);
                          const rem=6-portfolio.length;
                          files.slice(0,rem).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setPortfolio(p=>[...p,ev.target.result].slice(0,6)); r.readAsDataURL(f); });
                          e.target.value="";
                        }} />
                      </label>
                    )}
                  </div>
                </div>
                {portfolio.length===0?(
                  <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", padding:"32px 20px", background:T.cardBg, borderRadius:"18px", border:`1px dashed ${T.emptyBorder}`, cursor:"pointer" }}>
                    <MI name="add_photo_alternate" size={36} color={T.subText} />
                    <div style={{ fontSize:"14px", fontWeight:"600", color:T.subText }}>Add portfolio images</div>
                    <div style={{ fontSize:"12px", color:T.mutedText }}>Up to 6 images · JPG, PNG, GIF</div>
                    <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e=>{
                      const files=Array.from(e.target.files||[]);
                      files.slice(0,6).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setPortfolio(p=>[...p,ev.target.result].slice(0,6)); r.readAsDataURL(f); });
                      e.target.value="";
                    }} />
                  </label>
                ):(
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"6px" }}>
                    {portfolio.map((img,idx)=>(
                      <div key={idx} style={{ position:"relative", aspectRatio:"1", borderRadius:"12px", overflow:"hidden", cursor:"pointer" }}
                        onClick={()=>{ if(!portfolioEditMode) setLightboxImg(img); }}>
                        <img src={img} alt={`Portfolio ${idx+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                        {portfolioEditMode?(
                          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <button onClick={e=>{ e.stopPropagation(); setPortfolio(p=>p.filter((_,i)=>i!==idx)); }}
                              style={{ width:"32px", height:"32px", borderRadius:"50%", background:"rgba(220,38,38,0.9)", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                              <MI name="close" size={16} color="#fff" />
                            </button>
                          </div>
                        ):(
                          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0)", transition:"background 0.15s" }}
                            onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.18)"}
                            onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0)"} />
                        )}
                      </div>
                    ))}
                    {portfolioEditMode&&portfolio.length<6&&(
                      <label style={{ aspectRatio:"1", borderRadius:"12px", border:`2px dashed ${T.emptyBorder}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"4px", cursor:"pointer", background:T.sectionBg }}>
                        <MI name="add" size={24} color={T.mutedText} />
                        <span style={{ fontSize:"10px", color:T.mutedText, fontWeight:"600" }}>Add</span>
                        <input type="file" accept="image/*" multiple style={{ display:"none" }} onChange={e=>{
                          const files=Array.from(e.target.files||[]);
                          const rem=6-portfolio.length;
                          files.slice(0,rem).forEach(f=>{ const r=new FileReader(); r.onload=ev=>setPortfolio(p=>[...p,ev.target.result].slice(0,6)); r.readAsDataURL(f); });
                          e.target.value="";
                        }} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxImg&&(
        <div style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(8px)" }}
          onClick={()=>setLightboxImg(null)}>
          <button onClick={()=>setLightboxImg(null)} style={{ position:"absolute", top:"16px", right:"16px", background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"50%", width:"38px", height:"38px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <MI name="close" size={20} color="#fff" />
          </button>
          <img src={lightboxImg} alt="Portfolio" style={{ maxWidth:"92vw", maxHeight:"88vh", borderRadius:"16px", objectFit:"contain", boxShadow:"0 24px 80px rgba(0,0,0,0.6)" }} onClick={e=>e.stopPropagation()} />
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ background:T.footerBg, borderTop:`1px solid ${T.footerBorder}`, padding:"28px 24px 24px", transition:"background 0.25s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
          <div style={{ width:"24px", height:"24px", borderRadius:"6px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </div>
          <span style={{ fontSize:"17px", fontWeight:"800", background:"linear-gradient(135deg,#2a8a5a,#1a6640)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>UmLinked</span>
          <span style={{ fontSize:"11px", color:T.mutedText }}>by Mzansi Connect</span>
        </div>
        <div style={{ fontSize:"12px", color:T.subText, marginBottom:"20px" }}>Connecting South Africa's creative talent 🇿🇦</div>
        <div className="uml-footer-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px 16px", marginBottom:"20px" }}>
          {[
            {icon:"login",          label:"Login / Sign Up",    fn:()=>setModal("login")},
            {icon:"person",         label:"My Profile",          fn:()=>showToast("Redirecting…")},
            {icon:"search",         label:"Browse Talent",       fn:()=>showToast("Opening directory…")},
            {icon:"add_photo_alternate", label:"Post a Project", fn:()=>showToast("Opening form…")},
            {icon:"chat",           label:"Messages",            fn:()=>showToast("Opening messages…")},
            {icon:"grade",          label:"Top Rated",           fn:()=>showToast("Opening top rated…")},
            {icon:"location_city",  label:"Joburg Creatives",    fn:()=>showToast("Loading listings…")},
            {icon:"security",       label:"Safety Centre",       fn:()=>showToast("Opening safety…")},
            {icon:"description",    label:"Terms of Use",        fn:()=>showToast("Opening terms…")},
            {icon:"policy",         label:"Privacy Policy",      fn:()=>showToast("Opening privacy…")},
          ].map(({icon,label,fn})=>(
            <button key={label} onClick={fn} style={{ background:"none", border:"none", textAlign:"left", fontSize:"12px", color:T.subText, cursor:"pointer", padding:"6px 0", display:"flex", alignItems:"center", gap:"7px" }}>
              <MI name={icon} size={15} color={T.mutedText} />{label}
            </button>
          ))}
        </div>
        <div style={{ height:"1px", background:T.divider, margin:"4px 0 14px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:"11px", color:T.mutedText }}>© 2025 UmLinked · Mzansi Connect</span>
          <span style={{ fontSize:"11px", color:T.green, background:T.tagBg, padding:"3px 10px", borderRadius:"20px", border:`1px solid ${T.tagBorder}` }}>🇿🇦 Made in SA</span>
        </div>
      </footer>

      {/* ══ ADD LINK ══ */}
      {showAddLink&&<AddLinkModal onClose={()=>setShowAddLink(false)} onAdd={addLink} T={T} />}

      {/* ══ SOCIAL PREVIEW ══ */}
      {previewLink&&<SocialPreviewModal link={previewLink} T={T} onClose={()=>setPreviewLink(null)} />}

      {/* ══ FOLLOWERS / FOLLOWING ══ */}
      {modal==="followers"&&<PeopleModal title={`Followers · ${fmtN(12500)}`} ids={FOLLOWERS_IDS} onClose={()=>setModal(null)} showToast={showToast} onViewProfile={p=>{setModal(null);setViewingProfile(p);}} T={T} />}
      {modal==="following"&&<PeopleModal title="Following · 320" ids={FOLLOWING_IDS} onClose={()=>setModal(null)} showToast={showToast} onViewProfile={p=>{setModal(null);setViewingProfile(p);}} T={T} />}

      {/* ══ SUB-PROFILE ══ */}
      {viewingProfile&&<MiniProfile person={viewingProfile} onBack={()=>setViewingProfile(null)} showToast={showToast} T={T} onOpenMenu={()=>setModal("menu")} myProfile={profileData} />}

      {/* ══ HAMBURGER DRAWER ══ */}
      {modal==="menu"&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:599, backdropFilter:"blur(4px)" }} onClick={()=>setModal(null)}>
          <div className="uml-drawer" style={{ position:"fixed", top:0, right:0, bottom:0, width:"280px", background:T.drawerBg, borderLeft:`1px solid ${T.drawerBorder}`, zIndex:600, padding:"22px 18px", display:"flex", flexDirection:"column", gap:"4px", boxShadow:T.dark?"none":"-8px 0 32px rgba(30,40,80,0.1)", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
            <button style={{ alignSelf:"flex-end", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"50%", width:"30px", height:"30px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px" }} onClick={()=>setModal(null)}>
              <MI name="close" size={17} color={T.subText} />
            </button>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"18px", paddingBottom:"16px", borderBottom:`1px solid ${T.divider}` }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              </div>
              <span style={{ fontSize:"18px", fontWeight:"800", background:"linear-gradient(135deg,#2a8a5a,#1a6640)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>UmLinked</span>
            </div>

            {/* Theme toggle */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", borderRadius:"14px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, marginBottom:"12px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <MI name={T.dark?"dark_mode":"light_mode"} size={20} color={T.dark?"#a5b4fc":"#f59e0b"} />
                <div>
                  <div style={{ fontSize:"13px", fontWeight:"700", color:T.white }}>{T.dark?"Dark Mode":"Light Mode"}</div>
                  <div style={{ fontSize:"11px", color:T.subText }}>Tap to switch</div>
                </div>
              </div>
              <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
                style={{ width:"46px", height:"26px", borderRadius:"13px", border:"none", cursor:"pointer", position:"relative", background:T.dark?"#2a8a5a":"#d0d8f0", transition:"background 0.25s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:"4px", left:T.dark?"23px":"3px", width:"18px", height:"18px", borderRadius:"50%", background:"#ffffff", boxShadow:"0 1px 4px rgba(0,0,0,0.25)", transition:"left 0.25s" }} />
              </button>
            </div>

            <button onClick={()=>setModal("login")} style={{ display:"flex", alignItems:"center", gap:"11px", padding:"13px 14px", marginBottom:"8px", borderRadius:"12px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", width:"100%" }}>
              <MI name="login" size={18} color="#fff" /><span>Login / Sign Up</span>
            </button>
            {[["person","My Profile"],["search","Browse Talent"],["add_photo_alternate","Post a Project"],["chat","Messages"],["grade","Top Rated"],["location_city","Joburg Creatives"]].map(([icon,lb])=>(
              <button key={lb} onClick={()=>{setModal(null);showToast(`Opening ${lb}…`);}} style={{ display:"flex", alignItems:"center", gap:"11px", padding:"11px 14px", borderRadius:"11px", border:"none", background:"transparent", color:T.text, fontSize:"13px", cursor:"pointer", textAlign:"left", width:"100%" }}
                onMouseEnter={e=>e.currentTarget.style.background=T.hoverBg}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <MI name={icon} size={18} color={T.subText} /><span>{lb}</span>
              </button>
            ))}
            <div style={{ height:"1px", background:T.divider, margin:"8px 0" }} />
            {[["security","Safety Centre"],["description","Terms of Use"],["policy","Privacy Policy"]].map(([icon,lb])=>(
              <button key={lb} onClick={()=>{setModal(null);showToast(`Opening ${lb}…`);}} style={{ display:"flex", alignItems:"center", gap:"11px", padding:"9px 14px", borderRadius:"10px", border:"none", background:"transparent", color:T.subText, fontSize:"12px", cursor:"pointer", textAlign:"left", width:"100%" }}>
                <MI name={icon} size={16} color={T.mutedText} /><span>{lb}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ LOGIN MODAL ══ */}
      {modal==="login"&&(
        <div style={ov} onClick={()=>setModal(null)}>
          <div style={mb} onClick={e=>e.stopPropagation()}>
            <div style={{ textAlign:"center", marginBottom:"20px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"7px", marginBottom:"4px" }}>
                <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                </div>
                <span style={{ fontSize:"20px", fontWeight:"800", background:"linear-gradient(135deg,#2a8a5a,#1a6640)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>UmLinked</span>
              </div>
              <div style={{ fontSize:"12px", color:T.subText }}>Sign in to your account</div>
            </div>
            <div style={{ marginBottom:"11px" }}>
              <div style={{ fontSize:"11px", color:T.subText, marginBottom:"5px" }}>Email address</div>
              <input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} placeholder="you@example.com" type="email" style={inp} />
            </div>
            <div style={{ marginBottom:"18px" }}>
              <div style={{ fontSize:"11px", color:T.subText, marginBottom:"5px" }}>Password</div>
              <input value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="••••••••" type="password" style={inp} />
            </div>
            <button onClick={()=>{if(!loginEmail||!loginPass){showToast("Please fill in all fields");return;}setModal(null);showToast("Welcome back!");}} style={{ width:"100%", padding:"13px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", borderRadius:"12px", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", marginBottom:"11px" }}>Sign In</button>
            <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
              {[["Create Account",()=>{setModal(null);showToast("Redirecting to signup…");}],["Forgot Password",()=>{setModal(null);showToast("Reset email sent!");}]].map(([lb,fn])=>(
                <button key={lb} onClick={fn} style={{ flex:1, padding:"10px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"10px", color:T.subText, fontSize:"12px", fontWeight:"600", cursor:"pointer" }}>{lb}</button>
              ))}
            </div>
            <button onClick={()=>setModal(null)} style={{ display:"block", width:"100%", padding:"9px", background:"none", border:"none", color:T.mutedText, fontSize:"12px", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ══ EDIT PROFILE ══ */}
      {showEditProfile&&editDraft&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:600, backdropFilter:"blur(6px)" }} onClick={()=>setShowEditProfile(false)}>
          <div className="uml-edit-sheet" style={{ background:T.modalBg, borderRadius:"24px 24px 0 0", padding:"0 0 32px", width:"100%", maxWidth:"480px", maxHeight:"92vh", overflowY:"auto", border:`1px solid ${T.cardBorder}`, boxShadow:"0 -16px 60px rgba(0,0,0,0.18)" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
              <div style={{ width:"40px", height:"4px", background:T.handleBar, borderRadius:"2px" }} />
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 22px 18px", borderBottom:`1px solid ${T.divider}` }}>
              <div>
                <div style={{ fontSize:"17px", fontWeight:"800", color:T.white }}>Edit Profile</div>
                <div style={{ fontSize:"11px", color:T.mutedText, marginTop:"2px" }}>Update your public info</div>
              </div>
              <button onClick={()=>setShowEditProfile(false)} style={{ background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"50%", width:"32px", height:"32px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <MI name="close" size={17} color={T.subText} />
              </button>
            </div>
            <div style={{ padding:"20px 22px", display:"flex", flexDirection:"column", gap:"16px" }}>
              {/* Avatar */}
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", padding:"20px", background:T.sectionBg, borderRadius:"18px", border:`1px solid ${T.cardBorder}` }}>
                <div style={{ position:"relative" }}>
                  <LazyAvatar src={editDraft.avatar} alt="avatar" size={88} border="3px solid #2a8a5a" />
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity .2s", cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}
                    onClick={()=>document.getElementById("avatarFileInput").click()}>
                    <MI name="photo_camera" size={22} color="white" />
                  </div>
                </div>
                <input id="avatarFileInput" type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange} />
                <div style={{ display:"flex", gap:"8px" }}>
                  <button onClick={()=>document.getElementById("avatarFileInput").click()} style={{ padding:"8px 18px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", borderRadius:"20px", color:"#fff", fontSize:"12px", fontWeight:"700", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
                    <MI name="upload" size={14} color="#fff" /> Upload Photo
                  </button>
                  <button onClick={()=>{const seed=Math.random().toString(36).slice(2,8);setEditDraft(d=>({...d,avatar:`https://picsum.photos/seed/${seed}/200/200`}));}} style={{ padding:"8px 14px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"20px", color:T.subText, fontSize:"12px", fontWeight:"600", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px" }}>
                    <MI name="casino" size={14} color={T.subText} /> Random
                  </button>
                </div>
                <div style={{ fontSize:"11px", color:T.mutedText }}>JPG, PNG or GIF · Max 5MB</div>
              </div>

              {/* Text fields */}
              {[
                {key:"name",    label:"Full Name",   icon:"person",          placeholder:"Your display name"},
                {key:"handle",  label:"Handle",      icon:"alternate_email", placeholder:"@yourhandle"},
                {key:"location",label:"Location",    icon:"location_on",     placeholder:"City, Country"},
                {key:"email",   label:"Email",       icon:"mail",            placeholder:"you@example.com"},
              ].map(({key,label,icon,placeholder})=>(
                <div key={key}>
                  <div style={{ fontSize:"11px", color:T.subText, marginBottom:"6px", fontWeight:"600", display:"flex", alignItems:"center", gap:"5px" }}>
                    <MI name={icon} size={14} color={T.subText} />{label}
                  </div>
                  <input value={editDraft[key]||""} onChange={e=>setEditDraft(d=>({...d,[key]:e.target.value}))} placeholder={placeholder}
                    style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"12px 14px", fontSize:"14px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color .15s" }}
                    onFocus={e=>e.target.style.borderColor="rgba(42,138,90,0.5)"}
                    onBlur={e=>e.target.style.borderColor=T.inputBorder} />
                </div>
              ))}

              {/* Role/Title with visibility toggle */}
              <div>
                <div style={{ fontSize:"11px", color:T.subText, marginBottom:"6px", fontWeight:"600", display:"flex", alignItems:"center", gap:"5px" }}>
                  <MI name="badge" size={14} color={T.subText} /> Role / Title
                </div>
                <input value={editDraft.role||""} onChange={e=>setEditDraft(d=>({...d,role:e.target.value}))} placeholder="e.g. Freelance Photographer"
                  style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"12px 14px", fontSize:"14px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color .15s", marginBottom:"8px" }}
                  onFocus={e=>e.target.style.borderColor="rgba(42,138,90,0.5)"}
                  onBlur={e=>e.target.style.borderColor=T.inputBorder} />
                {/* Show on profile toggle */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderRadius:"12px", background:T.sectionBg, border:`1px solid ${T.cardBorder}` }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:"600", color:T.text }}>Show role on profile</div>
                    <div style={{ fontSize:"11px", color:T.subText, marginTop:"1px" }}>Visitors will see your role title</div>
                  </div>
                  <button onClick={()=>setEditDraft(d=>({...d,showRole:!d.showRole}))}
                    style={{ width:"44px", height:"24px", borderRadius:"12px", border:"none", cursor:"pointer", position:"relative", background:editDraft.showRole?"#2a8a5a":"#d0d8f0", transition:"background 0.2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:"3px", left:editDraft.showRole?"23px":"3px", width:"18px", height:"18px", borderRadius:"50%", background:"#ffffff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }} />
                  </button>
                </div>
              </div>

              {/* Receive Emails toggle — only meaningful if verified */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", borderRadius:"12px", background:T.sectionBg, border:`1px solid ${editDraft.verified ? T.cardBorder : T.emptyBorder}`, opacity:editDraft.verified ? 1 : 0.55 }}>
                <div style={{ flex:1, minWidth:0, marginRight:"12px" }}>
                  <div style={{ fontSize:"13px", fontWeight:"600", color:T.text, display:"flex", alignItems:"center", gap:"6px" }}>
                    <MI name="mail" size={15} color={T.green} />
                    Receive emails from followers
                    {!editDraft.verified && <span style={{ fontSize:"10px", background:"rgba(248,113,113,0.12)", color:"#f87171", padding:"1px 7px", borderRadius:"20px", border:"1px solid rgba(248,113,113,0.3)", fontWeight:"700" }}>Verified only</span>}
                  </div>
                  <div style={{ fontSize:"11px", color:T.subText, marginTop:"2px" }}>
                    {editDraft.verified ? "Verified followers can email you at your registered address" : "Get verified to enable this feature"}
                  </div>
                </div>
                <button
                  disabled={!editDraft.verified}
                  onClick={()=>{ if(editDraft.verified) setEditDraft(d=>({...d,receiveEmails:!d.receiveEmails})); }}
                  style={{ width:"44px", height:"24px", borderRadius:"12px", border:"none", cursor:editDraft.verified?"pointer":"not-allowed", position:"relative", background:editDraft.receiveEmails&&editDraft.verified?"#2a8a5a":"#d0d8f0", transition:"background 0.2s", flexShrink:0 }}>
                  <div style={{ position:"absolute", top:"3px", left:editDraft.receiveEmails&&editDraft.verified?"23px":"3px", width:"18px", height:"18px", borderRadius:"50%", background:"#ffffff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)", transition:"left 0.2s" }} />
                </button>
              </div>

              {/* Industry Category */}
              <div>
                <div style={{ fontSize:"11px", color:T.subText, marginBottom:"6px", fontWeight:"600", display:"flex", alignItems:"center", gap:"5px" }}>
                  <MI name="business_center" size={14} color={T.subText} /> Industry Category
                </div>
                <select value={editDraft.industry||"Photography"} onChange={e=>setEditDraft(d=>({...d,industry:e.target.value}))}
                  style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"12px 14px", fontSize:"14px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", cursor:"pointer" }}>
                  {INDUSTRY_CATEGORIES.map(cat=><option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {/* Bio */}
              <div>
                <div style={{ fontSize:"11px", color:T.subText, marginBottom:"6px", fontWeight:"600", display:"flex", alignItems:"center", gap:"5px" }}>
                  <MI name="notes" size={14} color={T.subText} /> Bio
                </div>
                <textarea value={editDraft.bio||""} onChange={e=>setEditDraft(d=>({...d,bio:e.target.value}))} placeholder="Tell the world about yourself…" rows={3}
                  style={{ width:"100%", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"12px", padding:"12px 14px", fontSize:"14px", color:T.text, outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical", lineHeight:1.6, transition:"border-color .15s" }}
                  onFocus={e=>e.target.style.borderColor="rgba(42,138,90,0.5)"}
                  onBlur={e=>e.target.style.borderColor=T.inputBorder} />
                <div style={{ fontSize:"11px", color:T.mutedText, marginTop:"4px", textAlign:"right" }}>{editDraft.bio?.length||0} chars</div>
              </div>

              {/* Save / Cancel */}
              <div style={{ display:"flex", gap:"10px", paddingTop:"4px" }}>
                <button onClick={()=>setShowEditProfile(false)} style={{ flex:1, padding:"13px", background:T.inputBg, border:`1px solid ${T.inputBorder}`, borderRadius:"14px", color:T.subText, fontSize:"14px", fontWeight:"600", cursor:"pointer" }}>Cancel</button>
                <button onClick={saveEditProfile} style={{ flex:2, padding:"13px", background:"linear-gradient(135deg,#2a8a5a,#1e6b44)", border:"none", borderRadius:"14px", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", boxShadow:"0 4px 16px rgba(42,138,90,0.3)", display:"flex", alignItems:"center", justifyContent:"center", gap:"7px" }}>
                  <MI name="check" size={17} color="#fff" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast&&(
        <div className="uml-toast" style={{ position:"fixed", bottom:"24px", left:"50%", transform:"translateX(-50%)", background:"#2a8a5a", color:"#fff", padding:"10px 22px", borderRadius:"30px", fontSize:"13px", fontWeight:"600", zIndex:999, boxShadow:"0 4px 20px rgba(42,138,90,0.35)", whiteSpace:"nowrap", pointerEvents:"none" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
