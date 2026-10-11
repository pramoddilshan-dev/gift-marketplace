import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/products.api";
import { addToCart } from "../api/cart.api";
import { buyProductNow } from "../api/orders.api";
import { useAuth } from "../auth/AuthContext";
import { ShoppingBag, Zap, Plus, Minus, ShieldCheck, ArrowLeft, Check } from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product details", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addToCart({ product_id: product.id, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleBuyNowSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    if (!shippingAddress || !phone) {
      setError("Please fill in shipping address and phone.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await buyProductNow({
        product_id: product.id,
        quantity,
        shipping_address: shippingAddress,
        phone,
      });
      setMessage("Order placed successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Buy now failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm font-mono text-neutral-500 animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h3 className="font-serif text-2xl font-semibold">Product not found</h3>
        <button onClick={() => navigate("/products")} className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs">
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-amber-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="aspect-square rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-sm">
            {product.image_url ? (
              <img src={`http://localhost:5000/${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-mono text-xs">No Image Available</div>
            )}
          </div>

          <div className="space-y-6 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-700 font-semibold">
                Seller: {product.User?.name || 'Artisan'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1 text-neutral-900">{product.name}</h1>
              <p className="font-mono text-2xl font-bold text-neutral-900 mt-3">Rs. {parseFloat(product.price).toLocaleString()}</p>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-4">
              {product.description || 'No description provided for this exquisite item.'}
            </p>

            <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">Quantity</span>
              <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-lg hover:bg-white text-neutral-700 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded-lg hover:bg-white text-neutral-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-xl font-medium text-xs transition flex items-center justify-center gap-2 shadow-xs ${
                  addedToCart ? "bg-emerald-700 text-white" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-900"
                }`}
              >
                {addedToCart ? <><Check className="w-4 h-4" /> Added to Cart</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
              </button>

              <button
                onClick={() => setShowBuyModal(true)}
                className="flex-1 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition flex items-center justify-center gap-2 shadow-md"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Verified seller item with fast secure delivery.</span>
            </div>
          </div>
        </div>

        {showBuyModal && (
          <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl border border-neutral-200 space-y-6">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
                <h3 className="font-serif text-xl font-semibold">Instant Checkout</h3>
                <button onClick={() => setShowBuyModal(false)} className="text-neutral-400 hover:text-neutral-700 text-sm font-bold">✕</button>
              </div>

              <div className="text-xs space-y-1">
                <p className="text-neutral-500">Product: <span className="font-semibold text-neutral-900">{product.name}</span></p>
                <p className="text-neutral-500">Total Price: <span className="font-mono font-bold text-amber-700">Rs. {(quantity * parseFloat(product.price)).toLocaleString()}</span></p>
              </div>

              <form onSubmit={handleBuyNowSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    rows="2"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter delivery address..."
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 text-xs bg-neutral-50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 text-xs bg-neutral-50"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBuyModal(false)}
                    className="flex-1 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white text-xs font-medium transition shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Processing...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}