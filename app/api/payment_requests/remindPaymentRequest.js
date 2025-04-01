async function remindPaymentRequest(paymentRequestId, userJWT) {
    const workerUrl = "https://zksync.tacto.workers.dev";

    try {
        const response = await fetch(`${workerUrl}/transactions/request/remind`, {
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
            console.error("Payment reminder failed:", data);
            throw new Error(data.error || "Payment reminder failed");
        } else if (response.status >= 500) {
            console.error("Server error:", data);
            throw new Error("Server error");
        }
        console.log("Payment Reminder:", data);
    } catch (error) {
        console.error("Error in remindPaymentRequest:", error);
        throw error;
    }
}

export default remindPaymentRequest;