import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet } from "react-native";
import routes from "./routes";
import AccountScreen from "../screens/AccountScreen";
import HomeNavigator from "./HomeNavigator";
import {
  ArrowDownUp,
  House,
  ReceiptText,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import TransactNavigator from "./TransactNavigator";
import PeopleTopTabNavigator from "../navigation/PeopleTopTabNavigator";
import ActivityScreen from "../screens/ActivityScreen";

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
        name={routes.ACTIVITY}
        component={ActivityScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <ReceiptText color={color} size={size} />;
          },
          tabBarLabel: "Activity",
        }}
      />
      <Tab.Screen
        name={routes.TRANSACTHOME}
        component={TransactNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <ArrowDownUp color={color} size={size} />;
          },
          tabBarLabel: "T",
        }}
      />
      <Tab.Screen
        name={routes.PEOPLEHOME}
        component={PeopleTopTabNavigator}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <UsersRound color={color} size={size} />;
          },
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
