import React, { createContext, useContext, useState } from "react";

export const TransactionContext = createContext();

export default function TransactionProvider({ children }) {
  const [transaction, setTransaction] = useState({
    action: null,
    amount: null,
    otherUser: null,
    otherUserWallet: null,
    memo: null,
  });
  return (
    <TransactionContext.Provider value={{ transaction, setTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}
