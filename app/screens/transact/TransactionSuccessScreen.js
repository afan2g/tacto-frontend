import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { Screen } from '../../components/primitives';
import { useContext } from 'react';
import { TransactionContext } from '../../contexts/TransactionContext';
import { useKeypadInput } from '../../hooks/useKeypadInput';

function TransactionSuccessScreen({ navigation, route }) {
    const { txHash } = route.params;
    const { transaction, setTransaction, clearTransaction } = useContext(TransactionContext);
    // Don't clear on focus - this is causing the error
    // We'll clear on navigation instead

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.popToTop();
                // Clear after navigation starts
                setTimeout(clearTransaction, 0);
                return true;
            }
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    )

    const handleClearTransaction = () => {
        navigation.popToTop();
        // Clear after navigation starts
        setTimeout(clearTransaction, 0);
    }

    return (
        <Screen style={styles.screen}>
            <Text>Transaction Success</Text>
            <Text>Hash: {txHash}</Text>
            {transaction && (
                <>
                    <Text>Action: {transaction.action}</Text>
                    <Text>Amount: {transaction.amount}</Text>
                    <Text>Address: {transaction.recipientAddress}</Text>
                    {transaction.recipientUser && <Text>Recipient: {transaction.recipientUser.username}</Text>}
                    <Text>Memo: {transaction.memo}</Text>
                </>
            )}
            <View style={styles.buttonContainer}>
                <Button title="Done" onPress={handleClearTransaction} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        marginTop: 20,
    }
});

export default TransactionSuccessScreen;