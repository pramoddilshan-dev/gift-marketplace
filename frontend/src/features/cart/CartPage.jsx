import { useEffect, useState } from "react";
import { getCart, removeFromCart } from "../../api/cart.api";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    getCart().then((res) => setCart(res.data.items));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (id) => {
    await removeFromCart(id);
    loadCart();
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.Product.price) * item.quantity,
    0
  );

  if (cart.length === 0) return <p>Your cart is empty</p>;

  return (
    <div>
      <h1>Your Cart</h1>

      {cart.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
          <h3>{item.Product.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: Rs {item.Product.price}</p>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}

      <h2>Total: Rs {total}</h2>
      <button>Proceed to Checkout</button>
    </div>
  );
}