import React from "react";
import { View, StyleSheet, Pressable, Keyboard, FlatList } from "react-native";
import { Search } from "lucide-react-native";
import { FindUserBar } from "../../components/forms";
import { FAKEUSERS, FAKE_DROPDOWN_ITEMS } from "../../data/fakeData";
import { UserCard } from "../../components/cards";
import { colors } from "../../config";
import DropDownPickerComponent from "../../components/forms/DropDownPickerComponent";
function PeopleFriendsScreen(props) {
  const handleItemChange = (item) => {
    console.log(item);
  };
  return (
    <Pressable style={styles.screen} onPress={Keyboard.dismiss}>
      <FindUserBar
        action="send"
        style={styles.findUserBar}
        icon={<Search color={colors.lightGray} size={16} />}
      />
      <DropDownPickerComponent
        items={FAKE_DROPDOWN_ITEMS}
        onChangeItem={handleItemChange}
      />
      <FlatList
        data={FAKEUSERS}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item) => item.username}
        style={styles.flatList}
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
    paddingHorizontal: 10,
  },
  flatList: {
    paddingHorizontal: 10,
  },
});

export default PeopleFriendsScreen;
