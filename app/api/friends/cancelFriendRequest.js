async function cancelFriendRequest(friendRequestId, userJWT) {
  console.log("Cancel pressed");
  const workerUrl = "https://zksync.tacto.workers.dev";

  try {
    const response = await fetch(`${workerUrl}/friends/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJWT}`,
      },
      body: JSON.stringify({
        requestId: friendRequestId,
      }),
    });

    const data = await response.json();

    if (!response.ok || (response.status >= 400 && response.status < 500)) {
      console.error("Friend request cancel failed:", data);
      throw new Error(data.error || "Friend request cancel failed");
    } else if (response.status >= 500) {
      console.error("Server error:", data);
      throw new Error("Server error");
    }

    return data;
  } catch (error) {
    console.error("Error in cancelFriendRequest:", error);
    throw error;
  }
}

export default cancelFriendRequest;
