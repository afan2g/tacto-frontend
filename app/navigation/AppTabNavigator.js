import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import routes from "./routes";
import TransactScreen from "../screens/transact/TransactScreen";
import AccountScreen from "../screens/AccountScreen";
import HomeNavigator from "./HomeNavigator";
import { ArrowDownUp, House, UserRound } from "lucide-react-native";
import TransactNavigator from "./TransactNavigator";

const Tab = createBottomTabNavigator();
function AppTabNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tab.Screen
        name={routes.HOME}
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <House color={color} size={size} />;
          },
        }}
      />
      <Tab.Screen
        name={routes.TRANSACTHOME}
        component={TransactNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <ArrowDownUp color={color} size={size} />;
          },
          tabBarLabel: "Send and Receive",
        }}
      />
      <Tab.Screen
        name={routes.ACCOUNT}
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <UserRound color={color} size={size} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default AppTabNavigator;
