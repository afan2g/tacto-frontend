import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { AppButton, AppText } from "../primitives";
import AppAvatar from "../AppAvatar";
import { colors, fonts } from "../../config";
import { useAuthContext, useData } from "../../contexts";
import { acceptFriendRequest, declineFriendRequest } from "../../api";
function FriendRequestCard({ request, onAccept, onReject }) {
  const { requester, ...friendRequest } = request;
  const { session } = useAuthContext();
  const { refreshFriendRequests } = useData();
  const [isAccepting, setIsAccepting] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);

  const handleAccept = async () => {
    if (isAccepting) return;
    setIsAccepting(true);
    try {
      await acceptFriendRequest(friendRequest.id, session.access_token);
      refreshFriendRequests(); // Refresh friend requests after accepting
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (isRejecting) return;
    setIsRejecting(true);
    try {
      await declineFriendRequest(friendRequest.id, session.access_token);
      refreshFriendRequests(); // Refresh friend requests after declining
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setIsRejecting(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AppAvatar user={requester} scale={0.75} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <AppText style={{ fontSize: 16 }}>{requester.full_name}</AppText>
          <AppText style={{ fontSize: 14, color: colors.lightGray }}>
            @{requester.username}
          </AppText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        <AppButton
          color={colors.yellow}
          style={[styles.button, styles.acceptButton]}
          textStyle={[styles.buttonText]}
          title="Accept"
          onPress={handleAccept}
          disabled={isAccepting || isRejecting}
          loading={isAccepting}
        />
        <AppButton
          color={colors.lightGray}
          style={[styles.button, styles.rejectButton]}
          textStyle={[styles.buttonText]}
          title="Decline"
          onPress={handleDecline}
          disabled={isRejecting || isAccepting}
          loading={isRejecting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "column",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  button: {
    width: "49%",
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});

export default FriendRequestCard;
