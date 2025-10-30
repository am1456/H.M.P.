const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Created by <span className="font-semibold text-gray-900 dark:text-white">Arpan</span> and <span className="font-semibold text-gray-900 dark:text-white">Ayush</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
          © {new Date().getFullYear()} NIT JSR. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;