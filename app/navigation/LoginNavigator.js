import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import routes from "./routes";
import { LoginScreen, ForgotPasswordScreen } from "../screens/auth";

const Stack = createNativeStackNavigator();

function LoginNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
      <Stack.Screen
        name={routes.FORGOTPASSWORD}
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default LoginNavigator;
