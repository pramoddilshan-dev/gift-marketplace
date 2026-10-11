import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
// eslint-disable-next-line no-unused-vars
import { ShoppingBag, User, LogOut, Menu, X, ShieldCheck, Store } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#fcfbf9]/90 backdrop-blur-md border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900">
                Gift Marketplace
              </span>
              <p className="text-[10px] text-amber-800 tracking-wider font-mono uppercase">
                Curated Luxury Finds
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-700">
            <Link to="/" className="hover:text-amber-700 transition">Home</Link>
            <Link to="/products" className="hover:text-amber-700 transition">Explore Gifts</Link>
            
            {user?.role === 'seller' && (
              <Link to="/seller/dashboard" className="flex items-center gap-1.5 text-amber-800 font-semibold hover:text-amber-900">
                <Store className="w-4 h-4" /> Seller Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-red-700 font-semibold hover:text-red-800">
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            )}
          </div>

          {/* Right Action Icons (Cart & Auth) */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/cart" 
              className="relative p-2.5 rounded-xl bg-neutral-100 hover:bg-amber-100 text-neutral-800 transition shadow-xs"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
                <div className="text-right">
                  <p className="text-xs font-semibold text-neutral-900">{user.name}</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-mono">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:text-amber-700 transition"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-medium text-xs tracking-wide transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
              <ShoppingBag className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-neutral-100 text-neutral-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-neutral-800">Home</Link>
          <Link to="/products" onClick={() => setIsOpen(false)} className="block py-2 text-sm font-medium text-neutral-800">Explore Gifts</Link>
          
          {user?.role === 'seller' && (
            <Link to="/seller/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-amber-800">
              <Store className="w-4 h-4" /> Seller Dashboard
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2 text-sm font-semibold text-red-700">
              <ShieldCheck className="w-4 h-4" /> Admin Portal
            </Link>
          )}

          {user ? (
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <p className="text-xs text-neutral-500 font-mono">Logged in as <span className="font-semibold text-neutral-900">{user.name}</span></p>
              <button onClick={() => { logout(); setIsOpen(false); }} className="w-full py-2 text-center text-xs font-semibold text-red-600 bg-red-50 rounded-lg">
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-neutral-100 flex gap-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-center text-xs font-semibold bg-neutral-100 rounded-lg">Sign In</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-center text-xs font-semibold bg-neutral-900 text-white rounded-lg">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}