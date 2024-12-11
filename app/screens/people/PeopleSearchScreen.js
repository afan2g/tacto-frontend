import React from "react";
import { StyleSheet, Pressable, Keyboard, FlatList } from "react-native";

import { FindUserBar } from "../../components/forms";
import { UserCard, AppCardSeparator } from "../../components/cards";
import { FAKEUSERS } from "../../data/fakeData";

function PeopleSearchScreen({ navigation, ...props }) {
  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    navigation.navigate("UserProfile", { user: item });
  };

  return (
    <Pressable style={styles.screen} onPress={Keyboard.dismiss}>
      <FindUserBar action="send" style={styles.findUserBar} />
      <FlatList
        data={FAKEUSERS}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            style={styles.userCard}
            onPress={() => handleCardPress(item)}
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
  userCard: {
    paddingHorizontal: 10,
  },
  flatList: {},
});

export default PeopleSearchScreen;
