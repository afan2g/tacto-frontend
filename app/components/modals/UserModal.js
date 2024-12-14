import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { colors } from "../../config";
import { OtherUserHeader } from "../cards";

function UserModal({ user, modalVisible, closeModal }) {
  if (!user) return null; // Render nothing if no user is selected
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
            <View style={styles.headerContainer}>
              <OtherUserHeader
                user={user}
                handleClose={closeModal}
                style={{ width: "100%", backgroundColor: colors.black }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Keeps the dimmed background
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
    paddingBottom: 20,
  },
});

export default UserModal;
