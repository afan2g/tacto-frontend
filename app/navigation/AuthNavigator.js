import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "./routes";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/signup/SignUpScreen";
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
