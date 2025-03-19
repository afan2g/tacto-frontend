import { ethers } from "ethers";
const fetchTransactionRequest = async (from, to, amount, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev";

    const response = await fetch(`${workerUrl}/transactions/prepare`, {
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

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch transaction request");
    }
    console.log("Transaction Request:", data);
    return JSON.parse(data);
}

export default fetchTransactionRequest;