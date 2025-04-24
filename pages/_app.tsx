import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "../src/store/store";
import "../src/styles/globals.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { replaceCart } from "../src/store/cartSlice";

function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if running in the browser
    if (typeof window !== "undefined") {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user?.email) {
          const savedCart = localStorage.getItem(`cart_${user.email}`);
          if (savedCart) {
            dispatch(replaceCart(JSON.parse(savedCart)));
          }
        }
      } catch (err) {
        console.error("Error loading user/cart from localStorage:", err);
      }
    }
  }, [dispatch]);

  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppInitializer />
      <Toaster position="top-right" reverseOrder={false} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
