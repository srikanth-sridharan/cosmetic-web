import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

export default function ProfileSidebar({ isOpen, onClose, user, handleLogout }) {
  const sidebarRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const getCartCount = (email) => {
      try {
        if (!email) return;
        const cartKey = `cart_${email}`;
        const cartString = localStorage.getItem(cartKey);
        const cart = cartString ? JSON.parse(cartString) : [];
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
      } catch (err) {
        console.error("Error reading cart", err);
      }
    };

    if (user?.email) {
      getCartCount(user.email);
    }

    const handleCartUpdate = () => {
      if (user?.email) {
        getCartCount(user.email);
      }
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  const handleCartClick = () => {
    onClose();
    router.push("/cart");
  };

  const getEmailInitials = (email) => {
    if (!email) return "U";
    const namePart = email.split("@")[0];
    return namePart.charAt(0).toUpperCase();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      {/* Overlay
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}></div> */}

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 p-6 rounded-l-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold">
              {getEmailInitials(user?.email)}
            </div>
            <div>
              <p className="font-semibold text-lg text-gray-800">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <IoClose
            size={24}
            className="cursor-pointer text-gray-600 hover:text-pink-500 transition"
            onClick={onClose}
          />
        </div>

        {/* Cart button */}
        <div className="mt-6 space-y-4">
          <button
            onClick={handleCartClick}
            className="w-full flex items-center justify-between text-left bg-gray-100 p-3 rounded-lg hover:bg-pink-100 transition"
          >
            <span className="flex items-center gap-2 text-gray-700 font-medium">
              <FaShoppingCart /> View Cart
            </span>
            {cartCount > 0 && (
              <span className="bg-pink-500 text-white text-sm rounded-full px-2">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile-only cart icon 
          <div className="md:hidden flex justify-center relative cursor-pointer" onClick={handleCartClick}>
            <div className="text-pink-600 hover:text-pink-700 text-xl relative">
              <FaShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white rounded-full text-xs px-1.5">
                  {cartCount}
                </span>
              )}
            </div>
          </div>*/}

          <button
            onClick={handleLogout}
            className="w-full bg-pink-500 text-white font-medium py-2 rounded-lg hover:bg-pink-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
