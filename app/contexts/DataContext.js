import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../../lib/storage";
import { supabase } from "../../lib/supabase";
import {
  fetchCompletedTransactions,
  fetchFriendRequests,
  fetchPaymentRequests,
} from "../api";
import { useAuthContext } from "./AuthContext";
const DataContext = createContext();

const STORAGE_KEYS = {
  PROFILE: "profile",
  WALLET: "wallet",
};

// Utility function to sanitize boolean fields
const sanitizeBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (value === "") return null;
  if (typeof value === "string") {
    const lowercase = value.toLowerCase();
    if (lowercase === "true") return true;
    if (lowercase === "false") return false;
  }
  return null;
};

// Utility function to sanitize profile data
const sanitizeProfileData = (profile) => {
  if (!profile) return null;

  const sanitizedProfile = { ...profile };

  // Add your boolean fields here
  const booleanFields = [
    "is_verified",
    "is_active",
    "notifications_enabled",
    "onboarding_complete",
    // Add other boolean fields from your schema
  ];

  booleanFields.forEach((field) => {
    if (field in sanitizedProfile) {
      sanitizedProfile[field] = sanitizeBoolean(sanitizedProfile[field]);
    }
  });

  return sanitizedProfile;
};

export function DataProvider({ children }) {
  const { session } = useAuthContext();
  const [transactionsPage, setTransactionsPage] = useState(0);
  const [transactionsHasMore, setTransactionsHasMore] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingPaymentRequests, setIsLoadingPaymentRequests] =
    useState(false);

  const [profile, setProfile] = useState(() => {
    const storedProfile = storage.getString(STORAGE_KEYS.PROFILE);
    try {
      return storedProfile
        ? sanitizeProfileData(JSON.parse(storedProfile))
        : null;
    } catch (error) {
      console.error("Error parsing stored profile:", error);
      return null;
    }
  });

  const [wallet, setWallet] = useState(() => {
    const storedWallet = storage.getString(STORAGE_KEYS.WALLET);
    try {
      return storedWallet ? JSON.parse(storedWallet) : null;
    } catch (error) {
      console.error("Error parsing stored wallet:", error);
      return null;
    }
  });

  // Using React state for transactions and payment requests instead of storage
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  useEffect(() => {
    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setTimeout(async () => {
          await fetchUserData();
        }, 0);
      } else if (event === "SIGNED_OUT") {
        clearData();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Only set up the supabase channel if profile exists and has an id
  useEffect(() => {
    // Check if profile exists and has an id before setting up the channel
    if (profile && profile.id) {
      const channel = supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "wallets",
            filter: `owner_id=eq.${profile.id}`,
          },
          (payload) => {
            updateWallet(payload.new);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "transactions",
            filter: `from_user_id=eq.${profile.id}`,
          },
          (payload) => {
            if (payload.new.status === "confirmed") {
              refreshTransactions();
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "transactions",
            filter: `to_user_id=eq.${profile.id}`,
          },
          (payload) => {
            if (payload.new.status === "confirmed") {
              refreshTransactions();
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "payment_requests",
            filter: `requester_id=eq.${profile.id}`,
          },
          (payload) => {
            refreshPaymentRequests();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "payment_requests",
            filter: `requestee_id=eq.${profile.id}`,
          },
          (payload) => {
            refreshPaymentRequests();
          }
        )
        .subscribe();

      // Return cleanup function
      return () => {
        channel.unsubscribe();
      };
    }
  }, [profile]); // Re-run this effect when profile changes

  const fetchUserData = async () => {
    if (isLoadingData) return; // Prevent multiple fetches
    setIsLoadingData(true); // Set loading state
    console.log("Fetching user data...");
    try {
      const userId = session?.user?.id;
      if (!userId) {
        console.error("No user ID found in session.");
        clearData();
        return;
      } else {
        console.log("User ID found:", userId);
      }
      const pageSize = 10;
      const [
        profileResponse,
        walletResponse,
        completedTransactionsResponse,
        paymentRequestsResponse,
        friendRequestsResponse,
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("wallets").select("*").eq("owner_id", userId).single(),
        fetchCompletedTransactions(userId, {
          page: transactionsPage,
          pageSize,
        }),
        fetchPaymentRequests(userId),
        fetchFriendRequests(userId),
      ]);

      if (profileResponse.error) {
        console.error(
          "Error fetching profile in data context:",
          profileResponse.error
        );
      } else {
        const sanitizedProfile = sanitizeProfileData(profileResponse.data);
        updateProfile(sanitizedProfile);
      }

      if (walletResponse.error && walletResponse.error.code !== "PGRST116") {
        console.error("Error fetching wallet:", walletResponse.error);
      } else if (walletResponse.data) {
        updateWallet(walletResponse.data);
      }

      if (completedTransactionsResponse.error) {
        console.error(
          "Error fetching completed transactions:",
          completedTransactionsResponse.error
        );
      } else {
        // Just update state, no storage operations
        const transactionsData = completedTransactionsResponse.data || [];
        setCompletedTransactions(transactionsData);
        setTransactionsPage(0);
        setTransactionsHasMore(transactionsData.length === pageSize);

        console.log(
          "Count of completed transactions:",
          transactionsData.length
        );
      }

      if (paymentRequestsResponse.error) {
        console.error(
          "Error fetching payment requests:",
          paymentRequestsResponse.error
        );
      } else {
        // Just update state, no storage operations
        const requestsData = paymentRequestsResponse.data || [];
        setPaymentRequests(requestsData);

        console.log("Count of payment requests:", requestsData.length);

        if (requestsData.length > 0) {
          console.log("Payment requests fetched:", requestsData[0]);
        }
      }

      if (friendRequestsResponse.error) {
        console.error(
          "Error fetching friend requests:",
          friendRequestsResponse.error
        );
      } else {
        // Just update state, no storage operations
        const requestsData = friendRequestsResponse.data || [];
        setFriendRequests(requestsData);
        console.log("Friend requests fetched:", requestsData);
        console.log("Count of friend requests:", requestsData.length);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    } finally {
      setIsLoadingData(false); // Reset loading state
      console.log("User data fetched successfully");
    }
  };

  const updateProfile = (dbProfile) => {
    if (dbProfile) {
      try {
        const sanitizedProfile = sanitizeProfileData(dbProfile);
        storage.set(STORAGE_KEYS.PROFILE, JSON.stringify(sanitizedProfile));
        setProfile(sanitizedProfile);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const updateWallet = (newWallet) => {
    if (newWallet) {
      try {
        setWallet(newWallet);
        storage.set(STORAGE_KEYS.WALLET, JSON.stringify(newWallet));
      } catch (error) {
        console.error("Error updating wallet:", error);
      }
    }
  };

  const refreshTransactions = async () => {
    if (!profile?.id) return;

    try {
      console.log("Refreshing transactions...");
      setIsLoadingTransactions(true);
      const pageSize = 10;

      const response = await fetchCompletedTransactions(profile.id, {
        page: 0,
        pageSize,
      });

      if (response.error) {
        console.error("Error refreshing transactions:", response.error);
        return;
      }

      // Just update state, no storage operations
      const transactionsData = response.data || [];
      setCompletedTransactions(transactionsData);
      setTransactionsPage(0);
      setTransactionsHasMore(transactionsData.length === pageSize);

      console.log("Transactions refreshed successfully");
    } catch (error) {
      console.error("Error in refreshTransactions:", error);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (!profile?.id || isLoadingTransactions || !transactionsHasMore) return;

    try {
      setIsLoadingTransactions(true);
      const nextPage = transactionsPage + 1;
      const pageSize = 10;

      const response = await fetchCompletedTransactions(profile.id, {
        page: nextPage,
        pageSize,
      });

      if (response.error) {
        console.error("Error fetching more transactions:", response.error);
        return;
      }

      const responseData = response.data || [];

      if (responseData.length > 0) {
        // Update state with the combined list
        setCompletedTransactions((prevTransactions) => {
          const prevData = prevTransactions || [];
          return [...prevData, ...responseData];
        });
        setTransactionsPage(nextPage);
        setTransactionsHasMore(responseData.length === pageSize);
      } else {
        setTransactionsHasMore(false);
      }
    } catch (error) {
      console.error("Error in loadMoreTransactions:", error);
    } finally {
      setIsLoadingTransactions(false);
      console.log("completed loading more transactions");
    }
  };

  const pullToRefreshTransactions = async () => {
    await refreshTransactions();
  };

  const refreshPaymentRequests = async () => {
    if (!profile?.id) return;

    try {
      console.log("Refreshing payment requests...");
      setIsLoadingPaymentRequests(true);
      const response = await fetchPaymentRequests(profile.id);

      if (response.error) {
        console.error("Error refreshing payment requests:", response.error);
        return;
      }

      // Just update state, no storage operations
      const requestsData = response.data || [];
      setPaymentRequests(requestsData);

      console.log("Payment requests refreshed successfully");
    } catch (error) {
      console.error("Error in refreshPaymentRequests:", error);
    } finally {
      setIsLoadingPaymentRequests(false);
    }
  };

  const refreshFriendRequests = async () => {
    if (!profile?.id) return;

    try {
      console.log("Refreshing friend requests...");
      const response = await fetchFriendRequests(profile.id);
      if (response.error) {
        console.error("Error refreshing friend requests:", response.error);
        return;
      }
      // Just update state, no storage operations
      const requestsData = response.data || [];
      setFriendRequests(requestsData);
      console.log("Friend requests refreshed successfully");
    } catch (error) {
      console.error("Error in refreshFriendRequests:", error);
    }
  };
  const clearData = () => {
    try {
      // Only clear profile and wallet from storage
      storage.clearAll();
      // Reset all state
      setProfile(null);
      setWallet(null);
      setCompletedTransactions(null);
      setPaymentRequests(null);
      setTransactionsPage(0);
      setTransactionsHasMore(true);
      setIsLoadingTransactions(false);
      setIsLoadingPaymentRequests(false);
      setIsLoadingData(false);
      setFriendRequests(null);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        wallet,
        completedTransactions,
        transactionsHasMore,
        isLoadingTransactions,
        paymentRequests,
        isLoadingPaymentRequests,
        transactionsPage,
        isLoadingData,
        friendRequests,
        updateProfile,
        updateWallet,
        clearData,
        fetchUserData,
        loadMoreTransactions,
        refreshTransactions,
        pullToRefreshTransactions,
        refreshPaymentRequests,
        refreshFriendRequests,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

/**
 * @param {Object} children - The children components to be rendered inside the provider.
 * @returns {UseData} - The DataProvider component.
 * /
/**
 * @typedef {Object} UseData
 * @property {Object} profile - The user's profile data.
 * @property {Object} wallet - The user's wallet data.
 * @property {Array} completedTransactions - List of completed transactions.
 * @property {boolean} transactionsHasMore - Indicates if there are more transactions to load.
 * @property {boolean} isLoadingTransactions - Loading state for transactions.
 * @property {Array} paymentRequests - List of payment requests.
 * @property {boolean} isLoadingPaymentRequests - Loading state for payment requests.
 * @property {number} transactionsPage - Current page for transactions.
 * @property {boolean} isLoadingData - Loading state for user data.
 * @property {Array} friendRequests - List of friend requests.
 * @property {Function} updateProfile - Function to update the user's profile.
 * @property {Function} updateWallet - Function to update the user's wallet.
 * @property {Function} clearData - Function to clear user data from storage.
 * @property {Function} fetchUserData - Function to fetch user data from the database.
 * @property {Function} loadMoreTransactions - Function to load more transactions.
 * @property {Function} refreshTransactions - Function to refresh transactions.
 * @property {Function} pullToRefreshTransactions - Function to pull to refresh transactions.
 * @property {Function} refreshPaymentRequests - Function to refresh payment requests.
 * @property {Function} refreshFriendRequests - Function to refresh friend requests.
 * 
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
