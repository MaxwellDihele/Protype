import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase";

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [theme,       setTheme]       = useState("dark");
  const [user,        setUser]        = useState(null);
  const [toast,       setToast]       = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Restore session ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) await loadProfile(session.user);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) await loadProfile(session.user);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (authUser) => {
    const { data: profile } = await supabase
      .from("profiles").select("*").eq("id", authUser.id).single();
    setUser(profile ? { ...authUser, ...profile } : authUser);
  };

  // ── Toast ────────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Auth: Sign Up ────────────────────────────────────────────────────────────
  const signUp = useCallback(async ({ email, password, name, brandName, category }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    const userId = data.user.id;
    const { data: brand, error: brandErr } = await supabase
      .from("brands")
      .insert({ name: brandName, category, owner: userId, status: "unverified" })
      .select().single();
    if (brandErr) return { error: brandErr };
    const { error: profileErr } = await supabase
      .from("profiles")
      .insert({ id: userId, name, role: "seller", brand_id: brand.id });
    if (profileErr) return { error: profileErr };
    return { data };
  }, []);

  // ── Auth: Login ──────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    await loadProfile(data.user);
    return { data };
  }, []);

  // ── Auth: Logout ─────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // ── Storage: Upload image ────────────────────────────────────────────────────
  // bucket: "product-images" | "brand-assets"
  // path: e.g. `${userId}/${Date.now()}.jpg`
  const uploadImage = useCallback(async (file, bucket, path) => {
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600", upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }, []);

  // ── Products ─────────────────────────────────────────────────────────────────
  const addProduct = useCallback(async (prod) => {
    const { data, error } = await supabase
      .from("products").insert({ ...prod, views: 0 }).select().single();
    if (error) throw error;
    return data;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
    const { error } = await supabase.from("products").update(updates).eq("id", id);
    if (error) throw error;
  }, []);

  const deleteProduct = useCallback(async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  }, []);

  const incrementViews = useCallback(async (id) => {
    await supabase.rpc("increment_product_views", { product_id: id });
  }, []);

  // ── Brands ───────────────────────────────────────────────────────────────────
  const updateBrand = useCallback(async (id, updates) => {
    const { error } = await supabase.from("brands").update(updates).eq("id", id);
    if (error) throw error;
  }, []);

  // ── Badge Applications ───────────────────────────────────────────────────────
  const applyForBadge = useCallback(async (brandId, badgeType, reason) => {
    // Upsert so re-applying replaces any previous rejected application
    const { error } = await supabase.from("badge_applications").upsert({
      brand_id: brandId,
      badge_type: badgeType,   // "verified" | "featured"
      reason,
      status: "pending",
      applied_at: new Date().toISOString(),
      reviewed_at: null,
      admin_note: null,
    }, { onConflict: "brand_id,badge_type" });
    if (error) throw error;
  }, []);

  const reviewApplication = useCallback(async (appId, decision, adminNote = "") => {
    // decision: "approved" | "rejected"
    const { data: app, error: fetchErr } = await supabase
      .from("badge_applications").select("*").eq("id", appId).single();
    if (fetchErr) throw fetchErr;

    // Update the application
    const { error } = await supabase.from("badge_applications").update({
      status: decision,
      reviewed_at: new Date().toISOString(),
      admin_note: adminNote,
    }).eq("id", appId);
    if (error) throw error;

    // If approved, update the brand status
    if (decision === "approved") {
      await supabase.from("brands").update({ status: app.badge_type }).eq("id", app.brand_id);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user, authLoading, login, logout, signUp,
      uploadImage,
      addProduct, updateProduct, deleteProduct, incrementViews,
      updateBrand,
      applyForBadge, reviewApplication,
      showToast, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}
