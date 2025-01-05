import { Database } from "./supabase";

export * from "./base";
export * from "./fhir";

export type Practitioner = Database["public"]["Tables"]["Practitioner"]["Row"];
export type Wards = Database["public"]["Tables"]["Wards"]["Row"];
export type CalendarEvent = Database["public"]["Tables"]["CalendarEvent"]["Row"];
export type Appointment = Database["public"]["Tables"]["Appointment"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  role: string[];
};
export type DocumentAppointment = Database["public"]["Tables"]["DocumentAppointment"]["Row"];
