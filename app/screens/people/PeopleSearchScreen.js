import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Pressable,
  Keyboard,
  FlatList,
  View,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import * as Haptics from "expo-haptics";

import { FindUserBar } from "../../components/forms";
import { UserCard, AppCardSeparator } from "../../components/cards";
import { FAKE_OTHER_USERS, FAKEUSERS } from "../../data/fakeData";
import useModal from "../../hooks/useModal";
import UserModal from "../../components/modals/UserModal";
import { Search } from "lucide-react-native";
import { colors, fonts } from "../../config";
import { fetchFriends, fetchProfiles } from "../../api";
import { useAuthContext } from "../../contexts";
import { useProfileSheet } from "../../hooks/useProfileSheet";
import ProfileBottomSheet from "../../components/modals/ProfileBottomSheet";
import { debounce } from "lodash";
import { supabase } from "../../../lib/supabase";
import DropDownPickerComponent from "../../components/forms/DropDownPickerComponent";
import { ChevronsUpDown } from "lucide-react-native";
import { FAKE_DROPDOWN_ITEMS } from "../../data/fakeData";
import { AppText } from "../../components/primitives";
import { set } from "zod";
import formatRelativeTime from "../../utils/formatRelativeTime";
function PeopleSearchScreen({ navigation, ...props }) {
  const { modalVisible, selectedItem, openModal, closeModal } = useModal();
  const { session } = useAuthContext();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [dropDownItem, setDropDownItem] = useState(
    FAKE_DROPDOWN_ITEMS[0].value
  ); // Default dropdown item
  const [sortDirection, setSortDirection] = useState("desc"); // Default sort direction

  const {
    bottomSheetRef,
    data,
    dismissSheet,
    fetchProfileData,
    loading: loadingBottomSheet,
    presentSheet,
  } = useProfileSheet({ sessionUserId: session.user.id });
  const skeletonItems = Array.from({ length: 5 });

  const handleRefresh = async () => {
    setLoading(true); // Show loading state immediately for better UX
    setError(false); // Reset error state
    setSearch(""); // Clear search input
    setIsSearching(false); // Reset searching state
    setDropDownOpen(false); // Close dropdown if open
    setDropDownItem(null); // Reset dropdown item
    setSortDirection("desc"); // Reset sort direction
    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Optional: Add a delay for the loading state
    try {
      await fetchInitialProfiles();
    } catch (err) {
      console.error("Error refreshing users:", err);
      setError("Failed to refresh users");
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  // Refactored fetchUsers function
  const fetchInitialProfiles = async () => {
    if (loading) return; // Prevent multiple fetches
    setLoading(true); // Set loading state
    try {
      // Fetch profiles data
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", session.user.id)
        .limit(20); // Limit initial fetch

      if (error) throw error;
      setProfiles(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    fetchInitialProfiles();
  }, []); // Fetch initial profiles on mount

  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm || searchTerm.trim() === "") {
        fetchInitialProfiles();
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        setDropDownItem("none");

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

  const handleSearch = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };
  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    presentSheet(item); // Open the bottom sheet with user data
  };

  const handleCardLongPress = (item) => {
    console.log("User long pressed:", item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_OTHER_USERS[0]);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    setDropDownOpen(false);
  };

  // First, update the handleItemChange function to use the new value directly
  const handleItemChange = async (item) => {
    console.log(item);
    setDropDownOpen(false);
    setDropDownItem(item); // Store the selected item

    if (item === "none") {
      handleRefresh(); // Reset to default state
      return;
    }
    // Use the new item value directly instead of relying on state
    try {
      setLoading(true);
      const { data: sortedProfiles, error } = await supabase.rpc(
        "get_transaction_partners",
        {
          current_user_id: session.user.id,
          sort_by: item, // Use the parameter directly
          sort_direction: sortDirection,
          limit_count: 20,
        }
      );

      if (error) throw error;
      console.log("Sorted profiles:", sortedProfiles);
      setProfiles(sortedProfiles);
    } catch (error) {
      console.error("Error fetching sorted profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Next, update the handleSortChange function to use the toggled value directly
  const handleSortChange = async () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    console.log("Sorting changed to:", newSortDirection);
    setSortDirection(newSortDirection); // Update state

    // Use the new sort direction directly
    try {
      setLoading(true);
      const { data: sortedProfiles, error } = await supabase.rpc(
        "get_transaction_partners",
        {
          current_user_id: session.user.id,
          sort_by: dropDownItem,
          sort_direction: newSortDirection, // Use the toggled value directly
          limit_count: 20,
        }
      );

      if (error) throw error;
      console.log("Sorted profiles:", sortedProfiles);
      setProfiles(sortedProfiles);
    } catch (error) {
      console.error("Error fetching sorted profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.resultCard}>
        <UserCard
          user={loading ? null : item}
          style={styles.userCard}
          onPress={() => handleCardPress(item)}
          onLongPress={() => handleCardLongPress(item)} // Long press logic here
        />
        {!loading && dropDownItem && (
          <View style={styles.sortedDetailContainer}>
            <AppText style={styles.sortByText}>
              {dropDownItem === "count"
                ? item.transaction_count
                : dropDownItem === "volume"
                ? `$${item.total_volume.toFixed(2)}`
                : dropDownItem === "recent"
                ? formatRelativeTime(item.last_transaction_date)
                : null}
            </AppText>
          </View>
        )}
      </View>
    );
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <Pressable style={styles.screen} onPress={handleOutsidePress}>
        <FindUserBar
          style={styles.findUserBar}
          onChangeText={handleSearch}
          value={search}
          isSearching={isSearching}
        />
        <View style={styles.dropDownPicker}>
          <DropDownPickerComponent
            items={FAKE_DROPDOWN_ITEMS}
            onChangeItem={handleItemChange}
            defaultValue={dropDownItem}
            open={dropDownOpen}
            setOpen={setDropDownOpen}
          />
          <ChevronsUpDown
            size={28}
            color={colors.lightGray}
            style={styles.sortByIcon}
            onPress={handleSortChange}
            disabled={!dropDownItem} // Disable icon if no dropdown item is selected
          />
        </View>
        <FlatList
          data={loading ? skeletonItems : profiles}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={handleRefresh}
          keyExtractor={(item, index) => item?.id || index.toString()}
          contentContainerStyle={styles.flatList}
          ItemSeparatorComponent={<AppCardSeparator />}
        />
        <ProfileBottomSheet
          ref={bottomSheetRef}
          user={data?.user}
          friendData={data?.friendData}
          sharedTransactions={data?.sharedTransactions}
          loading={loadingBottomSheet}
          onDismiss={dismissSheet}
        />
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 10,
    flex: 1,
  },
  findUserBar: {
    paddingHorizontal: 5,
  },
  userCard: {
    paddingHorizontal: 10,
  },
  flatList: {},
  dropDownPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  sortByIcon: {
    marginLeft: 10,
  },
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  sortedDetailContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20,
  },
  sortByText: {
    fontSize: 22,
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
});

export default PeopleSearchScreen;
