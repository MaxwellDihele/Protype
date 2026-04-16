import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";

export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= TOAST =================
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ================= FETCH DATA =================
  const loadData = async () => {
    try {
      const [
        { data: productsData, error: pErr },
        { data: brandsData, error: bErr },
      ] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("brands").select("*"),
      ]);

      if (pErr || bErr) {
        console.error(pErr || bErr);
        showToast("Failed to load data", "error");
      }

      setProducts(productsData || []);
      setBrands(brandsData || []);
    } catch (err) {
      console.error(err);
      showToast("Something went wrong loading data", "error");
    }
  };

  // ================= PROFILE =================
  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTH =================
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast("Invalid credentials", "error");
      return false;
    }

    setUser(data.user);
    await fetchProfile(data.user.id);

    showToast("Logged in!");
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // ================= CRUD =================
  const addProduct = async (prod) => {
    const { data, error } = await supabase
      .from("products")
      .insert(prod)
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast("Failed to add product", "error");
      return null;
    }

    setProducts((prev) => [data, ...prev]);
    return data;
  };

  const updateProduct = async (id, updates) => {
    const { data: updated, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast("Update failed", "error");
      return;
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      showToast("Delete failed", "error");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateBrand = async (id, updates) => {
    const { data: updated, error } = await supabase
      .from("brands")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      showToast("Brand update failed", "error");
      return;
    }

    setBrands((prev) =>
      prev.map((b) => (b.id === id ? updated : b))
    );
  };

  // ================= INIT =================
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await loadData();

      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "#0f0f0f",
        }}
      >
        Loading...
      </div>
    );
  }

  // ================= CONTEXT =================
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        user,
        profile,
        loading,

        products,
        brands,

        login,
        logout,

        addProduct,
        updateProduct,
        deleteProduct,
        updateBrand,

        showToast,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

  // ================= LOADING SCREEN =================
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "#0f0f0f",
        }}
      >
        Loading...
      </div>
    );
  }

  // ================= CONTEXT =================
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        user,
        profile,
        loading,

        products,
        brands,

        login,
        logout,

        addProduct,
        updateProduct,
        deleteProduct,
        updateBrand,

        showToast,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

  // ================= CONTEXT VALUE =================
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,

        user,
        profile,
        loading,

        products,
        brands,

        login,
        logout,

        addProduct,
        updateProduct,
        deleteProduct,
        updateBrand,

        showToast,
        toast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}


/*
import { createContext, useContext, useState, useCallback } from "react";
import { PRODUCTS_SEED, BRANDS_SEED, USERS_SEED } from "../data/seed";

export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [theme, setTheme]       = useState("dark");
  const [user, setUser]         = useState(null);
  const [products, setProducts] = useState(PRODUCTS_SEED);
  const [brands, setBrands]     = useState(BRANDS_SEED);
  const [users]                 = useState(USERS_SEED);
  const [toast, setToast]       = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((email, password) => {
    const u = users.find(u => u.email === email && u.password === password);
    if (u) { setUser(u); return true; }
    return false;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const addProduct = useCallback((prod) => {
    const np = {
      ...prod,
      id: "p" + Date.now(),
      created_at: new Date().toISOString().split("T")[0],
      views: 0,
    };
    setProducts(prev => [np, ...prev]);
    return np;
  }, []);

  const updateProduct = useCallback((id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateBrand = useCallback((id, data) => {
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  }, []);

  return (
    <AppContext.Provider value={{
      theme, setTheme,
      user, login, logout,
      products, brands,
      addProduct, updateProduct, deleteProduct, updateBrand,
      showToast, toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}
*/