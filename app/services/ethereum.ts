import { supabase } from "../../lib/supabase";

// src/services/ethereum.ts
interface EthereumService {
  getBalance: (address: string) => Promise<string>;
  getTransaction: (txHash: string) => Promise<any>;
  getBlockNumber: () => Promise<number>;
  getFeeData: () => Promise<any>;
}

export const createEthereumService = (supabaseClient: any): EthereumService => {
  const callEdgeFunction = async (action: string, params: any = {}) => {
    const { data, error } = await supabaseClient.functions.invoke("ethereum", {
      body: { action, ...params },
    });
    if (error) {
      alert(error.message || "An error occurred");
      throw error; // Ensure the error is propagated to the caller
    }
    return data; // Explicitly return the data
  };

  return {
    getBalance: async (address: string) => {
      const data = await callEdgeFunction("getBalance", { address });
      return data.balance; // Access the balance property from the returned data
    },

    getTransaction: async (txHash: string) => {
      const data = await callEdgeFunction("getTransaction", { txHash });
      return data.transaction; // Access the transaction property from the returned data
    },

    getBlockNumber: async () => {
      const data = await callEdgeFunction("getBlockNumber");
      return data.blockNumber; // Access the blockNumber property from the returned data
    },

    getFeeData: async () => {
      const data = await callEdgeFunction("getFeeData");
      return data; // Return all fee data
    },
  };
};
