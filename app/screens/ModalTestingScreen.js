import React, { useRef } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { useAuthContext } from "../contexts";
import { supabase } from "../../lib/supabase";
import { colors } from "../config";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
import { useProfileSheet } from "../hooks/useProfileSheet";
import SkeletonLoader from "../components/skeletons/SkeletonLoader";
import { Skeleton } from "moti/skeleton";
import TransactionCardSkeletonLoader from "../components/skeletons/TransactionCardSkeletonLoader";
import { TransactionCard } from "../components/cards";
function ModalTestingScreen({ navigation }) {
  const { session } = useAuthContext();
  const { bottomSheetRef, loading, data, presentSheet, dismissSheet } =
    useProfileSheet({
      sessionUserId: session.user.id,
      onSuccess: (data) => console.log("Success!"),
      onError: (error) => console.error("Error:", error),
    });
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

  const handlePress = () => {
    presentSheet(user);
  };

  const handleDismiss = () => {
    dismissSheet();
  };

  return (
    // <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //   <Button title="Open Modal" onPress={handlePress} />
    //   <ProfileBottomSheet
    //     ref={bottomSheetRef}
    //     user={data?.user}
    //     friendData={data?.friendData}
    //     sharedTransactions={data?.sharedTransactions}
    //     loading={loading}
    //     navigation={navigation}
    //     onDismiss={handleDismiss}
    //   />
    // </View>
    <View style={styles.container}>
      <TransactionCardSkeletonLoader />
      <TransactionCard transaction={null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.black,
  },
});

export default ModalTestingScreen;
