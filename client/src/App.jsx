import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import LandingPage from "./Components/Landing/LandingPage";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Journaling from "./Components/Journaling";
import JournalingAlt from "./Components/JournalingAlt";
import Dashboard from "./Components/Dashboard/Dashboard";
import JournalEntry from "./Components/JournalEntry";
import JournalEntries from "./Components/JournalEntries";
import ProfileSettings from "./Components/ProfileSettings";
import Features from "./Components/Landing/Features";
import DetailedMoodDistributions from "./Components/Dashboard/DetailedMoodDistributions";
import Library from "./Components/Library";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // 👈 after checking
  }, []);

  if (loading) return <div>Loading...</div>; // 👈 Optional: Spinner or blank

  return (
    <ThemeProvider>
      <div>
        <Routes>
          {user ? (
            <Route path="/" element={<Dashboard />} />
          ) : (
            <Route path="/" element={<LandingPage />} />
          )}
          <Route path="/journaling" element={<Journaling />} />
          <Route path="/journaling-alt" element={<JournalingAlt />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/journal/:id" element={<JournalEntry />} />
          <Route path="/journal-entries" element={<JournalEntries />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/features" element={<Features />} />
          <Route
            path="/mood-distributions"
            element={<DetailedMoodDistributions />}
          />
          <Route path="/library" element={<Library />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
