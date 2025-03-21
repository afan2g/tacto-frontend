async function fulfillPaymentRequest(paymentRequestId, txRequest, signedTx, userJWT) {
    const workerUrl = "https://zksync.tacto.workers.dev";
    console.log("Fulfilling payment request:", paymentRequestId, txRequest, signedTx, userJWT);
    try {
        const response = await fetch(`${workerUrl}/transactions/request/fulfill-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                requestId: paymentRequestId,
                txRequest,
                signedTransaction: signedTx
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
        console.error("Error in fulfillPaymentRequest:", error);
        throw error;
    }
}

export default fulfillPaymentRequest;