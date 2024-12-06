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

  const handleSortChange = () => {
    console.log("sorting changed!");
  };

  const handleDismiss = () => {
    Keyboard.dismiss();
  };
  return (
    <Pressable style={styles.screen} onPress={handleDismiss}>
      <FindUserBar
        action="send"
        style={styles.findUserBar}
        icon={<Search color={colors.lightGray} size={16} />}
      />
      <View style={styles.dropDownPicker}>
        <DropDownPickerComponent
          items={FAKE_DROPDOWN_ITEMS}
          onChangeItem={handleItemChange}
          defaultValue={null}
          onPressIcon={handleSortChange}
        />
      </View>
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
  dropDownPicker: {
    padding: 10,
  },
  flatList: {
    paddingHorizontal: 10,
  },
});

export default PeopleFriendsScreen;
