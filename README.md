# MzansiStreet — React + React Router DOM

## Folder Structure

```
src/
├── App.jsx                          ← BrowserRouter + Routes setup + ScrollToTop
├── context/
│   └── AppContext.jsx               ← Global state (theme, user, products, brands)
├── data/
│   └── seed.js                      ← CATEGORIES, BRANDS_SEED, PRODUCTS_SEED, USERS_SEED
├── components/
│   ├── ui/
│   │   ├── GlobalStyles.jsx         ← CSS custom properties + keyframe animations
│   │   └── index.jsx                ← Icon · Badge · Btn · Input · Textarea · Select
│   │                                   Card · Toast · Spinner · EmptyState · SectionHeader
│   ├── cards/
│   │   └── index.jsx                ← ProductCard · BrandCard  (use useNavigate)
│   └── layout/
│       ├── Navbar.jsx               ← useNavigate + useLocation for active links
│       └── Footer.jsx               ← useNavigate for footer links
└── pages/
    ├── HomePage.jsx                 ← useNavigate
    ├── SearchPage.jsx               ← useSearchParams (q, category, sort synced to URL)
    ├── ProductPage.jsx              ← useParams({ id })
    ├── BrandPage.jsx                ← useParams({ id })
    ├── StaticPages.jsx              ← BrandsPage · CategoriesPage · LoginPage
    ├── DashboardPage.jsx            ← useNavigate  (seller-only guard)
    └── AdminPage.jsx                ← useNavigate  (admin-only guard)
```

## Routes

| Path            | Component       |
|-----------------|-----------------|
| `/`             | HomePage        |
| `/search`       | SearchPage      |
| `/product/:id`  | ProductPage     |
| `/brand/:id`    | BrandPage       |
| `/brands`       | BrandsPage      |
| `/categories`   | CategoriesPage  |
| `/login`        | LoginPage       |
| `/dashboard`    | DashboardPage   |
| `/admin`        | AdminPage       |

## Setup

```bash
# Create project
npm create vite@latest mzansi-street -- --template react
cd mzansi-street

# Install dependencies
npm install react-router-dom

# Replace src/ with the files from this zip
npm run dev
```

## React Router hooks used

| Hook               | Used in                                        |
|--------------------|------------------------------------------------|
| `useNavigate`      | All pages, Navbar, Footer, Cards               |
| `useParams`        | ProductPage (`/product/:id`), BrandPage (`/brand/:id`) |
| `useSearchParams`  | SearchPage (q, category, sort synced to URL)   |
| `useLocation`      | Navbar (active link highlighting), ScrollToTop |
