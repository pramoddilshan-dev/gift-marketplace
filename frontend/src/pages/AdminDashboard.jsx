import { useEffect, useState } from "react";
import { 
  getAllUsers, 
  toggleUserStatus, 
  getAllOrders, 
  adminDeactivateProduct 
} from "../api/admin.api";
import { 
  getCategories, 
  createCategory, 
  deleteCategory 
} from "../api/categories.api";
import { getProducts } from "../api/products.api";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  FolderTree, 
  ShoppingBag,
  Trash2, 
  CheckCircle, 
  XCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Phone
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters / Search States
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Pagination States
  const [userPage, setUserPage] = useState(1);
  const userLimit = 5;

  const [productPage, setProductPage] = useState(1);
  const productLimit = 6;

  const [orderPage, setOrderPage] = useState(1);
  const orderLimit = 5;

  // Category Form State
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catErr, setCatErr] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [submittingCat, setSubmittingCat] = useState(false);

  // Status Alerts
  const [alert, setAlert] = useState({ type: "", text: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, userRes, catRes, orderRes] = await Promise.allSettled([
        getProducts(),
        getAllUsers(),
        getCategories(),
        getAllOrders()
      ]);

      if (prodRes.status === "fulfilled") setProducts(prodRes.value?.data?.products || []);
      if (userRes.status === "fulfilled") setUsersList(Array.isArray(userRes.value?.data) ? userRes.value.data : []);
      if (catRes.status === "fulfilled") setCategories(Array.isArray(catRes.value?.data) ? catRes.value.data : []);
      if (orderRes.status === "fulfilled") setOrders(Array.isArray(orderRes.value?.data) ? orderRes.value.data : []);
    } catch (err) {
      console.error("Data load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    loadData();
  }, [user, navigate]);

  const showAlert = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert({ type: "", text: "" }), 4000);
  };

  // User Status Toggle
  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      setUsersList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: !u.is_active } : u))
      );
      showAlert("success", "User status updated successfully.");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to update user status.");
    }
  };

  // Product Deactivation
  const handleDeactivateProduct = async (id) => {
    if (!window.confirm("Confirm product deactivation?")) return;
    try {
      await adminDeactivateProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showAlert("success", "Product deactivated.");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to deactivate product.");
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) {
      setCatErr("Category name required.");
      return;
    }
    setSubmittingCat(true);
    setCatErr("");
    setCatMsg("");
    try {
      const res = await createCategory({ name: catName, description: catDesc });
      setCatMsg("Category created.");
      setCatName("");
      setCatDesc("");
      if (res.data) setCategories((prev) => [...prev, res.data]);
    } catch (err) {
      setCatErr(err.response?.data?.message || "Failed to create category.");
    } finally {
      setSubmittingCat(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showAlert("success", "Category removed.");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Failed to delete category.");
    }
  };

  // Filtered & Paginated Users
  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );
  const totalUserPages = Math.ceil(filteredUsers.length / userLimit) || 1;
  const paginatedUsers = filteredUsers.slice((userPage - 1) * userLimit, userPage * userLimit);

  // Filtered & Paginated Products
  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );
  const totalProductPages = Math.ceil(filteredProducts.length / productLimit) || 1;
  const paginatedProducts = filteredProducts.slice((productPage - 1) * productLimit, productPage * productLimit);

  // Paginated Orders
  const totalOrderPages = Math.ceil(orders.length / orderLimit) || 1;
  const paginatedOrders = orders.slice((orderPage - 1) * orderLimit, orderPage * orderLimit);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
          <RefreshCw className="w-4 h-4 animate-spin" /> Loading Admin Portal...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-4 space-y-6 flex-shrink-0">
        <div className="px-3 py-2 border-b border-gray-100">
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Admin Portal</span>
          <h2 className="text-base font-bold text-gray-800">{user?.name}</h2>
          <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-[10px] rounded uppercase">
            {user?.role}
          </span>
        </div>

        <nav className="space-y-1">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "users", label: `Users (${usersList.length})`, icon: Users },
            { id: "products", label: `Products (${products.length})`, icon: Package },
            { id: "categories", label: `Categories (${categories.length})`, icon: FolderTree },
            { id: "orders", label: `Orders (${orders.length})`, icon: ShoppingBag },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                  active
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-x-hidden">
        
        {/* Global Notification */}
        {alert.text && (
          <div
            className={`p-3 rounded-lg text-xs font-medium flex justify-between items-center ${
              alert.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
            }`}
          >
            <span>{alert.text}</span>
            <button onClick={() => setAlert({ type: "", text: "" })} className="font-bold">✕</button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-gray-900">Dashboard Overview</h1>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <p className="text-xs font-mono text-gray-500 uppercase">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <p className="text-xs font-mono text-gray-500 uppercase">Users Registered</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{usersList.length}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <p className="text-xs font-mono text-gray-500 uppercase">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
                <p className="text-xs font-mono text-gray-500 uppercase">Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
            </div>

            {/* Recent Table Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-2xs">
              <h2 className="text-sm font-bold text-gray-800">Recent System Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 font-mono border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {usersList.slice(0, 5).map((u) => (
                      <tr key={u.id}>
                        <td className="p-2.5 font-mono text-gray-400">#{u.id}</td>
                        <td className="p-2.5 font-semibold text-gray-800">{u.name}</td>
                        <td className="p-2.5 text-gray-600 font-mono">{u.email}</td>
                        <td className="p-2.5 uppercase font-mono text-[10px] text-gray-700">{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">User Management</h1>
              
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-mono border-b border-gray-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-4 text-center text-gray-500">No users found.</td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="p-3 font-mono text-gray-400">#{u.id}</td>
                        <td className="p-3 font-semibold text-gray-900">{u.name}</td>
                        <td className="p-3 font-mono text-gray-600">{u.email}</td>
                        <td className="p-3 uppercase font-mono text-[10px] font-bold text-gray-700">{u.role}</td>
                        <td className="p-3">
                          {u.is_active !== false ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                              <CheckCircle className="w-3 h-3" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                              <XCircle className="w-3 h-3" /> Suspended
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== "admin" && (
                            <button
                              onClick={() => handleToggleUser(u.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium border ${
                                u.is_active !== false
                                  ? "border-red-200 text-red-600 hover:bg-red-50"
                                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                            >
                              {u.is_active !== false ? "Deactivate" : "Activate"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Users */}
            {totalUserPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Showing page {userPage} of {totalUserPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                    disabled={userPage === 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setUserPage((p) => Math.min(p + 1, totalUserPages))}
                    disabled={userPage === totalUserPages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === "products" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900">Products Catalog</h1>
              
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setProductPage(1); }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-50"
                />
              </div>
            </div>

            {paginatedProducts.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProducts.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col justify-between space-y-3">
                    <div className="aspect-video bg-gray-200 rounded overflow-hidden">
                      {p.image_url ? (
                        <img src={`http://localhost:5000/${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase">Seller ID: #{p.seller_id}</span>
                      <h3 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h3>
                      <p className="font-mono text-xs font-bold text-gray-800 mt-0.5">Rs. {parseFloat(p.price).toLocaleString()}</p>
                    </div>

                    <div className="pt-2 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => handleDeactivateProduct(p.id)}
                        className="px-2.5 py-1 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Deactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls for Products */}
            {totalProductPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Showing page {productPage} of {totalProductPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
                    disabled={productPage === 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setProductPage((p) => Math.min(p + 1, totalProductPages))}
                    disabled={productPage === totalProductPages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900">Add New Category</h2>

              {catErr && <p className="text-xs text-red-600 font-medium">{catErr}</p>}
              {catMsg && <p className="text-xs text-emerald-700 font-medium">{catMsg}</p>}

              <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Handmade Items"
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Description</label>
                  <textarea
                    rows="2"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    placeholder="Brief description..."
                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCat}
                  className="w-full py-2 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {submittingCat ? "Saving..." : "Create Category"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-gray-200 shadow-2xs space-y-3">
              <h2 className="text-sm font-bold text-gray-900">Categories Directory</h2>
              <div className="divide-y divide-gray-100 text-xs">
                {categories.map((c) => (
                  <div key={c.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{c.name}</p>
                      <p className="text-gray-500 text-[11px]">{c.description || "No description"}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-2xs">
            <h1 className="text-lg font-bold text-gray-900">System Orders Log</h1>

            {paginatedOrders.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No orders recorded.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedOrders.map((o) => {
                  const orderItems = o.OrderItems || [];
                  const totalAmount = orderItems.reduce((acc, item) => {
                    const price = parseFloat(item.price || item.Product?.price || 0);
                    return acc + price * (item.quantity || 1);
                  }, 0);

                  return (
                    <div key={o.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <span className="font-mono text-xs font-bold bg-gray-200 px-2 py-0.5 rounded text-gray-800">
                          Order #{o.id}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] font-mono text-gray-500">Buyer ID: <span className="font-bold text-gray-800">#{o.user_id}</span></p>
                        
                        {/* Order Items */}
                        <div className="space-y-1.5">
                          {orderItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-lg border border-gray-200">
                              {item.Product?.image_url && (
                                <img 
                                  src={`http://localhost:5000/${item.Product.image_url}`} 
                                  alt={item.Product?.name} 
                                  className="w-8 h-8 object-cover rounded flex-shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0 text-xs">
                                <p className="font-semibold text-gray-800 truncate">{item.Product?.name || "Gift Product"}</p>
                                <p className="text-gray-500 text-[11px]">
                                  Qty: <span className="font-bold text-gray-700">{item.quantity}</span> × Rs. {parseFloat(item.price || item.Product?.price || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-1 text-xs">
                          <span className="font-semibold text-gray-600">Total Amount:</span>
                          <span className="font-mono font-bold text-gray-900">Rs. {totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600 space-y-1 font-mono bg-white p-2.5 rounded-lg border border-gray-200">
                        <p className="flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span>{o.shipping_address || "No address"}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{o.phone || "N/A"}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls for Orders */}
            {totalOrderPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Showing page {orderPage} of {totalOrderPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderPage((p) => Math.max(p - 1, 1))}
                    disabled={orderPage === 1}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setOrderPage((p) => Math.min(p + 1, totalOrderPages))}
                    disabled={orderPage === totalOrderPages}
                    className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}