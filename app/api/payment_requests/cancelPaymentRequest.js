async function cancelPaymentRequest(paymentRequestId, userJWT) {
    console.log("Cancel pressed");
    const workerUrl = "https://zksync.tacto.workers.dev";

    try {
        const response = await fetch(`${workerUrl}/transactions/request/cancel`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userJWT}`
            },
            body: JSON.stringify({
                requestId: paymentRequestId
            })
        });

        const data = await response.json();

        if (!response.ok || (response.status >= 400 && response.status < 500)) {
            console.error("Transaction cancel failed:", data);
            throw new Error(data.error || "Transaction cancel failed");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }

        return data;
    } catch (error) {
        console.error("Error in cancelPaymentRequest:", error);
        throw error;
    }
}

export default cancelPaymentRequest;