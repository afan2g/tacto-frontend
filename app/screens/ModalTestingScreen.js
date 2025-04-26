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
import { useModalContext } from "../contexts/ModalContext";
import routes from "../navigation/routes";
import { useRoute } from "@react-navigation/native";
const SAMPLE_TX = {
  transaction: {
    amount: 1,
    asset: "USDC",
    created_at: "2025-04-08T02:56:50.665+00:00",
    fee: 0.00000202525,
    from_address: "0x1cDF47C79f79147F29AD9991457a2F0340678688",
    from_user: {
      avatar_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLeOdTf_VGXq8FdBUdJIrNO-QrsYBr0IlRI6_rRpezAZfuYlvIH=s96-c",
      full_name: "Aaron Fan",
      id: "a067c2ef-2f2a-4914-a136-b82ee14f3bea",
      username: "aaronfan404",
    },
    from_user_id: "a067c2ef-2f2a-4914-a136-b82ee14f3bea",
    hash: "0xf0b3ce14417209c648b8ff00500bf8ba81624fa0030677a5b9c9b9cc840dca4b",
    id: "eb26f2d6-6400-4392-8ad0-32f2c0be0c6f",
    method_id: 0,
    request_id: null,
    status: "confirmed",
    to_address: "0xAe045DE5638162fa134807Cb558E15A3F5A7F853",
    to_user: {
      avatar_url:
        "https://lh3.googleusercontent.com/a/ACg8ocLXzQszUy1M_WwfIDj8M8XZpzu_YDhOIP54FuxrkVrsjK3MVw=s96-c",
      full_name: "asd asd",
      id: "36e07376-20bf-4fcf-8180-a2c7f67b0cf1",
      username: "apronfag",
    },
    to_user_id: "36e07376-20bf-4fcf-8180-a2c7f67b0cf1",
    updated_at: "2025-04-08T02:56:52.921+00:00",
  },
};

const SAMPLE_USER = {
  avatar_url:
    "https://lh3.googleusercontent.com/a/ACg8ocLXzQszUy1M_WwfIDj8M8XZpzu_YDhOIP54FuxrkVrsjK3MVw=s96-c",
  full_name: "asd asd",
  id: "36e07376-20bf-4fcf-8180-a2c7f67b0cf1",
  username: "apronfag",
};
function ModalTestingScreen({ navigation }) {
  const { session } = useAuthContext();
  const { presentSheet } = useModalContext();
  const routeParams = useRoute();
  const handleProfilePress = () => {
    presentSheet("profile", {
      user: SAMPLE_USER,
      navigation: navigation,
    });
  };

  const handleTransactionPress = () => {
    console.log("Presenting transaction sheet");
    presentSheet("transaction", {
      transaction: SAMPLE_TX.transaction,
      navigation,
    });
  };

  const handleNavigation = () => {
    console.log("navigation mts:", navigation.getState());
    console.log("routeParams mts:", routeParams.name);
    navigation.navigate(routes.QRTESTING);
  };
  return (
    <View style={styles.container}>
      <Button title="Open Profile Modal" onPress={handleProfilePress} />
      <Button title="Open Transaction Modal" onPress={handleTransactionPress} />
      <Button title="test navigation" onPress={handleNavigation} />
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
