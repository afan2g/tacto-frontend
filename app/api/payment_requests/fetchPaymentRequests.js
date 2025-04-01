import { supabase } from "../../../lib/supabase";

async function fetchPaymentRequests(user_id) {
  console.log(`Fetching pending transactions for user ID: ${user_id}`);
  const response = await supabase
    .from("payment_requests")
    .select(
      `
        id,
        amount,
        status,
        created_at,
        message,
        last_reminder_sent_at,
        requester:profiles!requester_id (
          id,
          full_name,
          username,
          avatar_url,
          wallets (
            id,
            address,
            is_primary
          )
        ),
        requestee:profiles!requestee_id (
          id,
          full_name,
          username,
          avatar_url,
          wallets (
            id,
            address,
            is_primary
          )
        )
      `,
      { count: "exact" }
    )
    .or(`requester_id.eq.${user_id},requestee_id.eq.${user_id}`)
    .eq("status", "pending")
    .gt("amount", 0)
    .order("created_at", { ascending: false });

  return response;
}

export default fetchPaymentRequests;
