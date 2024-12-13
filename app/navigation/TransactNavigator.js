import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import TransactScreen from "../screens/transact/TransactScreen";
import routes from "./routes";
import SelectUserScreen from "../screens/transact/SelectUserScreen";
import ConfirmTransactionScreen from "../screens/transact/ConfirmTransactionScreen";
import TransactionProvider from "../contexts/TransactionContext";
import UserProfileScreen from "../screens/UserProfileScreen";
const Stack = createNativeStackNavigator();
function TransactNavigator({ navigation }) {
  return (
    <TransactionProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name={routes.TRANSACTHOME} component={TransactScreen} />
          <Stack.Screen
            name={routes.TRANSACTSELECTUSER}
            component={SelectUserScreen}
          />
          <Stack.Screen
            name={routes.TRANSACTCONFIRM}
            component={ConfirmTransactionScreen}
          />
        </Stack.Group>
        {/* <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name={routes.USERPROFILE}
            component={UserProfileScreen}
          />
        </Stack.Group> */}
      </Stack.Navigator>
    </TransactionProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default TransactNavigator;
