import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import { OtherUserHeader, UserCardVertical } from "../cards";
import { X } from "lucide-react-native";

function UserModal({ user, style, modalVisible, closeModal }) {
  const status = user.friendStatus;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <OtherUserHeader
              user={user}
              handleClose={closeModal}
              style={styles.headerContainer}
            />
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.07)", // Keeps the dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    width: "80%",
    backgroundColor: colors.black,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.blackTint40,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 40,
  },
});

export default UserModal;
