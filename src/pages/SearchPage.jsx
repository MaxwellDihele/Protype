import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CATEGORIES } from "../data/seed";
import { EmptyState, Select, Btn, Icon, Spinner } from "../components/ui";
import { ProductCard, BrandCard } from "../components/cards";

const PAGE_SIZE = 12;

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query,    setQuery]    = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort,     setSort]     = useState(searchParams.get("sort") || "newest");
  const [tab,      setTab]      = useState("products");

  // Products pagination state
  const [products,     setProducts]     = useState([]);
  const [prodLoading,  setProdLoading]  = useState(false);
  const [prodTotal,    setProdTotal]    = useState(0);
  const [prodPage,     setProdPage]     = useState(0);

  // Brands pagination state
  const [brands,       setBrands]       = useState([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [brandTotal,   setBrandTotal]   = useState(0);
  const [brandPage,    setBrandPage]    = useState(0);

  // Sync filters → URL
  useEffect(() => {
    const params = {};
    if (query)    params.q        = query;
    if (category) params.category = category;
    if (sort !== "newest") params.sort = sort;
    setSearchParams(params, { replace: true });
    // Reset and reload on filter change
    setProducts([]); setProdPage(0); setProdTotal(0);
    setBrands([]);   setBrandPage(0); setBrandTotal(0);
  }, [query, category, sort]);

  // Load products
  const loadProducts = useCallback(async (page) => {
    setProdLoading(true);
    let q = supabase.from("products").select("*, brands(*)", { count: "exact" });
    if (query)    q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    if (category) q = q.eq("category", category);
    if (sort === "newest")     q = q.order("created_at", { ascending: false });
    if (sort === "popular")    q = q.order("views",      { ascending: false });
    if (sort === "price_asc")  q = q.order("price",      { ascending: true  });
    if (sort === "price_desc") q = q.order("price",      { ascending: false });
    q = q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await q;
    setProducts(prev => page === 0 ? (data || []) : [...prev, ...(data || [])]);
    setProdTotal(count || 0);
    setProdPage(page);
    setProdLoading(false);
  }, [query, category, sort]);

  // Load brands
  const loadBrands = useCallback(async (page) => {
    setBrandLoading(true);
    let q = supabase.from("brands").select("*", { count: "exact" });
    if (query) q = q.or(`name.ilike.%${query}%,category.ilike.%${query}%`);
    q = q.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await q;
    setBrands(prev => page === 0 ? (data || []) : [...prev, ...(data || [])]);
    setBrandTotal(count || 0);
    setBrandPage(page);
    setBrandLoading(false);
  }, [query]);

  // Initial load
  useEffect(() => { loadProducts(0); }, [loadProducts]);
  useEffect(() => { loadBrands(0);   }, [loadBrands]);

  const hasMoreProducts = products.length < prodTotal;
  const hasMoreBrands   = brands.length   < brandTotal;

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
      {/* Filters */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontSize:"2rem", marginBottom:16 }}>Search</h2>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <div style={{ flex:"1 1 260px", position:"relative" }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products or brands..."
              style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:12, padding:"12px 16px 12px 42px", color:"var(--text)", fontSize:"0.95rem", outline:"none" }} />
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", display:"flex" }}><Icon name="search" size={18} color="var(--text3)" /></span>
          </div>
          <Select value={category} onChange={setCategory} options={[{value:"",label:"All Categories"}, ...CATEGORIES.map(c => ({value:c,label:c}))]} />
          <Select value={sort} onChange={setSort} options={[{value:"newest",label:"Newest"},{value:"popular",label:"Most Popular"},{value:"price_asc",label:"Price: Low → High"},{value:"price_desc",label:"Price: High → Low"}]} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:24 }}>
        {[["products",`Products (${prodTotal})`],["brands",`Brands (${brandTotal})`]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, fontSize:"0.9rem", cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      {/* Products tab */}
      {tab === "products" && (
        <>
          {products.length === 0 && !prodLoading
            ? <EmptyState icon="search_off" title="No products found" sub="Try adjusting your search or filters" />
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16, marginBottom:24 }}>
                {products.map(p => <ProductCard key={p.id} product={{ ...p, brand: p.brand_id, brandData: p.brands }} />)}
              </div>
          }
          {prodLoading && <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>}
          {hasMoreProducts && !prodLoading && (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
              <Btn variant="secondary" onClick={() => loadProducts(prodPage + 1)}>
                <Icon name="expand_more" size={18} />Load More Products
              </Btn>
            </div>
          )}
        </>
      )}

      {/* Brands tab */}
      {tab === "brands" && (
        <>
          {brands.length === 0 && !brandLoading
            ? <EmptyState icon="storefront" title="No brands found" sub="Try a different search term" />
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16, marginBottom:24 }}>
                {brands.map(b => <BrandCard key={b.id} brand={b} />)}
              </div>
          }
          {brandLoading && <div style={{ display:"flex", justifyContent:"center", padding:32 }}><Spinner /></div>}
          {hasMoreBrands && !brandLoading && (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
              <Btn variant="secondary" onClick={() => loadBrands(brandPage + 1)}>
                <Icon name="expand_more" size={18} />Load More Brands
              </Btn>
            </div>
          )}
        </>
      )}
    </div>
  );
};
