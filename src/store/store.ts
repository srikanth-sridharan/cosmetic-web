// src/store/store.ts

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice"; // Import user slice reducer

const getCartKey = () => {
  try {
    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
    return user?.email ? `cart_${user.email}` : null;
  } catch {
    return null;
  }
};

const saveCartToLocalStorage = (cartItems: unknown[]) => {
  try {
    const cartKey = getCartKey();
    if (!cartKey) return;
    const serializedState = JSON.stringify(cartItems);
    localStorage.setItem(cartKey, serializedState);
  } catch (e) {
    console.error("Could not save cart to localStorage", e);
  }
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, // Add user reducer here
  }
});

store.subscribe(() => {
  const state = store.getState();
  saveCartToLocalStorage(state.cart.items);
});

export const clearCart = () => {
  const cartKey = getCartKey();
  if (cartKey) localStorage.removeItem(cartKey);
};

export default store;
export type RootState = ReturnType<typeof store.getState>; // RootState now knows about user
export type AppDispatch = typeof store.dispatch;
