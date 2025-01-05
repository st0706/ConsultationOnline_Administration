import { defaultLang } from "@/i18n/settings";

export const toDate = (date?: bigint | string | number | Date): Date | undefined => {
  if (!date || ((typeof date === "bigint" || typeof date === "number") && date <= 0)) {
    return;
  }
  if (typeof date === "bigint") return new Date(Number(date));
  if (date instanceof Date) return date;
  return new Date(date);
};

export const localeDate = (date?: bigint | string | number | Date, locale = defaultLang, fullDate = false): string => {
  const _date = toDate(date);
  if (!_date) return "";

  try {
    return _date.toLocaleDateString(locale, {
      year: "numeric",
      month: fullDate ? "long" : "numeric",
      day: "numeric"
    });
  } catch {
    return date?.toLocaleString() || "";
  }
};

export const localeTime = (
  date?: bigint | string | number | Date,
  locale = defaultLang,
  hour12 = true,
  twoDigits = false,
  showSeconds = false
): string => {
  const _date = toDate(date);
  if (!_date) return "";

  try {
    return _date.toLocaleTimeString(locale, {
      hour: twoDigits ? "2-digit" : "numeric",
      minute: twoDigits ? "2-digit" : "numeric",
      second: showSeconds ? (twoDigits ? "2-digit" : "numeric") : undefined,
      hour12: hour12
    });
  } catch {
    return date?.toLocaleString() || "";
  }
};

export const localeDateTime = (
  date?: bigint | string | number | Date,
  locale = defaultLang,
  fullDateTime = false,
  hour12 = true,
  twoDigits = false,
  showSeconds = false
): string => {
  const _date = toDate(date);
  if (!_date) return "";

  try {
    return _date.toLocaleDateString(locale, {
      year: "numeric",
      month: fullDateTime ? "long" : "numeric",
      day: "numeric",
      hour: twoDigits ? "2-digit" : "numeric",
      minute: twoDigits ? "2-digit" : "numeric",
      second: showSeconds ? (twoDigits ? "2-digit" : "numeric") : undefined,
      hour12: hour12
    });
  } catch {
    return date?.toLocaleString() || "";
  }
};
