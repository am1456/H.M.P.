import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Home, Users, Briefcase, 
  UserPlus, ClipboardList, Bell, BarChart3
} from "lucide-react";

const WardenDashboard = () => {
  const theme = {
    mobileBg: "bg-purple-800 dark:bg-purple-950",
    sidebarBg: "bg-purple-800 dark:bg-purple-950",
    border: "border-purple-700 dark:border-purple-900",
    activeBg: "bg-purple-700 dark:bg-purple-900",
    hoverBg: "hover:bg-purple-500",
    textBase: "text-purple-100",
    sectionText: "text-purple-400",
    sectionPadding: "px-4",
    navItemPadding: "px-6",
    headerIconBg: "bg-white dark:bg-gray-200",
    headerIconText: "text-purple-800 dark:text-purple-950",
    subtitleText: "text-purple-300",
    footerBg: "bg-purple-900/50 dark:bg-black/20",
    footerHover: "hover:bg-purple-700 dark:hover:bg-purple-900",
    footerAvatarBg: "bg-purple-500 dark:bg-purple-700",
    footerSubtext: "text-purple-300",
  };

  const navSections = [
    {
      title: "Overview",
      items: [
        { to: "/warden/dashboard", label: "Home", icon: <Home size={20} />, end: true },
      ],
    },
    {
      title: "Management",
      items: [
        { to: "students", label: "Student List", icon: <Users size={20} /> },
        { to: "staff", label: "Staff List", icon: <Briefcase size={20} /> },
        { to: "create-staff", label: "Register Staff", icon: <UserPlus size={20} /> },
      ],
    },
    {
      title: "Operations",
      items: [
        { to: "complaints", label: "All Complaints", icon: <ClipboardList size={20} /> },
        { to: "notices", label: "Notices", icon: <Bell size={20} /> },
        { to: "graphs", label: "Graphs", icon: <BarChart3 size={20} /> },
      ],
    },
  ];

  const footerLink = {
    to: "profile",
    avatar: "W",
    title: "My Profile",
    subtitle: "View Settings",
  };

  return (
    <DashboardLayout
      portalLabel="Warden Portal"
      portalIcon={<ClipboardList size={18} />}
      sidebarTitle="Warden Panel"
      sidebarSubtitle="Hostel Management System"
      sidebarIcon={<ClipboardList size={20} />}
      theme={theme}
      navSections={navSections}
      footerLink={footerLink}
      mainClassName="p-0"
      contentWrapperClassName=""
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default WardenDashboard;