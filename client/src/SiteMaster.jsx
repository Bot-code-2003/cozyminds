// src/components/SiteMaster.jsx
import React, { useState } from "react";
import axios from "axios";

// Configure Axios with base URL from environment variable
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const SiteMaster = () => {
  const [formData, setFormData] = useState({
    sender: "Cozy Minds Team",
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validate required fields
    if (!formData.title || !formData.content) {
      setError("Title and content are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.post("/sendMail", {
        sender: formData.sender,
        title: formData.title,
        content: formData.content,
      });
      setSuccess(response.data.message);
      // Reset form
      setFormData({
        sender: "Cozy Minds Team",
        title: "",
        content: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Send Mail to All Users
      </h2>
      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-500 bg-green-50 p-3 rounded mb-4">{success}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="sender"
            className="block text-sm font-medium text-black mb-1"
          >
            Sender
          </label>
          <input
            type="text"
            id="sender"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            placeholder="e.g., Cozy Minds Team"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Welcome to Your Journey"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-black mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="e.g., Dear Traveler, welcome to Cozy Minds! We're delighted to have you join our community of writers and dreamers. May your journey be filled with inspiration and discovery."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-y"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-md text-white font-semibold transition ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isLoading ? "Sending..." : "Send Mail"}
        </button>
      </form>
    </div>
  );
};

export default SiteMaster;
