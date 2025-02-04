import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { colors, fonts } from "../config";

const CountryItem = React.memo(({ country, onSelect }) => (
  <TouchableOpacity
    style={styles.countryItem}
    onPress={() => onSelect(country)}
    activeOpacity={0.7}
  >
    <Text style={styles.flag}>{country.flag}</Text>
    <Text style={styles.countryName}>{country.name}</Text>
    <Text style={styles.dialCode}>{country.dial_code}</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.blackTint10,
    backgroundColor: colors.black,
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: colors.lightGray,
    fontFamily: fonts.medium,
  },
  dialCode: {
    fontSize: 16,
    color: colors.blueTint40,
    fontFamily: fonts.medium,
  },
});

export default CountryItem;
