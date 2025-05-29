// First, let's modify the Collections component to add a delete button and confirmation modal

import { useState, useEffect } from "react";
import axios from "axios";
import { FolderOpen, Plus, Calendar, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/ThemeContext";
import Navbar from "./Navbar";

const Collections = () => {
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });
  const { darkMode } = useDarkMode();
  const [collections, setCollections] = useState(["All"]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  // Load user data and collections
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        setUserData(user);

        if (!user) {
          navigate("/login");
          return;
        }

        // Fetch journal entries from the server
        const response = await API.get(`/journals/${user._id}`);
        setJournalEntries(response.data.journals || []);

        // Set collections - always include "All" first
        const uniqueCollections = ["All"];

        // Get all unique collections from all journal entries
        response.data.journals.forEach((journal) => {
          if (journal.collections && Array.isArray(journal.collections)) {
            journal.collections.forEach((collection) => {
              if (
                collection !== "All" &&
                !uniqueCollections.includes(collection)
              ) {
                uniqueCollections.push(collection);
              }
            });
          }
        });

        setCollections(uniqueCollections);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
        setError("Failed to load collections. Please try again later.");
        setJournalEntries([]);
        setCollections(["All"]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Navigate to journal entries of a specific collection
  const handleCollectionSelect = (collection) => {
    navigate(`/journal-entries/${encodeURIComponent(collection)}`);
  };

  // Count entries for a collection
  const countEntriesInCollection = (collection) => {
    if (collection === "All") {
      return journalEntries.length;
    }

    return journalEntries.filter(
      (entry) =>
        entry.collections &&
        Array.isArray(entry.collections) &&
        entry.collections.includes(collection)
    ).length;
  };

  // Show delete confirmation modal
  const handleDeleteClick = (e, collection) => {
    e.stopPropagation(); // Prevent navigation to collection

    // Don't allow deleting the "All" collection
    if (collection === "All") {
      return;
    }

    setCollectionToDelete(collection);
    setShowDeleteModal(true);
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCollectionToDelete(null);
  };

  // Confirm and execute delete action
  const handleConfirmDelete = async () => {
    if (!collectionToDelete || collectionToDelete === "All") return;

    setIsDeleting(true);

    try {
      // Call API to delete the collection
      await API.delete(
        `/collection/${userData._id}/${encodeURIComponent(collectionToDelete)}`
      );

      // Update the local state to reflect the change
      setCollections(collections.filter((c) => c !== collectionToDelete));

      // Close the modal
      setShowDeleteModal(false);
      setCollectionToDelete(null);

      // Optionally refresh the journal entries to ensure the UI is in sync
      const response = await API.get(`/journals/${userData._id}`);
      setJournalEntries(response.data.journals || []);
    } catch (err) {
      console.error("Error deleting collection:", err);
      setError(`Failed to delete collection: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top navigation bar */}
      <Navbar
        userData={userData}
        handleLogout={handleLogout}
        name="New Entry"
        link="/journaling-alt"
      />

      {/* Main content */}
      <main className="max-w-7xl mt-10 mb-20 mx-auto py-3 px-6 transition-colors duration-300">
        {/* Header section */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-2xl mb-2">Journal Collections</h1>
            <p className={"text-[var(--text-secondary)]"}>
              Browse and manage your journal collections
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div>
            <p className="text-lg">Loading collections...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div>
            <p className="text-lg mb-2">Error</p>
            <p className={`text-[var(--text-secondary)]`}>{error}</p>
          </div>
        )}

        {/* Collections View */}
        {!isLoading && !error && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Your Collections</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map((collection) => (
                <div
                  key={collection}
                  onClick={() => handleCollectionSelect(collection)}
                  className="border border-[var(--border)] shadow-elegant p-6 rounded-lg cursor-pointer bg-[var(--bg-secondary)] hover:bg-[var(--bg-navbar)] transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">{collection}</h3>
                    <div className="flex items-center">
                      {collection !== "All" && (
                        <button
                          onClick={(e) => handleDeleteClick(e, collection)}
                          className="mr-2 p-1 hover:text-red-500 transition-colors"
                          title="Delete collection"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <FolderOpen size={20} className="text-[var(--accent)]" />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {countEntriesInCollection(collection)} entries
                  </p>
                </div>
              ))}

              {/* New Collection Link */}
              <Link
                to="/journaling-alt"
                className="border border-dashed bg-[var(--bg-secondary)] border-[var(--border)] shadow-elegant p-6 rounded-lg cursor-pointer hover:bg-[var(--bg-navbar)] transition-colors flex flex-col items-center justify-center text-center"
              >
                <Plus size={24} className="text-[var(--accent)] mb-2" />
                <h3 className="text-lg font-medium">New Collection</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Create a new journal entry in a new collection
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-primary)] p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Collection</h3>
            <p className="mb-6">
              Are you sure you want to delete the "{collectionToDelete}"
              collection? This will remove this collection from all journal
              entries, but the entries themselves will remain in your journal.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-[var(--border)] rounded-md hover:bg-[var(--bg-navbar)]"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile action button */}
      <Link
        to="/journaling-alt"
        className={`md:hidden fixed bottom-6 right-6 w-12 h-12 bg-[var(--accent)] flex items-center justify-center shadow-elegant`}
      >
        <Calendar size={24} className="text-white" />
      </Link>

      {/* Custom CSS */}
      <style jsx>{`
        .shadow-elegant {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Collections;
