import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { QrCode, Search } from "lucide-react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import AppNFCIcon from "../icons/AppNFCIcon";
function FindUserBar({ style, action }) {
  const [search, setSearch] = useState("");

  const handleInputChange = (value) => {
    setSearch(value);
  };

  const handleSubmit = () => {
    console.log("Submitted search:", search);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <Search color={colors.lightGray} size={16} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          name="username"
          numberOfLines={1}
          multiline={false}
          onChangeText={(value) => handleInputChange(value)}
          onSubmitEditing={handleSubmit}
          placeholder="Username, email, or phone #"
          placeholderTextColor={colors.softGray}
          returnKeyType="next"
          selectionColor={colors.lightGray}
          style={[styles.input, styles.placeholder, search && styles.text]}
          value={search}
        />
      </View>
      <View style={styles.actionIconsContainer}>
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
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1, // This will make the container take up available space
    borderColor: colors.fadedGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    paddingVertical: 10,
    marginRight: 20, // Add some space between input and icons
  },
  input: {
    marginLeft: 10,
    fontSize: 16,
    lineHeight: 22,
    overflow: "hidden",
    textAlignVertical: "bottom",
  },
  placeholder: {
    fontFamily: fonts.italic,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  actionIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Space between icons
  },
});

export default FindUserBar;
