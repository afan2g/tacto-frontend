import React, { useContext } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import FindUserBar from "../../components/users/FindUserBar";
import UserCard from "../../components/users/UserCard";
import Screen from "../../components/Screen";
import { ChevronLeft } from "lucide-react-native";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import fonts from "../../config/fonts";
import routes from "../../navigation/routes";
import { TransactionContext } from "../../contexts/TransactionContext";

const FAKEUSERS = [
  {
    fullName: "Aaron Fan",
    username: "@afan2k",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Cindy Fan",
    username: "@cf96",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Andrew Zhai",
    username: "@zhaizhaizhai",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Nate Gale",
    username: "@nutgel",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Kyle Li",
    username: "@wheresme2010",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
];

function SelectUserScreen({ navigation }) {
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
          <UserCard user={item} onPress={() => handleCardPress(item)} />
        )}
        keyExtractor={(item) => item.username}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {},
  headerContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: 28,
    color: colors.yellow,
    alignSelf: "center",
    textAlign: "left",
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 28,
    color: colors.yellow,
  },
});

export default SelectUserScreen;
