"use server";

import { createAdminClient, createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getURL, getErrorRedirect, getStatusRedirect } from "../helpers";
import { getAuthTypes } from "./settings";
import { useServerTranslation } from "@/i18n/server";
import { getOfficialName } from "@/lib/common";
import { HumanName } from "fhir/r5";
import { v4 as uuidv4 } from "uuid";
import { toPractitioner } from "@/server/api/routers/practitioner";

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(pathName?: string, showError?: boolean) {
  const { t } = await useServerTranslation("auth");
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error && showError) {
    return getErrorRedirect(pathName || "/auth/signin", t("unexpectedError"), t("signout.couldNot"));
  }

  return pathName || "/auth/signin";
}

export async function signInWithEmail(email: string) {
  const { t } = await useServerTranslation("auth");
  const cookieStore = cookies();
  const callbackURL = getURL("/api/auth/callback");

  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect("/auth/email_signin", t("invalidEmail"), t("tryAgain"));
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/email_signin", t("signin.couldNot"), error.message);
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    redirectPath = getStatusRedirect("/auth/email_signin", t("success"), t("signin.checkEmail"), true);
  } else {
    redirectPath = getErrorRedirect("/auth/email_signin", t("unexpectedError"), t("signin.couldNot"));
  }

  return redirectPath;
}

export async function requestPasswordUpdate(email: string) {
  const { t } = await useServerTranslation("auth");
  const callbackURL = getURL("/auth/reset_password");
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect("/auth/forgot_password", t("invalidEmail"), t("tryAgain"));
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/forgot_password", error.message, t("tryAgain"));
  } else if (data) {
    redirectPath = getStatusRedirect("/auth/forgot_password", t("success"), t("updatePassword.checkEmail"), true);
  } else {
    redirectPath = getErrorRedirect(
      "/auth/forgot_password",
      t("unexpectedError"),
      t("updatePassword.couldNotSendEmail")
    );
  }

  return redirectPath;
}

export async function signInWithPassword(email: string, password: string, redirectUrl: string) {
  const { t } = await useServerTranslation("auth");
  const cookieStore = cookies();
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/auth/signin",
      t("signin.failed"),
      error.message === "Invalid login credentials"
        ? t("signin.invalidAccount")
        : error.message.includes("is not valid JSON")
          ? t("serverError")
          : error.message
    );
  } else if (data.user) {
    cookieStore.set("preferredSignInView", "signin", { path: "/" });
    if (redirectUrl) return redirectUrl;
    redirectPath = getStatusRedirect("/", t("signin.success"), t("signin.signedIn"));
  } else {
    redirectPath = getErrorRedirect("/auth/signin", t("unexpectedError"), t("signin.couldNot"));
  }

  return redirectPath;
}

export async function signUp({ email, password, name, role }) {
  const redirectUrl = "/auth/signin";
  const supabase = createAdminClient();
  //insert auth user supabase
  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      name: getOfficialName(name as HumanName[]),
      email
    }
  });
  if (error) throw error;
  //insert table profiles
  const { error: errorProfiles } = await supabase.from("profiles").insert({ id: data.user?.id!, name, email });
  if (errorProfiles) throw errorProfiles;
  //insert table user_roles
  const { error: errorRole } = await supabase
    .from("user_roles")
    .insert({ user_id: data.user?.id!, role: role as any })
    .select("*")
    .single();
  if (errorRole) throw errorRole;
  //create Practitioner
  if (!(name[0].family === "" || name[0].given.length === 0 || name[0].given?.at(0) === "")) {
    const id = uuidv4();
    const { error: errPractitioner } = await supabase
      .from("Practitioner")
      .insert([{ id, ...toPractitioner({ name, accountId: data.user?.id! }) }])
      .select();
    if (errPractitioner) throw errPractitioner;
  }
  return redirectUrl;
}

export async function updatePassword(password: string, passwordConfirm: string) {
  const { t } = await useServerTranslation("auth");
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      "/auth/update_password",
      t("updatePassword.couldNot"),
      t("updatePassword.notMatch")
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/update_password", t("updatePassword.couldNot"), error.message);
  } else if (data.user) {
    redirectPath = getStatusRedirect("/", t("success"), t("updatePassword.updated"));
  } else {
    redirectPath = getErrorRedirect("/auth/update_password", t("unexpectedError"), t("updatePassword.couldNot"));
  }

  return redirectPath;
}

export async function updateEmail(newEmail: string) {
  const { t } = await useServerTranslation("auth");

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect("/account", t("updateEmail.couldNot"), t("invalidEmail"));
  }

  const supabase = createClient();

  const callbackUrl = getURL(getStatusRedirect("/account", t("success"), t("updateEmail.updated")));

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect("/account", t("updateEmail.couldNot"), error.message);
  } else {
    return getStatusRedirect("/account", t("updateEmail.updateEmail"), t("updateEmail.checkEmail"));
  }
}

export async function updateName(fullName: string) {
  const { t } = await useServerTranslation("auth");
  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect("/account", t("updateName.couldNot"), error.message);
  } else if (data.user) {
    return getStatusRedirect("/account", t("success"), t("updateName.updated"));
  } else {
    return getErrorRedirect("/account", t("unexpectedError"), t("updateName.couldNot"));
  }
}
