import { supabase } from "../../lib/supabase";

const fetchProfiles = async (user_id) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user_id);
  if (error) throw error;
  return data;
};

export default fetchProfiles;
