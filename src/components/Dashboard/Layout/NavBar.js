"use client";
import ToggleThem from "@/components/theme/ToggleThem";
import { useState } from "react";

const Navbar = ({ toggleSidebar }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="shadow-sm p-4 flex items-center justify-between">
      {/* Desktop Logo / Title */}
      <div className="hidden lg:block text-lg font-bold">Admin Dashboard</div>

      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Open Mobile Menu"
      >
        {isMobileMenuOpen ? (
          <i className="fa-solid fa-square-xmark text-gray-700 fa-regular"></i>
        ) : (
          <i className="text-gray-700 fa-solid fa-bars"></i>
        )}
      </button>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className=" absolute top-30 left-0-0 w-3/4  shadow-lg p-4">
          <nav className="space-y-4">
            <a
              href="/"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </a>
            <a
              href="/users"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Users
            </a>
            <a
              href="/analytics"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analytics
            </a>
            <a
              href="/settings"
              className="block text-gray-600 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </a>
          </nav>
        </div>
      )}
      <ToggleThem />
    </header>
  );
};

export default Navbar;
