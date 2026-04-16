import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/seed";
import { Card, Btn, Icon, EmptyState, Input, Textarea, Select, Badge } from "../components/ui";

const BrandEditForm = ({ brand, onSave }) => {
  const [form, setForm] = useState({ name:brand.name, description:brand.description, whatsapp:brand.whatsapp, website:brand.website, instagram:brand.instagram, twitter:brand.twitter });
  const set = k => v => setForm(f => ({...f,[k]:v}));
  return (
    <Card style={{ padding:24 }}>
      <h3 style={{ fontSize:"1.4rem", marginBottom:20 }}>Edit Brand Profile</h3>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Input label="Brand Name"       value={form.name}      onChange={set("name")}      required />
        <Input label="WhatsApp Number"  value={form.whatsapp}  onChange={set("whatsapp")}  placeholder="27821234567" />
        <Input label="Website URL"      value={form.website}   onChange={set("website")}   placeholder="https://..." />
        <Input label="Instagram Handle" value={form.instagram} onChange={set("instagram")} placeholder="yourbrand" />
        <Input label="Twitter Handle"   value={form.twitter}   onChange={set("twitter")}   placeholder="yourbrand" />
      </div>
      <Textarea label="Description" value={form.description} onChange={set("description")} rows={4} />
      <div style={{ marginTop:16 }}><Btn onClick={() => onSave(form)}>Save Changes</Btn></div>
    </Card>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({ name:product?.name||"", price:product?.price||"", description:product?.description||"", category:product?.category||CATEGORIES[0], stock:product?.stock||"in_stock", images:product?.images||["https://picsum.photos/seed/new/400/400"] });
  const set = k => v => setForm(f => ({...f,[k]:v}));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", overflowY:"auto", padding:"24px 16px" }}>
      <div style={{ background:"var(--card)", borderRadius:"var(--radius)", padding:28, maxWidth:580, width:"100%", border:"1px solid var(--border)", marginTop:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <h3 style={{ fontSize:"1.4rem" }}>{product?"Edit Product":"Add New Product"}</h3>
          <button onClick={onClose} style={{ background:"var(--bg3)", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"var(--text)", display:"flex", alignItems:"center" }}><Icon name="close" size={18} /></button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Input label="Product Name" value={form.name} onChange={set("name")} required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Price (ZAR)" value={form.price} onChange={set("price")} type="number" placeholder="0" />
            <Select label="Stock Status" value={form.stock} onChange={set("stock")} options={[{value:"in_stock",label:"In Stock"},{value:"out_of_stock",label:"Out of Stock"}]} />
          </div>
          <Select label="Category" value={form.category} onChange={set("category")} options={CATEGORIES.map(c => ({value:c,label:c}))} />
          <Textarea label="Description" value={form.description} onChange={set("description")} rows={4} />
          <Input label="Image URL (main)" value={form.images[0]} onChange={v => set("images")([v,...form.images.slice(1)])} placeholder="https://..." />
        </div>
        <div style={{ display:"flex", gap:12, marginTop:24, justifyContent:"flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => onSave({...form,price:Number(form.price)})}>{product?"Save Changes":"Add Product"}</Btn>
        </div>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const navigate = useNavigate();

  const {
    user,
    profile,
    loading,
    products,
    brands,
    addProduct,
    updateProduct,
    deleteProduct,
    updateBrand,
    showToast
  } = useApp();
  
  if (loading) return null;
  
  if (!user || profile?.role !== "seller") {
    return (
      <EmptyState
        icon="lock"
        title="Access denied"
        sub="Please log in as a seller"
        action={<Btn onClick={() => navigate("/login")}>Log In</Btn>}
      />
    );
  }
  const [tab,            setTab]            = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct,    setEditProduct]    = useState(null);

  const brand = brands.find(b => b.id === profile?.brand_id);
  const myProducts = products.filter(p => p.brand === profile?.brand_id);

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:"2.2rem" }}>Seller Dashboard</h1>
          <p style={{ color:"var(--text2)" }}>{brand?.name} • {myProducts.length} listings</p>
        </div>
        <Btn onClick={() => { setEditProduct(null); setShowAddProduct(true); }}><Icon name="add" size={18} color="#fff" />Add Product</Btn>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:16, marginBottom:32 }}>
        {[["Total Products",myProducts.length,"inventory_2"],["In Stock",myProducts.filter(p=>p.stock==="in_stock").length,"check_circle"],["Out of Stock",myProducts.filter(p=>p.stock==="out_of_stock").length,"cancel"],["Total Views",myProducts.reduce((a,p)=>a+p.views,0).toLocaleString(),"visibility"]].map(([label,val,icon]) => (
          <Card key={label} style={{ padding:20, textAlign:"center" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Icon name={icon} size={28} color="var(--accent)" /></div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:"2rem", color:"var(--accent)" }}>{val}</div>
            <div style={{ fontSize:"0.75rem", color:"var(--text2)", fontWeight:600 }}>{label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
        {[["products","My Products"],["brand","Brand Profile"]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      {tab === "products" && (
        myProducts.length === 0
          ? <EmptyState icon="inventory_2" title="No products yet" sub="Add your first product listing" action={<Btn onClick={() => setShowAddProduct(true)}><Icon name="add" size={16} color="#fff"/>Add Product</Btn>} />
          : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
              {myProducts.map(p => (
                <Card key={p.id} style={{ display:"flex", flexDirection:"column" }}>
                  <div style={{ aspectRatio:"16/9", overflow:"hidden", background:"var(--bg2)" }}><img src={p.images[0]} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
                  <div style={{ padding:14, flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ fontWeight:600 }}>{p.name}</div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ fontFamily:"'Bebas Neue'", color:"var(--accent)", fontSize:"1.2rem" }}>R{p.price.toLocaleString()}</span>
                      <Badge status={p.stock} />
                    </div>
                    <div style={{ fontSize:"0.8rem", color:"var(--text2)", display:"flex", alignItems:"center", gap:4 }}><Icon name="visibility" size={14} color="var(--text3)" />{p.views} views</div>
                    <div style={{ display:"flex", gap:8, marginTop:"auto", paddingTop:8 }}>
                      <Btn size="sm" variant="secondary" full onClick={() => { setEditProduct(p); setShowAddProduct(true); }}><Icon name="edit" size={14}/>Edit</Btn>
                      <Btn size="sm" variant="danger" onClick={() => { if(confirm("Delete this product?")){ deleteProduct(p.id); showToast("Product deleted"); } }}><Icon name="delete" size={14} color="#ff3366"/></Btn>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
      )}

      {tab === "brand" && brand && <BrandEditForm brand={brand} onSave={data => { updateBrand(brand.id,data); showToast("Brand updated!"); }} />}

      {showAddProduct && (
        <ProductModal
          product={editProduct}
          brandId={user.brandId}
          onClose={() => { setShowAddProduct(false); setEditProduct(null); }}
          onSave={data => {
            if (editProduct) { updateProduct(editProduct.id,data); showToast("Product updated!"); }
            else { addProduct({...data,brand:user.brandId}); showToast("Product added!"); }
            setShowAddProduct(false); setEditProduct(null);
          }}
        />
      )}
    </div>
  );
};
