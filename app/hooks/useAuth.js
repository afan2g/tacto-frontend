import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
// Modify useAuth.js to handle temporary verification state
const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  GoogleSignin.configure({
    webClientId:
      "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
  });

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;

        // Only set session if user has completed the full signup flow
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .single();

        if (session && profile?.full_name) {
          setSession(session);
        } else if (session) {
          // If we have a session but no profile, sign out
          await supabase.auth.signOut();
          setSession(null);
        }
      } catch (error) {
        console.error("Error checking session:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle auth state changes
      if (event === "SIGNED_IN") {
        // Check if user has completed profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .single();

        if (profile?.full_name) {
          setSession(session);
        } else {
          // If no profile, sign out
          await supabase.auth.signOut();
          setSession(null);
        }
      } else if (event === "SIGNED_OUT") {
        setSession(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoading, isVerified };
};

export default useAuth;
