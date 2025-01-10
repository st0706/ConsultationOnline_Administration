import { env } from "@/env";
import { notifications } from "@mantine/notifications";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (env.NEXT_PUBLIC_VERCEL_URL) return env.NEXT_PUBLIC_VERCEL_URL;
  if (env.vercelURL) return env.vercelURL;
  if (env.appUrl) return env.appUrl;
  return "http://localhost:3001";
}

export function getErrorResponse(status: number = 500, message: string, errors: ZodError | null = null) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message,
      errors: errors ? errors.flatten() : null
    }),
    {
      status,
      headers: { "Content-Type": "application/json" }
    }
  );
}

export function handleApiError(error: Error): void {
  try {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
    } catch (parseError) {
      // Treat error.message as a plain error message
      // console.log("Error message:", error.message);
      notifications.show({
        color: "red",
        title: "Error",
        message: error.message,
        withBorder: true,
        autoClose: 12000
      });
      return;
    }

    if (typeof errorData === "object" && errorData !== null && "fieldErrors" in errorData) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors).forEach((fieldName) => {
        const validationMessages = fieldErrors[fieldName];
        if (validationMessages && validationMessages.length > 0) {
          const firstValidationMessage = validationMessages[0];
          notifications.show({
            color: "red",
            title: "Error",
            message: firstValidationMessage,
            withBorder: true,
            autoClose: 12000
          });
          // console.log(
          //   `Validation error for ${fieldName}:`,
          //   firstValidationMessage
          // );
        }
      });
    }
  } catch (error: any) {
    // console.log("Original error message:", error);
    notifications.show({
      color: "red",
      title: "Error",
      message: error,
      withBorder: true,
      autoClose: 12000
    });
  }
}
