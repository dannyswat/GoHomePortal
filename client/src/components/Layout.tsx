import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        isDrawerOpen
      ) {
        setIsDrawerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDrawerOpen]);

  // Prevent scrolling when drawer is open on mobile
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add("overflow-hidden", "md:overflow-auto");
    } else {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
    }
  }, [isDrawerOpen]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top Bar */}
      <header className="bg-blue-100 text-blue-900 shadow-md">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center">
          <button
            className="text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-1"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Search - hidden on small mobile, expands on larger screens */}
          <div className="mx-4 flex-grow hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="border border-blue-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 w-full max-w-xl"
              aria-label="Search"
            />
          </div>

          {/* Icons for small screens */}
          <div className="flex sm:hidden ml-auto space-x-2">
            <button
              aria-label="Search"
              className="text-blue-900 p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              aria-label="Login"
              className="text-blue-900 p-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md"
              onClick={() => navigate("/login")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>

          {/* Login button for larger screens */}
          <button
            className="hidden sm:flex items-center space-x-1 ml-4 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md px-3 py-1"
            onClick={() => navigate("/login")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* Responsive Drawer Navigation Menu with overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      ></div>
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-blue-50 shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
      >
        <div className="p-4 flex justify-between items-center border-b border-blue-200">
          <span className="font-bold text-blue-900">Menu</span>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-1"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-blue-50">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-100 text-blue-900 text-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4 text-sm md:text-base">
          All rights reserved &copy; {new Date().getFullYear()} Dannys
        </div>
      </footer>
    </div>
  );
}
