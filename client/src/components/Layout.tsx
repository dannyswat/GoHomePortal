import React, { useState, useEffect, useRef } from "react";
// Remove NavLink and useNavigate imports as they are moved to Header/NavigationDrawer
import Header from "./Header";
import NavigationDrawer from "./NavigationDrawer";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Keep state and refs related to drawer in the parent Layout
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer when clicking outside (logic remains here)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if the click is outside the drawer *and* not on the menu button (implicitly handled by drawerRef check)
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        isDrawerOpen
      ) {
        // Check if the click target is *not* the menu button itself or inside it
        // This prevents immediate closing if the menu button is clicked again
        const menuButton = document.querySelector('button[aria-label="Menu"]');
        if (!menuButton || !menuButton.contains(event.target as Node)) {
          setIsDrawerOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  // Handle escape key to close drawer (logic remains here)
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

  // Prevent scrolling when drawer is open on mobile (logic remains here)
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add("overflow-hidden", "md:overflow-auto");
    } else {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
    }
    // Cleanup function to remove classes when component unmounts or drawer closes
    return () => {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
    };
  }, [isDrawerOpen]);

  const handleMenuClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Use Header component */}
      <Header onMenuClick={handleMenuClick} />

      {/* Use NavigationDrawer component */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        drawerRef={drawerRef}
      />

      {/* Main Content */}
      <main className="flex-grow bg-blue-50">
        <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-6 lg:py-8">
          {children}
        </div>
      </main>

      {/* Use Footer component */}
      <Footer />
    </div>
  );
}
