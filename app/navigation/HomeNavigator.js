import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import routes from "./routes";
import HomeScreen from "../screens/HomeScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";

/*
component for home screen navigation.
Shows a  list of cards of transactions
Sort by button: Votes, comments, newest, amount
Filter by: Friends, local, global
Transactions from: 24hr, 1week, 1 month, 1 year, all

-search for friends
-tapping on card shows Transaction and its related score and comments

*/

const Stack = createNativeStackNavigator();
function HomeNavigator({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.HOME} component={HomeScreen} />
      <Stack.Screen
        name={routes.TRANSACTIONDETAIL}
        component={TransactionDetailScreen}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default HomeNavigator;
