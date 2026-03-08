import { useEffect, useState, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getProducts } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { addToCart } from "../api/cart.api";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import QuickViewModal from "../components/QuickViewModal";
import "../styles/products.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [quickViewId, setQuickViewId] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const loadProducts = async ({ reset = false, page: targetPage = 1 } = {}) => {
    if (reset) {
      setLoading(true);
      setProducts([]);
      setPage(1);
    }

    try {
      setError("");
      const opts = { page: targetPage };
      if (selectedCategory) opts.category = selectedCategory;
      if (searchQuery) opts.search = searchQuery;

      const res = await getProducts(opts);
      const productList = Array.isArray(res.data?.products) ? res.data.products : [];

      setProducts((prev) => (reset ? productList : [...prev, ...productList]));
      setTotalPages(res.data?.pages || 1);
      setPage(res.data?.page || targetPage);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
      if (reset) setProducts([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // initialize from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    const search = params.get("search") || "";
    if (cat !== selectedCategory) setSelectedCategory(cat);
    if (search !== searchQuery) setSearchQuery(search);
  }, [location.search]);

  // load categories on mount
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    loadCats();
  }, []);

  // fetch products when filters change
  useEffect(() => {
    loadProducts({ reset: true, page: 1 });
  }, [selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sort === "price-asc") {
      return copy.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (sort === "price-desc") {
      return copy.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return copy;
  }, [products, sort]);

  const handleAddToCart = async (productId, productName) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await addToCart({ product_id: productId, quantity: 1 });
      setSuccessMsg(`${productName} added to cart!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleLoadMore = async () => {
    if (page >= totalPages) return;
    setLoadingMore(true);
    await loadProducts({ reset: false, page: page + 1 });
  };

  const openQuickView = (id) => {
    setQuickViewId(id);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    setQuickViewId(null);
  };

  return (
    <div className="container py-4">
      <header className="products-header">
        <div>
          <h1>Browse Gifts</h1>
          <p className="text-secondary">
            Discover carefully curated gifts for every moment, with easy search and smart filters.
          </p>
        </div>

        <div className="products-actions">
          <div className="products-filter">
            <label htmlFor="sort" className="filter-label">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="select-category"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="products-filter">
            <label htmlFor="category" className="filter-label">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-category"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-secondary clear-filters"
            onClick={() => {
              setSelectedCategory("");
              setSearchQuery("");
              navigate("/products");
            }}
          >
            Clear
          </button>
        </div>
      </header>

      {successMsg && <div className="alert alert-success mb-4">{successMsg}</div>}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      {loading ? (
        <div className="grid grid-3">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="card product-card skeleton">
              <div className="product-image" />
              <div className="product-content">
                <div className="skeleton-text skeleton-title" />
                <div className="skeleton-text" />
                <div className="skeleton-text" />
              </div>
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="container text-center py-4">
          <h2>No products found</h2>
          <p className="text-secondary">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {sortedProducts.map((p) => (
              <div key={p.id} className="card product-card">
                <div className="product-image">
                  {p.image_url ? (
                    <img
                      src={`http://localhost:5000/${p.image_url}`}
                      alt={p.name}
                    />
                  ) : (
                    <div className="placeholder-image">No Image</div>
                  )}

                  <div className="product-overlay">
                    <button className="btn-secondary" onClick={() => openQuickView(p.id)}>
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="product-content">
                  <h3>{p.name}</h3>
                  <div className="product-meta">
                    {p.Category && <span className="tag">{p.Category.name}</span>}
                    <span className="seller">by {p.User?.name}</span>
                  </div>
                  <p className="text-secondary text-sm mb-2">{p.description}</p>
                  <div className="product-footer">
                    <span className="product-price">Rs {parseFloat(p.price).toLocaleString()}</span>
                    {user?.role === "customer" && (
                      <button
                        className="btn-primary btn-small"
                        onClick={() => handleAddToCart(p.id, p.name)}
                        disabled={addingToCart[p.id]}
                      >
                        {addingToCart[p.id] ? "Adding..." : "Add"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="load-more">
            {page < totalPages ? (
              <button className="btn-secondary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            ) : (
              <span className="text-secondary">You’ve reached the end of the list.</span>
            )}
          </div>
        </>
      )}

      <QuickViewModal
        open={quickViewOpen}
        productId={quickViewId}
        onClose={closeQuickView}
        onAdded={() => setSuccessMsg("Added to cart!")}
      />
    </div>
  );
}
