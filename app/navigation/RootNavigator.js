import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import routes from "./routes";
import AppTabNavigator from "./AppTabNavigator";
import UserProfileScreen from "../screens/UserProfileScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import SelectUserScreen from "../screens/transact/SelectUserScreen";
import ConfirmTransactionScreen from "../screens/transact/ConfirmTransactionScreen";
import TransactionProvider from "../contexts/TransactionContext";
import TestingScreen from "../screens/TestingScreen";
import NotificationsTest from "../testing/NotificationsTest";
import TransactionSuccessScreen from "../screens/transact/TransactionSuccessScreen";
import { DataProvider } from "../contexts";
import TransactNavigator from "./TransactNavigator";
import { TransactScreen } from "../screens/transact";
import QRTestingScreen from "../screens/qrTestingScreen";
import ModalTestingScreen from "../screens/ModalTestingScreen";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
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

function RootNavigator() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["right", "left"]}>
        <DataProvider>
          <TransactionProvider>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: "fade_from_bottom",
              }}
            >
              <Stack.Group>
                <Stack.Screen
                  name={routes.APPTABS}
                  component={AppTabNavigator}
                />
                <Stack.Screen
                  name={routes.TRANSACTSELECTUSER}
                  component={SelectUserScreen}
                />
                <Stack.Screen
                  name={routes.TRANSACTCONFIRM}
                  component={ConfirmTransactionScreen}
                />
                <Stack.Screen
                  name={routes.TRANSACTSUCCESS}
                  component={TransactionSuccessScreen}
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
              <Stack.Screen name={routes.TESTING} component={TestingScreen} />
              <Stack.Screen
                name={routes.QRTESTING}
                component={QRTestingScreen}
              />
              <Stack.Screen
                name={routes.TESTNOTIFICATIONS}
                component={NotificationsTest}
              />
              <Stack.Screen
                name={routes.TESTBOTTOMSHEET}
                component={ModalTestingScreen}
              />
            </Stack.Navigator>
          </TransactionProvider>
        </DataProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default RootNavigator;
