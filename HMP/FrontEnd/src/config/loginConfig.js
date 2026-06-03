/**
 * Login Configuration for each role
 * Controls: fields, colors, validation rules, dashboard route
 */

export const loginConfig = {
  student: {
    title: "Student Login",
    subtitle: "Sign in to access your hostel dashboard",
    role: "student",
    dashboard: "/student/dashboard",
    showForgotPassword: true,
    buttonColor: "bg-green-600 hover:bg-green-700",
    cardBg: "from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/30",
    headerBg: "bg-gradient-to-r from-green-500 to-green-600",
    fields: [
      {
        name: "enrollmentNumber",
        label: "Enrollment Number",
        type: "text",
        placeholder: "e.g., 2024ENG001",
        required: true,
        validation: {
          required: "Enrollment Number is required",
          minLength: { value: 5, message: "Enter a valid enrollment number" },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        validation: {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        },
      },
    ],
  },

  admin: {
    title: "Admin Login",
    subtitle: "Sign in to access admin dashboard",
    role: "admin",
    dashboard: "/admin/dashboard",
    showForgotPassword: true,
    buttonColor: "bg-red-600 hover:bg-red-700",
    cardBg: "from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/30",
    headerBg: "bg-gradient-to-r from-red-500 to-red-600",
    fields: [
      {
        name: "employeeId",
        label: "Employee ID",
        type: "text",
        placeholder: "e.g., EMP001",
        required: true,
        validation: {
          required: "Employee ID is required",
          minLength: { value: 3, message: "Enter a valid employee ID" },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        validation: {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        },
      },
    ],
  },

  warden: {
    title: "Warden Login",
    subtitle: "Sign in to manage your hostel",
    role: "warden",
    dashboard: "/warden/dashboard",
    showForgotPassword: true,
    buttonColor: "bg-purple-600 hover:bg-purple-700",
    cardBg: "from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/30",
    headerBg: "bg-gradient-to-r from-purple-500 to-purple-600",
    fields: [
      {
        name: "employeeId",
        label: "Employee ID",
        type: "text",
        placeholder: "e.g., EMP002",
        required: true,
        validation: {
          required: "Employee ID is required",
          minLength: { value: 3, message: "Enter a valid employee ID" },
        },
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        required: true,
        validation: {
          required: "Password is required",
          minLength: { value: 6, message: "Password must be at least 6 characters" },
        },
      },
    ],
  },

  staff: {
    title: "Staff Login",
    subtitle: "Sign in to access maintenance dashboard",
    role: "staff",
    dashboard: "/staff/dashboard",
    showForgotPassword: false, // NO Forgot PIN for now
    buttonColor: "bg-blue-600 hover:bg-blue-700",
    cardBg: "from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/30",
    headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
    fields: [
      {
        name: "phoneNumber",
        label: "Phone Number",
        type: "tel",
        placeholder: "e.g., 9876543210",
        required: true,
        validation: {
          required: "Phone Number is required",
          pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
        },
      },
      {
        name: "pin",
        label: "PIN",
        type: "password",
        placeholder: "••••",
        required: true,
        validation: {
          required: "PIN is required",
          pattern: { value: /^[0-9]{4}$/, message: "PIN must be exactly 4 digits" },
        },
      },
    ],
  },
};

/**
 * Get config for a specific role
 */
export const getLoginConfig = (role) => {
  return loginConfig[role] || loginConfig.student;
};
