import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products.api";
import { getCategories } from "../api/categories.api";
import { getMySalesOrders } from "../api/seller.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Store, Plus, Edit, Trash2, Package, ShoppingCart, MapPin, Phone, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New / Update Product Form State & Editing State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  // Pagination States
  const [productPage, setProductPage] = useState(1);
  const productsPerPage = 4;
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 3;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);

        const prodRes = await getProducts();
        if (!user) return;
        const myProducts = (prodRes.data.products || []).filter(p => p.seller_id === user.id);
        setProducts(myProducts);

        // Fetch Seller Sales Orders and Filter for current seller
        const ordersRes = await getMySalesOrders();
        if (!user) return;
        const allOrders = Array.isArray(ordersRes.data) ? ordersRes.data : [];

        // Filter orders containing items owned by this seller
        const mySellerOrders = allOrders.filter(order => {
          if (!order.OrderItems || order.OrderItems.length === 0) return false;
          return order.OrderItems.some(item => item.Product?.seller_id === user.id);
        });

        setOrders(mySellerOrders);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user || user.role !== 'seller') {
    return null;
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !price || !categoryId) {
      setError("Please fill in all required product fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setSubmitting(true);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, formData);
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(formData);
        setSuccess("Product created successfully!");
      }

      // Reset Form State
      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImageFile(null);
      setEditingProductId(null);

      const prodRes = await getProducts();
      if (!user) return;
      const myProducts = (prodRes.data.products || []).filter(p => p.seller_id === user.id);
      setProducts(myProducts);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setCategoryId(product.category_id || "");
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setImageFile(null);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };

  // Pagination Slicing
  const indexOfLastProduct = productPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalProductPages = Math.ceil(products.length / productsPerPage) || 1;

  const indexOfLastOrder = orderPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage) || 1;

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm font-mono text-neutral-500 animate-pulse">Loading Seller Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfbf9] py-12 px-4 sm:px-6 lg:px-8 text-neutral-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-neutral-200 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Store className="w-3.5 h-3.5" /> Seller Portal
            </div>
            <h1 className="font-serif text-3xl font-semibold">Welcome, {user?.name}</h1>
            <p className="text-xs text-neutral-500 mt-1">Manage your boutique catalog, listings, and customer orders.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            {success}
          </div>
        )}

        {/* ORDERS SECTION */}
        <div className="space-y-6">
          <h3 className="font-serif text-2xl font-semibold flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-600" /> Incoming Sales Orders ({orders.length})
          </h3>

          {currentOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 text-center">
              <p className="text-xs text-neutral-500">No sales orders received for your products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOrders.map((order) => {
                const sellerItems = (order.OrderItems || []).filter(
                  item => item.Product?.seller_id === user?.id
                );

                const totalAmount = sellerItems.reduce((acc, item) => {
                  const pPrice = parseFloat(item.price || item.Product?.price || 0);
                  return acc + pPrice * (item.quantity || 1);
                }, 0);

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md font-semibold">
                          Order #{order.id}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Purchased Items List */}
                      <div className="space-y-2">
                        {sellerItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                            {item.Product?.image_url && (
                              <img 
                                src={`http://localhost:5000/${item.Product.image_url}`} 
                                alt={item.Product?.name} 
                                className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-xs text-neutral-900 truncate">
                                {item.Product?.name || 'Gift Product'}
                              </h4>
                              <p className="text-[11px] text-neutral-500">
                                Qty: <span className="font-bold text-neutral-800">{item.quantity}</span> × Rs. {parseFloat(item.price || item.Product?.price || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex justify-between items-center">
                        <span className="text-xs font-semibold text-neutral-500">Total Revenue:</span>
                        <span className="font-mono text-sm font-bold text-amber-700">
                          Rs. {totalAmount.toLocaleString()}
                        </span>
                      </div>

                      {/* Customer Address & Phone */}
                      <div className="pt-2 border-t border-neutral-100 text-xs space-y-1.5 text-neutral-600 bg-amber-50/50 p-3 rounded-xl">
                        <p className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{order.shipping_address || 'No shipping address provided'}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span className="font-mono font-semibold">{order.phone || 'N/A'}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls for Orders */}
          {totalOrderPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <span className="text-xs text-neutral-500">Showing page {orderPage} of {totalOrderPages}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                  disabled={orderPage === 1}
                  className="p-2 rounded-xl border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))}
                  disabled={orderPage === totalOrderPages}
                  className="p-2 rounded-xl border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PRODUCTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6 border-t border-neutral-200">
          
          {/* Add / Edit Product Form */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-neutral-200/80 shadow-sm space-y-6 h-fit">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
                {editingProductId ? <Edit className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-amber-600" />}
                {editingProductId ? "Edit Gift Item" : "Add New Gift Item"}
              </h3>
              {editingProductId && (
                <button 
                  onClick={handleCancelEdit} 
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Handmade Ceramic Mug"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Category</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your artisan product..."
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">Product Image</label>
                <input
                  type="file"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-medium text-xs transition shadow-md disabled:opacity-50 mt-2"
              >
                {submitting ? 'Saving...' : editingProductId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>

          {/* My Products List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif text-xl font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-600" /> My Listed Products ({products.length})
            </h3>

            {currentProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8">
                <p className="text-xs text-neutral-500">You haven't listed any products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-2xl border border-neutral-200/80 p-4 shadow-xs flex flex-col justify-between">
                    <div className="aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-3">
                      {p.image_url ? (
                        <img src={`http://localhost:5000/${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">No Image</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-semibold truncate">{p.name}</h4>
                      <p className="font-mono text-sm font-bold text-amber-700 mt-1">Rs. {parseFloat(p.price).toLocaleString()}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-neutral-100 flex justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls for Products */}
            {totalProductPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                <span className="text-xs text-neutral-500">Showing page {productPage} of {totalProductPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
                    disabled={productPage === 1}
                    className="p-2 rounded-xl border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition bg-white"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductPage((p) => Math.min(p + 1, totalProductPages))}
                    disabled={productPage === totalProductPages}
                    className="p-2 rounded-xl border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50 transition bg-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}