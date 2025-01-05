import { SignOut } from "@/utils/auth-helpers/server";
import { getUser } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const user = await getUser(supabase);

  if (user) {
    return redirect("/consultation/appointment");
  }

  // If user doesn't exist, signout & redirect to the signin page
  const redirectPath = await SignOut();
  return redirect(redirectPath);
}
