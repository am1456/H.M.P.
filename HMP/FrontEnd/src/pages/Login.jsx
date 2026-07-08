import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getLoginConfig } from "../config/loginConfig";
import { Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

export default function Login() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Get configuration for the role
  const config = getLoginConfig(role);

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    defaultValues: config.fields.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle form submission
   */
  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);

    try {
      // Call login with credentials and role
      const result = await login(data, role);

      if (result.success) {
        // Navigate to the role's dashboard
        navigate(config.dashboard);
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 transition-all duration-300 bg-linear-to-br ${config.cardBg}`}
    >
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animation-in slide-in-from-bottom-4 duration-500">
          {/* Header with Role-based Color */}
          <div className={`${config.headerBg} p-8 text-white`}>
            <div className="flex items-center gap-3 mb-2">
              <Lock size={28} className="opacity-90" />
              <h1 className="text-3xl font-bold">{config.title}</h1>
            </div>
            <p className="text-sm opacity-90">{config.subtitle}</p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md animation-in fade-in duration-300">
                <p className="text-red-700 dark:text-red-400 text-sm font-semibold">
                  {error}
                </p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Dynamic Fields Based on Role */}
              {config.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>

                  <div className="relative">
                    <input
                      type={
                        field.type === "password" && showPassword
                          ? "text"
                          : field.type
                      }
                      placeholder={field.placeholder}
                      {...register(field.name, field.validation)}
                      className={`w-full px-4 py-3 rounded-lg border transition-all outline-none
                        ${
                          errors[field.name]
                            ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/50"
                            : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        }
                        bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                        placeholder-gray-400 dark:placeholder-gray-500`}
                    />

                    {/* Toggle Password Visibility */}
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Field Error Message */}
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors[field.name]?.message}
                    </p>
                  )}
                </div>
              ))}

              {/* Forgot Password Link - Only for non-staff roles */}
              {config.showForgotPassword && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    Forgot password ?
                  </button>
                </div>
              )}

              {/* Submit Button - Role-based Color */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-lg transform transition-all duration-200 active:scale-95
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : config.buttonColor
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {role === "staff" ? (
                  <>
                    Need assistance?{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Contact Administrator
                    </a>
                  </>
                ) : (
                  <>
                    Having trouble?{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Get Help
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Role Info - For debugging */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Logging in as: <span className="font-semibold capitalize">{role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}