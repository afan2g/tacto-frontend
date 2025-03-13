import React, { createContext, useContext, useState } from "react";

export const TransactionContext = createContext();
export default function TransactionProvider({ children }) {
  const initialState = {
    action: null,
    amount: null,
    recipientUser: null,
    recipientAddress: null,
    memo: null,
    methodId: null,
  };

  const [transaction, setTransaction] = useState(initialState);

  const clearTransaction = () => {
    setTransaction({
      action: null,
      amount: null,
      recipientUser: null,
      recipientAddress: null,
      memo: null,
      methodId: null,
    });

  };
  return (
    <TransactionContext.Provider value={{ transaction, setTransaction, clearTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}