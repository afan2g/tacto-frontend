import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet, Easing } from "react-native";
import routes from "./routes";
import AppTabNavigator from "./AppTabNavigator";

import UserProfileScreen from "../screens/UserProfileScreen";
import TestScreen from "../screens/TestScreen";
const Stack = createNativeStackNavigator();

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const configClose = {
  animation: "timing",
  config: {
    duration: 10000000,
  },
};
function TempNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name={routes.APPTABS} component={AppTabNavigator} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: "fullScreenModal",
          transitionSpec: {
            open: config,
            close: config,
          },
        }}
      >
        <Stack.Screen name={routes.USERPROFILE} component={UserProfileScreen} />
        {/* <Stack.Screen name={routes.TEST} component={TestScreen} /> */}
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default TempNavigator;
