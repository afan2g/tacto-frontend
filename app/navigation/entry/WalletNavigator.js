// WalletNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SignUpGenerateWallet from "../../screens/auth/SignUpGenerateWallet";
import SignUpComplete from "../../screens/auth/SignUpComplete";

import routes from "../routes";
const Stack = createNativeStackNavigator();

function WalletNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={routes.SIGNUPGENERATEWALLET}
        component={SignUpGenerateWallet}
      />
      <Stack.Screen name={routes.SIGNUPCOMPLETE} component={SignUpComplete} />
    </Stack.Navigator>
  );
}

export default WalletNavigator;
