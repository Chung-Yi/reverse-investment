import { useState, type PropsWithChildren } from "react";
import { primaryNavigation, routeMetadata, type RouteId } from "../../app/routeMetadata";
import { Button } from "../ui/Button";

interface AppShellProps {
  route: RouteId;
  navigate: (route: RouteId) => void;
  onPrimaryNavigate: (route: RouteId) => void;
  backLabel?: string;
  onBack: () => void;
  openAssistant: () => void;
}

export function AppShell({ route, navigate, onPrimaryNavigate, backLabel, onBack, openAssistant, children }: PropsWithChildren<AppShellProps>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const go = (next: RouteId) => { navigate(next); setMenuOpen(false); };
  const goPrimary = (next: RouteId) => { onPrimaryNavigate(next); setMenuOpen(false); };

  return (
    <>
      <a className="skip-link" href="#main-content">跳至主要內容</a>
      <div className="transparency-banner"><strong>資料透明</strong><span>市場資料均標示來源與截止日；內容用於研究與決策整理，不構成投資建議</span></div>
      <div className="app-shell">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="主要導覽">
          <button className="brand" onClick={() => go("welcome")} aria-label="回到產品介紹"><span className="brand-mark">逆</span><span><strong>逆思投資</strong><small>AI 決策陪伴</small></span></button>
          <nav className="nav-list">
            {primaryNavigation.map((item) => <button key={item.id} className={route === item.id ? "active" : ""} onClick={() => goPrimary(item.id)}><span>{item.icon}</span>{item.label}</button>)}
          </nav>
          <div className="sidebar-footer">
            <Button variant="secondary" full onClick={openAssistant}>✦ 問問 AI</Button>
            <p>研究與決策整理工具<br />不構成投資建議</p>
          </div>
        </aside>
        <div className="app-area">
          <header className="topbar">
            <div className="topbar-leading">
              {backLabel
                ? <button className="app-back-button" onClick={onBack} aria-label={backLabel} title={backLabel}><span aria-hidden="true">←</span><span className="back-button-label">{backLabel}</span></button>
                : <button className="icon-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="開啟選單">☰</button>}
              <div className="breadcrumb"><span>我的投資旅程</span><b>/</b><strong>{routeMetadata[route].label}</strong></div>
              <strong className="mobile-page-title">{routeMetadata[route].label}</strong>
            </div>
            <div className="top-actions"><button className="text-button" onClick={() => go("profile")}>投資輪廓</button><span className="avatar" aria-label="使用者">使</span></div>
          </header>
          <main id="main-content" tabIndex={-1}>{children}</main>
          <nav className="bottom-nav" aria-label="手機版主要導覽">
            {primaryNavigation.map((item) => <button key={item.id} className={route === item.id ? "active" : ""} onClick={() => goPrimary(item.id)}><span>{item.icon}</span>{item.label}</button>)}
          </nav>
        </div>
      </div>
      {menuOpen && <button className="menu-overlay" onClick={() => setMenuOpen(false)} aria-label="關閉選單" />}
    </>
  );
}
