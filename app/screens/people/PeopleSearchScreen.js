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
function PeopleSearchScreen({ navigation, ...props }) {
  const { modalVisible, selectedItem, openModal, closeModal } = useModal();
  const { session } = useAuthContext();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
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
    if (loadingProfiles) return; // Prevent multiple fetches
    setLoadingProfiles(true); // Set loading state
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
      setLoadingProfiles(false); // Reset loading state
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
  };

  const handleInputChange = (value) => {
    setSearch(value);
  };

  const handleSubmit = () => {
    console.log("Submitted search:", search);
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
        <FlatList
          data={loading ? skeletonItems : profiles}
          renderItem={({ item }) => (
            <UserCard
              user={loading ? null : item}
              style={styles.userCard}
              onPress={() => handleCardPress(item)}
              onLongPress={() => handleCardLongPress(item)} // Long press logic here
            />
          )}
          refreshing={loading}
          onRefresh={handleRefresh}
          keyExtractor={(item, index) => item?.id || index.toString()}
          contentContainerStyle={styles.flatList}
          ItemSeparatorComponent={<AppCardSeparator />}
        />
        <ProfileBottomSheet
          ref={bottomSheetRef}
          user={data?.user}
          loading={loadingBottomSheet}
          onDismiss={dismissSheet}
          friendData={data?.friendData}
          sharedTransactions={data?.sharedTransactions}
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
});

export default PeopleSearchScreen;
