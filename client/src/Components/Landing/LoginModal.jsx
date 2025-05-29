"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Signin from "../../assets/signin.png";

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      const res = await API.post("/login", loginForm);
      const { user, coinsEarned } = res.data;

      console.log("Login successful, coins earned:", coinsEarned);

      const coinsEarnedNum = Number.parseInt(coinsEarned || 0, 10);

      // Store user data
      sessionStorage.setItem("user", JSON.stringify(user));

      // Dispatch custom event for other components to listen
      window.dispatchEvent(
        new CustomEvent("user-logged-in", {
          detail: {
            user,
            coinsEarned: coinsEarnedNum,
          },
        })
      );

      onClose();
      window.location.href = "/"; // Refresh to show dashboard
    } catch (err) {
      setLoginError(err?.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = (e) => {
    e.preventDefault();
    onSwitchToSignup();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 p-4"
      style={{ zIndex: 9999 }}
    >
      <div className="w-full max-w-4xl bg-[#f3f9fc] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F8F1E9] rounded-2xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9] max-h-[90vh] overflow-y-auto">
        <div className="relative flex flex-col lg:flex-row min-h-[500px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10"
            aria-label="Close login modal"
          >
            <X size={20} />
          </button>

          {/* Background Image Section */}
          <div
            className="flex-1 p-6 lg:p-8 flex items-center justify-center relative min-h-[200px] lg:min-h-[500px]"
            style={{
              backgroundImage: `url(${Signin})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              aria-hidden="true"
            ></div>
            <div className="text-center relative z-10">
              <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2 lg:mb-4">
                Back for another chapter?
              </h2>
              <p className="text-base lg:text-lg text-gray-200">
                Let's keep the story going.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 p-6 lg:p-8 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-4"
                aria-labelledby="login-form-heading"
              >
                <h2
                  id="login-form-heading"
                  className="text-2xl font-bold mb-6 text-center"
                >
                  Welcome Back
                </h2>

                {loginError && (
                  <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {loginError}
                  </div>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                  aria-label="Email address"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg p-3 pr-12 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  Important: Remember your email and password. If you forget
                  them, you'll need to contact the developer to recover your
                  account.
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Sign in to your account"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>

                <p className="text-sm text-center mt-4">
                  Don't have an account?{" "}
                  <a
                    href="#"
                    onClick={handleSwitchToSignup}
                    className="text-[#5999a8] underline hover:no-underline transition-all"
                    aria-label="Open signup modal"
                  >
                    Sign Up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
