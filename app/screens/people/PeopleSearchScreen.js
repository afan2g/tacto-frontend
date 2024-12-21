import React, { useState } from "react";
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

function PeopleSearchScreen({ navigation, ...props }) {
  const { modalVisible, selectedItem, openModal, closeModal } = useModal();
  // const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    navigation.navigate("UserProfile", { user: item });
  };

  const handleCardLongPress = (item) => {
    console.log("User long pressed:", item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_OTHER_USERS[0]);
  };

  const handleOutsidePress = () => {
    Keyboard.dismiss();
    // setDropDownOpen(false);
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
        data={FAKE_OTHER_USERS}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            style={styles.userCard}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleCardLongPress(item)} // Long press logic here
            // disabled={dropDownOpen}
          />
        )}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={<AppCardSeparator />}
      />
      <UserModal
        user={selectedItem}
        visible={modalVisible}
        close={closeModal}
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
