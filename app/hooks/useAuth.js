import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Platform } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsWallet, setNeedsWallet] = useState(false);

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

        if (!hasWallet) {
          setNeedsWallet(true);
          return false;
        }

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
              setNeedsWallet(false);
            } else {
              console.log("Profile incomplete or needs wallet");
              if (!isProfileComplete && !needsWallet) {
                console.log("Signing out - incomplete profile");
                await supabase.auth.signOut();
              }
              setSession(null);
            }
          }
        } else {
          console.log("No session found");
          if (mounted) {
            setSession(null);
            setNeedsWallet(false);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error.message);
        if (mounted) {
          setSession(null);
          setNeedsWallet(false);
        }
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
            setNeedsWallet(false);
            console.log("Profile complete after sign in");
          } else {
            console.log("Profile incomplete after sign in");
            if (!needsWallet) {
              setSession(null);
            }
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setSession(null);
          setNeedsWallet(false);
          console.log("Signed out");
        }
      }

      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [needsWallet]);

  return { session, isLoading, needsWallet };
};

export default useAuth;
