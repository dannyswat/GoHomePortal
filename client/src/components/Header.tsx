import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-100 text-blue-900 shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center">
        <button
          className="text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-md p-1"
          onClick={onMenuClick}
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
  );
}
