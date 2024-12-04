import React from "react";
import { View, StyleSheet } from "react-native";

import { AppButton, AppText, Screen } from "../../components/primitives";
import { colors, fonts } from "../../config";
import { OrSeparator } from "../../components/login";
import routes from "../../navigation/routes";
function LandingScreen({ navigation }) {
  return (
    <Screen style={styles.screen}>
      <View style={styles.headerContainer}>
        <AppText style={styles.heading}>tacto</AppText>
        <AppText style={styles.subHeading}>Banking reclaimed.</AppText>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          color="yellow"
          onPress={() => navigation.navigate(routes.SIGNUPCREATE)}
          style={styles.button}
          title="Sign up"
        />
        <AppButton
          color="lightGray"
          onPress={() => navigation.navigate(routes.LOGIN)}
          style={styles.button}
          title="Log in"
        />
        <OrSeparator />
        <AppButton
          color="lightGray"
          onPress={() => console.log("google")}
          style={styles.button}
          title="Continue With Google"
        />
        <AppButton
          color="lightGray"
          onPress={() => console.log("apple")}
          style={styles.button}
          title="Continue With Apple"
        />
        <AppButton
          color="lightGray"
          onPress={() => console.log("meta")}
          style={styles.button}
          title="Continue With Meta"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  heading: {
    color: colors.lightGray,
    fontFamily: fonts.bold,
    fontSize: 48,
    textAlign: "center",
    paddingVertical: 10,
  },
  subHeading: {
    color: colors.lightGray,
    fontFamily: fonts.light,
    fontSize: 24,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  button: {
    marginVertical: 5,
  },
});

export default LandingScreen;
