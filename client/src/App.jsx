import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CoinProvider } from "./context/CoinContext";

// Components
import LandingPage from "./Components/Landing/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
// import JournalingAlt from "./Components/JournalingAlt";
import JournalingAlt from "./Components/EnterJournal/JournalingAlt";
import Dashboard from "./Components/Dashboard/Dashboard";
import JournalEntry from "./Components/JournalEntry";
import JournalEntries from "./Components/Dashboard/JournalEntries";
import ProfileSettings from "./Components/ProfileSettings";
import Features from "./Components/Landing/Features";
import DetailedMoodDistributions from "./Components/Dashboard/DetailedMoodDistributions";

import CozyMindsBlog from "./Components/Landing/CozyMindsBlog";

import "./index.css";
import SiteMaster from "./SiteMaster";
import Collections from "./Components/Dashboard/Collections";
import CozyShop from "./Components/Dashboard/Shop/CozyShop";
import Privacy from "./Components/Landing/Privacy";
import Terms from "./Components/Landing/Terms";
import BlogPage from "./Components/Landing/BlogPage";
import AboutUs from "./Components/Landing/AboutUs";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ThemeProvider>
      <CoinProvider>
        <div>
          <Routes>
            {user ? (
              <Route path="/" element={<Dashboard />} />
            ) : (
              <Route path="/" element={<LandingPage />} />
            )}

            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/journaling-alt" element={<JournalingAlt />} />
            {/* <Route
              path="/login"
              element={<Login setUser={setUser} />} // Pass setUser to Login
            /> */}
            {/* <Route path="/signup" element={<Signup setUser={setUser} />} /> */}
            <Route path="/journal/:id" element={<JournalEntry />} />
            <Route path="/cozyshop" element={<CozyShop />} />
            <Route
              path="/journal-entries/:collection"
              element={<JournalEntries />}
            />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-of-service" element={<Terms />} />
            <Route path="/starlitblogs" element={<CozyMindsBlog />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/features" element={<Features />} />
            <Route
              path="/mood-distributions"
              element={<DetailedMoodDistributions />}
            />

            <Route path="/sitemaster" element={<SiteMaster />} />
          </Routes>
        </div>
      </CoinProvider>
    </ThemeProvider>
  );
};

export default App;
