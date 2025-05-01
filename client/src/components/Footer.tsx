export default function Footer() {
  return (
    <footer className="bg-blue-100 text-blue-900 text-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-3 md:py-4 text-sm md:text-base">
        All rights reserved &copy; {new Date().getFullYear()} Dannys
      </div>
    </footer>
  );
}
