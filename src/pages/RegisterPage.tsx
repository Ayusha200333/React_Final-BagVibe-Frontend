import React, { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.jpg";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { cart } = useSelector((state: RootState) => state.cart);

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId && user._id) {
        dispatch(
          mergeCart({
            guestId,
            userId: user._id,
          })
        )
          .unwrap()
          .then(() => {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          })
          .catch(() => {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, dispatch, navigate, isCheckoutRedirect]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-pink-50 to-indigo-50 opacity-70" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-300/30 rounded-full animate-ping"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative z-10">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create an account <span className="text-purple-600">👋</span>
          </h1>
          <p className="text-gray-600 mb-10">
            Join the elite circle of luxury bag enthusiasts.
          </p>

          {error && (
            <p className="mb-6 text-center text-red-600 text-sm bg-red-50/80 py-3 rounded-lg backdrop-blur">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-4 bg-white/60 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:bg-white transition placeholder-gray-500 shadow-inner"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-white/60 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:bg-white transition placeholder-gray-500 shadow-inner"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/60 border border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-300/50 focus:bg-white transition placeholder-gray-500 shadow-inner"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-semibold text-white shadow-xl transition-all duration-300 transform hover:scale-105 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/50"
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-purple-600 font-semibold hover:underline hover:text-purple-800 transition"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Enhanced Image */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <img
          src={register}
          alt="Luxury Bag"
          className="h-full w-full object-cover scale-110 transition-transform duration-10000 hover:scale-100"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-6xl font-extrabold mb-4 drop-shadow-2xl">BagVibe</h2>
          <p className="text-2xl drop-shadow-lg">Premium bags for the modern lifestyle</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;