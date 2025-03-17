import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import routes from './routes';
import TransactionProvider from '../contexts/TransactionContext';
import { ConfirmTransactionScreen, TransactScreen, SelectUserScreen, TransactionSuccessScreen } from '../screens/transact';
const Stack = createNativeStackNavigator();
function TransactNavigator(props) {
    return (
        <TransactionProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={routes.TRANSACTHOME} component={TransactScreen} />
                <Stack.Screen name={routes.TRANSACTSELECTUSER} component={SelectUserScreen} />
                <Stack.Screen name={routes.TRANSACTCONFIRM} component={ConfirmTransactionScreen} />
                <Stack.Screen name={routes.TRANSACTSUCCESS} component={TransactionSuccessScreen} />
            </Stack.Navigator>
        </TransactionProvider>
    );
}

const styles = StyleSheet.create({
    container: {}
});

export default TransactNavigator;