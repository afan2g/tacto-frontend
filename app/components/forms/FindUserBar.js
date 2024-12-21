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
      <View style={styles.searchBar}>
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
          maxLength={24}
        />
      </View>
      <View style={styles.iconsContainer}>
        <AppNFCIcon />
        <View style={styles.qrIcon}>
          <QrCode color={colors.yellow} size={32} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.blueShade30,
    paddingVertical: 10,
  },
  input: {
    paddingLeft: 10,
    color: colors.lightGray,
    fontSize: 16,
    lineHeight: 22,
    overflow: "hidden",
    flex: 1,
  },
  placeholder: {
    fontFamily: fonts.italic,
  },
  text: {
    fontFamily: fonts.medium,
    color: colors.lightGray,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  qrIcon: {
    marginHorizontal: 5,
    marginLeft: 10,
    backgroundColor: colors.black,
    borderRadius: 5,
    height: 36,
    width: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FindUserBar;
