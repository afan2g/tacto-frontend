import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import constants from "expo-constants";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import routes from "./routes";
import PeopleSearchScreen from "../screens/people/PeopleSearchScreen";
import PeopleFriendsScreen from "../screens/people/PeopleFriendsScreen";
import PeopleSplitScreen from "../screens/people/PeopleSplitScreen";

const Tab = createMaterialTopTabNavigator();
function PeopleTopTabNavigator(props) {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          elevation: 5,
          paddingTop: insets.top,
        },
        tabBarPressColor: "none",
      }}
    >
      <Tab.Screen
        name={routes.PEOPLEHOME}
        component={PeopleSearchScreen}
        options={{
          tabBarLabel: "Search",
        }}
      />
      <Tab.Screen
        name={routes.PEOPLEFRIENDS}
        component={PeopleFriendsScreen}
        options={{
          tabBarLabel: "Friends",
        }}
      />
      <Tab.Screen
        name={routes.PEOPLESPLIT}
        component={PeopleSplitScreen}
        options={{
          tabBarLabel: "Split",
        }}
      />
    </Tab.Navigator>
  );
}

export default PeopleTopTabNavigator;
