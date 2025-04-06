import React from "react";
import { View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { QrCode, Search } from "lucide-react-native";
import colors from "../../config/colors";
import fonts from "../../config/fonts";
import AppNFCIcon from "../icons/AppNFCIcon";
import { useNavigation } from "@react-navigation/native";
import routes from "../../navigation/routes";

function FindUserBar({ style, onChangeText, value, isSearching = false }) {
  const navigation = useNavigation();

  const handleQrPress = () => {
    console.log("QR Code pressed");
    navigation.navigate(routes.QRTESTING);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchBar}>
        {isSearching ? (
          <ActivityIndicator size="small" color={colors.lightGray} />
        ) : (
          <Search color={colors.lightGray} size={16} />
        )}
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="username"
          name="username"
          numberOfLines={1}
          multiline={false}
          onChangeText={onChangeText}
          placeholder="Username, email, or phone #"
          placeholderTextColor={colors.softGray}
          returnKeyType="search"
          selectionColor={colors.lightGray}
          style={[styles.input, styles.placeholder, value && styles.text]}
          maxLength={24}
          value={value}
        />
      </View>
      <View style={styles.iconsContainer}>
        <View style={styles.qrIcon}>
          <QrCode color={colors.yellow} size={32} onPress={handleQrPress} />
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.blueShade30,
    paddingVertical: 10,
    marginLeft: 5,
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
