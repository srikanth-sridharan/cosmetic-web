"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import ProfileSidebar from "./ProfileSidebar";
import { useRouter } from "next/navigation";

const ProfileNavbar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [fullName, setFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [profileCartCount, setProfileCartCount] = useState(0);
  const [showMakeupDropdown, setShowMakeupDropdown] = useState(false);

  const makeupButtonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Retrieve user details from localStorage and set the state
    const getUser = () => {
      try {
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setFullName(user?.fullName || "");
          setUserEmail(user?.email || "");
          getCartCount(user?.email);
        }
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
      }
    };

    // Get the cart item count from localStorage for the logged-in user
    const getCartCount = (email: string) => {
      try {
        if (!email) return;
        const cartKey = `cart_${email}`;
        const cartString = localStorage.getItem(cartKey);
        const cart = cartString ? JSON.parse(cartString) : [];
        setProfileCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
      } catch (err) {
        console.error("Error reading cart", err);
      }
    };

    // Get user and cart data on component mount
    getUser();

    // Handle cart updates and synchronize with localStorage
    const handleCartUpdate = () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (user?.email) getCartCount(user.email);
    };

    // Add event listener for cart updates
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  // Handle user logout and clear session data from localStorage
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("profileCart");
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Update the search term and trigger the search function
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Toggle the makeup category dropdown visibility
  const toggleDropdown = () => {
    setShowMakeupDropdown((prev) => !prev);
  };

  // Close dropdown if a click is detected outside of the dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        makeupButtonRef.current &&
        !makeupButtonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMakeupDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const user = { fullName, email: userEmail };

  return (
    <>
      <nav className="bg-white shadow-md px-3 py-1 flex justify-between items-center sticky top-0 z-10">
        <Link href="/" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Cosmetics Store Logo"
            className="h-18 w-23 cursor-pointer"
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          {["Makeup", "Skin", "Hair", "Fragrance", "Offers"].map((cat) =>
            cat === "Makeup" ? (
              <div
                key={cat}
                className="relative"
                ref={makeupButtonRef}
                onClick={toggleDropdown}
              >
                <div className="flex items-center gap-1 cursor-pointer text-gray-700 font-medium text-lg hover:text-pink-500 transition">
                  {cat} <span className="text-xs">▼</span>
                </div>
                {showMakeupDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 z-20"
                  >
                    <Link href="/makeup/face" className="block px-4 py-2 text-gray-700 hover:text-pink-500">Face</Link>
                    <Link href="/makeup/eyes" className="block px-4 py-2 text-gray-700 hover:text-pink-500">Eyes</Link>
                    <Link href="/makeup/lips" className="block px-4 py-2 text-gray-700 hover:text-pink-500">Lips</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={cat}
                href={`/${cat.toLowerCase()}`}
                className="text-gray-700 font-medium text-lg hover:text-pink-500 transition"
              >
                {cat}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products"
              className="border rounded-lg p-2 pl-10 w-64"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>

          <Link href="/cart" className="relative text-gray-700 hover:text-pink-500">
            <FaShoppingCart size={24} />
            {profileCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs px-1.5">
                {profileCartCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-2">    
            <FaUserCircle
              size={30}
              className="text-gray-700 cursor-pointer hover:text-pink-500 transition"
              onClick={() => setShowSidebar(true)}
              title="Profile"
            />
            {fullName && (
              <span className="text-gray-700 text-pink-500 font-semibold">{fullName}</span>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2 ml-auto px-4 mt-4 w-full">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products"
              className="border rounded-lg p-2 pl-10 w-full"
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
          <FaUserCircle
            size={26}
            className="text-gray-700 cursor-pointer hover:text-pink-500 transition ml-2"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </nav>

      <ProfileSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default ProfileNavbar;
