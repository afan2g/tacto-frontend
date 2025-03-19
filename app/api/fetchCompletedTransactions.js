import { supabase } from "../../lib/supabase";

async function fetchCompletedTransactions(user_id, { page = 0, pageSize = 10 } = {}) {
    console.log(`Fetching completed transactions for user ID: ${user_id}, page: ${page}, pageSize: ${pageSize}`);

    const from = page * pageSize;
    const to = from + pageSize - 1;
    const response = await supabase
        .from("transactions")
        .select(
            `
                *,
                from_user:profiles!from_user_id(id, full_name, username, avatar_url),
                to_user:profiles!to_user_id(id, full_name, username, avatar_url)
              `, { count: "exact" }
        )
        .or(`from_user_id.eq.${user_id},to_user_id.eq.${user_id}`)
        .eq("status", "confirmed")
        .gt("amount", 0)
        .order("updated_at", { ascending: false })
        .range(from, to);

    return response;
}

export default fetchCompletedTransactions;