import { supabase } from "../../../lib/supabase";

async function fetchFriendData(currentUserId, targetUserId) {
  /* 
  Fetch:
  -friend status between a and b
  -count of friends of b
  -count of friends where both a and b are friends with c
  */
  const { data, error } = await supabase.rpc("get_friend_data", {
    current_user_id: currentUserId,
    target_user_id: targetUserId,
  });
  if (error) {
    console.error("Error fetching friend data:", error);
    return {
      status: "none",
      friendCount: 0,
      mutualFriendCount: 0,
    };
  }
  if (data.length === 0) {
    return {
      status: "none",
      friendCount: 0,
      mutualFriendCount: 0,
    };
  }
  console.log("Friend data fetched:", data);
  return data;
}

export default fetchFriendData;
