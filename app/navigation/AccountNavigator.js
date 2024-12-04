import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import routes from "./routes";
import AccountScreen from "../screens/AccountScreen";

const Stack = createNativeStackNavigator();
function AccountNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.ACCOUNT} component={AccountScreen} />
      <Stack.Screen />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AccountNavigator;
