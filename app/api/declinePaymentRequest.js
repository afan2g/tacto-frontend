async function declinePaymentRequest(paymentRequestId, userJWT) {
    console.log("Decline pressed");
    const workerUrl = "https://zksync.tacto.workers.dev";

    try {
        const response = await fetch(`${workerUrl}/transactions/request/decline-request`, {
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
            console.error("Transaction broadcast failed:", data);
            throw new Error(data.error || "Transaction broadcast failed");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }

        return data;
    } catch (error) {
        console.error("Error in declinePaymentRequest:", error);
        throw error;
    }
}

export default declinePaymentRequest;