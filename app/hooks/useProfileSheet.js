import { useRef, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

/**
 * Custom hook to manage ProfileBottomSheet state and data fetching
 *
 * @param {Object} options - Configuration options
 * @param {string} options.sessionUserId - Current user's session ID
 * @param {Function} [options.onSuccess] - Optional callback for successful data fetch
 * @param {Function} [options.onError] - Optional callback for error handling
 * @returns {Object} - Methods and state for controlling the bottom sheet
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
        console.log("Fetching friend data...");
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

  const presentSheet = useCallback(
    (targetUser) => {
      setData({ user: targetUser });
      bottomSheetRef.current?.present();
      setTimeout(() => {
        fetchProfileData(targetUser);
      }, 1000);
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
