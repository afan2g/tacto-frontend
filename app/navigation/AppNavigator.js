// AppNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import RootNavigator from "./RootNavigator";
import routes from "./routes";
import {
  LandingScreen,
  SignUpComplete,
  SignUpFullName,
  SignUpPassword,
  SignUpUsername,
  SignUpVerify,
  SignUpGenerateWallet,
} from "../screens/auth";
import LoginNavigator from "./LoginNavigator";
import { useAuthContext } from "../contexts/AuthContext";
import SignUpScreen from "../screens/auth/SignUpScreen";
import SignUpImportWallet from "../screens/auth/SignUpImportWallet";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { session, needsWallet } = useAuthContext();

  // Set up navigator based on auth state
  const renderNavigator = () => {
    // User is authenticated but needs wallet setup
    if (session && needsWallet) {
      console.log("rendering wallet setup stack");
      return (
        <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
          <Stack.Screen
            name={routes.SIGNUPGENERATEWALLET}
            component={SignUpGenerateWallet}
          />
          <Stack.Screen
            name={routes.SIGNUPIMPORTWALLET}
            component={SignUpImportWallet}
          />
          <Stack.Screen
            name={routes.SIGNUPCOMPLETE}
            component={SignUpComplete}
          />
        </Stack.Group>
      );
    }

    // Fully authenticated user
    if (session) {
      console.log("rendering authenticated stack");
      return (
        <Stack.Group>
          <Stack.Screen
            name={routes.ROOT}
            component={RootNavigator}
            options={{ gestureEnabled: false }}
          />
        </Stack.Group>
      );
    }

    // Not authenticated
    console.log("rendering non-authenticated stack");
    return (
      <Stack.Group screenOptions={{ animation: "none" }}>
        <Stack.Screen name={routes.LANDING} component={LandingScreen} />
        <Stack.Screen name={routes.LOGIN} component={LoginNavigator} />
        <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
          <Stack.Screen
            name={routes.SIGNUPUSERNAME}
            component={SignUpUsername}
            options={{ animation: "none" }}
          />
          <Stack.Screen
            name={routes.SIGNUPFULLNAME}
            component={SignUpFullName}
          />
          <Stack.Screen
            name={routes.SIGNUPIDENTIFIER}
            component={SignUpScreen}
          />
          <Stack.Screen
            name={routes.SIGNUPPASSWORD}
            component={SignUpPassword}
          />
          <Stack.Screen name={routes.SIGNUPVERIFY} component={SignUpVerify} />
          <Stack.Screen
            name={routes.SIGNUPGENERATEWALLET}
            component={SignUpGenerateWallet}
          />
          <Stack.Screen
            name={routes.SIGNUPIMPORTWALLET}
            component={SignUpImportWallet}
          />
          <Stack.Screen
            name={routes.SIGNUPCOMPLETE}
            component={SignUpComplete}
          />
        </Stack.Group>
      </Stack.Group>
    );
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animation: "none",
      }}
    >
      {renderNavigator()}
    </Stack.Navigator>
  );
}

export default AppNavigator;