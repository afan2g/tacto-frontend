const broadcastTransaction = async (signedTx, txRequest, txInfo, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev";

    try {
        const response = await fetch(`${workerUrl}/transactions/send/broadcast-usdc`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                signedTransaction: signedTx,
                txRequest: txRequest,
                txInfo: txInfo
            })
        });

        const data = await response.json();

        if (!response.ok || (response.status >= 400 && response.status < 500)) {
            console.error("Transaction broadcast failed:", data);
            throw new Error(data.error || "Transaction broadcast failed");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }

        return data;
    } catch (error) {
        console.error("Error in broadcastTransaction:", error);
        throw error;
    }
}

export default broadcastTransaction;