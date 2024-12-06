import React from "react";
import { View, StyleSheet, Pressable, Keyboard, FlatList } from "react-native";
import { ChevronsUpDown } from "lucide-react-native";

import { colors } from "../../config";
import { FindUserBar } from "../../components/forms";
import { FAKEUSERS, FAKE_DROPDOWN_ITEMS } from "../../data/fakeData";
import { UserCard, AppCardSeparator } from "../../components/cards";
import DropDownPickerComponent from "../../components/forms/DropDownPickerComponent";
function PeopleFriendsScreen(props) {
  const handleItemChange = (item) => {
    console.log(item);
  };

  const handleSortChange = () => {
    console.log("sorting changed!");
  };

  const handleCardPress = (item) => {
    console.log("User pressed:", item);
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
        data={FAKEUSERS}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            onPress={() => handleCardPress(item)}
            style={styles.userCard}
          />
        )}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={<AppCardSeparator />}
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
