async function acceptFriendRequest(friendRequestId, userJWT) {
  console.log("Accept pressed, requestId:", friendRequestId);
  const workerUrl = "https://zksync.tacto.workers.dev";

  try {
    const response = await fetch(`${workerUrl}/friends/accept`, {
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
      console.error("Friend request accept failed:", data);
      throw new Error(data.error || "Friend request accept failed");
    } else if (response.status >= 500) {
      console.error("Server error:", data);
      throw new Error("Server error");
    }

    return data;
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    throw error;
  }
}

export default acceptFriendRequest;
