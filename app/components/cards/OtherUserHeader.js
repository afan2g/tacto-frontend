import React, { useState, useMemo, useEffect } from "react";
import { View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { X } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import { AppButton, AppText } from "../primitives";
import UserCardVertical from "./UserCardVertical";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { useAuthContext } from "../../contexts";
import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  unfriendUser,
} from "../../api";
import { supabase } from "../../../lib/supabase";

function OtherUserHeader({ user, friendData, style, handleClose }) {
  const {
    friendCount = 0,
    mutualFriendsCount = 0,
    status = "none",
  } = friendData || {};
  const { session } = useAuthContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendStatus, setFriendStatus] = useState(status);
  const [friendRequestData, setFriendRequestData] = useState(friendData);
  // Track who is the requester when we send a friend request
  const [isRequester, setIsRequester] = useState(
    friendRequestData?.requester_id === session.user.id
  );

  // Compute friend action based on current status and requester information
  const friendAction = useMemo(() => {
    if (
      friendStatus === "none" ||
      friendStatus === "declined" ||
      friendStatus === "canceled"
    ) {
      return "Add Friend";
    } else if (friendStatus === "pending") {
      // Check if the current user is the requester
      if (isRequester || friendRequestData?.requester_id === session.user.id) {
        return "Cancel Request";
      } else {
        return "Accept Request";
      }
    } else if (friendStatus === "accepted") {
      return "Unfriend";
    }
    return null;
  }, [friendStatus, friendRequestData, session.userId, isRequester]);

  // Determine button styles based on friend status
  const buttonStyles = useMemo(() => {
    const styles = { button: {}, text: {} };

    if (friendStatus === "accepted") {
      styles.button = {
        ...buttonBaseStyles.button,
        ...buttonBaseStyles.buttonAccepted,
      };
      styles.text = { ...buttonBaseStyles.text, ...buttonBaseStyles.friends };
    } else if (friendStatus === "pending") {
      styles.button = { ...buttonBaseStyles.button };
      styles.text = { ...buttonBaseStyles.text, ...buttonBaseStyles.pending };
    } else {
      styles.button = {
        ...buttonBaseStyles.button,
        ...buttonBaseStyles.buttonNotFriends,
      };
      styles.text = {
        ...buttonBaseStyles.text,
        ...buttonBaseStyles.notFriends,
      };
    }

    return styles;
  }, [friendStatus]);

  const handleFriendPress = async () => {
    if (loading || !friendAction) return;

    try {
      setLoading(true);
      setError(null);

      switch (friendAction) {
        case "Add Friend":
          const { data: sendRequestData } = await sendFriendRequest(
            user.id,
            session.access_token
          );
          setFriendRequestData((prevData) => ({
            ...prevData,
            ...sendRequestData,
          }));
          // After sending a friend request, we become the requester
          setIsRequester(true);
          setFriendStatus("pending");
          break;
        case "Cancel Request":
          const { data: cancelRequestData } = await cancelFriendRequest(
            friendRequestData.id,
            session.access_token
          );
          // Update the friend request data with the response
          setFriendRequestData((prevData) => ({
            ...prevData,
            ...cancelRequestData,
          }));
          setIsRequester(false);
          setFriendStatus("none");
          break;
        case "Accept Request":
          const { data: acceptRequestData } = await acceptFriendRequest(
            friendRequestData.id,
            session.access_token
          );
          // Update the friend request data with the response
          setFriendRequestData((prevData) => ({
            ...prevData,
            ...acceptRequestData,
          }));
          setFriendStatus("accepted");
          break;
        case "Unfriend":
          const { data: unfriendData } = await unfriendUser(
            friendRequestData.id,
            session.access_token
          );
          // Update the friend request data with the response
          setFriendRequestData((prevData) => ({
            ...prevData,
            ...unfriendData,
          }));
          setIsRequester(false);
          setFriendStatus("none");
          break;
      }
    } catch (err) {
      console.error("Error handling friend request:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleTransactNavigation = async (type) => {
    if (loading) return; // Prevent navigation if loading
    try {
      setLoading(true);
      setError(null);

      console.log("fetching wallet information for user:", user);
      // fetch user wallet information
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (error) {
        console.error("Error fetching wallet information:", error);
        throw new Error("Failed to fetch wallet information");
      }
      if (!data) {
        console.error("Wallet not found for user:", user.id);
        throw new Error("Wallet not found");
      }
      console.log("Wallet data:", data);
      // Pass the wallet information to the next screen
      handleClose(); // Close the modal before navigating
      navigation.navigate(routes.TRANSACTCONFIRM, {
        action: type,
        amount: null,
        recipientUser: user,
        recipientAddress: data.address,
        memo: "",
        methodId: type === "send" ? 0 : null,
      });
    } catch (error) {
      console.error("Error navigating to transact screen:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.headerContainer, style]}>
      <UserCardVertical user={user} scale={0.8} />

      <View style={styles.userStats}>
        <Pressable style={styles.stat}>
          <AppText style={styles.statNumber}>{friendCount}</AppText>
          <AppText style={styles.statLabel}>friends</AppText>
        </Pressable>
        <Pressable style={styles.stat}>
          <AppText style={styles.statNumber}>{mutualFriendsCount}</AppText>
          <AppText style={styles.statLabel}>mutuals</AppText>
        </Pressable>
      </View>

      <View style={styles.friendButtonContainer}>
        <AppButton
          style={buttonStyles.button}
          onPress={handleFriendPress}
          disabled={loading || !friendAction}
          title={loading ? "" : friendAction}
          color={
            friendStatus === "pending"
              ? colors.grayOpacity40
              : friendStatus === "accepted"
              ? colors.grayOpacity40
              : colors.bluePop
          }
          textStyle={buttonStyles.text}
          loading={loading}
        />

        {error && <AppText style={styles.errorText}>{error}</AppText>}
      </View>

      <View style={styles.transactButtons}>
        <Pressable
          style={styles.send}
          onPress={() => handleTransactNavigation("Sending")}
          disabled={loading}
        >
          <AppText style={styles.text}>Send</AppText>
        </Pressable>
        <Pressable
          style={styles.request}
          onPress={() => handleTransactNavigation("Requesting")}
          disabled={loading}
        >
          <AppText style={styles.text}>Request</AppText>
        </Pressable>
      </View>
    </View>
  );
}

// Split styles for better organization
const buttonBaseStyles = {
  button: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // Minimum touch target size
  },
  buttonAccepted: {
    borderWidth: 0,
    padding: 0,
  },
  buttonNotFriends: {
    backgroundColor: colors.bluePop,
  },
  text: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: 14,
    padding: 0,
    margin: 0,
  },
  friends: {
    color: colors.yellow,
    fontSize: 18,
  },
  pending: {
    color: colors.blackTint10,
  },
  notFriends: {
    color: colors.black,
  },
};

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.blue,
    paddingBottom: 20,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 10,
    padding: 10, // Increase touch target
    zIndex: 1,
  },
  userStats: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 60,
    width: "100%",
  },
  stat: {
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  statNumber: {
    color: colors.lightGray,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  statLabel: {
    color: colors.blackTint40,
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  friendButtonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  transactButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  send: {
    backgroundColor: colors.yellow,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  request: {
    backgroundColor: colors.lightGray,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  text: {
    color: colors.black,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
});

export default OtherUserHeader;
