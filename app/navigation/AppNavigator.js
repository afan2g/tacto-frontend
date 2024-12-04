import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import routes from "./routes";
import AuthNavigator from "./AuthNavigator";
import AppTabNavigator from "./AppTabNavigator";

const Stack = createNativeStackNavigator();
function AppNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.AUTH} component={AuthNavigator} />
      <Stack.Screen name={routes.APP} component={AppTabNavigator} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
