import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import routes from "./routes";
import AppTabNavigator from "./AppTabNavigator";
import UserProfileScreen from "../screens/UserProfileScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import SelectUserScreen from "../screens/transact/SelectUserScreen";
import ConfirmTransactionScreen from "../screens/transact/ConfirmTransactionScreen";
import TransactionProvider from "../contexts/TransactionContext";
const Stack = createNativeStackNavigator();

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

function RootNavigator(props) {
  return (
    <TransactionProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Group>
          <Stack.Screen name={routes.APPTABS} component={AppTabNavigator} />
          <Stack.Screen
            name={routes.TRANSACTSELECTUSER}
            component={SelectUserScreen}
          />
          <Stack.Screen
            name={routes.TRANSACTCONFIRM}
            component={ConfirmTransactionScreen}
          />
        </Stack.Group>
        <Stack.Group screenOptions={{}}>
          <Stack.Screen
            name={routes.USERPROFILE}
            component={UserProfileScreen}
          />
          <Stack.Screen
            name={routes.TRANSACTIONDETAIL}
            component={TransactionDetailScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </TransactionProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default RootNavigator;
