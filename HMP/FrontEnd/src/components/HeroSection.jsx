import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Shield, Wrench, UserCheck, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      name: 'Student',
      path: '/login/student',
      description: 'Submit maintenance issues, track complaint history, and check official hostel notices.',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      borderClass: 'border-emerald-100 hover:border-emerald-500 dark:border-emerald-950/50 dark:hover:border-emerald-500',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450',
      glowClass: 'hover:shadow-emerald-500/15 dark:hover:shadow-emerald-500/10',
      icon: <GraduationCap size={26} />,
    },
    {
      name: 'Warden',
      path: '/login/warden',
      description: 'Manage room inventory, supervise staff duties, resolve disputes, and broadcast student notices.',
      colorClass: 'text-purple-600 dark:text-purple-400',
      borderClass: 'border-purple-100 hover:border-purple-500 dark:border-purple-950/50 dark:hover:border-purple-500',
      iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-450',
      glowClass: 'hover:shadow-purple-500/15 dark:hover:shadow-purple-500/10',
      icon: <UserCheck size={26} />,
    },
    {
      name: 'Staff',
      path: '/login/staff',
      description: 'View assigned electrical, plumbing, or carpentering tasks and update resolution logs.',
      colorClass: 'text-blue-600 dark:text-blue-400',
      borderClass: 'border-blue-100 hover:border-blue-500 dark:border-blue-950/50 dark:hover:border-blue-500',
      iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450',
      glowClass: 'hover:shadow-blue-500/15 dark:hover:shadow-blue-500/10',
      icon: <Wrench size={26} />,
    },
    {
      name: 'Admin',
      path: '/login/admin',
      description: 'Invite wardens, configure new hostels, manage student accounts, and view global system diagnostics.',
      colorClass: 'text-red-600 dark:text-red-400',
      borderClass: 'border-red-100 hover:border-red-500 dark:border-red-950/50 dark:hover:border-red-500',
      iconBg: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-450',
      glowClass: 'hover:shadow-red-500/15 dark:hover:shadow-red-500/10',
      icon: <Shield size={26} />,
    },
  ];

  return (
    <div className="relative overflow-hidden py-16 lg:py-24 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Background visual shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/3 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/3 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Branding text */}
        <div className="lg:col-span-5 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-emerald-500/10 to-purple-500/10 dark:from-emerald-950/40 dark:to-purple-950/40 border border-emerald-500/20 dark:border-emerald-950 text-xs font-semibold text-emerald-800 dark:text-emerald-350 tracking-wide uppercase">
            🚀 Official Portal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
            Hostel <br />
            <span className="bg-linear-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Management
            </span> <br />
            Portal
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Welcome to the NIT JSR secure hostel ecosystem. We connect students, wardens, and repair staff on a single dashboard to make residential life simple and responsive.
          </p>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800/80 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white block mb-1">🔐 Closed Onboarding Network:</span>
            Credentials are created and managed strictly by the college administration. Contact your Warden to receive your login details.
          </div>
        </div>

        {/* Right Side: Grid of 4 Role Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => navigate(role.path)}
              className={`group text-left p-6 bg-white dark:bg-gray-800/45 rounded-2xl border ${role.borderClass} ${role.glowClass} shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between h-64 focus:outline-none`}
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${role.iconBg}`}>
                  {role.icon}
                </div>
                <h3 className={`text-xl font-bold ${role.colorClass} mb-2`}>
                  {role.name} Login
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {role.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 mt-4 group-hover:translate-x-1 transition-transform duration-300">
                <span>Access Portal</span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-950 dark:group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
