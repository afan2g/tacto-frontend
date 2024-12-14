import React, { useState } from "react";
import { View, StyleSheet, Pressable, Keyboard, FlatList } from "react-native";
import { ChevronsUpDown, User } from "lucide-react-native";

import { colors } from "../../config";
import { FindUserBar } from "../../components/forms";
import {
  FAKEUSERS,
  FAKE_DROPDOWN_ITEMS,
  FAKE_OTHER_USERS,
} from "../../data/fakeData";
import { UserCard, AppCardSeparator } from "../../components/cards";
import DropDownPickerComponent from "../../components/forms/DropDownPickerComponent";
import UserModal from "../../components/modals/UserModal";
import routes from "../../navigation/routes";
import useModal from "../../hooks/useModal";

function PeopleFriendsScreen({ navigation }) {
  const { selectedItem, modalVisible, openModal, closeModal } = useModal();
  const handleItemChange = (item) => {
    console.log(item);
  };

  const handleSortChange = () => {
    console.log("sorting changed!");
  };

  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    navigation.navigate(routes.USERPROFILE, { user: item });
  };

  const handleCardLongPress = (item) => {
    console.log("User long pressed:", item);
    openModal(FAKE_OTHER_USERS[0]);
  };

  return (
    <Pressable style={styles.screen} onPress={Keyboard.dismiss}>
      <FindUserBar action="send" style={styles.findUserBar} />
      <View style={styles.dropDownPicker}>
        <DropDownPickerComponent
          items={FAKE_DROPDOWN_ITEMS}
          onChangeItem={handleItemChange}
          defaultValue={null}
        />
        <ChevronsUpDown
          size={28}
          color={colors.lightGray}
          style={styles.sortByIcon}
          onPress={handleSortChange}
        />
      </View>
      <FlatList
        data={FAKE_OTHER_USERS}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleCardLongPress(item)} // Long press logic here
            style={styles.userCard}
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
  dropDownPicker: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
    marginVertical: 5,
  },
  sortByIcon: {
    marginLeft: 10,
  },
  userCard: {
    paddingHorizontal: 10,
  },
  flatList: {},
});

export default PeopleFriendsScreen;
