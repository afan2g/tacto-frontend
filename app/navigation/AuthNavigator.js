import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "./routes";
import LandingScreen from "../screens/entry/LandingScreen";
import LoginScreen from "../screens/entry/LoginScreen";
import SignUpScreen from "../screens/entry/SignUpScreen";
import SignUpNavigator from "./SignUpNavigator";
import LoginNavigator from "./LoginNavigator";

const Stack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "none",
        animationDuration: 0,
      }}
    >
      <Stack.Screen name={routes.LANDING} component={LandingScreen} />
      <Stack.Screen name={routes.LOGIN} component={LoginNavigator} />
      <Stack.Screen name={routes.SIGNUPCREATE} component={SignUpNavigator} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
