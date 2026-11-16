
import { Link } from "@tanstack/react-router";
import { ShoppingOutlined } from "@ant-design/icons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Brand */}
        <Link to="/" className="flex flex-col no-underline">
          <span className="text-2xl font-semibold tracking-[0.2em] text-gray-950">
            NIVORA
          </span>
          <span className="text-[9px] tracking-[0.3em] text-gray-500">
            CURATED FOR EVERYDAY
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-9 md:flex">
          <a
            href="#home"
            className="text-sm text-gray-700 transition hover:text-black"
          >
            Home
          </a>

          <a
            href="#categories"
            className="text-sm text-gray-700 transition hover:text-black"
          >
            Categories
          </a>

          <a
            href="#featured"
            className="text-sm text-gray-700 transition hover:text-black"
          >
            New Arrivals
          </a>

          <a
            href="#about"
            className="text-sm text-gray-700 transition hover:text-black"
          >
            About
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="hidden text-sm font-medium text-gray-700 transition hover:text-black sm:block"
          >
            Sign In
          </Link>

          <button
            type="button"
            aria-label="Shopping bag"
            className="relative text-xl text-gray-900"
          >
            <ShoppingOutlined />
          </button>
        </div>

      </div>
    </header>
  );
}
