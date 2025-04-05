import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { TouchableRipple } from "react-native-paper";
import AppText from "./AppText";
import colors from "../../config/colors";

const AppButton = ({
  title,
  onPress,
  color = colors.yellow,
  style,
  textStyle,
  loadingColor = colors.black,
  loading = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  icon = null,
}) => {
  const buttonIsDisabled = disabled || loading;

  return (
    <TouchableRipple
      style={[
        styles.button,
        { backgroundColor: color },
        buttonIsDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={buttonIsDisabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{
        disabled: buttonIsDisabled,
        busy: loading,
      }}
      testID="app-button"
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={loadingColor}
            style={styles.indicator}
            testID="button-loading-indicator"
          />
        ) : (
          icon
        )}
        <AppText
          style={[styles.text, textStyle, loading && styles.textWithIndicator]}
          numberOfLines={1}
        >
          {title}
        </AppText>
      </View>
    </TouchableRipple>
  );
};

AppButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loadingColor: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: colors.yellow,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    padding: 10,
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    marginRight: 8,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
  textWithIndicator: {
    marginLeft: 4,
  },
});

export default AppButton;
