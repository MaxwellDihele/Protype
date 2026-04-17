import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppProvider }   from "./context/AppContext";
import { useApp }        from "./context/AppContext";
import { GlobalStyles }  from "./components/ui/GlobalStyles";
import { Navbar }        from "./components/layout/Navbar";
import { Footer }        from "./components/layout/Footer";
import { Toast }         from "./components/ui";
import { HomePage }      from "./pages/HomePage";
import { SearchPage }    from "./pages/SearchPage";
import { ProductPage }   from "./pages/ProductPage";
import { BrandPage }     from "./pages/BrandPage";
import { BrandsPage, CategoriesPage, LoginPage } from "./pages/StaticPages";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminPage }     from "./pages/AdminPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function InnerApp() {
	logToScreen("InnerApp rendered");
  const { theme, toast } = useApp();
  return (
    <>
      <GlobalStyles theme={theme} />
      <ScrollToTop />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/search"      element={<SearchPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/brand/:id"   element={<BrandPage />} />
            <Route path="/brands"      element={<BrandsPage />} />
            <Route path="/categories"  element={<CategoriesPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/admin"       element={<AdminPage />} />
            <Route path="*"            element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <Toast toast={toast} />
      </div>
    </>
  );
}

export default function App() {
	
  return (
    <AppProvider>
      <BrowserRouter>
        <InnerApp />
      </BrowserRouter>
    </AppProvider>
  );
}
