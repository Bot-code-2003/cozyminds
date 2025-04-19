import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CoinProvider } from "./context/CoinContext";

// Components
import LandingPage from "./Components/Landing/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import JournalingAlt from "./Components/JournalingAlt";
import Dashboard from "./Components/Dashboard/Dashboard";
import JournalEntry from "./Components/JournalEntry";
import JournalEntries from "./Components/Dashboard/JournalEntries";
import ProfileSettings from "./Components/ProfileSettings";
import Features from "./Components/Landing/Features";
import DetailedMoodDistributions from "./Components/Dashboard/DetailedMoodDistributions";
import Library from "./Components/Library";

import "./index.css";
import SiteMaster from "./SiteMaster";
import Collections from "./Components/Dashboard/Collections";
import CozyShop from "./Components/Dashboard/CozyShop";

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
            <Route path="/journaling-alt" element={<JournalingAlt />} />
            <Route
              path="/login"
              element={<Login setUser={setUser} />} // Pass setUser to Login
            />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/journal/:id" element={<JournalEntry />} />
            <Route path="/cozyshop" element={<CozyShop />} />
            <Route
              path="/journal-entries/:collection"
              element={<JournalEntries />}
            />
            <Route path="/collections" element={<Collections />} />
            <Route path="/profile-settings" element={<ProfileSettings />} />
            <Route path="/features" element={<Features />} />
            <Route
              path="/mood-distributions"
              element={<DetailedMoodDistributions />}
            />
            <Route path="/library" element={<Library />} />
            <Route path="/sitemaster" element={<SiteMaster />} />
          </Routes>
        </div>
      </CoinProvider>
    </ThemeProvider>
  );
};

export default App;
