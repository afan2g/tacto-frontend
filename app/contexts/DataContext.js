import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../../lib/storage";
import { supabase } from "../../lib/supabase";
import { fetchCompletedTransactions, fetchPaymentRequests } from "../api";
const DataContext = createContext();

const STORAGE_KEYS = {
  PROFILE: "profile",
  WALLET: "wallet",
  COMPLETED_TRANSACTIONS: "completedTransactions",
  PAYMENT_REQUESTS: "paymentRequests",
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
  const [transactionsPage, setTransactionsPage] = useState(0);
  const [transactionsHasMore, setTransactionsHasMore] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [isLoadingPaymentRequests, setIsLoadingPaymentRequests] = useState(false);
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

  const [completedTransactions, setCompletedTransactions] = useState(() => {
    const storedCompletedTransactions = storage.getString(STORAGE_KEYS.COMPLETED_TRANSACTIONS);
    try {
      return storedCompletedTransactions ? JSON.parse(storedCompletedTransactions) : null;
    } catch (error) {
      console.error("Error parsing stored completed transactions:", error);
      return null;
    }
  });

  const [paymentRequests, setPaymentRequests] = useState(() => {
    const storedPaymentRequests = storage.getString(STORAGE_KEYS.PAYMENT_REQUESTS);
    try {
      return storedPaymentRequests ? JSON.parse(storedPaymentRequests) : null;
    } catch (error) {
      console.error("Error parsing stored payment requests:", error);
      return null;
    }
  });
  useEffect(() => {
    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION"
      ) {
        fetchUserData();
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
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'wallets',
            filter: `owner_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('Wallet update received!', payload)
            updateWallet(payload.new)
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `from_user_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('New transaction received!', payload)
            refreshTransactions()
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `to_user_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('New transaction received!', payload)
            refreshTransactions()
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payment_requests',
            filter: `requester_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('New request received!', payload)
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payment_requests',
            filter: `requestee_id=eq.${profile.id}`
          },
          (payload) => {
            console.log('New request received!', payload)
          }
        )
        .subscribe()

      // Return cleanup function
      return () => {
        channel.unsubscribe();
      };
    }
  }, [profile]); // Re-run this effect when profile changes

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        console.error("No user ID found in session.");
        clearData();
        return;
      } else {
        console.log("User ID found:", userId);
      }
      const pageSize = 10;
      const [profileResponse, walletResponse, completedTransactionsResponse, paymentRequestsResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("wallets").select("*").eq("owner_id", userId).single(),
        fetchCompletedTransactions(userId, { page: transactionsPage, pageSize }),
        fetchPaymentRequests(userId),
      ]);

      if (profileResponse.error) {
        console.error("Error fetching profile in data context:", profileResponse.error);
      } else {
        const sanitizedProfile = sanitizeProfileData(profileResponse.data);
        updateProfile(sanitizedProfile);
        console.log("Profile fetched:", sanitizedProfile);
        console.log("storage size: ", storage.size);

      }

      if (walletResponse.error && walletResponse.error.code !== "PGRST116") {
        console.error("Error fetching wallet:", walletResponse.error);
      } else if (walletResponse.data) {
        updateWallet(walletResponse.data);
        console.log("Wallet fetched:", walletResponse.data);
        console.log("storage size: ", storage.size);

      }

      // In the fetchUserData function, modify the transactions part:
      if (completedTransactionsResponse.error) {
        console.error("Error fetching completed transactions:", completedTransactionsResponse.error);
      } else {
        // Clear existing transactions in storage
        storage.delete(STORAGE_KEYS.COMPLETED_TRANSACTIONS);

        setCompletedTransactions(completedTransactionsResponse.data);
        setTransactionsPage(0);
        setTransactionsHasMore(completedTransactionsResponse.data.length === pageSize);

        // Only store if we have data
        if (completedTransactionsResponse.data && completedTransactionsResponse.data.length > 0) {
          storage.set(STORAGE_KEYS.COMPLETED_TRANSACTIONS, JSON.stringify(completedTransactionsResponse.data));
        }

        console.log("Count of completed transactions:", completedTransactionsResponse.data.length);
      }

      console.log("storage size: ", storage.size);

      if (paymentRequestsResponse.error) {
        console.error("Error fetching payment requests:", paymentRequestsResponse.error);
      } else {
        setPaymentRequests(paymentRequestsResponse.data);

        // Only store if we have data
        if (paymentRequestsResponse.data && paymentRequestsResponse.data.length > 0) {
          storage.set(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(paymentRequestsResponse.data));
        }

        console.log("Count of payment requests:", paymentRequestsResponse.data.length);
        console.log("Payment requests fetched:", paymentRequestsResponse.data[0]);
      }

    } catch (error) {
      console.error("Error in fetchUserData:", error);
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
      const pageSize = 10;
      const response = await fetchCompletedTransactions(profile.id, {
        page: 0,
        pageSize
      });

      if (response.error) {
        console.error("Error refreshing transactions:", response.error);
        return;
      }

      // Clear existing transactions in storage before setting new ones
      storage.delete(STORAGE_KEYS.COMPLETED_TRANSACTIONS);

      setCompletedTransactions(response.data);
      setTransactionsPage(0);
      setTransactionsHasMore(response.data.length === pageSize);

      // Only store if we have data
      if (response.data && response.data.length > 0) {
        storage.set(STORAGE_KEYS.COMPLETED_TRANSACTIONS, JSON.stringify(response.data));
      }

      console.log("Transactions refreshed successfully");
      console.log("storage size: ", storage.size);
    } catch (error) {
      console.error("Error in refreshTransactions:", error);
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
        pageSize
      });

      if (response.error) {
        console.error("Error fetching more transactions:", response.error);
        return;
      }

      if (response.data.length > 0) {
        // Create the updated list first
        const updatedList = completedTransactions ?
          [...completedTransactions, ...response.data] :
          [...response.data];

        // Then update state with the combined list
        setCompletedTransactions(updatedList);
        setTransactionsPage(nextPage);
        setTransactionsHasMore(response.data.length === pageSize);

        // Clear existing data and set the new combined list
        storage.delete(STORAGE_KEYS.COMPLETED_TRANSACTIONS);
        storage.set(STORAGE_KEYS.COMPLETED_TRANSACTIONS, JSON.stringify(updatedList));
      } else {
        setTransactionsHasMore(false);
      }
    } catch (error) {
      console.error("Error in loadMoreTransactions:", error);
    } finally {
      setIsLoadingTransactions(false);
      console.log("completed loading more transactions");
      console.log("storage size: ", storage.size);
    }
  };
  const pullToRefreshTransactions = async () => {
    await refreshTransactions();
  }

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

      // Clear existing payment requests in storage before setting new ones
      storage.delete(STORAGE_KEYS.PAYMENT_REQUESTS);

      setPaymentRequests(response.data);

      // Only store if we have data
      if (response.data && response.data.length > 0) {
        storage.set(STORAGE_KEYS.PAYMENT_REQUESTS, JSON.stringify(response.data));
      }

      console.log("Payment requests refreshed successfully");
      console.log("storage size: ", storage.size);
    } catch (error) {
      console.error("Error in refreshPaymentRequests:", error);
    } finally {
      setIsLoadingPaymentRequests(false);
    }
  }



  const clearData = () => {
    try {
      console.log(`storage size before clearing: ${storage.size}`);
      storage.clearAll();
      console.log(`storage size after clearing: ${storage.size}`);
      setProfile(null);
      setWallet(null);
      setCompletedTransactions(null);
      setTransactionsPage(0);
      setTransactionsHasMore(true);
      setIsLoadingTransactions(false);

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
        updateProfile,
        updateWallet,
        clearData,
        fetchUserData,
        loadMoreTransactions,
        refreshTransactions,
        pullToRefreshTransactions,
        refreshPaymentRequests,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};