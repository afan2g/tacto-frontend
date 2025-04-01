const createTransactionRequest = async (transaction, userJWT) => {
    const workerUrl = "https://zksync.tacto.workers.dev";
    console.log("Creating transaction request:", transaction);
    try {
        const response = await fetch(`${workerUrl}/transactions/request/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                paymentRequest: transaction
            })
        });

        const data = await response.json();
        if (!response.ok || (response.status >= 400 && response.status < 500)) {
            console.error("Transaction request failed:", data);
            throw new Error(data.error || "Transaction request failed");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }
        console.log("Transaction Request:", data);
    } catch (error) {
        console.error("Error in createTransactionRequest:", error);
        throw error;
    }
}

export default createTransactionRequest;