import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const useAuth = () => {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsWallet, setNeedsWallet] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getUser();
        if (!session?.user) {
          setSession(null);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_complete")
          .eq("id", session.user.id)
          .single();

        if (mounted) {
          setSession(session);
          setNeedsWallet(!profile?.onboarding_complete);
        }
      } catch (error) {
        console.error(error);
        if (mounted) setSession(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session);
      if (!mounted) {
        return;
      }
      if (event === "SIGNED_OUT") {
        setSession(null);
        setNeedsWallet(false);
        setIsLoading(false);
      } else if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event:", event);
      } else if (event === "USER_UPDATED") {
        console.log("User updated event:", event);
      } else if (
        ["SIGNED_IN", "TOKEN_REFRESHED", "INITIAL_SESSION"].includes(event) &&
        session?.user
      ) {
        setTimeout(async () => {
          if (!mounted) return;

          if (
            ["SIGNED_IN", "TOKEN_REFRESHED", "INITIAL_SESSION"].includes(
              event
            ) &&
            session?.user
          ) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("onboarding_complete")
              .eq("id", session.user.id)
              .single();

            if (mounted) {
              setSession(session);
              setNeedsWallet(!profile?.onboarding_complete);
            }
          } else if (event === "SIGNED_OUT") {
            if (mounted) {
              setSession(null);
              setNeedsWallet(false);
            }
          }
        }, 0);
      }

      if (mounted) setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { session, isLoading, needsWallet };
};

export default useAuth;
