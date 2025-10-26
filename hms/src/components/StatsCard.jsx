const StatsCard = ({ title, value, icon, iconBg, iconColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
        <div className={`${iconBg} p-4 rounded-full`}>
          <span className={`text-3xl ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;