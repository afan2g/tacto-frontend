import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../../lib/storage";
import { supabase } from "../../lib/supabase";

const DataContext = createContext();

const STORAGE_KEYS = {
  PROFILE: "profile",
  WALLET: "wallet",
};

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(() =>
    storage.getString(STORAGE_KEYS.PROFILE)
      ? JSON.parse(storage.getString(STORAGE_KEYS.PROFILE))
      : null
  );
  const [wallet, setWallet] = useState(() =>
    storage.getString(STORAGE_KEYS.WALLET)
      ? JSON.parse(storage.getString(STORAGE_KEYS.WALLET))
      : null
  );

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const session = await supabase.auth.getSession();
    const userId = session?.data?.session?.user?.id;
    if (!userId) return;

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: walletData } = await supabase
      .from("wallets")
      .select("*")
      .eq("id", userId)
      .single();

    updateProfile(profileData);
    updateWallet(walletData);
  };

  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    storage.set(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
  };

  const updateWallet = (newWallet) => {
    setWallet(newWallet);
    storage.set(STORAGE_KEYS.WALLET, JSON.stringify(newWallet));
  };

  const clearData = () => {
    storage.clearAll();
    setProfile(null);
    setWallet(null);
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
