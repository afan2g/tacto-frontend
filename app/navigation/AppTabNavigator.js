import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Easing, StyleSheet } from "react-native";
import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import {
  ArrowDownUp,
  House,
  ReceiptText,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import PeopleTopTabNavigator from "../navigation/PeopleTopTabNavigator";
import ActivityScreen from "../screens/ActivityScreen";
import AccountNavigator from "./AccountNavigator";
import TransactScreen from "../screens/transact/TransactScreen";
const Tab = createBottomTabNavigator();
const config = {
  animation: "spring", // or 'timing'
  config: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  },
};

function AppTabNavigator(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        popToTopOnBlur: true,
      }}
    >
      <Tab.Group>
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
          component={TransactScreen}
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
          component={AccountNavigator}
          options={{
            tabBarIcon: ({ color, size }) => {
              return <UserRound color={color} size={size} />;
            },
          }}
        />
      </Tab.Group>
      {/* <Tab.Group
        screenOptions={{
          presentation: "modal",
          animation: "shift",
        }}
      >
        <Tab.Screen
          name={routes.USERPROFILE}
          component={UserProfileScreen}
          options={{ headerShown: false }}
        />
      </Tab.Group> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default AppTabNavigator;
