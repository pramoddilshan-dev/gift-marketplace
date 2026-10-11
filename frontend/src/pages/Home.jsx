import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Gift, Heart } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const prodRes = await getProducts({ limit: 6 });
        setProducts(Array.isArray(prodRes.data?.products) ? prodRes.data.products : []);

        const catRes = await getCategories();
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-[#fcfbf9] to-[#fcfbf9] pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200/60 text-amber-900 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                Bespoke & Curated Collections
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.15]">
                Find the Perfect Gift <br className="hidden sm:inline" />
                <span className="italic font-normal text-amber-700">for Every Moment.</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover handpicked treasures, unique personalized keepsakes, and artisan creations curated to bring joy to those you love.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg transform active:scale-95"
                >
                  Start Shopping
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 font-medium text-sm transition-all shadow-xs"
                >
                  Explore Catalog
                </button>
              </div>
            </div>

            {/* Hero Banner Box */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-4/5 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-50 p-6 shadow-xl border border-amber-200/50 flex flex-col justify-between relative overflow-hidden">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-amber-800 font-bold mb-1">Curated Daily</p>
                  <h3 className="font-serif text-2xl font-semibold text-neutral-900">Handcrafted Memories</h3>
                  <p className="text-xs text-neutral-600 mt-2">Over 1,000+ unique gift ideas waiting to be discovered.</p>
                </div>

                {/* Animated Center Icon to fill empty space professionally */}
                <div className="flex flex-col items-center justify-center my-auto py-6">
                  <div className="w-16 h-16 rounded-full bg-amber-600/10 flex items-center justify-center border border-amber-300/50 animate-bounce shadow-inner">
                    <Heart className="w-8 h-8 text-amber-700 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-mono text-amber-900/80 mt-3 tracking-widest uppercase font-semibold">Handmade with Love</span>
                </div>

                <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-lg mt-auto">
                  <span className="text-xs text-amber-300 font-mono">Special Collection</span>
                  <p className="font-serif text-lg font-medium mt-1">Artisanal Gift Hampers</p>
                  <button onClick={() => navigate('/products')} className="mt-3 text-xs text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1">
                    Browse Hampers <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-16 bg-white border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#fcfbf9] border border-neutral-200/60">
            <Gift className="w-8 h-8 text-amber-700 mb-4" />
            <h3 className="font-serif text-lg font-semibold mb-2">Curated Collections</h3>
            <p className="text-xs text-neutral-600">Handpicked gifts organized so you can find the right present in seconds.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#fcfbf9] border border-neutral-200/60">
            <Truck className="w-8 h-8 text-amber-700 mb-4" />
            <h3 className="font-serif text-lg font-semibold mb-2">Fast & Reliable Delivery</h3>
            <p className="text-xs text-neutral-600">Get gifts delivered on time with tracking for every order.</p>
          </div>
          <div className="p-8 rounded-2xl bg-[#fcfbf9] border border-neutral-200/60">
            <ShieldCheck className="w-8 h-8 text-amber-700 mb-4" />
            <h3 className="font-serif text-lg font-semibold mb-2">Secure Checkout</h3>
            <p className="text-xs text-neutral-600">Safe payments with modern encryption and privacy-first practices.</p>
          </div>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-semibold">Explore</span>
            <h2 className="font-serif text-3xl font-semibold mt-1">Top Categories</h2>
          </div>
          <button onClick={() => navigate('/products')} className="text-xs font-semibold hover:text-amber-700 flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/products?category=${c.id}`)}
              className="p-5 rounded-2xl bg-white border border-neutral-200/80 hover:border-amber-400 hover:shadow-md transition text-left flex flex-col justify-between min-h-[120px]"
            >
              <span className="font-serif text-base font-semibold text-neutral-900">{c.name}</span>
              <span className="text-[11px] text-neutral-500">Explore &rarr;</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-amber-50/30 border-t border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-semibold">Trending</span>
              <h2 className="font-serif text-3xl font-semibold mt-1">Featured Products</h2>
            </div>
            <button onClick={() => navigate('/products')} className="text-xs font-semibold hover:text-amber-700 flex items-center gap-1">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between">
                <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
                  {p.image_url ? (
                    <img src={`http://localhost:5000/${p.image_url}`} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">No Image</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 truncate mb-1">{p.name}</h3>
                  <p className="font-mono text-base font-bold text-neutral-900 mb-4">Rs. {parseFloat(p.price).toLocaleString()}</p>
                  <button onClick={() => navigate(`/products/${p.id}`)} className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-medium text-xs transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}