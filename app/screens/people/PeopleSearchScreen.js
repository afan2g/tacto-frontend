import React from "react";
import { StyleSheet, Pressable, Keyboard, FlatList } from "react-native";
import { Search } from "lucide-react-native";

import { FindUserBar } from "../../components/forms";
import { colors } from "../../config";
import { UserCard } from "../../components/cards";
import { FAKEUSERS } from "../../data/fakeData";

function PeopleSearchScreen(props) {
  return (
    <Pressable style={styles.screen} onPress={Keyboard.dismiss}>
      <FindUserBar
        action="send"
        style={styles.findUserBar}
        icon={<Search color={colors.lightGray} size={16} />}
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

export default PeopleSearchScreen;
