"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paperclip,
  MailCheck,
  X,
  Gift,
  ArrowLeft,
  Inbox,
  Mail,
  Star,
  Trash2,
} from "lucide-react";
import { useDarkMode } from "../../../context/ThemeContext";
import { useCoins } from "../../../context/CoinContext";
import AID from "../../../assets/wifu.png";

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
  const { updateUserCoins, showCoinAward } = useCoins();
  const [selectedMail, setSelectedMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(null);
  const [activeView, setActiveView] = useState("inbox"); // "inbox" or "detail"
  const [isMobile, setIsMobile] = useState(false);
  const [mailAnimation, setMailAnimation] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
      await API.put(`/mail/${mailId}/read`, { userId });
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, read: true } : mail
      );
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));
    } catch (err) {
      console.error("Error marking mail as read:", err);
    }
  };

  // Claim reward
  const claimReward = async (mailId) => {
    try {
      setClaimingReward(true);
      setError(null);
      setClaimSuccess(null);
      setMailAnimation(true);

      const response = await API.put(`/mail/${mailId}/claim-reward`, {
        userId,
      });

      // Update the mail in the list
      const updatedMails = mails.map((mail) =>
        mail.id === mailId ? { ...mail, rewardClaimed: true, read: true } : mail
      );

      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));

      // Update selected mail
      if (selectedMail && selectedMail.id === mailId) {
        setSelectedMail({ ...selectedMail, rewardClaimed: true, read: true });
      }

      // Get the reward amount from the mail
      const mail = mails.find((m) => m.id === mailId);
      const rewardAmount = mail?.rewardAmount || 50; // Default to 50 if not specified

      // Update user coins in context and show coin award popup
      if (response.data.newCoinsBalance) {
        // Update coins directly with the new balance from the server
        const user = JSON.parse(sessionStorage.getItem("user") || "null");
        if (user) {
          user.coins = response.data.newCoinsBalance;
          sessionStorage.setItem("user", JSON.stringify(user));

          // Trigger a storage event to update other components
          window.dispatchEvent(new Event("storage"));
        }

        // Show the coin award popup
        showCoinAward(rewardAmount);
      }

      setClaimSuccess(response.data.message);

      // Reset animation after 2 seconds
      setTimeout(() => {
        setMailAnimation(false);
      }, 2000);
    } catch (err) {
      console.error("Error claiming reward:", err);
      setError(err.response?.data?.message || "Failed to claim reward.");
      setMailAnimation(false);
    } finally {
      setClaimingReward(false);
    }
  };

  // Delete mail
  const deleteMail = async (mailId) => {
    try {
      await API.delete(`/mail/${mailId}`, { data: { userId } });
      const updatedMails = mails.filter((mail) => mail.id !== mailId);
      setMails(updatedMails);
      setHasUnreadMails(updatedMails.some((mail) => !mail.read));

      if (selectedMail && selectedMail.id === mailId) {
        // After deleting the selected mail automatically update the selected mail to the next mail.
        setSelectedMail(updatedMails.length > 0 ? updatedMails[0] : null);

        // On mobile, go back to inbox view after deleting
        if (isMobile) {
          setActiveView("inbox");
        }
      }
    } catch (err) {
      console.error("Error deleting mail:", err);
      setError("Failed to delete mail.");
    }
  };

  // Handle mail selection
  const handleSelectMail = (mail) => {
    setSelectedMail(mail);
    if (!mail.read) markAsRead(mail.id);

    // On mobile, switch to detail view
    if (isMobile) {
      setActiveView("detail");
    }
  };

  // Handle back to inbox
  const handleBackToInbox = () => {
    setActiveView("inbox");
  };

  // Handle claim button click in mail content
  useEffect(() => {
    if (
      selectedMail &&
      selectedMail.mailType === "reward" &&
      !selectedMail.rewardClaimed
    ) {
      const claimButton = document.getElementById("claim-reward-button");
      if (claimButton) {
        claimButton.addEventListener("click", () =>
          claimReward(selectedMail.id)
        );
        return () => {
          claimButton.removeEventListener("click", () =>
            claimReward(selectedMail.id)
          );
        };
      }
    }
  }, [selectedMail]);

  // Custom styles for deep sea fantasy theme
  const fantasyStyles = {
    modalBg:
      "fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md",
    mailContainer: `w-full max-w-md md:max-w-2xl lg:max-w-7xl min-h-[90vh] overflow-hidden border ${
      darkMode
        ? "bg-[#1a1a1a] border-[#404040] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        : "bg-white border-[#e5e7eb] shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
    } rounded-lg`,
    header: `flex justify-between items-center p-4 ${
      darkMode
        ? "bg-[#2d2d2d] border-b border-[#404040]"
        : "bg-[#f8fafc] border-b border-[#e5e7eb]"
    }`,
    headerTitle: `text-xl font-semibold ${
      darkMode ? "text-[#f1f5f9]" : "text-[#1e293b]"
    }`,
    scrollArea: `h-[80vh] ${
      darkMode
        ? "scrollbar-thin scrollbar-thumb-[#525252] scrollbar-track-[#1a1a1a]"
        : "scrollbar-thin scrollbar-thumb-[#cbd5e1] scrollbar-track-[#f1f5f9]"
    }`,
    mailListItem: (isSelected, isUnread) =>
      `p-4 cursor-pointer transition-all duration-200 ${
        darkMode
          ? isSelected
            ? "bg-[#374151] border-l-4 border-[#3b82f6]"
            : isUnread
            ? "border-l-4 border-[#3b82f6] bg-[#2d2d2d]/50"
            : "border-l-4 border-transparent hover:bg-[#374151]/50"
          : isSelected
          ? "bg-[#f1f5f9] border-l-4 border-[#3b82f6]"
          : isUnread
          ? "border-l-4 border-[#3b82f6] bg-[#eff6ff]"
          : "border-l-4 border-transparent hover:bg-[#f8fafc]"
      }`,
    mailTitle: (isUnread) =>
      `text-base font-medium truncate max-w-[80%] ${
        darkMode
          ? isUnread
            ? "text-[#f1f5f9] font-semibold"
            : "text-[#d1d5db]"
          : isUnread
          ? "text-[#1e293b] font-semibold"
          : "text-[#374151]"
      }`,
    mailSender: `text-sm truncate max-w-[60%] ${
      darkMode ? "text-[#9ca3af]" : "text-[#6b7280]"
    }`,
    mailDate: `text-xs ${darkMode ? "text-[#9ca3af]" : "text-[#6b7280]"}`,
    mailContent: `p-6 ${darkMode ? "text-[#e5e7eb]" : "text-[#374151]"}`,
    mailDetailTitle: `text-xl font-semibold ${
      darkMode ? "text-[#f1f5f9]" : "text-[#1e293b]"
    }`,
    rewardTag: `text-xs px-3 py-1 rounded-full font-medium ${
      darkMode
        ? "bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30"
        : "bg-[#dcfce7] text-[#059669] border border-[#bbf7d0]"
    }`,
    rewardBox: `mt-6 p-4 rounded-lg border ${
      darkMode
        ? "bg-[#374151] border-[#4b5563]"
        : "bg-[#f8fafc] border-[#e2e8f0]"
    }`,
    button: (color = "primary") =>
      `flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
        color === "primary"
          ? darkMode
            ? "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-lg shadow-blue-500/25"
            : "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-lg shadow-blue-500/25"
          : darkMode
          ? "bg-[#6b7280] text-white hover:bg-[#4b5563]"
          : "bg-[#6b7280] text-white hover:bg-[#4b5563]"
      }`,
    emptyState:
      "flex flex-col items-center justify-center h-full p-6 text-center",
    emptyIcon: `mb-4 opacity-50 ${
      darkMode ? "text-[#9ca3af]" : "text-[#9ca3af]"
    }`,
    emptyText: `text-base font-medium ${
      darkMode ? "text-[#9ca3af]" : "text-[#6b7280]"
    }`,
    loadingSpinner: `animate-spin w-8 h-8 border-4 border-t-transparent rounded-full ${
      darkMode ? "border-[#3b82f6]" : "border-[#3b82f6]"
    }`,
    mobileBackButton: `flex items-center gap-2 p-3 ${
      darkMode
        ? "text-[#3b82f6] border-b border-[#404040]"
        : "text-[#3b82f6] border-b border-[#e5e7eb]"
    }`,
    claimButton: `w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ${
      darkMode
        ? "bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-emerald-500/25"
        : "bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-emerald-500/25"
    }`,
    successMessage: `mt-3 p-3 rounded-md text-sm font-medium ${
      darkMode
        ? "bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30"
        : "bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]"
    }`,
    errorMessage: `mt-3 p-3 rounded-md text-sm font-medium ${
      darkMode
        ? "bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30"
        : "bg-[#fee2e2] text-[#991b1b] border border-[#fecaca]"
    }`,
    attachmentBox: `flex items-center p-3 rounded-md ${
      darkMode
        ? "bg-[#374151] text-[#d1d5db] border border-[#4b5563]"
        : "bg-[#f1f5f9] text-[#374151] border border-[#e2e8f0]"
    }`,
    mailDetailContent: `prose prose-sm max-w-none ${
      darkMode
        ? "text-[#e5e7eb] prose-headings:text-[#f1f5f9] prose-a:text-[#60a5fa] prose-strong:text-[#f1f5f9]"
        : "text-[#374151] prose-headings:text-[#1e293b] prose-a:text-[#2563eb] prose-strong:text-[#1e293b]"
    }`,
    unreadIndicator: `w-2 h-2 mt-2 rounded-full ${
      darkMode ? "bg-[#3b82f6]" : "bg-[#3b82f6]"
    }`,
    storyCircle: `ring-2 ring-offset-2 ${
      darkMode
        ? "ring-[#3b82f6] ring-offset-[#1a1a1a]"
        : "ring-[#3b82f6] ring-offset-white"
    }`,
    mailAnimation: mailAnimation ? "animate-pulse" : "",
  };

  if (loading) {
    return (
      <div className={fantasyStyles.modalBg}>
        <div className={fantasyStyles.mailContainer}>
          <div className={fantasyStyles.header}>
            <h2 className={fantasyStyles.headerTitle}>Inbox</h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[#d4a256]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[300px] md:h-[450px]">
            <div className="flex flex-col items-center gap-3">
              <div className={fantasyStyles.loadingSpinner}></div>
              <span className="text-base font-medium">
                Loading your mail...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={fantasyStyles.modalBg}>
        <div className={fantasyStyles.mailContainer}>
          <div className={fantasyStyles.header}>
            <h2 className={fantasyStyles.headerTitle}>Inbox</h2>
            <button
              onClick={toggleMailModal}
              className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-[#d4a256]" />
            </button>
          </div>
          <div className="flex justify-center items-center h-[300px] md:h-[450px]">
            <div className="text-center p-6 max-w-md">
              <div className="text-red-500 mb-3">
                <X size={40} className="mx-auto" />
              </div>
              <span className="text-base font-medium text-red-400 block mb-2">
                {error}
              </span>
              <button
                onClick={toggleMailModal}
                className={fantasyStyles.button()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={fantasyStyles.modalBg}>
      <div className={fantasyStyles.mailContainer}>
        {/* Header */}
        <div className={fantasyStyles.header}>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#d4a256]" />
            <h2 className={fantasyStyles.headerTitle}>Magical Messenger</h2>
          </div>
          <button
            onClick={toggleMailModal}
            className="p-1.5 rounded-full hover:bg-[#d4a256]/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-[#d4a256]" />
          </button>
        </div>

        {/* Mobile View */}
        {isMobile && (
          <div className={fantasyStyles.scrollArea}>
            {activeView === "inbox" ? (
              /* Mobile Inbox List */
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className={fantasyStyles.emptyState}>
                    <Inbox size={40} className={fantasyStyles.emptyIcon} />
                    <p className={fantasyStyles.emptyText}>
                      Your magical scroll case is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e2c496]/30">
                    {mails.map((mail) => {
                      const formattedDate = new Date(
                        mail.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      return (
                        <div
                          key={mail.id}
                          onClick={() => handleSelectMail(mail)}
                          className={fantasyStyles.mailListItem(
                            false,
                            !mail.read
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={fantasyStyles.mailTitle(!mail.read)}>
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">✨</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span
                                className={fantasyStyles.unreadIndicator}
                              ></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={fantasyStyles.mailSender}>
                              {mail.sender}
                            </p>
                            <p className={fantasyStyles.mailDate}>
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Mobile Mail Detail */
              <div className="h-full flex flex-col">
                {/* Back button */}
                <button
                  onClick={handleBackToInbox}
                  className={fantasyStyles.mobileBackButton}
                >
                  <ArrowLeft size={16} />
                  <span>Back to scrolls</span>
                </button>

                {/* Mail content */}
                {selectedMail ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className={fantasyStyles.mailContent}>
                      <div className="flex items-start justify-between">
                        <h2 className={fantasyStyles.mailDetailTitle}>
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">✨</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className={fantasyStyles.rewardTag}>
                              Treasure
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#7e6c56] mt-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">From:</span>{" "}
                          {selectedMail.sender}
                        </div>
                        <div>
                          {new Date(selectedMail.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <div
                        className={`border-t border-[#e2c496]/30 my-4 pt-4 ${fantasyStyles.mailAnimation}`}
                      >
                        <div
                          className={fantasyStyles.mailDetailContent}
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className={fantasyStyles.rewardBox}>
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Treasure of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Magical Treasure Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className={fantasyStyles.claimButton}
                              >
                                <Star size={16} className="animate-pulse" />
                                <span>
                                  {claimingReward
                                    ? "Summoning..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Magic Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className={fantasyStyles.successMessage}>
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className={fantasyStyles.errorMessage}>
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className={fantasyStyles.attachmentBox}>
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Magical Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className={fantasyStyles.button()}
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        {/* <button
                            onClick={() => deleteMail(selectedMail.id)}
                            title="Delete Mail"
                            className={fantasyStyles.button("secondary")}
                          >
                            <Trash2 size={16} />
                            <span>Discard</span>
                          </button> */}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-[#7e6c56]">
                    <p className="text-base font-medium">
                      Select a scroll to view.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Desktop View */}
        {!isMobile && (
          <div className="flex h-[80vh]">
            {/* Left Panel - Mail List */}
            <div className="w-1/3 border-r border-[#e2c496]/30 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {mails.length === 0 ? (
                  <div className={fantasyStyles.emptyState}>
                    <Inbox size={40} className={fantasyStyles.emptyIcon} />
                    <p className={fantasyStyles.emptyText}>
                      Your magical scroll case is empty
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#e2c496]/30">
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
                          onClick={() => handleSelectMail(mail)}
                          className={fantasyStyles.mailListItem(
                            isSelected,
                            !mail.read
                          )}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={fantasyStyles.mailTitle(!mail.read)}>
                              {mail.title}
                              {mail.mailType === "reward" && (
                                <span className="ml-2 text-yellow-500">✨</span>
                              )}
                            </h3>
                            {!mail.read && (
                              <span
                                className={fantasyStyles.unreadIndicator}
                              ></span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className={fantasyStyles.mailSender}>
                              {mail.sender}
                            </p>
                            <p className={fantasyStyles.mailDate}>
                              {formattedDate}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Mail Detail */}
            <div className="w-2/3 overflow-hidden">
              <div className="h-full overflow-y-auto">
                {selectedMail ? (
                  <div className={fantasyStyles.mailContent}>
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <h2 className={fantasyStyles.mailDetailTitle}>
                          {selectedMail.title}
                          {selectedMail.mailType === "reward" && (
                            <span className="ml-2 text-yellow-500">✨</span>
                          )}
                        </h2>
                        {selectedMail.mailType === "reward" &&
                          !selectedMail.rewardClaimed && (
                            <span className={fantasyStyles.rewardTag}>
                              Treasure
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#7e6c56]">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">From:</span>{" "}
                          {selectedMail.sender}
                        </div>
                        <div>
                          {new Date(selectedMail.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>

                      <div
                        className={`border-t border-[#e2c496]/30 my-4 pt-4 ${fantasyStyles.mailAnimation}`}
                      >
                        <div
                          className={fantasyStyles.mailDetailContent}
                          dangerouslySetInnerHTML={{
                            __html: selectedMail.content,
                          }}
                        />
                      </div>

                      {/* Reward Claim Button */}
                      {selectedMail.mailType === "reward" && (
                        <div className={fantasyStyles.rewardBox}>
                          {selectedMail.rewardClaimed ? (
                            <div className="flex items-center text-green-500 gap-2">
                              <Gift size={18} />
                              <span>
                                Treasure of {selectedMail.rewardAmount || 50}{" "}
                                coins already claimed!
                              </span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Gift size={18} className="text-yellow-500" />
                                <span className="font-medium">
                                  Magical Treasure Available
                                </span>
                              </div>
                              <button
                                onClick={() => claimReward(selectedMail.id)}
                                disabled={claimingReward}
                                className={fantasyStyles.claimButton}
                              >
                                <Star size={16} className="animate-pulse" />
                                <span>
                                  {claimingReward
                                    ? "Summoning..."
                                    : `Claim ${
                                        selectedMail.rewardAmount || 50
                                      } Magic Coins`}
                                </span>
                              </button>

                              {claimSuccess && (
                                <div className={fantasyStyles.successMessage}>
                                  {claimSuccess}
                                </div>
                              )}

                              {error && (
                                <div className={fantasyStyles.errorMessage}>
                                  {error}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {selectedMail.hasAttachment && (
                        <div className={fantasyStyles.attachmentBox}>
                          <Paperclip size={16} className="mr-2" />
                          <span className="text-sm">Magical Attachment</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-3 mt-6">
                        {!selectedMail.read && (
                          <button
                            onClick={() => markAsRead(selectedMail.id)}
                            title="Mark as Read"
                            className={fantasyStyles.button()}
                          >
                            <MailCheck size={16} />
                            <span>Mark as Read</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteMail(selectedMail.id)}
                          title="Delete Mail"
                          className={fantasyStyles.button("secondary")}
                        >
                          <Trash2 size={16} />
                          <span>Discard</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#7e6c56]">
                    <Mail size={40} className="mb-4 opacity-50" />
                    <p className="text-base font-medium">
                      Select a magical scroll to view
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InGameMail;
