import { useCart } from "../Context/CartContext";
import { useNavigate, Link } from "react-router-dom";

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 30;
  const tax = 35;
  const total = subtotal + shipping + tax;

  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  return (
    <div className="flex w-full">
      <div className="lg:w-[70%] bg-white h-screen overflow-y-auto p-4">
        <Link
          to="/"
          className="text-gray-600 hover:underline mb-4 inline-block"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-20 h-20 object-cover"
              />
              <div className="ml-4 flex-1">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm text-gray-600">{item.color}</p>
                <p className="text-sm font-medium">
                  {inrFormatter.format(item.price)} × {item.quantity}
                </p>

                <select
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value))
                  }
                  className="border mt-2"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 ml-4"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Panel */}

      <div className="lg:w-[30%] bg-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <p>Subtotal: {inrFormatter.format(subtotal)}</p>
        <p>Shipping: {inrFormatter.format(shipping)}</p>
        <p>Tax: {inrFormatter.format(tax)}</p>
        <hr className="my-2" />
        <p className="font-bold text-lg">Total: {inrFormatter.format(total)}</p>
        {cartItems.length === 0 ? (
          <h2>Add Items to your cart</h2>
        ) : (
          <button
            className="w-full mt-6 bg-black text-white py-2"
            onClick={() => navigate("/checkout")}
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default CartPage;
