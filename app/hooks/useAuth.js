// useAuth.js
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { checkWalletAccess } from "../utils/checkWalletAccess";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsWallet, setNeedsWallet] = useState(false);
  const [secureWalletState, setSecureWalletState] = useState("none");
  const initialSessionChecked = useRef(false);
  const isMounted = useRef(true);

  // Helper function to fetch user profile and update state
  const fetchProfileAndUpdateState = async (userSession) => {
    if (!isMounted.current) return;

    try {
      if (!userSession?.user) {
        setSession(null);
        setNeedsWallet(false);
        setSecureWalletState("none");

        if (!initialSessionChecked.current) {
          initialSessionChecked.current = true;
          setIsLoading(false);
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("id", userSession.user.id)
        .single();

      // Check for SecureStore wallet access
      const { hasWallet, error: secureWalletError } = await checkWalletAccess(
        userSession.user.id
      );

      if (!isMounted.current) return;

      setSession(userSession);
      setNeedsWallet(!profile?.onboarding_complete);
      if (
        secureWalletError ===
        "Call to function 'ExpoSecureStore.getValueWithKeyAsync' has been rejected."
      ) {
        console.warn("SecureStore access rejected");
        setSecureWalletState("rejected");
      } else {
        setSecureWalletState(
          !hasWallet && profile?.onboarding_complete ? "none" : "present"
        );
      }

      if (!initialSessionChecked.current) {
        initialSessionChecked.current = true;
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profile in useauth:", error);
      if (isMounted.current) {
        setSession(null);

        if (!initialSessionChecked.current) {
          initialSessionChecked.current = true;
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;

    // Initial session check
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        // If no session found, finish loading immediately
        if (!data.session) {
          if (isMounted.current) {
            setSession(null);
            initialSessionChecked.current = true;
            setIsLoading(false);
          }
          return;
        }

        await fetchProfileAndUpdateState(data.session);
      } catch (error) {
        console.error("Session check error:", error);
        if (isMounted.current) {
          setSession(null);
          initialSessionChecked.current = true;
          setIsLoading(false);
        }
      }
    };

    // Add a safety timeout to ensure isLoading is eventually set to false
    const safetyTimer = setTimeout(() => {
      if (isMounted.current && isLoading) {
        console.warn("Safety timeout triggered for auth loading");
        initialSessionChecked.current = true;
        setIsLoading(false);
      }
    }, 5000); // 5 second safety timeout

    checkSession();

    // Listen for auth state changes - WITHOUT using async in the callback
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, userSession) => {
      console.log("Auth event:", event);

      if (!isMounted.current) return;

      if (event === "SIGNED_OUT") {
        // For sign out, we can update state immediately
        setSession(null);
        setNeedsWallet(false);
        initialSessionChecked.current = true;
        setIsLoading(false);
        setSecureWalletState("none");
      } else if (event === "SIGNED_IN") {
        // For sign in events, use setTimeout to avoid deadlock as per Supabase docs
        console.warn("AUTH SIGNED_IN");
        console.log("User session:", userSession);
        console.log("Current session:", session);
        if (!session || userSession.user?.id !== session.user?.id) {
          console.warn("AUTH SIGNED_IN - no existing session");
          setTimeout(() => {
            fetchProfileAndUpdateState(userSession);
          }, 0);
        }
      } else if (event === "INITIAL_SESSION") {
        console.warn("AUTH INITIAL_SESSION");
        setSession(userSession);
      } else if (event === "TOKEN_REFRESHED") {
        console.warn("AUTH TOKEN_REFRESHED");
        setSession(userSession);
      }
    });

    // Cleanup function
    return () => {
      isMounted.current = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoading, needsWallet, secureWalletState, setNeedsWallet };
};

export default useAuth;
