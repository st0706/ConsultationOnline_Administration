import AuthProvider from "@/components/auth/AuthContext";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { PropsWithChildren } from "react";

export default async function AuthLayout({ children }: PropsWithChildren) {
  const supabase = createClient();
  const user = await getUser(supabase);

  return <AuthProvider authUser={user}>{children}</AuthProvider>;
}
