import React, { useRef } from "react";
import { View, StyleSheet, Button } from "react-native";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
import { useAuthContext } from "../contexts";
import { supabase } from "../../lib/supabase";
import { colors } from "../config";
function ModalTestingScreen({ navigation }) {
  const profileSheetRef = useRef(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [bottomSheetItem, setBottomSheetItem] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const { session } = useAuthContext();

  const handleUserPress = async () => {
    const user = {
      avatar_url:
        "https://xxzucuadafldmamlluvh.supabase.co/storage/v1/object/public/avatars/963f9398-e270-4b14-8f7e-92f2b4c7b1fb/avatar.svg",
      created_at: "2025-03-26T05:48:36.949486+00:00",
      first_name: "Aoana",
      full_name: "Aoana djdn",
      id: "963f9398-e270-4b14-8f7e-92f2b4c7b1fb",
      last_name: "djdn",
      onboarding_complete: true,
      username: "afndk",
    };
    console.log("User pressed:", user.id);
    if (loading) return; // Prevent navigation if loading
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.rpc("get_friend_data", {
        current_user_id: session.user.id,
        target_user_id: user.id,
      });
      if (error) {
        console.error("Error fetching friend data:", error);
        throw new Error("Failed to fetch friend data");
      }
      if (!data || data.length === 0) {
        console.error("user not found: ", user.id);
        throw new Error("User not found");
      }
      setBottomSheetItem({
        user,
        friendData: {
          ...data.friendData,
          mutualFriendCount: data.mutualFriendCount,
          friendCount: data.friendCount,
        },
        sharedTransactions: data.sharedTransactions,
      });

      handleBottomSheet();
    } catch (error) {
      console.error("Error navigating to user profile:", error);
      setError("Failed to load recipient wallet information");
    } finally {
      setLoading(false);
    }
  };

  const handleBottomSheet = () => {
    if (visible) {
      profileSheetRef.current?.dismiss();
      setVisible(false);
    } else {
      profileSheetRef.current?.present();
      setVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={handleUserPress} title="open bottom sheet" />
      <ProfileBottomSheet
        ref={profileSheetRef}
        user={bottomSheetItem?.user}
        friendData={bottomSheetItem?.friendData}
        sharedTransactions={bottomSheetItem?.sharedTransactions}
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ModalTestingScreen;
