import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Card, Btn, Icon, EmptyState, Badge } from "../components/ui";

export const AdminPage = () => {
  const navigate = useNavigate();
  const { user, brands, products, updateBrand, deleteProduct, showToast } = useApp();
  const [tab, setTab] = useState("brands");

  if (!user || user.role !== "admin") return <EmptyState icon="lock" title="Admin access only" sub="" action={<Btn onClick={() => navigate("/login")}>Log In</Btn>} />;

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <h1 style={{ fontSize:"2.2rem", marginBottom:8 }}>Admin Panel</h1>
      <p style={{ color:"var(--text2)", marginBottom:28 }}>Manage the MzansiStreet marketplace</p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:16, marginBottom:32 }}>
        {[["Brands",brands.length,"storefront"],["Products",products.length,"inventory_2"],["Featured",brands.filter(b=>b.status==="featured").length,"star"],["Verified",brands.filter(b=>b.status==="verified").length,"verified"]].map(([label,val,icon]) => (
          <Card key={label} style={{ padding:20, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Icon name={icon} size={28} color="var(--accent)" /></div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:"2rem", color:"var(--accent)" }}>{val}</div>
            <div style={{ fontSize:"0.75rem", color:"var(--text2)", fontWeight:600 }}>{label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
        {[["brands","Brands"],["products","Products"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      {tab === "brands" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {brands.map(b => (
            <Card key={b.id} style={{ padding:16, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
              <img src={b.logo} alt={b.name} style={{ width:48, height:48, borderRadius:10, flexShrink:0 }} />
              <div style={{ flex:1, minWidth:160 }}>
                <div style={{ fontWeight:700, marginBottom:2 }}>{b.name}</div>
                <div style={{ fontSize:"0.8rem", color:"var(--text2)" }}>{b.category} • {products.filter(p=>p.brand===b.id).length} products</div>
              </div>
              <Badge status={b.status} />
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                {b.status!=="featured" && <Btn size="sm" variant="gold" onClick={() => { updateBrand(b.id,{status:"featured"}); showToast(`${b.name} is now Featured!`); }}><Icon name="star" size={14} color="#000"/>Feature</Btn>}
                {b.status!=="verified"&&b.status!=="featured" && <Btn size="sm" onClick={() => { updateBrand(b.id,{status:"verified"}); showToast(`${b.name} verified!`); }}><Icon name="verified" size={14} color="#fff"/>Verify</Btn>}
                {(b.status==="verified"||b.status==="featured") && <Btn size="sm" variant="danger" onClick={() => { updateBrand(b.id,{status:"unverified"}); showToast("Status removed"); }}><Icon name="remove_circle" size={14} color="#ff3366"/>Remove Badge</Btn>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "products" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {products.map(p => {
            const brand = brands.find(b => b.id === p.brand);
            return (
              <Card key={p.id} style={{ padding:16, display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                <img src={p.images[0]} alt={p.name} style={{ width:56, height:56, borderRadius:8, objectFit:"cover", flexShrink:0, background:"var(--bg2)" }} />
                <div style={{ flex:1, minWidth:160 }}>
                  <div style={{ fontWeight:600, marginBottom:2 }}>{p.name}</div>
                  <div style={{ fontSize:"0.8rem", color:"var(--text2)", display:"flex", alignItems:"center", gap:4 }}>{brand?.name} • R{p.price.toLocaleString()} • <Icon name="visibility" size={13} color="var(--text3)"/>{p.views}</div>
                </div>
                <Badge status={p.stock} />
                <Btn size="sm" variant="danger" onClick={() => { if(confirm(`Remove "${p.name}"?`)){ deleteProduct(p.id); showToast("Product removed"); } }}><Icon name="delete" size={14} color="#ff3366"/>Remove</Btn>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
