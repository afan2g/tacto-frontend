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
import { Skeleton } from "moti/skeleton";
import SkeletonLoader from "../skeletons/SkeletonLoader";
const Spacer = ({ height = 16 }) => <View style={{ height }} />;
function OtherUserHeader({ user, friendData, style, handleClose }) {
  const { friendCount, mutualFriendCount, status } = friendData || {};
  const { session } = useAuthContext();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [loadingFriend, setLoadingFriend] = useState(false);
  const [loadingTransact, setLoadingTransact] = useState(false);
  const [error, setError] = useState(null);
  const [friendStatus, setFriendStatus] = useState(status || "none");
  const [friendRequestData, setFriendRequestData] = useState(friendData);
  // Track who is the requester when we send a friend request
  const [isRequester, setIsRequester] = useState(
    friendRequestData?.requester_id === session.user.id
  );

  useEffect(() => {
    if (friendData) {
      setFriendRequestData(friendData);
      setFriendStatus(friendData.status || "none");
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [friendData]);

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
    if (loadingFriend || !friendAction) return;

    try {
      setLoadingFriend(true);
      setError(null);

      switch (friendAction) {
        case "Add Friend":
          console.log("Sending friend request to:", user.id);
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
      setLoadingFriend(false);
    }
  };

  const handleTransactNavigation = async (type) => {
    if (loading || loadingTransact) return; // Prevent navigation if loading
    try {
      setLoadingTransact(true);
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
      setLoadingTransact(false);
    }
  };

  return (
    <View style={[styles.headerContainer, style]}>
      <UserCardVertical user={user} scale={0.8} />
      <View style={styles.userStats}>
        <Pressable style={styles.stat}>
          {loading && (
            <SkeletonLoader width={50} height={22} radius={5} show={loading} />
          )}
          {!loading && (
            <AppText style={styles.statNumber}>
              {!loading && friendCount}
            </AppText>
          )}

          <AppText style={styles.statLabel}>friends</AppText>
        </Pressable>
        <Pressable style={styles.stat}>
          {loading && (
            <SkeletonLoader width={50} height={22} radius={5} show={loading} />
          )}

          {!loading && (
            <AppText style={styles.statNumber}>
              {!loading && mutualFriendCount}
            </AppText>
          )}
          <AppText style={styles.statLabel}>mutuals</AppText>
        </Pressable>
      </View>
      {loading && <Spacer height={10} />}

      <View style={styles.friendButtonContainer}>
        {loading && <SkeletonLoader width={390} radius={5} height={44} />}
        {!loading && (
          <AppButton
            style={buttonStyles.button}
            onPress={handleFriendPress}
            disabled={loadingFriend || loading || !friendAction}
            title={loading ? "" : friendAction}
            color={
              friendStatus === "pending"
                ? colors.gray.shade40
                : friendStatus === "accepted"
                ? colors.gray.shade40
                : colors.bluePop
            }
            textStyle={buttonStyles.text}
            loading={loadingFriend}
          />
        )}
        {error && <AppText style={styles.errorText}>{error}</AppText>}
      </View>
      {loading && <Spacer height={10} />}
      <View style={styles.transactButtons}>
        {loading && <SkeletonLoader width={190} height={44} radius={5} />}
        {!loading && (
          <AppButton
            style={styles.send}
            onPress={() => handleTransactNavigation("Sending")}
            disabled={loadingTransact || loading}
            title="Send"
            color={colors.yellow}
            textStyle={styles.text}
            loading={loadingTransact}
          />
        )}
        {loading && <SkeletonLoader width={190} height={44} radius={5} />}
        {!loading && (
          <AppButton
            style={styles.request}
            onPress={() => handleTransactNavigation("Requesting")}
            disabled={loadingTransact || loading}
            title="Request"
            color={colors.lightGray}
            textStyle={styles.text}
            loading={loadingTransact}
          />
        )}
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
    alignSelf: "center",
    textAlign: "center",
  },
  statNumber: {
    color: colors.lightGray,
    fontFamily: fonts.bold,
    fontSize: 16,
    alignSelf: "center",
    textAlign: "center",
  },
  statLabel: {
    color: colors.blackTint40,
    fontFamily: fonts.medium,
    fontSize: 14,
    alignSelf: "center",
    textAlign: "center",
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
    gap: 10,
    paddingHorizontal: 10,
  },
  send: {
    backgroundColor: colors.yellow,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  request: {
    backgroundColor: colors.lightGray,
    padding: 10,
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
