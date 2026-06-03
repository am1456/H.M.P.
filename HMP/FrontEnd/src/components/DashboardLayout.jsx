import { useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "@/components/Header";
import { Menu, X } from "lucide-react";

const buildNavLinkClass = (theme) => ({ isActive }) =>
  `flex items-center py-3 ${theme.navItemPadding} my-1 font-semibold transition-all duration-200 border-l-4 ${
    isActive
      ? `${theme.activeBg} border-white text-white shadow-inner`
      : `border-transparent ${theme.textBase} ${theme.hoverBg} hover:text-white`
  }`;

const DashboardLayout = ({
  portalLabel,
  portalIcon,
  sidebarTitle,
  sidebarSubtitle,
  sidebarIcon,
  theme,
  navSections,
  footerLink,
  overlay,
  showOverlay,
  contentWrapperClassName,
  mainClassName,
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const navLinkStyles = buildNavLinkClass(theme);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Header />

      <div
        className={`lg:hidden ${theme.mobileBg} p-4 flex justify-between items-center text-white shadow-md z-20`}
      >
        <span className="font-bold uppercase tracking-widest text-sm flex items-center gap-2">
          {portalIcon}
          {portalLabel}
        </span>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 outline-none hover:bg-white/10 rounded-lg transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 ${theme.sidebarBg} text-white transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 flex flex-col shadow-2xl
          `}
        >
          <div className={`p-6 border-b ${theme.border}`}>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className={`${theme.headerIconBg} ${theme.headerIconText} p-1.5 rounded-lg shadow-sm`}>
                {sidebarIcon}
              </span>
              {sidebarTitle}
            </h2>
            <p className={`text-xs ${theme.subtitleText} mt-1 ml-1`}>{sidebarSubtitle}</p>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
            <ul className="flex flex-col gap-1">
              {navSections.map((section) => (
                <li key={section.title}>
                  <div className={`${theme.sectionPadding} text-xs font-bold ${theme.sectionText} uppercase tracking-wider mb-2 mt-2`}>
                    {section.title}
                  </div>
                  {section.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={navLinkStyles}
                      onClick={closeMenu}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </NavLink>
                  ))}
                </li>
              ))}
            </ul>
          </nav>

          {footerLink && (
            <div className={`p-4 border-t ${theme.border} ${theme.footerBg}`}>
              <NavLink
                to={footerLink.to}
                className={`flex items-center gap-3 p-2 rounded-lg ${theme.footerHover} transition group`}
                onClick={closeMenu}
              >
                <div className={`w-10 h-10 ${theme.footerAvatarBg} rounded-full flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition`}>
                  {footerLink.avatar}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-white">{footerLink.title}</p>
                  <p className={`text-xs ${theme.footerSubtext}`}>{footerLink.subtitle}</p>
                </div>
              </NavLink>
            </div>
          )}
        </aside>

        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={closeMenu}
          ></div>
        )}

        <main className={`flex-1 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto custom-scrollbar relative ${mainClassName || ""}`}>
          {showOverlay && overlay}
          <div className={`p-4 lg:p-8 max-w-7xl mx-auto transition-all duration-500 ${contentWrapperClassName || ""}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
