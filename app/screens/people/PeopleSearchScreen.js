import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Pressable,
  Keyboard,
  FlatList,
  View,
  TextInput,
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

function PeopleSearchScreen({ navigation, ...props }) {
  const { modalVisible, selectedItem, openModal, closeModal } = useModal();
  const { session } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const {
    bottomSheetRef,
    data,
    dismissSheet,
    fetchProfileData,
    loading: loadingBottomSheet,
    presentSheet,
  } = useProfileSheet({ sessionUserId: session.user.id });
  const skeletonItems = Array.from({ length: 5 });
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simulate fetching users from an API or database
        const fetchedUsers = await fetchProfiles(session.user.id);
        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRefresh = async () => {
    setLoading(true); // Show loading state immediately for better UX

    // await new Promise((resolve) => setTimeout(resolve, 10000)); // Optional: Add a delay for the loading state
    try {
      await fetchUsers();
    } catch (err) {
      console.error("Error refreshing users:", err);
      setError("Failed to refresh users");
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  // Refactored fetchUsers function
  const fetchUsers = async () => {
    try {
      const fetchedUsers = await fetchProfiles(session.user.id);
      setUsers(fetchedUsers);
      setError(null); // Clear any previous errors on success
      return fetchedUsers; // Return the data for potential chaining
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
      throw err; // Re-throw to allow proper error handling by callers
    }
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

  const [search, setSearch] = useState("");

  const handleInputChange = (value) => {
    setSearch(value);
  };

  const handleSubmit = () => {
    console.log("Submitted search:", search);
  };

  return (
    <Pressable style={styles.screen} onPress={handleOutsidePress}>
      <FindUserBar />
      <FlatList
        data={loading ? skeletonItems : users}
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
