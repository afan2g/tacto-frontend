async function fetchAccountNonce(address, userJWT) {
    const workerUrl = "https://zksync.tacto.workers.dev";

    const response = await fetch(`${workerUrl}/nonce-by-fetch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userJWT}`
        },
        body: JSON.stringify({
            address: address
        })
    });

    const data = await response.json();
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch account nonce");
    }

    return data;
}

export default fetchAccountNonce;