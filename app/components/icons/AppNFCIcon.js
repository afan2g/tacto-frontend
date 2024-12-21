import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../config/colors";
import { Nfc } from "lucide-react-native";
function AppNFCIcon({ action = "send", size = 36 }) {
  return (
    <View
      style={[
        styles.NFCContainer,
        { height: size, width: size, borderRadius: size / 2 },
      ]}
    >
      <Nfc
        size={size / 1.5}
        color={action === "send" ? colors.yellow : colors.lightGray}
        style={action === "send" ? styles.NFCIconSend : styles.NFCIconReceive}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  NFCContainer: {
    borderWidth: 1,
    borderColor: colors.yellow,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  NFCIconSend: {
    transform: [{ rotateZ: "-90deg" }],
  },
  NFCIconReceive: {
    transform: [{ rotateZ: "90deg" }],
  },
});

export default AppNFCIcon;
