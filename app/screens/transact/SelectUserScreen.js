import React, { useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { AppText, Screen } from "../../components/primitives";
import FindUserBar from "../../components/forms/FindUserBar";
import UserCard from "../../components/cards/UserCard";
import { colors, fonts } from "../../config";
import routes from "../../navigation/routes";
import { TransactionContext } from "../../contexts/TransactionContext";
import {
  FAKE_OTHER_USERS,
  FAKE_TRANSACTIONS_FULL,
  FAKEUSERS,
} from "../../data/fakeData";
import { AppCardSeparator } from "../../components/cards";
import useModal from "../../hooks/useModal";
import UserModal from "../../components/modals/UserModal";

function SelectUserScreen({ navigation }) {
  const { selectedItem, modalVisible, openModal, closeModal } = useModal();
  // Access transaction and setTransaction from context
  const { transaction, setTransaction } = useContext(TransactionContext);

  // Handle user card press
  const handleCardPress = (item) => {
    // Update the transaction with the selected user
    setTransaction((prev) => ({
      ...prev,
      otherUser: { ...item },
    }));
    // Navigate to the Confirm Transaction screen
    navigation.navigate(routes.TRANSACTCONFIRM);
  };

  const handleCardLongPress = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_OTHER_USERS[0]);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          size={36}
          color={colors.lightGray}
          onPress={() => navigation.goBack()}
        />
        <AppText style={styles.headerText}>
          {transaction.action}{" "}
          <AppText style={styles.value}>${transaction.amount}</AppText>{" "}
          {transaction.action === "Sending" ? "to:" : "from:"}
        </AppText>
      </View>
      <FindUserBar
        style={styles.FindUserBar}
        action={transaction.action.slice(0, 4).toLowerCase()}
      />
      <FlatList
        data={FAKEUSERS}
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
