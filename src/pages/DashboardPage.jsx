import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/seed";
import { Card, Btn, Icon, EmptyState, Input, Textarea, Select, Badge, Spinner } from "../components/ui";

// ─── ImageUploader ────────────────────────────────────────────────────────────
const ImageUploader = ({ label, currentUrl, onUpload, bucket, pathPrefix, uploading, setUploading }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(currentUrl || "");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${pathPrefix}/${Date.now()}.${ext}`;
      const { uploadImage } = useApp();  // accessed via prop instead — see below
      void path; // handled via prop
      onUpload(file, path);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {label && <label style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        style={{ position:"relative", width:"100%", height:140, borderRadius:12, border:"2px dashed var(--border2)", background:"var(--bg3)", cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, transition:"border-color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.borderColor="var(--border2)"}
      >
        {preview ? (
          <>
            <img src={preview} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {uploading
                ? <Spinner />
                : <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                    <Icon name="photo_camera" size={28} color="#fff" />
                    <span style={{ fontSize:"0.75rem", color:"#fff", fontWeight:600 }}>Change image</span>
                  </div>
              }
            </div>
          </>
        ) : (
          <>
            <Icon name="add_photo_alternate" size={32} color="var(--text3)" />
            <span style={{ fontSize:"0.8rem", color:"var(--text2)", fontWeight:600 }}>Click to upload</span>
            <span style={{ fontSize:"0.72rem", color:"var(--text3)" }}>JPG, PNG, WEBP — max 5 MB</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
    </div>
  );
};

// ─── ImageUploaderReal (with uploadImage from context via prop) ───────────────
const ProductImageUploader = ({ currentUrls, onUrlsChange, brandId }) => {
  const { uploadImage } = useApp();
  const [previews,   setPreviews]   = useState(currentUrls || []);
  const [uploading,  setUploading]  = useState(false);
  const inputRef = useRef();

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const ext = file.name.split(".").pop();
        const path = `${brandId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        return await uploadImage(file, "product-images", path);
      }));
      const next = [...previews, ...urls].slice(0, 5); // max 5 images
      setPreviews(next);
      onUrlsChange(next);
    } catch (err) { alert("Upload failed: " + err.message); }
    setUploading(false);
  };

  const remove = (i) => {
    const next = previews.filter((_, idx) => idx !== i);
    setPreviews(next);
    onUrlsChange(next);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <label style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>Product Images (max 5)</label>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"flex-start" }}>
        {previews.map((url, i) => (
          <div key={i} style={{ position:"relative", width:80, height:80, borderRadius:10, overflow:"hidden", flexShrink:0, border:"1px solid var(--border)" }}>
            <img src={url} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            <button onClick={() => remove(i)} style={{ position:"absolute", top:2, right:2, background:"rgba(0,0,0,0.7)", border:"none", borderRadius:"50%", width:20, height:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="close" size={12} color="#fff" />
            </button>
          </div>
        ))}
        {previews.length < 5 && (
          <div onClick={() => inputRef.current?.click()}
            style={{ width:80, height:80, borderRadius:10, border:"2px dashed var(--border2)", background:"var(--bg3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:4, flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"}
            onMouseLeave={e => e.currentTarget.style.borderColor="var(--border2)"}
          >
            {uploading ? <Spinner /> : <><Icon name="add" size={22} color="var(--text3)" /><span style={{ fontSize:"0.65rem", color:"var(--text3)" }}>Upload</span></>}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:"none" }} />
    </div>
  );
};

// ─── BrandImageUploader ───────────────────────────────────────────────────────
const BrandImageUploader = ({ label, currentUrl, onUrlChange, brandId, type }) => {
  const { uploadImage } = useApp();
  const [preview,  setPreview]  = useState(currentUrl || "");
  const [uploading,setUploading]= useState(false);
  const inputRef = useRef();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("Image must be under 5 MB"); return; }
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${brandId}/${type}_${Date.now()}.${ext}`;
      const url = await uploadImage(file, "brand-assets", path);
      onUrlChange(url);
    } catch (err) { alert("Upload failed: " + err.message); }
    setUploading(false);
  };

  const isWide = type === "banner";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {label && <label style={{ fontSize:"0.8rem", fontWeight:600, color:"var(--text2)", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>}
      <div onClick={() => inputRef.current?.click()}
        style={{ position:"relative", width:"100%", height: isWide ? 120 : 80, borderRadius:12, border:"2px dashed var(--border2)", background:"var(--bg3)", cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:6 }}
        onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"}
        onMouseLeave={e => e.currentTarget.style.borderColor="var(--border2)"}
      >
        {preview ? (
          <>
            <img src={preview} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              {uploading ? <Spinner /> : <><Icon name="photo_camera" size={22} color="#fff" /><span style={{ fontSize:"0.72rem", color:"#fff", fontWeight:600, marginTop:4 }}>Change</span></>}
            </div>
          </>
        ) : (
          <>
            <Icon name="add_photo_alternate" size={28} color="var(--text3)" />
            <span style={{ fontSize:"0.75rem", color:"var(--text2)", fontWeight:600 }}>Upload {label}</span>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
    </div>
  );
};

// ─── BrandEditForm ────────────────────────────────────────────────────────────
const BrandEditForm = ({ brand, onSave, saving, onApplyBadge }) => {
  const [form, setForm] = useState({
    name: brand.name || "", description: brand.description || "",
    whatsapp: brand.whatsapp || "", website: brand.website || "",
    instagram: brand.instagram || "", twitter: brand.twitter || "", location: brand.location || "",
    logo: brand.logo || "", banner: brand.banner || "",
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const [applyType, setApplyType] = useState("");
  const [reason,    setReason]    = useState("");
  const [applying,  setApplying]  = useState(false);

  const handleApply = async () => {
    if (!reason.trim()) return;
    setApplying(true);
    await onApplyBadge(applyType, reason);
    setApplyType(""); setReason("");
    setApplying(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:"1.4rem", marginBottom:20 }}>Brand Profile</h3>
        {/* Logo + Banner uploaders */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16, marginBottom:20 }}>
          <BrandImageUploader label="Logo" currentUrl={form.logo} onUrlChange={url => set("logo")(url)} brandId={brand.id} type="logo" />
          <BrandImageUploader label="Banner" currentUrl={form.banner} onUrlChange={url => set("banner")(url)} brandId={brand.id} type="banner" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
          <Input label="Brand Name"       value={form.name}      onChange={set("name")}      required />
          <Input label="WhatsApp"         value={form.whatsapp}  onChange={set("whatsapp")}  placeholder="27821234567" />
          <Input label="Website"          value={form.website}   onChange={set("website")}   placeholder="https://..." />
          <Input label="Instagram"        value={form.instagram} onChange={set("instagram")} placeholder="yourbrand" />
          <Input label="Twitter / X" value={form.twitter} onChange={set("twitter")} placeholder="yourbrand" />
          <Input label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Cape Town, WC" />
        </div>
        <Textarea label="Description" value={form.description} onChange={set("description")} rows={4} />
        <div style={{ marginTop:16 }}>
          <Btn onClick={() => onSave(form)} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Btn>
        </div>
      </Card>

      {/* Badge Application Section */}
      <Card style={{ padding:24 }}>
        <h3 style={{ fontSize:"1.3rem", marginBottom:6 }}>Apply for a Badge</h3>
        <p style={{ color:"var(--text2)", fontSize:"0.85rem", marginBottom:20 }}>
          Current status: <Badge status={brand.status} />
        </p>

        {brand.status === "featured" ? (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px", background:"#f5b80018", borderRadius:10, border:"1px solid #f5b80033" }}>
            <Icon name="star" size={20} color="var(--gold)" />
            <span style={{ fontSize:"0.9rem", color:"var(--text)", fontWeight:600 }}>Your brand has the highest Featured badge!</span>
          </div>
        ) : (
          <>
            <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
              {(brand.status !== "verified" && brand.status !== "featured") && (
                <button onClick={() => setApplyType(applyType === "verified" ? "" : "verified")}
                  style={{ padding:"10px 18px", borderRadius:10, border:`2px solid ${applyType==="verified"?"var(--accent2)":"var(--border)"}`, background:applyType==="verified"?"#00d4aa18":"var(--bg3)", color:applyType==="verified"?"var(--accent2)":"var(--text2)", fontWeight:700, fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                  <Icon name="verified" size={16} color={applyType==="verified"?"var(--accent2)":"var(--text3)"} />Apply for Verified
                </button>
              )}
              <button onClick={() => setApplyType(applyType === "featured" ? "" : "featured")}
                style={{ padding:"10px 18px", borderRadius:10, border:`2px solid ${applyType==="featured"?"var(--gold)":"var(--border)"}`, background:applyType==="featured"?"#f5b80018":"var(--bg3)", color:applyType==="featured"?"var(--gold)":"var(--text2)", fontWeight:700, fontSize:"0.85rem", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                <Icon name="star" size={16} color={applyType==="featured"?"var(--gold)":"var(--text3)"} />Apply for Featured
              </button>
            </div>
            {applyType && (
              <div style={{ display:"flex", flexDirection:"column", gap:12, padding:16, background:"var(--bg2)", borderRadius:10, border:"1px solid var(--border)" }}>
                <div style={{ fontWeight:600, fontSize:"0.9rem" }}>
                  Why should your brand be <span style={{ color: applyType==="featured" ? "var(--gold)" : "var(--accent2)" }}>{applyType}</span>?
                </div>
                <Textarea value={reason} onChange={setReason} placeholder="Tell us about your brand, products, social media following, and why you deserve this badge..." rows={4} />
                <div style={{ display:"flex", gap:10 }}>
                  <Btn onClick={handleApply} disabled={applying || !reason.trim()} variant={applyType==="featured"?"gold":"primary"}>
                    {applying ? "Submitting..." : "Submit Application"}
                  </Btn>
                  <Btn variant="ghost" onClick={() => { setApplyType(""); setReason(""); }}>Cancel</Btn>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Application history */}
      <BadgeApplicationHistory brandId={brand.id} />
    </div>
  );
};

// ─── BadgeApplicationHistory ──────────────────────────────────────────────────
const BadgeApplicationHistory = ({ brandId }) => {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    supabase.from("badge_applications").select("*")
      .eq("brand_id", brandId).order("applied_at", { ascending: false })
      .then(({ data }) => setApps(data || []));
  }, [brandId]);

  if (!apps.length) return null;

  const statusColor = { pending:"#f5b800", approved:"#22c55e", rejected:"#ff3366" };
  const statusIcon  = { pending:"schedule", approved:"check_circle", rejected:"cancel" };

  return (
    <Card style={{ padding:24 }}>
      <h3 style={{ fontSize:"1.1rem", marginBottom:16 }}>Application History</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {apps.map(a => (
          <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 14px", background:"var(--bg2)", borderRadius:10, border:"1px solid var(--border)" }}>
            <Icon name={statusIcon[a.status]} size={20} color={statusColor[a.status]} style={{ marginTop:1, flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                <span style={{ fontWeight:700, fontSize:"0.9rem", textTransform:"capitalize" }}>{a.badge_type}</span>
                <span style={{ fontSize:"0.75rem", fontWeight:700, color:statusColor[a.status], textTransform:"uppercase", letterSpacing:"0.08em" }}>{a.status}</span>
                <span style={{ fontSize:"0.72rem", color:"var(--text3)" }}>{new Date(a.applied_at).toLocaleDateString()}</span>
              </div>
              {a.admin_note && (
                <p style={{ fontSize:"0.82rem", color:"var(--text2)", margin:0, fontStyle:"italic" }}>Admin: "{a.admin_note}"</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// ─── ProductModal ─────────────────────────────────────────────────────────────
const ProductModal = ({ product, brandId, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    name:        product?.name        || "",
    price:       product?.price       || "",
    description: product?.description || "",
    category:    product?.category    || CATEGORIES[0],
    stock:       product?.stock       || "in_stock",
    images:      product?.images      || [],
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:500, display:"flex", alignItems:"flex-start", justifyContent:"center", overflowY:"auto", padding:"24px 16px" }}>
      <div style={{ background:"var(--card)", borderRadius:"var(--radius)", padding:28, maxWidth:600, width:"100%", border:"1px solid var(--border)", marginTop:20, marginBottom:40 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
          <h3 style={{ fontSize:"1.4rem" }}>{product ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} style={{ background:"var(--bg3)", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"var(--text)", display:"flex", alignItems:"center" }}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Image uploader */}
          <ProductImageUploader
            currentUrls={form.images}
            onUrlsChange={urls => set("images")(urls)}
            brandId={brandId}
          />
          <Input label="Product Name" value={form.name} onChange={set("name")} required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Input label="Price (ZAR)" value={form.price} onChange={set("price")} type="number" placeholder="0" />
            <Select label="Stock" value={form.stock} onChange={set("stock")}
              options={[{value:"in_stock",label:"In Stock"},{value:"out_of_stock",label:"Out of Stock"}]} />
          </div>
          <Select label="Category" value={form.category} onChange={set("category")}
            options={CATEGORIES.map(c => ({ value:c, label:c }))} />
          <Textarea label="Description" value={form.description} onChange={set("description")} rows={4} />
        </div>
        <div style={{ display:"flex", gap:12, marginTop:24, justifyContent:"flex-end" }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={saving || !form.name || !form.price}
            onClick={() => onSave({ name:form.name, price:Number(form.price), description:form.description, category:form.category, stock:form.stock, images:form.images })}>
            {saving ? "Saving..." : product ? "Save Changes" : "Add Product"}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ─── DashboardPage ────────────────────────────────────────────────────────────
export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, addProduct, updateProduct, deleteProduct, updateBrand, applyForBadge, showToast } = useApp();
  const [tab,         setTab]         = useState("products");
  const [showModal,   setShowModal]   = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [myProducts,  setMyProducts]  = useState([]);
  const [brand,       setBrand]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.brand_id) return;
    setLoading(true);
    const [{ data: b }, { data: prods }] = await Promise.all([
      supabase.from("brands").select("*").eq("id", user.brand_id).single(),
      supabase.from("products").select("*").eq("brand_id", user.brand_id).order("created_at", { ascending: false }),
    ]);
    setBrand(b);
    setMyProducts(prods || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  if (!user || user.role !== "seller") return (
    <EmptyState icon="lock" title="Access denied" sub="Please log in as a seller" action={<Btn onClick={() => navigate("/login")}>Log In</Btn>} />
  );

  const handleSaveProduct = async (data) => {
    setSaving(true);
    try {
      if (editProduct) { await updateProduct(editProduct.id, data); showToast("Product updated!"); }
      else { await addProduct({ ...data, brand_id: user.brand_id }); showToast("Product added!"); }
      await loadData();
    } catch (e) { showToast(e.message, "error"); }
    setSaving(false); setShowModal(false); setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await deleteProduct(id); showToast("Product deleted"); await loadData(); }
    catch (e) { showToast(e.message, "error"); }
  };

  const handleSaveBrand = async (data) => {
    setSaving(true);
    try { await updateBrand(user.brand_id, data); showToast("Brand updated!"); await loadData(); }
    catch (e) { showToast(e.message, "error"); }
    setSaving(false);
  };

  const handleApplyBadge = async (badgeType, reason) => {
    try {
      await applyForBadge(user.brand_id, badgeType, reason);
      showToast("Application submitted! Admin will review it.");
    } catch (e) { showToast(e.message, "error"); }
  };

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:"2.2rem" }}>Seller Dashboard</h1>
          <p style={{ color:"var(--text2)" }}>{brand?.name} • {myProducts.length} listings</p>
        </div>
        <Btn onClick={() => { setEditProduct(null); setShowModal(true); }}>
          <Icon name="add" size={18} color="#fff" />Add Product
        </Btn>
      </div>

      {loading ? <div style={{ display:"flex", justifyContent:"center", padding:60 }}><Spinner /></div> : (
        <>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px, 1fr))", gap:16, marginBottom:32 }}>
            {[
              ["Total Products", myProducts.length,                                             "inventory_2"],
              ["In Stock",       myProducts.filter(p=>p.stock==="in_stock").length,             "check_circle"],
              ["Out of Stock",   myProducts.filter(p=>p.stock==="out_of_stock").length,         "cancel"],
              ["Total Views",    myProducts.reduce((a,p)=>a+(p.views||0),0).toLocaleString(),  "visibility"],
            ].map(([label,val,icon]) => (
              <Card key={label} style={{ padding:20, textAlign:"center" }}>
                <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}><Icon name={icon} size={28} color="var(--accent)" /></div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:"2rem", color:"var(--accent)" }}>{val}</div>
                <div style={{ fontSize:"0.75rem", color:"var(--text2)", fontWeight:600 }}>{label}</div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
            {[["products","My Products"],["brand","Brand & Badges"]].map(([t,l]) => (
              <button key={t} onClick={() => setTab(t)}
                style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, cursor:"pointer" }}>
                {l}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {tab === "products" && (
            myProducts.length === 0
              ? <EmptyState icon="inventory_2" title="No products yet" sub="Add your first product listing"
                  action={<Btn onClick={() => setShowModal(true)}><Icon name="add" size={16} color="#fff"/>Add Product</Btn>} />
              : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
                  {myProducts.map(p => {
                    const img = Array.isArray(p.images) ? p.images[0] : p.images;
                    return (
                      <Card key={p.id} style={{ display:"flex", flexDirection:"column" }}>
                        <div style={{ aspectRatio:"4/3", overflow:"hidden", background:"var(--bg2)" }}>
                          <img src={img || `https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}`} alt={p.name}
                            style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        </div>
                        <div style={{ padding:14, flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                          <div style={{ fontWeight:600, fontSize:"0.95rem" }}>{p.name}</div>
                          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <span style={{ fontFamily:"'Bebas Neue'", color:"var(--accent)", fontSize:"1.2rem" }}>R{Number(p.price).toLocaleString()}</span>
                            <Badge status={p.stock} />
                          </div>
                          <div style={{ fontSize:"0.8rem", color:"var(--text2)", display:"flex", alignItems:"center", gap:4 }}>
                            <Icon name="visibility" size={14} color="var(--text3)" />{p.views||0} views
                          </div>
                          <div style={{ display:"flex", gap:8, marginTop:"auto", paddingTop:8 }}>
                            <Btn size="sm" variant="secondary" full onClick={() => { setEditProduct(p); setShowModal(true); }}>
                              <Icon name="edit" size={14}/>Edit
                            </Btn>
                            <Btn size="sm" variant="danger" onClick={() => handleDelete(p.id)}>
                              <Icon name="delete" size={14} color="#ff3366"/>
                            </Btn>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
          )}

          {tab === "brand" && brand && (
            <BrandEditForm brand={brand} onSave={handleSaveBrand} saving={saving} onApplyBadge={handleApplyBadge} />
          )}
        </>
      )}

      {showModal && (
        <ProductModal
          product={editProduct}
          brandId={user.brand_id}
          onClose={() => { setShowModal(false); setEditProduct(null); }}
          onSave={handleSaveProduct}
          saving={saving}
        />
      )}
    </div>
  );
};
