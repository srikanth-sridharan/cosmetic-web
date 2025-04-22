"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuthRedirect } from "../src/hooks/useAuthRedirect";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../src/styles/globals.css';
import Navbar from "../src/components/layout/navbar";
import { useDispatch } from "react-redux";
import { replaceCart } from "../src/store/cartSlice";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(''); // Add state for fullName
  const dispatch = useDispatch();

  useAuthRedirect(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!fullName || !email || !password) {
      alert('Please provide all fields (full name, email, and password)');
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }), // Include fullName
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // Retrieve the cart from the backend (or from localStorage if needed)
        const savedCart = localStorage.getItem(`cart_${data.user.email}`);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        dispatch(replaceCart(parsedCart)); // Update Redux store with the cart

        // Optionally, store the cart in localStorage for the profile
        localStorage.setItem("profileCart", JSON.stringify(parsedCart)); 

        window.dispatchEvent(new Event("cartUpdated"));

        router.push("/profile");
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-96">
          <h2 className="text-xl font-bold mb-4 text-center">Log In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName} // Bind value to the state
                onChange={(e) => setFullName(e.target.value)} // Handle change for fullName
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="w-full p-2 border border-gray-300 rounded pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
