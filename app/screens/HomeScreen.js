import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import * as Haptics from "expo-haptics";

import {
  AppCardSeparator,
  TransactionCard,
  TransactionCardSeparator,
} from "../components/cards";
import { AppText, Header, Screen } from "../components/primitives";
import { colors } from "../config";
import useGreeting from "../hooks/useGreeting";
import formatRelativeTime from "../utils/formatRelativeTime";
import {
  FAKE_HOME_SCREEN_DATA,
  FAKE_TRANSACTIONS_FULL,
} from "../data/fakeData";
import routes from "../navigation/routes";
import useModal from "../hooks/useModal";
import TransactionModal from "../components/modals/TransactionModal";
function HomeScreen({ navigation }) {
  const { selectedItem, modalVisible, openModal, closeModal } = useModal();
  const greeting = useGreeting();

  const handleLongPress = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_TRANSACTIONS_FULL[0]);
  };
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <Header style={styles.header}>
          {greeting},{" "}
          <AppText style={[styles.header, styles.firstName]}>Aaron.</AppText>
        </Header>
      </View>

      <FlatList
        data={FAKE_HOME_SCREEN_DATA}
        renderItem={({ item }) => (
          <TransactionCard
            transaction={{ ...item, time: formatRelativeTime(item.time) }}
            navigation={navigation}
            onLongPress={handleLongPress}
          />
        )}
        keyExtractor={(item) => item.txid.toString()}
        ItemSeparatorComponent={() => <AppCardSeparator />}
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
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: colors.softGray,
    marginBottom: 10,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  firstName: {
    color: colors.yellow,
  },
});

export default HomeScreen;
