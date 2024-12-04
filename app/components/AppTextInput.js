import React, { forwardRef } from "react";
import { StyleSheet, TextInput } from "react-native";
import colors from "../config/colors";
import fonts from "../config/fonts";

const AppTextInput = forwardRef(({ style, value, ...otherProps }, ref) => {
  return (
    <TextInput
      placeholderTextColor={colors.light}
      style={[
        styles.text,
        style,
        { fontFamily: value ? fonts.regular : fonts.italic },
      ]}
      value={value}
      ref={ref}
      selectionColor={colors.light}
      selectionHandleColor={colors.gray}
      {...otherProps}
    />
  );
});

const styles = StyleSheet.create({
  text: {
    color: colors.gray,
    fontSize: 18,
    padding: 10,
    marginBottom: 15,
    width: "100%",
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
  },
});

export default AppTextInput;
