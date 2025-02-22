import { supabase } from "../../lib/supabase";

const fetchProfiles = async () => {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data;
};

export default fetchProfiles;
