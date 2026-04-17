import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";
import { Card, Btn, Icon, EmptyState, Badge, Spinner, Textarea } from "../components/ui";

// ─── AdminPage ────────────────────────────────────────────────────────────────
export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, updateBrand, deleteProduct, reviewApplication, showToast } = useApp();
  const [tab,          setTab]          = useState("applications");
  const [brands,       setBrands]       = useState([]);
  const [products,     setProducts]     = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [reviewNotes,  setReviewNotes]  = useState({}); // appId → note
  const [reviewing,    setReviewing]    = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [{ data: b }, { data: p }, { data: apps }] = await Promise.all([
      supabase.from("brands").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*, brands(name)").order("created_at", { ascending: false }),
      supabase.from("badge_applications")
        .select("*, brands(name, logo, status, category)")
        .order("applied_at", { ascending: false }),
    ]);
    setBrands(b || []);
    setProducts(p || []);
    setApplications(apps || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user || user.role !== "admin") return (
    <EmptyState icon="lock" title="Admin access only" sub=""
      action={<Btn onClick={() => navigate("/login")}>Log In</Btn>} />
  );

  const pendingCount = applications.filter(a => a.status === "pending").length;

  const handleReview = async (appId, decision) => {
    setReviewing(appId);
    try {
      await reviewApplication(appId, decision, reviewNotes[appId] || "");
      showToast(decision === "approved" ? "Badge approved!" : "Application rejected");
      await loadData();
    } catch (e) { showToast(e.message, "error"); }
    setReviewing(null);
  };

  const handleUpdateBrand = async (id, updates, msg) => {
    try { await updateBrand(id, updates); showToast(msg); await loadData(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!confirm(`Remove "${name}"?`)) return;
    try { await deleteProduct(id); showToast("Product removed"); await loadData(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const statusColor = { pending:"#f5b800", approved:"#22c55e", rejected:"#ff3366" };
  const statusBg    = { pending:"#f5b80018", approved:"#22c55e18", rejected:"#ff336618" };
  const statusIcon  = { pending:"schedule", approved:"check_circle", rejected:"cancel" };

  const tabs = [
    ["applications", `Applications${pendingCount ? ` (${pendingCount})` : ""}`],
    ["brands",       "Brands"],
    ["products",     "Products"],
  ];

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.2rem", marginBottom:8 }}>Admin Panel</h1>
      <p style={{ color:"var(--text2)", marginBottom:28 }}>Manage MzansiStreet</p>

      {loading ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner /></div> : (
        <>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:16, marginBottom:32 }}>
            {[
              ["Brands",       brands.length,                                      "storefront"],
              ["Products",     products.length,                                    "inventory_2"],
              ["Pending",      pendingCount,                                        "pending_actions"],
              ["Featured",     brands.filter(b=>b.status==="featured").length,     "star"],
            ].map(([label,val,icon]) => (
              <Card key={label} style={{ padding:20, textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Icon name={icon} size={28} color="var(--accent)" /></div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:"2rem", color: label==="Pending"&&val>0?"var(--gold)":"var(--accent)" }}>{val}</div>
                <div style={{ fontSize:"0.75rem", color:"var(--text2)", fontWeight:600 }}>{label}</div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
            {tabs.map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, cursor:"pointer", position:"relative" }}>
                {l}
                {t==="applications" && pendingCount > 0 && (
                  <span style={{ marginLeft:4, background:"var(--gold)", color:"#000", borderRadius:99, padding:"1px 7px", fontSize:"0.7rem", fontWeight:800 }}>{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Badge Applications tab ── */}
          {tab === "applications" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {applications.length === 0 && (
                <EmptyState icon="pending_actions" title="No applications yet" sub="Badge applications from sellers will appear here" />
              )}
              {applications.map(app => {
                const brand = app.brands;
                const note  = reviewNotes[app.id] || "";
                return (
                  <Card key={app.id} style={{ padding:20 }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
                      <img src={brand?.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${app.brand_id}`} alt=""
                        style={{ width:52, height:52, borderRadius:12, flexShrink:0, background:"var(--bg3)" }} />
                      <div style={{ flex:1, minWidth:200 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, flexWrap:"wrap" }}>
                          <span style={{ fontWeight:700, fontSize:"1rem" }}>{brand?.name}</span>
                          <Badge status={brand?.status} />
                          {/* Badge type chip */}
                          <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 10px", borderRadius:99, background: app.badge_type==="featured"?"#f5b80022":"#00d4aa22", color: app.badge_type==="featured"?"var(--gold)":"var(--accent2)", fontSize:"0.72rem", fontWeight:800, textTransform:"uppercase" }}>
                            <Icon name={app.badge_type==="featured"?"star":"verified"} size={11} color={app.badge_type==="featured"?"var(--gold)":"var(--accent2)"} />
                            {app.badge_type}
                          </span>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 10px", borderRadius:99, background:statusBg[app.status], color:statusColor[app.status], fontSize:"0.72rem", fontWeight:800, textTransform:"uppercase" }}>
                            <Icon name={statusIcon[app.status]} size={11} color={statusColor[app.status]} />{app.status}
                          </span>
                        </div>
                        <div style={{ fontSize:"0.75rem", color:"var(--text3)", marginBottom:10 }}>
                          Applied {new Date(app.applied_at).toLocaleDateString("en-ZA", { day:"numeric", month:"short", year:"numeric" })}
                          {app.reviewed_at && ` · Reviewed ${new Date(app.reviewed_at).toLocaleDateString("en-ZA", { day:"numeric", month:"short" })}`}
                        </div>
                        <div style={{ background:"var(--bg2)", borderRadius:8, padding:"10px 14px", border:"1px solid var(--border)", marginBottom: app.status==="pending"?14:0 }}>
                          <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Seller's reason</div>
                          <p style={{ fontSize:"0.88rem", color:"var(--text)", margin:0, lineHeight:1.6 }}>{app.reason}</p>
                        </div>
                        {app.admin_note && app.status !== "pending" && (
                          <div style={{ marginTop:10, padding:"8px 12px", background:"var(--bg3)", borderRadius:8, fontSize:"0.82rem", color:"var(--text2)", fontStyle:"italic" }}>
                            Admin note: "{app.admin_note}"
                          </div>
                        )}
                        {app.status === "pending" && (
                          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                            <Textarea
                              value={note}
                              onChange={v => setReviewNotes(prev => ({ ...prev, [app.id]: v }))}
                              placeholder="Optional admin note (shown to seller)..."
                              rows={2}
                            />
                            <div style={{ display:"flex", gap:10 }}>
                              <Btn variant="primary" disabled={reviewing===app.id} onClick={() => handleReview(app.id,"approved")}>
                                <Icon name="check_circle" size={16} color="#fff"/>{reviewing===app.id?"Approving...":"Approve"}
                              </Btn>
                              <Btn variant="danger" disabled={reviewing===app.id} onClick={() => handleReview(app.id,"rejected")}>
                                <Icon name="cancel" size={16} color="#ff3366"/>{reviewing===app.id?"...":"Reject"}
                              </Btn>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* ── Brands tab ── */}
          {tab === "brands" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {brands.map(b => (
                <Card key={b.id} style={{ padding:16, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  <img src={b.logo || `https://api.dicebear.com/7.x/shapes/svg?seed=${b.id}`} alt={b.name}
                    style={{ width:48, height:48, borderRadius:10, flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:160 }}>
                    <div style={{ fontWeight:700, marginBottom:2 }}>{b.name}</div>
                    <div style={{ fontSize:"0.8rem", color:"var(--text2)" }}>{b.category}</div>
                  </div>
                  <Badge status={b.status} />
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {b.status!=="featured" && (
                      <Btn size="sm" variant="gold" onClick={() => handleUpdateBrand(b.id,{status:"featured"},`${b.name} is now Featured!`)}>
                        <Icon name="star" size={14} color="#000"/>Feature
                      </Btn>
                    )}
                    {b.status!=="verified" && b.status!=="featured" && (
                      <Btn size="sm" onClick={() => handleUpdateBrand(b.id,{status:"verified"},`${b.name} verified!`)}>
                        <Icon name="verified" size={14} color="#fff"/>Verify
                      </Btn>
                    )}
                    {(b.status==="verified"||b.status==="featured") && (
                      <Btn size="sm" variant="danger" onClick={() => handleUpdateBrand(b.id,{status:"unverified"},"Badge removed")}>
                        <Icon name="remove_circle" size={14} color="#ff3366"/>Remove
                      </Btn>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ── Products tab ── */}
          {tab === "products" && (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {products.map(p => {
                const img = Array.isArray(p.images) ? p.images[0] : p.images;
                return (
                  <Card key={p.id} style={{ padding:16, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                    <img src={img || `https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}`} alt={p.name}
                      style={{ width:56, height:56, borderRadius:8, objectFit:"cover", flexShrink:0, background:"var(--bg2)" }} />
                    <div style={{ flex:1, minWidth:160 }}>
                      <div style={{ fontWeight:600, marginBottom:2 }}>{p.name}</div>
                      <div style={{ fontSize:"0.8rem", color:"var(--text2)", display:"flex", alignItems:"center", gap:4 }}>
                        {p.brands?.name} · R{Number(p.price).toLocaleString()} ·
                        <Icon name="visibility" size={13} color="var(--text3)"/>{p.views||0}
                      </div>
                    </div>
                    <Badge status={p.stock} />
                    <Btn size="sm" variant="danger" onClick={() => handleDeleteProduct(p.id, p.name)}>
                      <Icon name="delete" size={14} color="#ff3366"/>Remove
                    </Btn>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
