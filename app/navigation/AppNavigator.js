// AppNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RootNavigator from "./RootNavigator";
import routes from "./routes";

import {
  LandingScreen,
  SignUpComplete,
  SignUpEmail,
  SignUpFullName,
  SignUpPassword,
  SignUpUsername,
  SignUpVerify,
  SignUpGenerateWallet,
} from "../screens/auth";
import LoginNavigator from "./entry/LoginNavigator";
import { useAuthContext } from "../contexts/AuthContext";
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { session, isLoading, needsWallet } = useAuthContext();

  if (isLoading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
      }}
    >
      {!session ? (
        // Non-authenticated stack
        <Stack.Group>
          {console.log("rendering non-authenticated stack")}
          <Stack.Screen name={routes.LANDING} component={LandingScreen} />
          <Stack.Screen name={routes.LOGIN} component={LoginNavigator} />
          <Stack.Screen
            name={routes.SIGNUPUSERNAME}
            component={SignUpUsername}
          />
          <Stack.Screen
            name={routes.SIGNUPFULLNAME}
            component={SignUpFullName}
          />
          <Stack.Screen
            name={routes.SIGNUPIDENTIFIER}
            component={SignUpEmail}
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
            name={routes.SIGNUPCOMPLETE}
            component={SignUpComplete}
          />
        </Stack.Group>
      ) : needsWallet ? (
        // Wallet setup stack
        <Stack.Group>
          {console.log("rendering wallet setup stack")}
          <Stack.Screen
            name={routes.SIGNUPGENERATEWALLET}
            component={SignUpGenerateWallet}
          />
          <Stack.Screen
            name={routes.SIGNUPCOMPLETE}
            component={SignUpComplete}
          />
        </Stack.Group>
      ) : (
        // Authenticated stack
        <Stack.Group>
          {console.log("rendering authenticated stack")}
          <Stack.Screen
            name={routes.ROOT}
            component={RootNavigator}
            options={{ gestureEnabled: false }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
export default AppNavigator;
