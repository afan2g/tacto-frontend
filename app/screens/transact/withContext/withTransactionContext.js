import React, { useContext } from 'react';
import { TransactionContext } from '../../../contexts/TransactionContext';

export const withTransactionContext = (Component, contextValue) => {
    return (props) => {
        return (
            <TransactionContext.Provider value={contextValue || useContext(TransactionContext)}>
                <Component {...props} />
            </TransactionContext.Provider>
        );
    };
};