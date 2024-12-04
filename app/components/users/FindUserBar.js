import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import { Nfc, QrCode } from "lucide-react-native";
import AppNFCIcon from "../icons/AppNFCIcon";
function FindUserBar({ style, action }) {
  const [search, setSearch] = useState("");

  const handleInputChange = (value) => {
    setSearch(value);
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        name="username"
        numberOfLines={1}
        multiline={false}
        onChangeText={(value) => handleInputChange(value)}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder="Username, email, or phone #"
        placeholderTextColor={colors.softGray}
        returnKeyType="next"
        selectionColor={colors.lightGray}
        style={[styles.input, styles.placeholder, search && styles.text]}
        value={search}
      />
      <View style={styles.iconContainer}>
        <QrCode size={24} color={colors.lightGray} />
        <AppNFCIcon action={action} size={36} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between", // Changed from "center"
    alignItems: "center",
    width: "100%",
  },
  input: {
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 16,
    lineHeight: 22,
    overflow: "hidden",
    padding: 10,
    flex: 1, // This will make the TextInput take up available space
    marginRight: 20, // Add some space between input and icons
    textAlignVertical: "bottom",
  },
  placeholder: {
    fontFamily: fonts.italic,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Space between icons
  },
});

export default FindUserBar;
