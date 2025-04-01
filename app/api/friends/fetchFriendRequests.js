async function fetchFriendRequests(userJWT) {
  const workerUrl = "https://zksync.tacto.workers.dev";
  try {
    const { data: requests, error: fetchError } = await supabase
      .from("friends")
      .select("*")
      .eq("requestee_id", user.id)
      .eq("status", "pending")
      .order("updated_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching friend requests:", fetchError);
      throw fetchError;
    }
    if (!requests || requests.length === 0) {
      return []; // No friend requests found
    }
  } catch (error) {
    console.error("Error in fetchFriendRequests:", error);
    throw error;
  }
}

export default fetchFriendRequests;
