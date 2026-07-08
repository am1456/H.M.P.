import React from "react";
import { useSelector } from "react-redux";
import { User, Mail, Shield, Phone, Building, Calendar } from "lucide-react";

function WardenProfile() {
  const { userData } = useSelector((state) => state.auth);

  if (!userData) {
    return (
      <div className="h-full min-h-[50vh] flex items-center justify-center text-purple-600 dark:text-purple-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mr-3"></div>
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Warden Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">View your registered details and administrative jurisdiction.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Banner header */}
        <div className="bg-linear-to-br from-purple-700 via-purple-600 to-indigo-600 p-8 md:p-12 text-white relative">
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl text-3xl font-black">
              {userData.fullName?.charAt(0).toUpperCase() || "W"}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">{userData.fullName}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-xs opacity-90">@{userData.username}</span>
                <span className="px-2.5 py-0.5 bg-black/20 rounded-full text-[9px] font-bold uppercase tracking-wider border border-white/10">
                  {userData.role}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {/* Info Grid */}
        <div className="p-6 md:p-10 space-y-6 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Account Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-2 border-b border-gray-100 dark:border-gray-700">
                Account Details
              </h3>
              <div className="space-y-3">
                <InfoItem icon={<User className="text-purple-500" size={16} />} label="Full Name" value={userData.fullName} />
                <InfoItem icon={<Mail className="text-purple-500" size={16} />} label="Email Address" value={userData.email} />
                <InfoItem icon={<Phone className="text-purple-500" size={16} />} label="Contact Number" value={userData.mobile || "—"} />
              </div>
            </div>

            {/* Admin Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest pb-2 border-b border-gray-100 dark:border-gray-700">
                Administrative Scope
              </h3>
              <div className="space-y-3">
                <InfoItem icon={<Shield className="text-purple-500" size={16} />} label="Assigned Role" value={userData.role?.toUpperCase()} />
                <InfoItem icon={<Building className="text-purple-500" size={16} />} label="Hostel Jurisdiction" value={userData.hostel?.name || "No Hostel Assigned"} />
                <InfoItem icon={<Calendar className="text-purple-500" size={16} />} label="Member Since" value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString("en-GB") : "—"} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Tiny reusable layout component
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100/50 dark:border-gray-700/50">
    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xs text-gray-600 dark:text-gray-300">
      {icon}
    </div>
    <div>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase block">{label}</span>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{value}</span>
    </div>
  </div>
);

export default WardenProfile;