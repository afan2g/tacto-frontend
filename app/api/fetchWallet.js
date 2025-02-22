import { supabase } from "../../lib/supabase";

const fetchWallet = async (userId) => {
  const { data, error } = await supabase
    .from("wallets")
    .select("*")
    .eq("owner_id", userId)
    .single();
  if (error) throw error;
  return data;
};
export default fetchWallet;
