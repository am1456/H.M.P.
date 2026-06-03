import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Home, UserPlus, ShieldPlus, 
  Building, Search, PlusCircle, ShieldCheck 
} from "lucide-react"; 

const AdminDashboard = () => {
  const { userData } = useSelector((state) => state.auth);
  const isSuperAdmin = userData?.role === "superAdmin";
  const theme = {
    mobileBg: "bg-red-700 dark:bg-red-900",
    sidebarBg: "bg-red-700 dark:bg-red-900",
    border: "border-red-600 dark:border-red-800",
    activeBg: "bg-red-800 dark:bg-red-950",
    hoverBg: "hover:bg-red-600",
    textBase: "text-red-100",
    sectionText: "text-red-300",
    sectionPadding: "px-6",
    navItemPadding: "px-6",
    headerIconBg: "bg-white dark:bg-gray-800",
    headerIconText: "text-red-700 dark:text-red-400",
    subtitleText: "text-red-200",
    footerBg: "bg-red-800/50 dark:bg-black/20",
    footerHover: "hover:bg-red-600 dark:hover:bg-red-800",
    footerAvatarBg: "bg-red-500 dark:bg-red-700",
    footerSubtext: "text-red-200",
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        { to: "/admin/dashboard", label: "Home", icon: <Home size={20} />, end: true },
        { to: "search-user", label: "Search Users", icon: <Search size={20} /> },
      ],
    },
    {
      title: "Registration",
      items: [
        { to: "add-student", label: "Add Student", icon: <UserPlus size={20} /> },
        { to: "add-warden", label: "Add Warden", icon: <ShieldPlus size={20} /> },
        ...(isSuperAdmin
          ? [{ to: "invite-admin", label: "Invite Admin", icon: <ShieldPlus size={20} /> }]
          : []),
      ],
    },
    {
      title: "Infrastructure",
      items: [
        { to: "add-hostel", label: "Add Hostel", icon: <Building size={20} /> },
        { to: "add-rooms", label: "Add Rooms", icon: <PlusCircle size={20} /> },
      ],
    },
  ];

  const footerLink = {
    to: "change-password",
    avatar: userData?.fullName?.charAt(0) || "A",
    title: userData?.fullName?.split(" ")[0] || "Admin",
    subtitle: "Account Settings",
  };

  return (
    <DashboardLayout
      portalLabel="Admin Portal"
      portalIcon={<ShieldCheck size={18} />}
      sidebarTitle="Admin Panel"
      sidebarSubtitle="System Management"
      sidebarIcon={<ShieldCheck size={20} />}
      theme={theme}
      navSections={navSections}
      footerLink={footerLink}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default AdminDashboard;