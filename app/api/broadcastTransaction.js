const broadcastTransaction = async (signedTx, txRequest, txInfo, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev/";

    try {
        const response = await fetch(workerUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                action: "broadcastTxUSDC",
                signedTransaction: signedTx,
                txRequest: txRequest,
                txInfo: txInfo
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Transaction broadcast failed:", data);
            throw new Error(data.error || "Transaction broadcast failed");
        }

        return data;
    } catch (error) {
        console.error("Error in broadcastTransaction:", error);
        throw error;
    }
}

export default broadcastTransaction;