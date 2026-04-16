import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/seed";
import { EmptyState, Select, Btn, Icon } from "../components/ui";
import { ProductCard, BrandCard } from "../components/cards";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, brands } = useApp();

  const [query,       setQuery]       = useState(searchParams.get("q") || "");
  const [category,    setCategory]    = useState(searchParams.get("category") || "");
  const [sort,        setSort]        = useState(searchParams.get("sort") || "newest");
  const [tab,         setTab]         = useState("products");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 12;

  // Sync state → URL
  useEffect(() => {
    const params = {};
    if (query)    params.q        = query;
    if (category) params.category = category;
    if (sort !== "newest") params.sort = sort;
    setSearchParams(params, { replace: true });
    setCurrentPage(1);
  }, [query, category, sort]);

  const filteredProducts = useMemo(() => {
    let res = [...products];
    if (query)    res = res.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()));
    if (category) res = res.filter(p => p.category === category);
    if (sort === "newest")     res.sort((a,b) => new Date(b.created_at)-new Date(a.created_at));
    if (sort === "price_asc")  res.sort((a,b) => a.price-b.price);
    if (sort === "price_desc") res.sort((a,b) => b.price-a.price);
    if (sort === "popular")    res.sort((a,b) => b.views-a.views);
    return res;
  }, [products, query, category, sort]);

  const filteredBrands = useMemo(() => {
    if (!query) return brands;
    return brands.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.category.toLowerCase().includes(query.toLowerCase()));
  }, [brands, query]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const paginated  = filteredProducts.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);

  return (
    <div className="fade-in" style={{ maxWidth:1200, margin:"0 auto", padding:"32px 16px" }}>
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

      <div style={{ display:"flex", gap:0, borderBottom:"1px solid var(--border)", marginBottom:24 }}>
        {[["products",`Products (${filteredProducts.length})`],["brands",`Brands (${filteredBrands.length})`]].map(([t,l]) => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", background:"none", border:"none", borderBottom:`2px solid ${tab===t?"var(--accent)":"transparent"}`, color:tab===t?"var(--accent)":"var(--text2)", fontWeight:600, fontSize:"0.9rem", cursor:"pointer", transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      {tab === "products" && (
        <>
          {paginated.length === 0
            ? <EmptyState icon="search_off" title="No products found" sub="Try adjusting your search or filters" />
            : <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16, marginBottom:32 }}>{paginated.map(p => <ProductCard key={p.id} product={p} />)}</div>
          }
          {totalPages > 1 && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
              <Btn size="sm" variant="secondary" disabled={currentPage===1} onClick={() => setCurrentPage(p => p-1)}>← Prev</Btn>
              {Array.from({length:totalPages},(_,i) => (
                <button key={i} onClick={() => setCurrentPage(i+1)} style={{ width:36, height:36, borderRadius:8, border:"1px solid var(--border)", background:currentPage===i+1?"var(--accent)":"var(--bg3)", color:currentPage===i+1?"#fff":"var(--text)", cursor:"pointer", fontWeight:600, fontSize:"0.85rem" }}>{i+1}</button>
              ))}
              <Btn size="sm" variant="secondary" disabled={currentPage===totalPages} onClick={() => setCurrentPage(p => p+1)}>Next →</Btn>
            </div>
          )}
        </>
      )}

      {tab === "brands" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:16 }}>
          {filteredBrands.length === 0
            ? <EmptyState icon="storefront" title="No brands found" sub="Try a different search term" />
            : filteredBrands.map(b => <BrandCard key={b.id} brand={b} />)
          }
        </div>
      )}
    </div>
  );
};
