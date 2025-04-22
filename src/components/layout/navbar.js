"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import "../../styles/globals.css";

const Navbar = ({ products = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const _toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const categories = ["Makeup", "Skin", "Hair", "Fragrance", "Offers"];

  const _filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="));
    setIsLoggedIn(!!token);
  }, []);

  const handleCartClick = () => {
    if (isLoggedIn) {
      router.push("/cart");
    } else {
      router.push("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md px-3 py-1 flex justify-between items-center sticky top-0 z-10">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Cosmetics Store Logo"
          width={100}
          height={60}
          className="h-18 w-23 cursor-pointer"
        />
      </Link>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-6">
        {categories.map((category) => (
          <Link
            href={`/${category.toLowerCase()}`}
            key={category}
            className="text-gray-700 font-medium text-lg transition duration-200 hover:text-pink-500 hover:scale-105"
          >
            {category}
          </Link>
        ))}
      </div>

      {/* Search, Cart, and Authentication Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products"
            className="border rounded-lg p-2 pl-10 form-control mx-2 w-64 focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Cart */}
        <Link href="/login" onClick={handleCartClick} className="text-gray-700 relative">
          <FaShoppingCart size={24} />
        </Link>

        {/* Authentication Buttons */}
        <Link
          href="/login"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      {/*
      <button
        onClick={_toggleMobileMenu}
        className="md:hidden text-gray-700"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
      */}

      {/* Mobile Menu */}
      {/*
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col items-center md:hidden z-50">
          {categories.map((category) => (
            <Link
              href={`/${category.toLowerCase()}`}
              key={category}
              className="text-gray-700 hover:text-pink-500 py-2"
              onClick={_toggleMobileMenu}
            >
              {category}
            </Link>
          ))}
          <Link
            href="/cart"
            className="text-gray-700 py-2 relative"
            onClick={_toggleMobileMenu}
          >
            Cart
            {totalQuantity > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-4"
            onClick={_toggleMobileMenu}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 mt-4"
            onClick={_toggleMobileMenu}
          >
            Sign Up
          </Link>
        </div>
      )}
      */}

      {/* Mobile-only: Search bar + Sign In/Sign Up */}
      <div className="flex items-center gap-2 ml-auto md:hidden px-4 mt-4 w-full">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search products"
            className="border rounded-lg p-2 pl-10 w-full focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Sign In */}
        <Link
          href="/login"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
