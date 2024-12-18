import React from "react";
import { View, StyleSheet, FlatList, SectionList } from "react-native";
import * as Haptics from "expo-haptics";

import { AppText, Screen } from "../components/primitives";
import { colors, fonts } from "../config";
import routes from "../navigation/routes";
import {
  AccountBalanceCard,
  ActivityTransactionCard,
} from "../components/cards";
import {
  FAKE_TRANSACTIONS_COMPLETED,
  FAKE_TRANSACTIONS_FULL,
  FAKE_TRANSACTIONS_PENDING,
} from "../data/fakeData";
import useModal from "../hooks/useModal";
import TransactionModal from "../components/modals/TransactionModal";

const DATA = [
  {
    title: "Pending",
    data: FAKE_TRANSACTIONS_PENDING,
  },
  {
    title: "Completed",
    data: FAKE_TRANSACTIONS_COMPLETED,
  },
];
function ActivityScreen({ navigation }) {
  const { closeModal, openModal, modalVisible, selectedItem } = useModal();
  const handlePress = (transaction) => {
    navigation.navigate(routes.TRANSACTIONDETAIL, { transaction });
  };

  const handleLongPress = (transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_TRANSACTIONS_FULL[0]);
  };
  return (
    <Screen style={styles.screen}>
      <AccountBalanceCard balance={1002.33} style={styles.balanceCard} />
      {/* <FlatList
        ListHeaderComponent={() => (
          <>
            <View style={styles.pendingContainer}>
              <AppText style={styles.header}>Pending</AppText>
              {FAKE_TRANSACTIONS_PENDING.map((item) => (
                <ActivityTransactionCard
                  key={item.id}
                  transaction={item}
                  onPress={() => handlePress(item)}
                  onLongPress={() => handleLongPress(item)}
                  navigation={navigation}
                />
              ))}
            </View>
            <View style={styles.completedContainer}>
              <AppText style={styles.header}>Completed</AppText>
            </View>
          </>
        )}
        data={FAKE_TRANSACTIONS_COMPLETED}
        renderItem={({ item }) => (
          <ActivityTransactionCard
            transaction={item}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={styles.flatList}
      /> */}

      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <ActivityTransactionCard
            transaction={item}
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
            navigation={navigation}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderSectionHeader={({ section: { title } }) => (
          <AppText style={styles.header}>{title}</AppText>
        )}
      />
      <TransactionModal
        transaction={selectedItem}
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
  balanceCard: {
    borderBottomColor: colors.fadedGray,
  },
  separator: {
    height: 2,
    marginHorizontal: 10,
    backgroundColor: colors.blueShade10,
  },
  header: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 1,
    paddingBottom: 10,
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    paddingHorizontal: 10,
  },
  pendingContainer: {},
  completedContainer: {
    marginBottom: 10,
  },
  flatList: {
    paddingTop: 10,
  },
});

export default ActivityScreen;
