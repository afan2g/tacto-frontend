import { ethers } from "ethers";
const fetchTransactionRequest = async (from, to, amount, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev";
    try {
        const response = await fetch(`${workerUrl}/transactions/send/prepare-usdc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                action: "getCompleteTransferTx",
                txRequest: {
                    from: from,
                    to: to, // Recipient's wallet address
                    value: ethers.parseUnits(amount.toString(), 6).toString(),
                }
            })
        });
        const data = await response.json();

        if (!response.ok || (response.status >= 400 && response.status < 500)) {
            const data = await response.json();
            throw new Error(data.error || "Failed to fetch transaction request");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }

        console.log("Transaction Request:", data);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error in fetchTransactionRequest:", error);
        throw error;
    }
}

export default fetchTransactionRequest;