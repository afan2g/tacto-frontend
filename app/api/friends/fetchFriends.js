import { supabase } from "../../../lib/supabase";

async function fetchFriends(user_id) {
  const { data, error } = await supabase
    .from("friends")
    .select("*")
    .or(`requester_id.eq.${user_id},requestee_id.eq.${user_id}`)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching friends:", error);
    throw error;
  }
  return data;
}
export default fetchFriends;
