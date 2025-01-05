import packageInfo from "../../../package.json";

export const app = {
  version: packageInfo.version,
  name: "AnPhat Consultation",
  description: "Online medical consultation management solution",
  location: "Hanoi, Vietnam",
  logoUrl: " https://hoichan.anphat.ai.vn/logo.png",
  url: " https://hoichan.anphat.ai.vn"
};

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const CALENDAR_ROOT = "/calendar";
const CONSULTATION_ROOT = "/consultation";

export const CALENDAR_PATHS = {
  root: CALENDAR_ROOT
};

export const CONSULTATION_PATHS = {
  root: CONSULTATION_ROOT,
  appointment: path(CONSULTATION_ROOT, "/appointment"),
  account: path(CONSULTATION_ROOT, "/account"),
  staff: path(CONSULTATION_ROOT, "/staffs"),
  adDivision: path(CONSULTATION_ROOT, "/adDivision"),
  organization: path(CONSULTATION_ROOT, "/organization")
};
