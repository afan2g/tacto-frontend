import { supabase } from "../../../lib/supabase";
async function fetchFriendRequests(user_id) {
  console.log(`Fetching friend requests for user ID: ${user_id}`);
  const response = await supabase
    .from("friends")
    .select(
      `
          *,
          requester:profiles!requester_id(id, full_name, username, avatar_url)
        `
    )
    .eq("requestee_id", user_id)
    .eq("status", "pending")
    .order("updated_at", { ascending: false });

  return response;
}

export default fetchFriendRequests;
