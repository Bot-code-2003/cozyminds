"use client";

import { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Signup from "../../assets/signup.png";

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, darkMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    nickname: "",
    email: "",
    password: "",
    verifyPassword: "",
    age: "",
    gender: "",
    subscribe: false,
  });
  const [signupError, setSignupError] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  });

  // Check if passwords match
  useEffect(() => {
    if (signupForm.verifyPassword || signupForm.password) {
      setPasswordMatch(signupForm.password === signupForm.verifyPassword);
    }
  }, [signupForm.password, signupForm.verifyPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);

    if (signupForm.password !== signupForm.verifyPassword) {
      setPasswordMatch(false);
      setSignupError("Passwords do not match. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const { verifyPassword, ...formDataToSend } = signupForm;

      const res = await API.post("/signup", formDataToSend);
      const user = res.data.user;

      // Store user data
      sessionStorage.setItem("user", JSON.stringify(user));

      onClose();
      window.location.href = "/"; // Refresh to show dashboard
    } catch (err) {
      setSignupError(
        err?.response?.data?.message || "Signup failed. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = (e) => {
    e.preventDefault();
    onSwitchToLogin();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-5xl bg-[#f3f9fc] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-[#F8F1E9] rounded-2xl overflow-hidden border-2 border-[#1A1A1A] dark:border-[#F8F1E9] max-h-[90vh] overflow-y-auto">
        <div className="relative flex flex-col lg:flex-row min-h-[600px]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close signup modal"
          >
            <X size={20} />
          </button>
          {/* Background Image Section */}
          <div
            className="flex-1 p-6 lg:p-8 flex items-center justify-center relative min-h-[200px] lg:min-h-[600px]"
            style={{
              backgroundImage: `url(${Signup})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute inset-0 bg-black/40"
              aria-hidden="true"
            ></div>
            <div className="text-center relative z-10">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-200 mb-2 lg:mb-4">
                Hello, new friend
              </h2>
              <p className="text-base lg:text-lg text-gray-400">
                Let's start writing your story, one page at a time.
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-1 p-6 lg:p-8 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-4"
                aria-labelledby="signup-form-heading"
              >
                <h2
                  id="signup-form-heading"
                  className="text-2xl font-bold mb-6 text-center"
                >
                  Join Starlit Journals
                </h2>

                {signupError && (
                  <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    {signupError}
                  </div>
                )}

                <input
                  type="text"
                  name="nickname"
                  placeholder="Nickname"
                  value={signupForm.nickname}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                  aria-label="Nickname"
                />

                <div className="space-y-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={signupForm.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Email address"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    💡 No need for your real email! Feel free to use something
                    creative like batman@dc.comics or starwriter@moon.sky
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row w-full gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={signupForm.password}
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

                  <div className="relative flex-1">
                    <input
                      type={showVerifyPassword ? "text" : "password"}
                      name="verifyPassword"
                      placeholder="Verify Password"
                      value={signupForm.verifyPassword}
                      onChange={handleChange}
                      required
                      className={`w-full p-3 pr-12 border-2 ${
                        signupForm.verifyPassword && !passwordMatch
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#1A1A1A] dark:border-[#F8F1E9] focus:ring-[#5999a8]"
                      } bg-transparent rounded-lg focus:outline-none focus:ring-2 transition-all`}
                      aria-label="Verify password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
                      aria-label={
                        showVerifyPassword
                          ? "Hide verify password"
                          : "Show verify password"
                      }
                    >
                      {showVerifyPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {signupForm.verifyPassword && !passwordMatch && (
                  <div className="text-red-500 text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    Passwords do not match
                  </div>
                )}

                <div className="flex flex-col sm:flex-row w-full gap-2">
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={signupForm.age}
                    onChange={handleChange}
                    required
                    min="13"
                    className="flex-1 rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Age"
                  />

                  <select
                    name="gender"
                    value={signupForm.gender}
                    onChange={handleChange}
                    required
                    className="flex-1 rounded-lg p-3 border-2 border-[#1A1A1A] dark:border-[#F8F1E9] bg-transparent focus:outline-none focus:ring-2 focus:ring-[#5999a8] transition-all"
                    aria-label="Gender"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                  Important: Remember your email and password. If you forget
                  them, you'll need to contact the developer to recover your
                  account.
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg p-3 bg-[#1A1A1A] dark:bg-[#F8F1E9] text-[#F8F1E9] dark:text-[#1A1A1A] hover:opacity-90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    (signupForm.verifyPassword && !passwordMatch) || isLoading
                  }
                  aria-label="Create your account"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-sm text-center mt-4">
                  Already have an account?{" "}
                  <a
                    href="#"
                    onClick={handleSwitchToLogin}
                    className="text-[#5999a8] underline hover:no-underline transition-all"
                    aria-label="Open login modal"
                  >
                    Log In
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

export default SignupModal;
