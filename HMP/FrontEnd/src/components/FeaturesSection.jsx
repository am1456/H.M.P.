import React from 'react';
import { AlertTriangle, Megaphone, UserCheck, Shield } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: "Swift Complaint Resolution",
      description: "Submit room or mess issues with photos, and track the assignment and repair process in real-time.",
      icon: <AlertTriangle className="text-emerald-500" size={28} />,
      bg: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      title: "Real-time Notice Boards",
      description: "Receive instant updates, curfew changes, or hostel events directly from Wardens on your announcement page.",
      icon: <Megaphone className="text-purple-500" size={28} />,
      bg: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      title: "Staff Assignment Control",
      description: "Wardens assign plumbing, cleaning, or electrical repairs directly to registered staff, optimizing response times.",
      icon: <UserCheck className="text-blue-500" size={28} />,
      bg: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Admin Onboarding Gate",
      description: "Security is locked down. Administrators register verified student records to block any unauthorized external logins.",
      icon: <Shield className="text-red-500" size={28} />,
      bg: "bg-red-50 dark:bg-red-950/20"
    }
  ];

  return (
    <section className="w-full py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Streamlining Campus Living
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            A comprehensive, secure system designed to bridge communication between students, staff, and administration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:border-gray-200 dark:hover:border-gray-700/60 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.bg}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
