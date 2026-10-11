import { Gift, ShieldCheck, Truck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-serif font-bold">
              G
            </div>
            <span className="font-serif text-white text-lg font-bold">Gift Marketplace</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Curated luxury finds, bespoke gifts, and artisan creations designed to make every celebration memorable.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-mono font-semibold mb-4">Explore</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-amber-400 transition">Gift Catalog</Link></li>
            <li><Link to="/cart" className="hover:text-amber-400 transition">Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-mono font-semibold mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li><span className="hover:text-amber-400 transition cursor-pointer">Order Tracking</span></li>
            <li><span className="hover:text-amber-400 transition cursor-pointer">Privacy Policy</span></li>
            <li><span className="hover:text-amber-400 transition cursor-pointer">Terms of Service</span></li>
          </ul>
        </div>

        {/* Security & Trust */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-widest font-mono font-semibold mb-4">Secure & Trusted</h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Encrypted Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Truck className="w-4 h-4 text-amber-500" />
              <span>Islandwide Fast Delivery</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; 2026 Gift Marketplace. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for luxury gifting.
        </p>
      </div>
    </footer>
  );
}