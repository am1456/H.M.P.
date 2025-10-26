const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Welcome Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Welcome to NIT JSR Hostel Management Portal
      </h1>
      
      {/* Subheading */}
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        You are a
      </p>
      
      {/* Role Buttons */}
      <div className="flex flex-wrap gap-6 justify-center">
        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Staff
        </button>
        
        <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Student
        </button>
        
        <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Warden
        </button>
      </div>
    </div>
  );
};

export default HeroSection;