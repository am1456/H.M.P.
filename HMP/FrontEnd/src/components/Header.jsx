import React from 'react';
import useTheme from '../context/ThemeContext';
import { Sun, Moon } from "lucide-react";

const Header = () => {
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const toggleTheme = () => {
    themeMode === "light" ? darkTheme() : lightTheme();
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="w-full px-6 py-4 flex justify-between items-center">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <a
            href = "https://www.nitjsr.ac.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img
              src={ themeMode === "dark" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmnE5VQ-tVxYPsnm8YEQDCRYOgKqwX-ONtIg&s" : "https://www.nitjsr.ac.in/static/media/logo_new1.85cf87db219a8a2bd4c9.png"}
              alt="NIT JSR Logo"
              className="h-12 w-auto object-contain"
            />
          </a>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            NIT JSR HMP
          </h1>
        </div>

        {/* Right Section */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all duration-300"
          aria-label="Toggle theme"
        >
          {themeMode === "dark" ? <Sun size={28} /> : <Moon size={28} />}
        </button>

      </div>
    </header>
  );
};

export default Header;
