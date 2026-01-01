import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useTheme from '../context/ThemeContext';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSliice.js'

const Login = ({ role }) => {
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const dispatch = useDispatch();

  // 1. Unified State Management
  const [formData, setFormData] = useState({
    username: '',
    mobile: '',
    password: '',
    pin: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Role-Based UI Configuration
  const loginConfig = {
    student: {
      title: "Student Login",
      subtitle: "Access your hostel portal",
      fields: [
        { name: "username", type: "text", label: "Username", placeholder: "Enter Username", required: true },
        { name: "password", type: "password", label: "Password", placeholder: "Enter Password", required: true }
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      dashboardPath: "/student/dashboard"
    },
    staff: {
      title: "Staff Login",
      subtitle: "Access your work portal",
      fields: [
        { name: "mobile", type: "tel", label: "Mobile Number", placeholder: "10-digit mobile number", maxLength: 10, required: true },
        { name: "pin", type: "password", label: "6-digit PIN", placeholder: "Enter PIN", maxLength: 6, required: true }
      ],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      dashboardPath: "/staff/dashboard"
    },
    warden: {
      title: "Warden Login",
      subtitle: "Manage your hostel",
      fields: [
        { name: "username", type: "text", label: "Username", placeholder: "Enter Username", required: true },
        { name: "password", type: "password", label: "Password", placeholder: "Enter Password", required: true }
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      dashboardPath: "/warden/dashboard"
    },
    admin: {
      title: "Admin Login",
      subtitle: "System administration portal",
      fields: [
        { name: "username", type: "text", label: "Username", placeholder: "Enter Admin ID", required: true },
        { name: "password", type: "password", label: "Password", placeholder: "Enter Password", required: true }
      ],
      buttonColor: "bg-red-600 hover:bg-red-700",
      dashboardPath: "/admin/dashboard"
    }
  };

  const config = loginConfig[role];

  // 3. Optimized Handle Change (Functional Update Pattern)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Handle Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/v1/user/login", formData, { withCredentials: true });

      if (response.data.success) {
        const userToStore = response.data.data.user;

        // DISPATCH FIRST
        dispatch(login(userToStore));

        // NAVIGATE SECOND
        navigate(config.dashboardPath);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-all"
        >
          <span>←</span> Back to Home
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              {config.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              {config.subtitle}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
              <p className="text-red-700 dark:text-red-400 text-sm font-semibold text-center">
                {error}
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  required={field.required}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            ))}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform active:scale-95 transition-all duration-200 
                ${loading ? 'bg-gray-400 cursor-not-allowed' : config.buttonColor}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </span>
              ) : "Login"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need assistance? <a href="#" className="font-semibold text-blue-500 hover:underline">Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;