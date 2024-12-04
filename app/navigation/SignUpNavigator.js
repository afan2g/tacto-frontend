import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import routes from "./routes";
import {
  SignUpCreate,
  SignUpFullName,
  SignUpPassword,
  SignUpVerify,
  SignUpUsername,
} from "../screens/entry";
import { FormProvider } from "../contexts/FormContext";

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
        <Stack.Screen name={routes.SIGNUPCREATE} component={SignUpCreate} />
        <Stack.Screen name={routes.SIGNUPVERIFY} component={SignUpVerify} />
        <Stack.Screen name={routes.SIGNUPFULLNAME} component={SignUpFullName} />
        <Stack.Screen name={routes.SIGNUPUSERNAME} component={SignUpUsername} />
        <Stack.Screen name={routes.SIGNUPPASSWORD} component={SignUpPassword} />
      </Stack.Navigator>
    </FormProvider>
  );
}

export default SignUpNavigator;
