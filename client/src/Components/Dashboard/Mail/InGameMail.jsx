"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Paperclip, Trash2, MailCheck, X } from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";
// import Mails from "./assets/mails.png";

// Configure Axios with base URL
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const InGameMail = ({
  toggleMailModal,
  mails,
  setMails,
  setHasUnreadMails,
  userId,
}) => {
  const { darkMode } = useDarkMode();
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set initial selected mail when mails change
  useEffect(() => {
    if (mails.length > 0 && !selectedMail) {
      setSelectedMail(mails[0]);
    } else if (mails.length === 0) {
      setSelectedMail(null);
    }
  }, [mails, selectedMail]);

  // Mark mail as read
  const markAsRead = async (mailId) => {
    try {
      await API.put(`/mail/mail/${mailId}/read`, { userId });
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));
    } catch (err) {
      console.error("Error marking mail as read:", err);
    }
  };

  // Delete mail
  const deleteMail = async (mailId) => {
    try {
      await API.delete(`/mail/mail/${mailId}`, { data: { userId } });
      const updatedMails = mails.filter((mail) => mail.id !== mailId);
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));
      if (selectedMail && selectedMail.id === mailId) {
        // After deleting the selected mail automatically update the selected mail to the next mail.
        setSelectedMail(updatedMails.length > 0 ? updatedMails[0] : null);
      }
    } catch (err) {
      console.error("Error deleting mail:", err);
      setError("Failed to delete mail.");
    }
  };

  if (loading) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-black/80" : "bg-black/50"
        }`}
      >
        <div
          className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              Inbox
            </h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[var(--accent)]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[450px]">
            <span className="text-base font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          darkMode ? "bg-black/80" : "bg-black/50"
        }`}
      >
        <div
          className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--accent)]">
              Inbox
            </h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[var(--accent)]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[450px]">
            <span className="text-base font-medium text-red-400">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        darkMode ? "bg-black/80" : "bg-black/50"
      }`}
    >
      <div
        className={`w-full max-w-7xl rounded-lg shadow-md p-5 bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-primary)]`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--accent)]">Inbox</h2>
          <button
            onClick={toggleMailModal}
            className="p-1.5 rounded-full hover:bg-[var(--accent)]/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[var(--accent)]" />
          </button>
        </div>
        <div
          className={`max-w-7xl mx-auto h-[550px] flex bg-[var(--bg-secondary)] text-[var(--text-primary)]`}
        >
          {/* Left Panel - Mail List */}
          <div className="w-1/3 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-3 space-y-2">
                {mails.length === 0 ? (
                  <p className="text-center text-base font-medium p-4 text-[var(--text-secondary)]">
                    No mails to display.
                  </p>
                ) : (
                  <div>
                    {mails.map((mail) => {
                      const formattedDate = new Date(
                        mail.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                      const isSelected = selectedMail?.id === mail.id;

                      return (
                        <div
                          key={mail.id}
                          onClick={() => {
                            setSelectedMail(mail);
                            if (!mail.read) markAsRead(mail.id);
                          }}
                          className={`p-3 rounded cursor-pointer flex items-center transition-colors hover:bg-[var(--bg-primary)] ${
                            isSelected
                              ? "bg-[var(--bg-primary)] border-l-2 border-[var(--accent)]"
                              : mail.read
                              ? "opacity-60"
                              : ""
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3
                                className={`text-base font-medium ${
                                  !mail.read ? "text-[var(--accent)]" : ""
                                }`}
                              >
                                {mail.title}
                              </h3>
                              {!mail.read && (
                                <span className="w-2 h-2 bg-[var(--highlight)] rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              {formattedDate} • {mail.sender}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Separation Line */}
          <div className={`w-px mx-4 bg-[var(--border)]`}></div>

          {/* Right Panel - Mail Detail */}
          <div className="w-2/3 rounded-lg overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {selectedMail ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-[var(--accent)]">
                        {selectedMail.title}
                      </h2>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      From: {selectedMail.sender} •{" "}
                      {new Date(selectedMail.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <div
                      className="leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: selectedMail.content }}
                    />
                    {selectedMail.hasAttachment && (
                      <div className="flex items-center text-[var(--accent)]">
                        <Paperclip size={16} className="mr-1" />
                        <span className="text-sm">Attachment</span>
                      </div>
                    )}
                    <div className="flex space-x-2 mt-4">
                      {!selectedMail.read && (
                        <button
                          onClick={() => markAsRead(selectedMail.id)}
                          title="Mark as Read"
                          className="flex items-center space-x-2 bg-[var(--accent)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                        >
                          <MailCheck size={16} />
                          <span>Mark as Read</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteMail(selectedMail.id)}
                        title="Delete Mail"
                        className="flex items-center space-x-2 bg-[var(--accent)] text-white px-3 py-1.5 rounded-md hover:bg-[var(--accent)]/80 transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Delete Mail</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                    <p className="text-base font-medium">
                      Select a mail to view.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InGameMail;
