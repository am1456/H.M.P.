
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const roles = [
    { name: 'Admin', path: '/login/admin', color: 'bg-red-600 hover:bg-red-700' },
    { name: 'Student', path: '/login/student', color: 'bg-green-600 hover:bg-green-700' },
    { name: 'Staff', path: '/login/staff', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Warden', path: '/login/warden', color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
        Welcome to NIT JSR Hostel Management Portal
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        You are a
      </p>
      
      <div className="flex flex-wrap gap-6 justify-center">
        {roles.map((role) => (
          <button
            key={role.name}
            onClick={() => navigate(role.path)}
            className={`px-8 py-4 ${role.color} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
