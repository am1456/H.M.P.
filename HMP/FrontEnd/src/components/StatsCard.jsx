import React from 'react';

const StatsCard = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-white dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-850 p-6 hover:border-gray-250 dark:hover:border-gray-700 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`${iconBg} w-14 h-14 rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;