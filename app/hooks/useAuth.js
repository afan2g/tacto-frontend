import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  GoogleSignin.configure({
    webClientId:
      "785186330408-e70b787gaulcvn8m1qdfqvulem1su9q2.apps.googleusercontent.com",
  });

  useEffect(() => {
    let mounted = true;

    const checkProfile = async (userId) => {
      try {
        console.log("Checking profile for user:", userId);

        if (!userId) {
          console.log("No user ID provided");
          return false;
        }

        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, wallet_created")
          .eq("id", userId)
          .limit(1);

        if (profileError) {
          console.error("Profile error:", profileError);
          return false;
        }

        if (!profiles || profiles.length === 0) {
          console.log("No profile found for user:", userId);
          return false;
        }

        const profile = profiles[0];
        console.log("Profile data:", profile);

        const hasFullName =
          !!profile.full_name && profile.full_name.trim() !== "";
        const hasWallet = profile.wallet_created === true;

        console.log("Profile checks:", { hasFullName, hasWallet });

        return hasFullName && hasWallet;
      } catch (error) {
        console.error("Error checking profile:", error.message);
        return false;
      }
    };

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("Session check - Session:", session?.user?.id);

        if (error) {
          console.error("Session error:", error);
          throw error;
        }

        if (session?.user) {
          const isProfileComplete = await checkProfile(session.user.id);

          if (mounted) {
            if (isProfileComplete) {
              console.log("Setting session - Profile complete");
              setSession(session);
            } else {
              console.log("Profile incomplete, signing out");
              await supabase.auth.signOut();
              setSession(null);
            }
          }
        } else {
          console.log("No session found");
          if (mounted) setSession(null);
        }
      } catch (error) {
        console.error("Error checking session:", error.message);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);

      if (event === "SIGNED_IN" && session) {
        const isProfileComplete = await checkProfile(session.user.id);

        if (mounted) {
          if (isProfileComplete) {
            setSession(session);
            console.log("Profile complete after sign in");
          } else {
            console.log("Profile incomplete after sign in");
            setSession(null);
          }
        }
      } else if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
        if (mounted) {
          setSession(null);
          console.log(`Session cleared after ${event}`);
        }
      }

      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoading };
};

export default useAuth;
