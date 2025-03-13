import { ethers } from "ethers";
const fetchTransactionRequest = async (from, to, amount, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev/";

    const response = await fetch(workerUrl, {
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
    return JSON.parse(data);
}

export default fetchTransactionRequest;