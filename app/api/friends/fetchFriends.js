import { supabase } from "../../../lib/supabase";

async function fetchFriends() {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(
      `requester_id.eq.${user.data.user.id},requestee_id.eq.${user.data.user.id}`
    )
    .eq("status", "accepted")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
  return data;
}
export default fetchFriends;
