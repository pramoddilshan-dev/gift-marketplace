import { useEffect, useState } from "react";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { addToCart } from "../api/cart.api";
import { useAuth } from "../auth/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Eye, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedSuccess, setAddedSuccess] = useState(null);
  const [cartError, setCartError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load Categories
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error loading categories", err));
  }, []);

  // Fetch Products
  useEffect(() => {
    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;

        const res = await getProducts(params);
        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        console.error("Error loading products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, [page, selectedCategory, searchQuery]);

  // Handle Add To Cart
  const handleAddToCart = async (productId) => {
    setCartError("");
    
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingId(productId);
    try {
      await addToCart({ product_id: productId, quantity: 1 });
      setAddedSuccess(productId);
      
      setTimeout(() => {
        setAddedSuccess(null);
      }, 2000);
    } catch (err) {
      setCartError(err.response?.data?.message || "Failed to add product to cart");
      setTimeout(() => setCartError(""), 3000);
    } finally {
      setAddingId(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ ...(selectedCategory && { category: selectedCategory }), ...(searchQuery && { search: searchQuery }) });
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setPage(1);
    const newParams = {};
    if (catId) newParams.category = catId;
    if (searchQuery) newParams.search = searchQuery;
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-semibold">Exquisite Selection</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold">Explore Gift Catalog</h1>
          <p className="text-sm text-neutral-600">Browse through our curated collection of artisanal gifts, hampers, and personalized treasures.</p>
        </div>

        {cartError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 text-center max-w-md mx-auto shadow-sm">
            {cartError}
          </div>
        )}

        {/* Search & Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button
              onClick={() => handleCategorySelect("")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                !selectedCategory ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              All Gifts
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory == c.id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 text-xs bg-neutral-50/50"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-amber-700 transition">
              Search
            </button>
          </form>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm font-mono text-neutral-500 animate-pulse">Loading amazing gifts...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200/60">
            <h3 className="font-serif text-xl font-medium text-neutral-800">No gifts found</h3>
            <p className="text-xs text-neutral-500 mt-1">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl transition flex flex-col justify-between group">
                <div 
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="relative aspect-4/3 bg-neutral-100 overflow-hidden cursor-pointer"
                >
                  {p.image_url ? (
                    <img src={`http://localhost:5000/${p.image_url}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">No Image</div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-amber-700 uppercase">{p.Category?.name || 'General'}</span>
                    <h3 
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="font-serif text-lg font-semibold text-neutral-900 truncate cursor-pointer hover:text-amber-700 transition"
                    >
                      {p.name}
                    </h3>
                  </div>
                  <p className="font-mono text-base font-bold text-neutral-900">Rs. {parseFloat(p.price).toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="flex-1 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>

                    <button 
                      onClick={() => handleAddToCart(p.id)}
                      disabled={addingId === p.id}
                      className={`px-4 py-3 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                        addedSuccess === p.id 
                          ? "bg-emerald-700 text-white" 
                          : "bg-neutral-900 hover:bg-amber-700 text-white"
                      }`}
                    >
                      {addingId === p.id ? (
                        <span>...</span>
                      ) : addedSuccess === p.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="p-2.5 rounded-xl bg-white border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-medium">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2.5 rounded-xl bg-white border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}