import { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import { jwtDecode } from "jwt-decode";
export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const session = (await supabase.auth.refreshSession()).data.session;
  if (session && user) {
    const access_token = jwtDecode(session?.access_token);
    return { user, session: { ...session, access_token: access_token } };
  } else return { user: null, session: null };
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase.from("users").select("*").single();
  return userDetails;
});
