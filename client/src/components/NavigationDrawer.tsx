import React from "react";
import { NavLink } from "react-router-dom";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drawerRef: React.RefObject<HTMLDivElement | null>;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  drawerRef,
}: NavigationDrawerProps) {
  return (
    <>
      {/* Responsive Drawer Navigation Menu with overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose} // Close on overlay click
      ></div>
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full bg-blue-50 shadow-lg z-20 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "280px" }}
      >
        <div className="p-4 flex justify-between items-center border-b border-blue-200">
          <span className="font-bold text-blue-900">Menu</span>
          <button
            onClick={onClose}
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
              {/* Use NavLink for Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200 ${
                    isActive ? "bg-blue-100 font-semibold" : ""
                  }`
                }
                onClick={onClose} // Close drawer on click
              >
                Home
              </NavLink>
            </li>
            <li>
              {/* Use NavLink for Scripts */}
              <NavLink
                to="/scripts" // Assuming '/scripts' is the route for UserScriptPage
                className={({ isActive }) =>
                  `block py-2 px-3 rounded hover:bg-blue-100 transition-colors duration-200 ${
                    isActive ? "bg-blue-100 font-semibold" : ""
                  }`
                }
                onClick={onClose} // Close drawer on click
              >
                Scripts
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
