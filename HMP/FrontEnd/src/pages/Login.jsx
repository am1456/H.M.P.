import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTheme from '../context/ThemeContext'

const Login = ({ role }) => {
  const navigate = useNavigate()
  const { themeMode } = useTheme()

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    employeeId: '',
    adminId: '',
    password: '',
    pin: ''
  })

  // Login configuration for different roles
  const loginConfig = {
    student: {
      title: "Student Login",
      subtitle: "Access your hostel portal",
      fields: [
        {
          name: "email",
          type: "email",
          label: "College Email",
          placeholder: "your.email@nitjsr.ac.in",
          required: true
        },
        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter your password",
          required: true
        }
      ],
      buttonColor: "bg-green-600 hover:bg-green-700",
      dashboardPath: "/student/dashboard"
    },
    staff: {
      title: "Staff Login",
      subtitle: "Access your work portal",
      fields: [
        {
          name: "mobile",
          type: "tel",
          label: "Mobile Number",
          placeholder: "10-digit mobile number",
          maxLength: 10,
          required: true
        },
        {
          name: "pin",
          type: "password",
          label: "6-digit PIN",
          placeholder: "Enter 6-digit PIN",
          maxLength: 6,
          required: true
        }
      ],
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      dashboardPath: "/staff/dashboard"
    },
    warden: {
      title: "Warden Login",
      subtitle: "Manage your hostel",
      fields: [
        {
          name: "employeeId",
          type: "text",
          label: "Employee ID",
          placeholder: "Enter your employee ID",
          required: true
        },
        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter your password",
          required: true
        }
      ],
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      dashboardPath: "/warden/dashboard"
    },
    admin: {
      title: "Admin Login",
      subtitle: "System administration portal",
      fields: [
        {
          name: "adminId",
          type: "text",
          label: "Admin ID",
          placeholder: "Enter your admin ID",
          required: true
        },
        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Enter your password",
          required: true
        }
      ],
      buttonColor: "bg-red-600 hover:bg-red-700",
      dashboardPath: "/admin/dashboard"
    }
  }

  const config = loginConfig[role]

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    // For now, just navigate to dashboard (no authentication)
    // Later you'll add API call here
    console.log('Login attempt:', { role, formData })

    navigate(config.dashboardPath)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {config.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {config.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {config.fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {field.label}
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  maxLength={field.maxLength}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 transition-colors duration-300"
                  style={{
                    focusRingColor: config.buttonColor.split(' ')[0].replace('bg-', '')
                  }}
                />
              </div>
            ))}

            {/* Forgot Password Link (Optional) */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full ${config.buttonColor} text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              Login
            </button>
          </form>

          {/* Footer Note */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact your hostel administrator
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login