import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, BackHandler } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { FlashList } from "@shopify/flash-list";
import { AppText, Screen } from "../../components/primitives";
import FindUserBar from "../../components/forms/FindUserBar";
import UserCard from "../../components/cards/UserCard";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { TransactionContext } from "../../contexts/TransactionContext";
import { AppCardSeparator } from "../../components/cards";
import useModal from "../../hooks/useModal";
import UserModal from "../../components/modals/UserModal";
import { useData } from "../../contexts";
import { supabase } from "../../../lib/supabase";
import { useAmountFormatter } from "../../hooks/useAmountFormatter";

function SelectUserScreen({ navigation, route }) {
  const { selectedItem, modalVisible, openModal, closeModal } = useModal();
  // const { transaction, setTransaction } = useContext(TransactionContext);
  const { action = null, amount = null, recipientUser = null, recipientAddress = null, memo = null, methodId = null } = route.params || {};
  console.log("route.params", route.params);
  const [transaction, setTransaction] = useState({ action, amount, recipientUser, recipientAddress, memo, methodId });
  const [profiles, setProfiles] = useState([]);
  const { profile } = useData();

  // Use our amount formatter
  const { getFormattedAmount } = useAmountFormatter();

  // Fetch profiles data
  useEffect(() => {
    const fetchProfiles = async () => {
      // Fetch profiles data
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", profile.id);
      if (error) throw error;
      setProfiles(profiles);
    };

    fetchProfiles();
  }, []);


  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate(routes.APPTABS, { screen: routes.TRANSACTHOME, params: { ...transaction, } });
      return true;
    }
    );
    return () => subscription.remove();
  }, []);
  // Handle user card press
  const handleCardPress = (item) => {
    // Update the transaction with the selected user

    const updatedTransaction = {
      ...transaction,
      recipientUser: { ...item },
    };
    setTransaction(updatedTransaction);
    // Navigate to the Confirm Transaction screen
    navigation.navigate(routes.TRANSACTCONFIRM, { ...updatedTransaction });
  };

  const handleCardLongPress = (item) => {
    console.log("Long press on user card", item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(item);
  };

  // Format the amount for display
  const formattedAmount = getFormattedAmount(transaction.amount);
  console.log("formattedAmount", formattedAmount);
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          size={36}
          color={colors.lightGray}
          onPress={() => navigation.navigate(routes.APPTABS, { screen: routes.TRANSACTHOME, params: { ...transaction, } })}
        />
        <AppText style={styles.headerText}>
          {transaction.action}{" "}
          <AppText style={styles.value}>{formattedAmount}</AppText>{" "}
          {transaction.action === "Sending" ? "to:" : "from:"}
        </AppText>
      </View>
      <FindUserBar
        style={styles.FindUserBar}
        action={transaction.action.slice(0, 3).toLowerCase()}
      />
      <FlashList
        estimatedItemSize={76}
        data={profiles}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleCardLongPress(item)}
            style={styles.userCard}
          />
        )}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={() => <AppCardSeparator />}
      />
      <UserModal
        user={selectedItem}
        visible={modalVisible}
        close={closeModal}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: 28,
    color: colors.yellow,
    textAlign: "left",
    alignSelf: "center",
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 28,
    color: colors.yellow,
  },
  FindUserBar: {
    paddingHorizontal: 10,
  },
  userCard: {
    paddingHorizontal: 10,
  },
});

export default SelectUserScreen;