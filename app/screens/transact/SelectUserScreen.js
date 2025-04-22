import React, { useContext, useEffect, useState, useCallback } from "react";
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
import { useAuthContext, useData } from "../../contexts";
import { supabase } from "../../../lib/supabase";
import { useAmountFormatter } from "../../hooks/useAmountFormatter";
import { debounce } from "lodash";

function SelectUserScreen({ navigation, route }) {
  const { selectedItem, modalVisible, openModal, closeModal } = useModal();
  const {
    action = null,
    amount = null,
    recipientUser = null,
    recipientAddress = null,
    memo = null,
    methodId = null,
  } = route.params || {};
  const [transaction, setTransaction] = useState({
    action,
    amount,
    recipientUser,
    recipientAddress,
    memo,
    methodId,
  });
  const { session } = useAuthContext();
  const [profiles, setProfiles] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  // Use our amount formatter
  const { getFormattedAmount } = useAmountFormatter();

  // Fetch initial profiles data
  useEffect(() => {
    fetchInitialProfiles();
  }, []);

  const fetchInitialProfiles = async () => {
    try {
      // Fetch profiles data
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", session.user.id)
        .eq("onboarding_complete", true)
        .limit(20); // Limit initial fetch

      if (error) throw error;
      setProfiles(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  // Debounced search function for as-you-type searching
  // Update the debouncedSearch function in your SelectUserScreen component
  // Replace the existing debouncedSearch function with this enhanced version
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm || searchTerm.trim() === "") {
        fetchInitialProfiles();
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);

        // Using trigram similarity for fuzzy matching
        const { data: searchResults, error } = await supabase.rpc(
          "search_profiles",
          {
            search_term: searchTerm,
            similarity_threshold: 0.3,
            current_user_id: session.user.id,
            result_limit: 20,
          }
        );

        if (error) {
          console.error("Error with trigram search:", error);

          // Fallback to simple ILIKE search if RPC fails
          const { data: fallbackResults, fallbackError } = await supabase
            .from("profiles")
            .select("*")
            .or(
              `username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`
            )
            .eq("onboarding_complete", true)
            .neq("id", session.user.id)
            .limit(20);

          if (fallbackError) throw fallbackError;
          setProfiles(fallbackResults);
        } else {
          setProfiles(searchResults);
        }
      } catch (error) {
        console.error("Error searching profiles:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300), // 300ms debounce delay
    [session.user.id]
  );
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const prevRoute =
          navigation.getState().routes[navigation.getState().index - 1];
        if (prevRoute.name === routes.TRANSACTCONFIRM) {
          navigation.navigate(routes.APPTABS, {
            screen: routes.TRANSACTHOME,
            params: { ...transaction },
          });
          return true;
        } else {
          navigation.popToTop();
          return true;
        }
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

  const handleSearch = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  // Format the amount for display
  const formattedAmount = getFormattedAmount(transaction.amount);

  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <ChevronLeft
          size={36}
          color={colors.lightGray}
          onPress={() =>
            navigation.navigate(routes.APPTABS, {
              screen: routes.TRANSACTHOME,
              params: { ...transaction },
            })
          }
        />
        <AppText style={styles.headerText}>
          {transaction.action}{" "}
          <AppText style={styles.value}>{formattedAmount}</AppText>{" "}
          {transaction.action === "Sending" ? "to:" : "from:"}
        </AppText>
      </View>
      <FindUserBar
        style={styles.FindUserBar}
        onChangeText={handleSearch}
        value={search}
        isSearching={isSearching}
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
        keyExtractor={(item) => item.id || item.username}
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
  flatList: {
    paddingBottom: 20,
  },
});

export default SelectUserScreen;
