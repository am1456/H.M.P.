const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 bg-gray-350 dark:bg-gray-800 border-t border-gray-700 dark:border-gray-200 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Created by <span className="font-semibold text-gray-900 dark:text-white"><a href="https://www.linkedin.com/in/arpan-mandal-5b6769328/">Arpan</a></span> and <span className="font-semibold text-gray-900 dark:text-white"><a href="https://www.linkedin.com/in/ayush-roy-741179361/">Ayush</a></span>
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-500 mt-1">
          © {new Date().getFullYear()} NIT JSR. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;