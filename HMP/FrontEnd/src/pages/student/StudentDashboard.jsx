import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setProfileStatus } from "@/store/authSlice";
import apiClient from "@/api/axios";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Home,
  AlertCircle,
  FileText,
  GraduationCap
} from "lucide-react"; 

const StudentDashboard = () => {
  const { userData, isProfileComplete } = useSelector((state) => state.auth);
  const [checkingStatus, setCheckingStatus] = useState(true);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const isProfilePage = location.pathname.includes("/profile");

  useEffect(() => {
    const verifyProfile = async () => {
      try {
        const response = await apiClient.get("/api/v1/student/profile-status");
        dispatch(setProfileStatus(response.data.data.isComplete));
      } catch (error) {
        console.error("Status check failed", error);
      } finally {
        setCheckingStatus(false);
      }
    };
    verifyProfile();
  }, [dispatch]);

  if (checkingStatus) return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-emerald-600 dark:text-emerald-400">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
    </div>
  );

  const showOverlay = !isProfileComplete && !isProfilePage;

  const theme = {
    mobileBg: "bg-emerald-700 dark:bg-emerald-900",
    sidebarBg: "bg-emerald-700 dark:bg-emerald-900",
    border: "border-emerald-600 dark:border-emerald-800",
    activeBg: "bg-emerald-800 dark:bg-emerald-950",
    hoverBg: "hover:bg-emerald-600",
    textBase: "text-emerald-100",
    sectionText: "text-emerald-300",
    sectionPadding: "px-6",
    navItemPadding: "px-6",
    headerIconBg: "bg-white dark:bg-gray-800",
    headerIconText: "text-emerald-700 dark:text-emerald-400",
    subtitleText: "text-emerald-200",
    footerBg: "bg-emerald-800/50 dark:bg-black/20",
    footerHover: "hover:bg-emerald-600 dark:hover:bg-emerald-800",
    footerAvatarBg: "bg-emerald-500 dark:bg-emerald-700",
    footerSubtext: "text-emerald-200",
  };

  const navSections = [
    {
      title: "Menu",
      items: [
        { to: "/student/dashboard", label: "Dashboard", icon: <Home size={20} />, end: true },
        { to: "complaints", label: "My Complaints", icon: <AlertCircle size={20} /> },
      ],
    },
  ];

  const footerLink = {
    to: "profile",
    avatar: userData?.fullName?.charAt(0) || "S",
    title: userData?.fullName?.split(" ")[0] || "Student",
    subtitle: "View Profile",
  };

  const overlay = (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-emerald-900/20 backdrop-blur-md">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border-t-8 border-emerald-500 p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <FileText size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Action Required</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 italic">
          "Please complete your profile to access dashboard features and file complaints."
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("profile")}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-200 dark:shadow-none"
          >
            Complete Profile Now
          </button>
          <button
            onClick={() => dispatch(setProfileStatus(true))}
            className="text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm font-medium transition"
          >
            I'll do it later
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      portalLabel="Student Portal"
      portalIcon={<GraduationCap size={18} />}
      sidebarTitle="Student Panel"
      sidebarSubtitle="Hostel Management System"
      sidebarIcon={<GraduationCap size={20} />}
      theme={theme}
      navSections={navSections}
      footerLink={footerLink}
      overlay={overlay}
      showOverlay={showOverlay}
      contentWrapperClassName={
        showOverlay ? "blur-sm pointer-events-none grayscale-50" : ""
      }
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default StudentDashboard;