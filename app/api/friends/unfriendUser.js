async function unfriendUser(friendId, userJWT) {
  console.log("Unfriend pressed");
  const workerUrl = "https://zksync.tacto.workers.dev";

  try {
    const response = await fetch(`${workerUrl}/friends/unfriend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJWT}`,
      },
      body: JSON.stringify({
        friendId: friendId,
      }),
    });

    const data = await response.json();

    if (!response.ok || (response.status >= 400 && response.status < 500)) {
      console.error("Unfriend failed:", data);
      throw new Error(data.error || "Unfriend failed");
    } else if (response.status >= 500) {
      console.error("Server error:", data);
      throw new Error("Server error");
    }

    return data;
  } catch (error) {
    console.error("Error in unfriendUser:", error);
    throw error;
  }
}
export default unfriendUser;
