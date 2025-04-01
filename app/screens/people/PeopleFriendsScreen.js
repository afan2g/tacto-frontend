import React, { useState } from "react";
import { View, StyleSheet, Pressable, Keyboard, FlatList } from "react-native";
import { ChevronsUpDown, User } from "lucide-react-native";
import * as Haptics from "expo-haptics";

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
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleOutsidePress = () => {
    console.log("outside press");
    Keyboard.dismiss();
    setDropDownOpen(false);
  };
  const handleItemChange = (item) => {
    console.log(item);
  };

  const handleSortChange = () => {
    console.log("sorting changed!");
  };

  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    if (dropDownOpen) {
      setDropDownOpen(false);
    } else {
      navigation.navigate(routes.USERPROFILE, {
        user: item,
        friendData: {
          ...data.friendData,
          mutualFriendCount: data.mutualFriendCount,
          friendCount: data.friendCount,
        },
        sharedTransactions: data.sharedTransactions,
      });
    }
  };

  const handleCardLongPress = (item) => {
    console.log("User long pressed:", item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openModal(FAKE_OTHER_USERS[0]);
  };

  return (
    <Pressable style={styles.screen} onPress={handleOutsidePress}>
      <FindUserBar action="send" style={styles.findUserBar} />
      <View style={styles.dropDownPicker}>
        <DropDownPickerComponent
          items={FAKE_DROPDOWN_ITEMS}
          onChangeItem={handleItemChange}
          defaultValue={null}
          open={dropDownOpen}
          setOpen={setDropDownOpen}
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
            style={styles.userCard}
            onPress={() => handleCardPress(item)}
            onLongPress={() => handleCardLongPress(item)} // Long press logic here
            disabled={dropDownOpen}
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
  pressed: {
    backgroundColor: colors.blueShade40,
  },
  notPressed: {
    backgroundColor: "transparent",
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
