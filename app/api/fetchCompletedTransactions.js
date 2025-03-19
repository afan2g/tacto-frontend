import { supabase } from "../../lib/supabase";

async function fetchCompletedTransactions(user_id) {
    const response = await supabase
        .from("transactions")
        .select(
            `
                *,
                from_user:profiles!from_user_id(id, full_name, username),
                to_user:profiles!to_user_id(id, full_name, username)
              `, { count: "exact" }
        )
        .or(`from_user_id.eq.${user_id},to_user_id.eq.${user_id}`)
        .eq("status", "confirmed")
        .gt("amount", 0)
        .order("updated_at", { ascending: false });

    return response;
}

export default fetchCompletedTransactions;