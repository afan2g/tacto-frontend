async function sendFriendRequest(friendId, userJWT) {
  console.log("Send pressed");
  const workerUrl = "https://zksync.tacto.workers.dev";

  try {
    const response = await fetch(`${workerUrl}/friends/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJWT}`,
      },
      body: JSON.stringify({
        requestee: friendId,
      }),
    });

    const data = await response.json();

    if (!response.ok || (response.status >= 400 && response.status < 500)) {
      console.error("Transaction send failed:", data);
      throw new Error(data.error || "Transaction send failed");
    } else if (response.status >= 500) {
      console.error("Server error:", data);
      throw new Error("Server error");
    }

    return data;
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    throw error;
  }
}

export default sendFriendRequest;
