async function declineFriendRequest(friendRequestId, userJWT) {
  console.log("Decline pressed");
  const workerUrl = "https://zksync.tacto.workers.dev";

  try {
    const response = await fetch(`${workerUrl}/friends/decline`, {
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
      console.error("Friend request decline failed:", data);
      throw new Error(data.error || "Friend request decline failed");
    } else if (response.status >= 500) {
      console.error("Server error:", data);
      throw new Error("Server error");
    }

    return data;
  } catch (error) {
    console.error("Error in declineFriendRequest:", error);
    throw error;
  }
}
export default declineFriendRequest;
