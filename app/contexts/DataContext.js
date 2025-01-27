import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../../lib/storage";
import { supabase } from "../../lib/supabase";
import { transformProfileData } from "../utils/TransformProfileData";

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

  useEffect(() => {
    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchUserData();
      } else if (event === "SIGNED_OUT") {
        clearData();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) {
        clearData();
        return;
      }

      const [profileResponse, walletResponse] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("wallets").select("*").eq("id", userId).single(),
      ]);

      if (profileResponse.error) {
        console.error("Error fetching profile:", profileResponse.error);
      } else {
        const sanitizedProfile = sanitizeProfileData(profileResponse.data);
        updateProfile(sanitizedProfile);
      }

      if (walletResponse.error && walletResponse.error.code !== "PGRST116") {
        console.error("Error fetching wallet:", walletResponse.error);
      } else if (walletResponse.data) {
        updateWallet(walletResponse.data);
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
        setProfile(transformProfileData(sanitizedProfile));
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

  const clearData = () => {
    try {
      storage.clearAll();
      setProfile(null);
      setWallet(null);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profile,
        wallet,
        updateProfile,
        updateWallet,
        clearData,
        fetchUserData,
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
