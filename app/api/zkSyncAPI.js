import { ethers } from "ethers";
import { Wallet } from "zksync-ethers";

// ZKSync Worker API functions
export const zkSyncAPI = {
    // Worker URL - replace with your deployed worker URL
    workerUrl: "https://zksync.tacto.workers.dev",

    // Helper function to make authenticated requests to the worker
    async callWorker(action, params = {}) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error("Error getting session data:", sessionError);
            throw new Error("Authentication failed: " + sessionError.message);
        }

        const userJWT = sessionData.session?.access_token;
        if (!userJWT) {
            throw new Error("No active session found");
        }

        try {
            const response = await fetch(this.workerUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userJWT}`
                },
                body: JSON.stringify({
                    action,
                    ...params
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `API error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Error calling ${action}:`, error);
            throw error;
        }
    },

    // Get network information
    async getNetwork() {
        return this.callWorker("getNetwork");
    },

    // Get current block number
    async getBlockNumber() {
        return this.callWorker("getBlockNumber");
    },

    // Get all balances for an address
    async getBalance(address) {
        return this.callWorker("getBalance", { address });
    },

    // Get USDC balance for an address
    async getUSDCBalance(address) {
        return this.callWorker("getUSDCBalance", { address });
    },

    // Prepare a USDC transfer transaction
    async getCompleteTransferTx(from, to, value) {
        // Convert value to proper format (with 6 decimal places for USDC)
        const valueInSmallestUnit = ethers.parseUnits(value.toString(), 6).toString();

        const txRequest = {
            from,
            to,
            value: valueInSmallestUnit
        };

        return this.callWorker("getCompleteTransferTx", { txRequest });
    },

    // Broadcast a signed transaction
    async broadcastTxUSDC(signedTransaction, txRequest, toUserId, methodId = "transfer", requestId = null) {
        // Generate a unique request ID if not provided
        if (!requestId) {
            requestId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        }

        const txInfo = {
            toUserId,
            methodId,
            requestId
        };

        return this.callWorker("broadcastTxUSDC", {
            signedTransaction,
            txRequest,
            txInfo
        });
    },

    // Test broadcast function (for debugging)
    async broadcastTxTest(signedTransaction) {
        return this.callWorker("broadcastTxTest", { signedTransaction });
    }
};