import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import { Menu, X, Home, UserPlus, ShieldPlus, Building, Search, PlusCircle } from "lucide-react"; 

const AdminDashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  const isSuperAdmin = userData?.role === "superAdmin";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkStyles = ({ isActive }) =>
    `flex items-center py-4 px-6 font-semibold transition-all duration-200 border-none ${
      isActive
        ? "bg-white dark:bg-gray-900 text-red-600 shadow-inner"
        : "bg-red-600 text-white hover:bg-red-700"
    }`;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    /* CHANGE 1: min-h-screen -> h-screen AND overflow-hidden */
    /* This locks the browser window so the whole page can't scroll */
    <div className="h-screen flex flex-col overflow-hidden">
      
      {/* Header is now locked at the top because parent is h-screen */}
      <Header />

      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-red-600 p-4 flex justify-between items-center text-white shadow-md z-20">
        <span className="font-bold uppercase tracking-widest text-sm">Management</span>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 outline-none">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Sidebar (Aside) */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-red-600 transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0 flex flex-col shadow-xl
          `}
        >
          <nav className="flex-1 overflow-y-auto pt-4 lg:pt-0">
            <ul className="flex flex-col">
              <li>
                <NavLink to="/admin/dashboard" end className={navLinkStyles} onClick={closeMenu}>
                  <Home size={18} className="mr-3"/> Home
                </NavLink>
              </li>
              <li>
                <NavLink to="add-student" className={navLinkStyles} onClick={closeMenu}>
                  <UserPlus size={18} className="mr-3"/> Add Student
                </NavLink>
              </li>
              <li>
                <NavLink to="add-warden" className={navLinkStyles} onClick={closeMenu}>
                  <ShieldPlus size={18} className="mr-3"/> Add Warden
                </NavLink>
              </li>
              
              {isSuperAdmin && (
                <li>
                  <NavLink to="invite-admin" className={navLinkStyles} onClick={closeMenu}>
                    <ShieldPlus size={18} className="mr-3"/> Invite Admin
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="add-hostel" className={navLinkStyles} onClick={closeMenu}>
                  <Building size={18} className="mr-3"/> Add Hostel
                </NavLink>
              </li>

              {/* Added Add Rooms here for convenience */}
              <li>
                <NavLink to="add-rooms" className={navLinkStyles} onClick={closeMenu}>
                  <PlusCircle size={18} className="mr-3"/> Add Rooms
                </NavLink>
              </li>

              <li>
                <NavLink to="search-user" className={navLinkStyles} onClick={closeMenu}>
                  <Search size={18} className="mr-3"/> Search
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={closeMenu}></div>
        )}

        {/* CHANGE 2: Main Content Area */}
        {/* 'overflow-y-auto' here ensures the SCROLLBAR appears ONLY for the form/content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-950 overflow-y-auto custom-scrollbar">
          <div className="p-4 lg:p-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;