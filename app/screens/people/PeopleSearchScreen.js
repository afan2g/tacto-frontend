import React from "react";
import { StyleSheet, Pressable, Keyboard, FlatList } from "react-native";

import { FindUserBar } from "../../components/forms";
import { UserCard, AppCardSeparator } from "../../components/cards";
import { FAKE_OTHER_USERS, FAKEUSERS } from "../../data/fakeData";
import useModal from "../../hooks/useModal";
import UserModal from "../../components/modals/UserModal";
function PeopleSearchScreen({ navigation, ...props }) {
  const { modalVisible, selectedUser, openModal, closeModal } = useModal();
  const handleCardPress = (item) => {
    console.log("User pressed:", item);
    navigation.navigate("UserProfile", { user: item });
  };

  return (
    <Pressable style={styles.screen} onPress={Keyboard.dismiss}>
      <FindUserBar action="send" style={styles.findUserBar} />
      <FlatList
        data={FAKE_OTHER_USERS}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            style={styles.userCard}
            onPress={() => handleCardPress(item)}
            onLongPress={() => openModal(item)} // Long press logic here
          />
        )}
        keyExtractor={(item) => item.username}
        contentContainerStyle={styles.flatList}
        ItemSeparatorComponent={<AppCardSeparator />}
      />
      <UserModal
        user={selectedUser}
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
