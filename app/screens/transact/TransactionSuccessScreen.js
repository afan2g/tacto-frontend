import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Screen } from '../../components/primitives';
import { useContext } from 'react';
import { TransactionContext } from '../../contexts/TransactionContext';
function TransactionSuccessScreen({ navigation, route }) {
    const { txHash } = route.params;
    const { transaction } = useContext(TransactionContext);
    return (
        <Screen style={styles.screen}>
            <Text>Transaction Success</Text>
            <Text>Hash: {txHash}</Text>
            <Text>Action: {transaction.action}</Text>
            <Text>Amount: {transaction.amount}</Text>
            <Text>Address: {transaction.recipientAddress}</Text>
            {transaction.recipientUser && <Text>Recipient: {transaction.recipientUser.username}</Text>}
            <Text>Memo: {transaction.memo}</Text>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default TransactionSuccessScreen;