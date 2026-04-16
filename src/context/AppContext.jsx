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
