const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
`;

export const GlobalStyles = ({ theme }) => {
  const dark = theme === "dark";
  return (
    <style>{`
      ${FONTS}
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg:      ${dark ? "#0a0a0a" : "#f5f2ed"};
        --bg2:     ${dark ? "#111111" : "#ebe7e0"};
        --bg3:     ${dark ? "#1a1a1a" : "#e0dbd3"};
        --card:    ${dark ? "#141414" : "#ffffff"};
        --border:  ${dark ? "#222222" : "#d8d3ca"};
        --border2: ${dark ? "#2a2a2a" : "#ccc7be"};
        --text:    ${dark ? "#f0ece4" : "#1a1714"};
        --text2:   ${dark ? "#888880" : "#6b6560"};
        --text3:   ${dark ? "#555550" : "#999590"};
        --accent:  #ff6b35;
        --accent2: #00d4aa;
        --gold:    #f5b800;
        --red:     #ff3366;
        --green:   #22c55e;
        --purple:  #a855f7;
        --radius:    12px;
        --radius-sm:  8px;
        --shadow:    ${dark ? "0 4px 24px rgba(0,0,0,0.6)"  : "0 4px 24px rgba(0,0,0,0.12)"};
        --shadow-sm: ${dark ? "0 2px 8px rgba(0,0,0,0.4)"   : "0 2px 8px rgba(0,0,0,0.08)"};
      }
      html { font-size: 16px; scroll-behavior: smooth; }
      body {
        -webkit-user-select: none; -ms-user-select: none; user-select: none;
        background: var(--bg); color: var(--text);
        font-family: 'Outfit', sans-serif; line-height: 1.5;
        min-height: 100vh; overflow-x: hidden;
      }
      h1,h2,h3 { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.04em; line-height: 1.1; }
      h4,h5,h6 { font-family: 'Outfit', sans-serif; font-weight: 600; }
      a { color: inherit; text-decoration: none; }
      img { max-width: 100%; display: block; }
      button { cursor: pointer; border: none; outline: none; font-family: 'Outfit', sans-serif; }
      input, textarea, select { font-family: 'Outfit', sans-serif; }
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: var(--bg); }
      ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      @keyframes fadeIn   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideDown{ from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
      @keyframes spin     { to { transform: rotate(360deg); } }
      @keyframes shimmer  { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
      .fade-in { animation: fadeIn 0.4s ease forwards; }
      .skeleton {
        background: linear-gradient(90deg, var(--bg3) 25%, var(--border) 50%, var(--bg3) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: var(--radius-sm);
      }
      .material-icons-round {
        font-family: 'Material Icons Round'; font-weight: normal; font-style: normal;
        display: inline-block; line-height: 1; text-transform: none;
        letter-spacing: normal; word-wrap: normal; white-space: nowrap; direction: ltr;
        -webkit-font-smoothing: antialiased;
      }
      @media (max-width: 640px) {
        h1 { font-size: 2.4rem; }
        h2 { font-size: 1.8rem; }
      }
    `}</style>
  );
};
