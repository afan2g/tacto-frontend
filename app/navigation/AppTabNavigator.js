import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Dimensions, Easing, StyleSheet, View } from "react-native";
import routes from "./routes";
import HomeNavigator from "./HomeNavigator";
import {
  ArrowDownUp,
  House,
  ReceiptText,
  UserRound,
  UsersRound,
} from "lucide-react-native";
import { ActivityIndicator } from "react-native";
import PeopleTopTabNavigator from "../navigation/PeopleTopTabNavigator";
import ActivityScreen from "../screens/ActivityScreen";
import AccountNavigator from "./AccountNavigator";
import TransactScreen from "../screens/transact/TransactScreen";
import { useData } from "../contexts";
const Tab = createBottomTabNavigator();
const config = {
  animation: "spring", // or 'timing'
  config: {
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  },
};

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);
function AppTabNavigator(props) {
  const { isLoadingData } = useData();
  if (isLoadingData) {
    return <LoadingScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        popToTopOnBlur: true,
        animation: "none",
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
            lazy: false,
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
            unmountOnBlur: true,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppTabNavigator;
