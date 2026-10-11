import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeFromCart } from "../api/cart.api";
import { checkoutOrder } from "../api/orders.api";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityUpdate = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await updateCartItem({ product_id: productId, quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error("Failed to update cart quantity", err);
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await removeFromCart(cartId);
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!shippingAddress || !phone) {
      setError("Please provide shipping address and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await checkoutOrder({ shipping_address: shippingAddress, phone });
      setSuccessMsg("Order placed successfully!");
      setCartItems([]);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate Total
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.quantity * parseFloat(item.Product?.price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm font-mono text-neutral-500 animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="border-b border-neutral-200/80 pb-6">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-700 font-semibold">Review & Order</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">Shopping Cart</h1>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            {successMsg}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-neutral-200/60 shadow-sm space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-serif text-xl font-medium text-neutral-800">Your cart is empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">Explore our catalog and discover wonderful gifts to add to your cart.</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-xs hover:bg-amber-700 transition"
            >
              Explore Gifts
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                      {item.Product?.image_url ? (
                        <img src={`http://localhost:5000/${item.Product.image_url}`} alt={item.Product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold text-neutral-900">{item.Product?.name}</h4>
                      <p className="font-mono text-xs text-neutral-500 mt-0.5">Rs. {parseFloat(item.Product?.price || 0).toLocaleString()} each</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 border border-neutral-200 rounded-xl p-1 bg-neutral-50">
                      <button
                        onClick={() => handleQuantityUpdate(item.product_id, item.quantity, -1)}
                        className="p-1.5 rounded-lg hover:bg-white text-neutral-700 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.product_id, item.quantity, 1)}
                        className="p-1.5 rounded-lg hover:bg-white text-neutral-700 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6 sticky top-28">
                <h3 className="font-serif text-xl font-semibold text-neutral-900">Order Summary</h3>

                <div className="space-y-3 pt-2 border-t border-neutral-100 text-sm">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-neutral-900">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-mono font-semibold text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-100">
                    <span>Total Amount</span>
                    <span className="font-mono text-amber-700">Rs. {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <form onSubmit={handleCheckout} className="space-y-4 pt-4 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Shipping Address
                    </label>
                    <textarea
                      required
                      rows="2"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter your delivery address..."
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 text-xs bg-neutral-50/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-amber-500 text-xs bg-neutral-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-medium text-xs tracking-wide transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {submitting ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Secure checkout guaranteed with automated inventory allocation.</span>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}