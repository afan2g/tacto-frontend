// AppNavigator.js
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import RootNavigator from "./RootNavigator";
import AuthNavigator from "./entry/AuthNavigator";
import routes from "./routes";

const Stack = createNativeStackNavigator();

function AppNavigator({ session }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "modal",
      }}
    >
      {session?.user ? (
        // Authenticated stack
        <Stack.Group>
          <Stack.Screen name={routes.ROOT} component={RootNavigator} />
          {/* Add any global modal screens here */}
          {/* <Stack.Screen name="GlobalSettings" component={GlobalSettingsScreen} /> */}
          {/* <Stack.Screen name="AppModal" component={AppModalScreen} /> */}
        </Stack.Group>
      ) : (
        // Non-authenticated stack
        <Stack.Group>
          <Stack.Screen name={routes.AUTH} component={AuthNavigator} />
          {/* Add any auth-specific modal screens here */}
          {/* <Stack.Screen name="TermsModal" component={TermsModalScreen} /> */}
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
