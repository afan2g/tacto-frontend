import { useRef, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

/**
 * Custom hook to manage ProfileBottomSheet state and data fetching
 *
 * @param {Object} options - Configuration options
 * @param {string} options.sessionUserId - Current user's session ID
 * @param {Function} [options.onSuccess] - Optional callback for successful data fetch
 * @param {Function} [options.onError] - Optional callback for error handling
 * @returns {UseProfileSheet} - Methods and state for controlling the bottom sheet
 */

/**
 * The `useProfileSheet` hook manages the state and data fetching for a profile bottom sheet.
 * @typedef {Object} UseProfileSheet
 * @property {React.Ref} bottomSheetRef - Ref for the bottom sheet component.
 * @property {boolean} loading - Loading state for data fetching.
 * @property {Object|null} data - Fetched profile data.
 * @property {Function} presentSheet - Function to present the bottom sheet with user data.
 * @property {Function} dismissSheet - Function to dismiss the bottom sheet.
 * @property {Function} fetchProfileData - Function to fetch profile data for a specific user.
 */
export const useProfileSheet = ({ sessionUserId, onSuccess, onError }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const bottomSheetRef = useRef(null);

  const fetchProfileData = useCallback(
    async (targetUser) => {
      // Reset state before fetching
      setLoading(true);

      try {
        const { data: responseData, error } = await supabase.rpc(
          "get_friend_data",
          {
            current_user_id: sessionUserId,
            target_user_id: targetUser.id,
          }
        );

        if (error) {
          console.error("Error fetching friend data:", error);
          if (onError) onError(error);
          throw new Error("Failed to fetch friend data");
        }

        if (!responseData) {
          console.error("No response data received");
          const noDataError = new Error("No data received");
          if (onError) onError(noDataError);
          throw noDataError;
        }

        const processedData = {
          user: targetUser,
          friendData: {
            ...responseData.friendData,
            mutualFriendCount: responseData.mutualFriendsCount,
            friendCount: responseData.targetUserFriendsCount,
          },
          sharedTransactions: responseData.sharedTransactions || [],
        };
        setData(processedData);

        if (onSuccess) onSuccess(processedData);

        return processedData;
      } catch (error) {
        console.error("Error loading profile data:", error);
        if (onError) onError(error);
      } finally {
        setLoading(false);
      }
    },
    [sessionUserId, onSuccess, onError]
  );
  const fetchExternalWalletData = useCallback(
    async (targetWallet) => {
      setLoading(true);
      try {
        const {
          data: responseData,
          count,
          error,
        } = await supabase
          .from("transactions")
          .select("*", { count: "exact" })
          .or(`from_address.eq.${targetWallet},to_address.eq.${targetWallet}`);

        if (error) {
          console.error("Error fetching external wallet data:", error);
          throw new Error("Failed to fetch external wallet data");
        }

        if (!responseData) {
          console.error("No response data received for external wallet");
          throw new Error("No data received for external wallet");
        }

        setData((prevData) => ({
          ...prevData,
          sharedTransactions: responseData || [],
        }));
        console.log("External wallet data:", responseData);
        console.log("Count:", count);
      } catch (error) {
        console.error("Error loading external wallet data:", error);
      } finally {
        setLoading(false);
      }
    },
    [sessionUserId]
  );

  const presentSheet = useCallback(
    (targetUser) => {
      setData({ user: targetUser });
      bottomSheetRef.current?.present();
      if (!targetUser.id) {
        setData((prevData) => ({ user: { ...prevData.user, external: true } }));
        fetchExternalWalletData(targetUser.address);
        return;
      }

      fetchProfileData(targetUser);
    },
    [fetchProfileData]
  );

  const dismissSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    setLoading(true);
  }, []);

  return {
    bottomSheetRef,
    loading,
    data,
    presentSheet,
    dismissSheet,
    fetchProfileData,
  };
};
