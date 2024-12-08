import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { View, StyleSheet } from "react-native";
import TransactScreen from "../screens/transact/TransactScreen";
import routes from "./routes";
import SelectUserScreen from "../screens/transact/SelectUserScreen";
import ConfirmTransactionScreen from "../screens/transact/ConfirmTransactionScreen";
import TransactionProvider from "../contexts/TransactionContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const Stack = createNativeStackNavigator();
function TransactNavigator({ navigation }) {
  return (
    <TransactionProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={routes.TRANSACTHOME} component={TransactScreen} />
        <Stack.Screen
          name={routes.TRANSACTSELECTUSER}
          component={SelectUserScreen}
        />
        <Stack.Screen
          name={routes.TRANSACTCONFIRM}
          component={ConfirmTransactionScreen}
        />
      </Stack.Navigator>
    </TransactionProvider>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default TransactNavigator;
