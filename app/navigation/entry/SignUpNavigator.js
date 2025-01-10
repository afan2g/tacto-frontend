import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import routes from "../routes";
import {
  SignUpComplete,
  SignUpFullName,
  SignUpPassword,
  SignUpVerify,
  SignUpUsername,
  SignUpEmail,
} from "../../screens/auth";
import { FormProvider } from "../../contexts/FormContext";
import SignUpGenerateWallet from "../../screens/auth/SignUpGenerateWallet";

const Stack = createNativeStackNavigator();

function SignUpNavigator() {
  return (
    <FormProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "none",
          animationDuration: 0,
        }}
      >
        <Stack.Screen name={routes.SIGNUPUSERNAME} component={SignUpUsername} />
        <Stack.Screen name={routes.SIGNUPFULLNAME} component={SignUpFullName} />
        <Stack.Screen name={routes.SIGNUPIDENTIFIER} component={SignUpEmail} />
        <Stack.Screen name={routes.SIGNUPPASSWORD} component={SignUpPassword} />
        <Stack.Screen name={routes.SIGNUPVERIFY} component={SignUpVerify} />
        <Stack.Screen
          name={routes.SIGNUPGENERATEWALLET}
          component={SignUpGenerateWallet}
        />
        <Stack.Screen name={routes.SIGNUPCOMPLETE} component={SignUpComplete} />
      </Stack.Navigator>
    </FormProvider>
  );
}

export default SignUpNavigator;
