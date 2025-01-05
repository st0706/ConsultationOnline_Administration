import {
  Address,
  Availability,
  CodeableConcept,
  ExtendedContactDetail,
  HumanName,
  Identifier,
  Location,
  Reference
} from "fhir/r5";

export type LanguageCode = "en" | "vi";

export type Language = {
  label: string;
  language: LanguageCode;
  image: string;
};

export interface TreeNode {
  id: string;
  name: string | null;
  children?: TreeNode[];
}

export interface DeviceGrid {
  id: string;
  name: string | null;
  status: string | null;
  subRows: DeviceGrid[];
}

export interface DataGrid {
  resourceType: string;
  id: string;
  identifier: Identifier[];
  active: boolean | undefined;
  type: CodeableConcept[];
  name: string | null;
  alias: string[];
  description: string | null;
  contact: ExtendedContactDetail[];
  endpoint: Reference[];
  logo: string | null;
  website: string | null;
  partOfId: string | null;
  subRows: DataGrid[];
}

export interface FileInfo {
  id: string | null;
  name: string | null;
  url: string | null;
}

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
  unknown = "unknown"
}

export enum Status {
  active = "active",
  suspend = "suspend",
  inactive = "inactive"
}

export enum StatusReview {
  draft = "draft",
  approved = "approved",
  pending = "pending",
  rejected = "rejected"
}

export enum RelatedType {
  father = "father",
  mother = "mother",
  fatherInLaw = "fatherInLaw",
  motherInLaw = "motherInLaw",
  son = "son",
  daughter = "daughter"
}

export enum TravelStatus {
  self = "self",
  recommendation = "recommendation"
}

export const ethnicMinority = [
  "Ba Na",
  "Bố Y",
  "Brâu",
  "Bru-Vân Kiều",
  "Chăm",
  "Chơ Ro",
  "Chứt",
  "Co",
  "Cơ Ho",
  "Cơ Tu",
  "Cống",
  "Dao",
  "Ê Đê",
  "Giáy",
  "Giẻ Triêng",
  "Gia Rai",
  "H'Mông",
  "Hrê",
  "Hoa",
  "Kháng",
  "Khơ Mú",
  "Khmer",
  "Kinh",
  "La Chí",
  "La Ha",
  "La Hủ",
  "Lào",
  "Lự",
  "Lô Lô",
  "Mạ",
  "Mảng",
  "Mnông",
  "Mường",
  "Ngái",
  "Nùng",
  "Pà Thẻn",
  "Phù Lá",
  "Pu Péo",
  "Ra Glai",
  "Rơ Măm",
  "Sán Chay",
  "Sán Dìu",
  "Si La",
  "Tày",
  "Thái",
  "Thổ",
  "Xinh Mun",
  "Xơ Đăng",
  "Xtiêng",
  "Ơ Đu"
];

export const LocationFormData = {
  si: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "si",
    display: "Site"
  },
  bu: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "bu",
    display: "Building"
  },
  wi: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "wi",
    display: "Wing"
  },
  wa: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "wa",
    display: "Ward"
  },
  lvl: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "lvl",
    display: "Level"
  },
  co: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "co",
    display: "Corridor"
  },
  ro: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "ro",
    display: "Room"
  },
  bd: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "bd",
    display: "Bed"
  },
  ve: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "ve",
    display: "Vehicle"
  },
  ho: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "ho",
    display: "House"
  },
  ca: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "ca",
    display: "Cabinet"
  },
  rd: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "rd",
    display: "Road"
  },
  area: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "area",
    display: "Area"
  },
  jdn: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "jdn",
    display: "Jurisdiction"
  },
  vi: {
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
    code: "vi",
    display: "Virtual"
  }
};
export const DeviceType = {
  528391: {
    code: "528391",
    display: "Blood Pressure Cuff"
  },
  528404: {
    code: "528404",
    display: "Body Composition Analyzer"
  },
  528425: {
    code: "528425",
    display: "Cardiovascular Device"
  },
  528402: {
    code: "528402",
    display: "Coagulation meter"
  },
  528409: {
    code: "528409",
    display: "Continuous Glucose Monitor"
  },
  528390: {
    code: "528390",
    display: "Electro cardiograph"
  },
  528457: {
    code: "528457",
    display: "Generic 20601 Device"
  },
  528401: {
    code: "528401",
    display: "Glucose Monitor"
  },
  528455: {
    code: "528455",
    display: "Independent Activity/Living Hub"
  },
  528403: {
    code: "528403",
    display: "Insulin Pump"
  },
  528405: {
    code: "528405",
    display: "Peak Flow meter"
  },
  528388: {
    code: "528388",
    display: "Pulse Oximeter"
  },
  528397: {
    code: "528397",
    display: "Respiration rate"
  },
  528408: {
    code: "528408",
    display: "Sleep Apnea Breathing Equipment"
  },
  528426: {
    code: "528426",
    display: "Strength Equipment"
  },
  528392: {
    code: "528392",
    display: "Thermometer"
  },
  528399: {
    code: "528399",
    display: "Weight Scale"
  },
  38017: {
    code: "38017",
    display: "Dry salt inhalation therapy device"
  },
  38663: {
    code: "38663",
    display: "Flexible video nephroscope"
  },
  42347: {
    code: "42347",
    display: "Dental implant, endosseous, partially-embedded"
  },
  46352: {
    code: "46352",
    display: "Bare-metal intracranial vascular stent"
  },
  47264: {
    code: "47264",
    display: "Dual-chamber implantable pacemaker, demand"
  },
  62163: {
    code: "62163",
    display: "Intrauterine cannula, reusable"
  },
  62260: {
    code: "62260",
    display: "Air-conduction hearing aid acoustic tube"
  },
  62423: {
    code: "62423",
    display: "Spinal cord/peripheral nerve implantable analgesic electrical stimulation system lead, wired connection"
  },
  62414: {
    code: "62414",
    display: "Blue-light phototherapy lamp, home-use"
  },
  64587: {
    code: "64587",
    display: "Uncoated knee femur prosthesis, ceramic"
  },
  64992: {
    code: "64992",
    display: "ADAMTS13 activity IVD, kit, chemiluminescent immunoassay"
  }
};
export const LocationFormType = {
  si: {
    display: "Trụ sở chính",
    code: "si",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  bu: {
    display: "Toà nhà",
    code: "bu",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  wi: {
    display: "Wing",
    code: "wi",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  wa: {
    display: "Ward",
    code: "wa",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  lvl: {
    display: "Level",
    code: "lvl",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  co: {
    display: "Corridor",
    code: "co",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  ro: {
    display: "Phòng",
    code: "ro",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  bd: {
    display: "Giường bệnh",
    code: "bd",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  ve: {
    display: "Phương tiện",
    code: "ve",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  ho: {
    display: "Nhà ở",
    code: "ho",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  ca: {
    display: "Cabinet",
    code: "ca",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  rd: {
    display: "Road",
    code: "rd",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  area: {
    display: "Area",
    code: "area",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  jdn: {
    display: "Jurisdiction",
    code: "jdn",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  },
  vi: {
    display: "Virtual",
    code: "vi",
    system: "http://terminology.hl7.org/CodeSystem/location-physical-type"
  }
};

export const OperationStatusType = {
  C: {
    code: "C",
    display: "Closed",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  },
  H: {
    code: "H",
    display: "Housekeeping",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  },
  O: {
    code: "O",
    display: "Occupied",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  },
  U: {
    code: "U",
    display: "UnOccupied",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  },
  K: {
    code: "K",
    display: "Contaminated",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  },
  I: {
    code: "I",
    display: "Isolated",
    system: "http://terminology.hl7.org/CodeSystem/v2-0116"
  }
};

export const ModeData = [
  {
    label: "Instance",
    value: "instance"
  },
  {
    label: "Kind",
    value: "kind"
  }
];
export const AddressUseData = [
  {
    label: "Nhà riêng",
    value: "home"
  },
  {
    label: "Nơi làm việc",
    value: "work"
  },
  {
    label: "Tạm thời",
    value: "temp"
  },
  {
    label: "Old/Incorrect",
    value: "old"
  },
  {
    label: "Địa chỉ hoá đơn",
    value: "billing"
  },
  {
    label: "",
    value: ""
  }
];
export const AddressTypeData = [
  {
    label: "Postal",
    value: "postal"
  },
  {
    label: "Physical",
    value: "physical"
  },
  {
    label: "Postal & Physical",
    value: "both"
  }
];

export const DaysOfWeekData = [
  { label: "Monday", value: "mon" },
  { label: "Tuesday", value: "tue" },
  { label: "Wednesday", value: "wed" },
  { label: "Thursday", value: "thu" },
  { label: "Friday", value: "fri" },
  { label: "Saturday", value: "sat" },
  { label: "Sunday", value: "sun" }
];

export const ContactEntityType = {
  BILL: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Billing",
    code: "BILL"
  },
  ADMIN: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Administrative",
    code: "ADMIN"
  },
  HR: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Human Resource",
    code: "HR"
  },
  PAYOR: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Payor",
    code: "PAYOR"
  },
  PATINF: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Patient",
    code: "PATINF"
  },
  PRESS: {
    system: "http://terminology.hl7.org/CodeSystem/contactentity-type",
    display: "Press",
    code: "PRESS"
  }
};

export const NameUseType = {
  Usual: {
    code: "usual",
    system: "http://hl7.org/fhir/name-use",
    display: "Usual"
  },
  Offical: {
    code: "offical",
    system: "http://hl7.org/fhir/name-use",
    display: "Offical"
  },
  Temp: {
    code: "temp",
    system: "http://hl7.org/fhir/name-use",
    display: "Temp"
  },
  Nickname: {
    code: "nickname",
    system: "http://hl7.org/fhir/name-use",
    display: "Nickname"
  },
  Anonymous: {
    code: "anonymous",
    system: "http://hl7.org/fhir/name-use",
    display: "Anonymous"
  },
  Old: {
    code: "old",
    system: "http://hl7.org/fhir/name-use",
    display: "Old"
  },
  Maiden: {
    code: "maiden",
    system: "http://hl7.org/fhir/name-use",
    display: "Maiden"
  }
};

export const DeviceAvailabilityStatus = {
  lost: {
    system: "http://hl7.org/fhir/device-availability-status",
    code: "lost",
    display: "Lost"
  },
  damaged: {
    system: "http://hl7.org/fhir/device-availability-status",
    code: "damaged",
    display: "Damaged"
  },
  destroyed: {
    system: "http://hl7.org/fhir/device-availability-status",
    code: "destroyed",
    display: "Destroyed"
  },
  available: {
    system: "http://hl7.org/fhir/device-availability-status",
    code: "available",
    display: "Available"
  }
};

export const DeviceCategoryType = {
  active: {
    system: "http://hl7.org/fhir/device-category",
    code: "active",
    display: "Active"
  },
  communicating: {
    system: "http://hl7.org/fhir/device-category",
    code: "communicating",
    display: "communicating"
  },
  dme: {
    system: "http://hl7.org/fhir/device-category",
    code: "dme",
    display: "Durable Medical Equipment"
  },
  "home-use": {
    system: "http://hl7.org/fhir/device-category",
    code: "home-use",
    display: "Maintenance"
  },
  implantable: {
    system: "http://hl7.org/fhir/device-category",
    code: "implantable",
    display: "Implantable"
  },
  "in-vitro": {
    system: "http://hl7.org/fhir/device-category",
    code: "in-vitro",
    display: "In vitro"
  },
  "point-of-care": {
    system: "http://hl7.org/fhir/device-category",
    code: "point-of-care",
    display: "Point of Care"
  },
  "single-use": {
    system: "http://hl7.org/fhir/device-category",
    code: "single-use",
    display: "Single Use"
  },
  reusable: {
    system: "http://hl7.org/fhir/device-category",
    code: "reusable",
    display: "Reusable"
  },
  software: {
    system: "http://hl7.org/fhir/device-category",
    code: "software",
    display: "Software"
  }
};

export const ServiceDeliveryLocationRoleType = {
  _DedicatedServiceDeliveryLocationRoleType: {
    display: "DedicatedServiceDeliveryLocationRoleType",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    code: "_DedicatedServiceDeliveryLocationRoleType"
  },
  _DedicatedClinicalLocationRoleType: {
    display: "DedicatedClinicalLocationRoleType",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    code: "_DedicatedClinicalLocationRoleType"
  },
  DX: {
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    code: "DX",
    display: "Diagnostics or therapeutics unit"
  },
  CVDX: {
    code: "CVDX",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Cardiovascular diagnostics or therapeutics unit"
  },
  CATH: {
    code: "CATH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Cardiac catheterization lab"
  },
  ECHO: {
    code: "ECHO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Echocardiography lab"
  },
  GIDX: {
    code: "GIDX",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Gastroenterology diagnostics or therapeutics lab"
  },
  ENDOS: {
    code: "ENDOS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Endoscopy lab"
  },
  RADDX: {
    code: "RADDX",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Radiology diagnostics or therapeutics unit"
  },
  RADO: {
    code: "RADO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Radiation oncology unit"
  },
  RNEU: {
    code: "RNEU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Neuroradiology unit"
  },
  HOSP: {
    code: "HOSP",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hospital"
  },
  CHR: {
    code: "CHR",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Chronic Care Facility"
  },
  GACH: {
    code: "GACH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hospitals; General Acute Care Hospital"
  },
  MHSP: {
    code: "MHSP",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Military Hospital"
  },
  PSYCHF: {
    code: "PSYCHF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Psychatric Care Facility"
  },
  RH: {
    code: "RH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Rehabilitation hospital"
  },
  RHAT: {
    code: "RHAT",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "addiction treatment center"
  },
  RHII: {
    code: "RHII",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "intellectual impairment center"
  },
  RHMAD: {
    code: "RHMAD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "parents with adjustment difficulties center"
  },
  RHPI: {
    code: "RHPI",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "physical impairment center"
  },
  RHPIH: {
    code: "RHPIH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "physical impairment - hearing center"
  },
  RHPIMS: {
    code: "RHPIMS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "physical impairment - motor skills center"
  },
  RHPIVS: {
    code: "RHPIVS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "physical impairment - visual skills center"
  },
  RHYAD: {
    code: "RHYAD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "youths with adjustment difficulties center"
  },
  HU: {
    code: "HU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hospital unit"
  },
  BMTU: {
    code: "BMTU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Bone marrow transplant unit"
  },
  CCU: {
    code: "CCU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Coronary care unit"
  },
  CHEST: {
    code: "CHEST",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Chest unit"
  },
  EPIL: {
    code: "EPIL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Epilepsy unit"
  },
  ER: {
    code: "ER",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Emergency room"
  },
  ETU: {
    code: "ETU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Emergency trauma unit"
  },
  HD: {
    code: "HD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hemodialysis unit"
  },
  HLAB: {
    code: "HLAB",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "hospital laboratory"
  },
  INLAB: {
    code: "INLAB",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "inpatient laboratory"
  },
  HRAD: {
    code: "HRAD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "radiology unit"
  },
  HUSCS: {
    code: "HUSCS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "specimen collection site"
  },
  ICU: {
    code: "ICU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Intensive care unit"
  },
  PEDICU: {
    code: "PEDICU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric intensive care unit"
  },
  PEDNICU: {
    code: "PEDNICU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric neonatal intensive care unit"
  },
  INPHARM: {
    code: "INPHARM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "inpatient pharmacy"
  },
  MBL: {
    code: "MBL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "medical laboratory"
  },
  NCCS: {
    code: "NCCS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Neurology critical care and stroke unit"
  },
  NS: {
    code: "NS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Neurosurgery unit"
  },
  OUTPHARM: {
    code: "OUTPHARM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "outpatient pharmacy"
  },
  PEDU: {
    code: "PEDU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric unit"
  },
  PHU: {
    code: "PHU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Psychiatric hospital unit"
  },
  RHU: {
    code: "RHU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Rehabilitation hospital unit"
  },
  SLEEP: {
    code: "SLEEP",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Sleep disorders unit"
  },
  NCCF: {
    code: "NCCF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Nursing or custodial care facility"
  },
  SNF: {
    code: "SNF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Skilled nursing facility"
  },
  OF: {
    code: "OF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Outpatient facility"
  },
  ALL: {
    code: "ALL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Allergy clinic"
  },
  AMPUT: {
    code: "AMPUT",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Amputee clinic"
  },
  BMTC: {
    code: "BMTC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Bone marrow transplant clinic"
  },
  BREAST: {
    code: "BREAST",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Breast clinic"
  },
  CANC: {
    code: "CANC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Child and adolescent neurology clinic"
  },
  CAPC: {
    code: "CAPC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Child and adolescent psychiatry clinic"
  },
  CARD: {
    code: "CARD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Ambulatory Health Care Facilities; Clinic/Center; Rehabilitation: Cardiac Facilities"
  },
  PEDCARD: {
    code: "PEDCARD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric cardiology clinic"
  },
  COAG: {
    code: "COAG",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Coagulation clinic"
  },
  CRS: {
    code: "CRS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Colon and rectal surgery clinic"
  },
  DERM: {
    code: "DERM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Dermatology clinic"
  },
  ENDO: {
    code: "ENDO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Endocrinology clinic"
  },
  PEDE: {
    code: "PEDE",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric endocrinology clinic"
  },
  ENT: {
    code: "ENT",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Otorhinolaryngology clinic"
  },
  FMC: {
    code: "FMC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Family medicine clinic"
  },
  GI: {
    code: "GI",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Gastroenterology clinic"
  },
  PEDGI: {
    code: "PEDGI",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric gastroenterology clinic"
  },
  GIM: {
    code: "GIM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "General internal medicine clinic"
  },
  GYN: {
    code: "GYN",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Gynecology clinic"
  },
  HEM: {
    code: "HEM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hematology clinic"
  },
  PEDHEM: {
    code: "PEDHEM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric hematology clinic"
  },
  HTN: {
    code: "HTN",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hypertension clinic"
  },
  IEC: {
    code: "IEC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Impairment evaluation center"
  },
  INFD: {
    code: "INFD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Infectious disease clinic"
  },
  PEDID: {
    code: "PEDID",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric infectious disease clinic"
  },
  INV: {
    code: "INV",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Infertility clinic"
  },
  LYMPH: {
    code: "LYMPH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Lympedema clinic"
  },
  MGEN: {
    code: "MGEN",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Medical genetics clinic"
  },
  NEPH: {
    code: "NEPH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Nephrology clinic"
  },
  PEDNEPH: {
    code: "PEDNEPH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric nephrology clinic"
  },
  NEUR: {
    code: "NEUR",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Neurology clinic"
  },
  OB: {
    code: "OB",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Obstetrics clinic"
  },
  OMS: {
    code: "OMS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Oral and maxillofacial surgery clinic"
  },
  ONCL: {
    code: "ONCL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Medical oncology clinic"
  },
  PEDHO: {
    code: "PEDHO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric oncology clinic"
  },
  OPH: {
    code: "OPH",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Opthalmology clinic"
  },
  OPTC: {
    code: "OPTC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "optometry clinic"
  },
  ORTHO: {
    code: "ORTHO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Orthopedics clinic"
  },
  HAND: {
    code: "HAND",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Hand clinic"
  },
  PAINCL: {
    code: "PAINCL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pain clinic"
  },
  PC: {
    code: "PC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Primary care clinic"
  },
  PEDC: {
    code: "PEDC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatrics clinic"
  },
  PEDRHEUM: {
    code: "PEDRHEUM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pediatric rheumatology clinic"
  },
  POD: {
    code: "POD",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Podiatry clinic"
  },
  PREV: {
    code: "PREV",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Preventive medicine clinic"
  },
  PROCTO: {
    code: "PROCTO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Proctology clinic"
  },
  PROFF: {
    code: "PROFF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Provider's Office"
  },
  PROS: {
    code: "PROS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Prosthodontics clinic"
  },
  PSI: {
    code: "PSI",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Psychology clinic"
  },
  PSY: {
    code: "PSY",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Psychiatry clinic"
  },
  RHEUM: {
    code: "RHEUM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Rheumatology clinic"
  },
  SPMED: {
    code: "SPMED",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Sports medicine clinic"
  },
  SU: {
    code: "SU",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Surgery clinic"
  },
  PLS: {
    code: "PLS",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Plastic surgery clinic"
  },
  URO: {
    code: "URO",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Urology clinic"
  },
  TR: {
    code: "TR",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Transplant clinic"
  },
  TRAVEL: {
    code: "TRAVEL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Travel and geographic medicine clinic"
  },
  WND: {
    code: "WND",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Wound clinic"
  },
  RTF: {
    code: "RTF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Residential treatment facility"
  },
  PRC: {
    code: "PRC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pain rehabilitation center"
  },
  SURF: {
    code: "SURF",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Substance use rehabilitation facility"
  },
  _DedicatedNonClinicalLocationRoleType: {
    code: "_DedicatedNonClinicalLocationRoleType",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "DedicatedNonClinicalLocationRoleType"
  },
  DADDR: {
    code: "DADDR",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Delivery Address"
  },
  MOBL: {
    code: "MOBL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Mobile Unit"
  },
  AMB: {
    code: "AMB",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Ambulance"
  },
  PHARM: {
    code: "PHARM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Pharmacy"
  },
  _IncidentalServiceDeliveryLocationRoleType: {
    code: "_IncidentalServiceDeliveryLocationRoleType",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "IncidentalServiceDeliveryLocationRoleType"
  },
  ACC: {
    code: "ACC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "accident site"
  },
  COMM: {
    code: "COMM",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Community Location"
  },
  CSC: {
    code: "CSC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "community service center"
  },
  PTRES: {
    code: "PTRES",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Patient's Residence"
  },
  SCHOOL: {
    code: "SCHOOL",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "school"
  },
  UPC: {
    code: "UPC",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "underage protection center"
  },
  WORK: {
    code: "WORK",
    system: "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
    display: "Substance use rehabilitation facility"
  }
};

export const FormDefaultValue = {
  Location: {
    resourceType: "Location",
    contact: [
      {
        purpose: {
          coding: [
            {
              code: "",
              system: "",
              display: ""
            }
          ],
          text: ""
        } as CodeableConcept,
        address: {
          use: undefined,
          city: "",
          district: "",
          line: ["", ""],
          type: undefined,
          text: "",
          state: "",
          postalCode: "",
          period: {
            start: undefined,
            end: undefined
          }
        } as Address,
        name: [
          {
            use: "official",
            text: "",
            family: "",
            given: [""],
            prefix: [""],
            suffix: [""],
            period: {
              start: "",
              end: ""
            }
          }
        ] as HumanName[],
        telecom: [
          {
            use: undefined,
            rank: undefined,
            system: undefined,
            value: "",
            period: { start: undefined, end: undefined }
          }
        ]
      }
    ],
    form: {
      coding: [
        {
          code: "",
          display: "",
          system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
          version: "",
          userSelected: true
        }
      ],
      text: ""
    },
    address: {
      use: undefined,
      city: "",
      district: "",
      line: ["", ""],
      type: undefined,
      text: "",
      state: "",
      postalCode: "",
      period: {
        start: "",
        end: ""
      }
    } as Address,
    type: [
      {
        coding: [],
        text: ""
      }
    ] as CodeableConcept[],
    position: {
      latitude: 0,
      longitude: 0,
      altitude: 0
    },
    partOf: {
      reference: ""
    },
    hoursOfOperation: [
      {
        availableTime: [{ allDay: false, daysOfWeek: [], availableEndTime: "", availableStartTime: "" }],
        notAvailableTime: [
          {
            description: "",
            during: {
              start: "",
              end: ""
            }
          }
        ]
      }
    ] as Availability[],
    managingOrganization: {
      reference: ""
    },
    endpoint: [{ reference: "" }]
  } as Location
};

export const degreeLicenseCertificate = {
  PN: {
    coding: {
      code: "PN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Advanced Practice Nurse"
    }
  },
  AAS: {
    coding: {
      code: "AAS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Associate of Applied Science"
    }
  },
  AA: {
    coding: {
      code: "AA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Associate of Arts"
    }
  },
  ABA: {
    coding: {
      code: "ABA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Associate of Business Administration"
    }
  },
  AE: {
    coding: {
      code: "AE",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Associate of Engineering"
    }
  },
  AS: {
    coding: {
      code: "AS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Associate of Science"
    }
  },
  BA: {
    coding: {
      code: "BA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Arts"
    }
  },
  BBA: {
    coding: {
      code: "BBA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Business Administration"
    }
  },
  BE: {
    coding: {
      code: "BE",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Engineering"
    }
  },
  BFA: {
    coding: {
      code: "BFA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Fine Arts"
    }
  },
  BN: {
    coding: {
      code: "BN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Nursing"
    }
  },
  BS: {
    coding: {
      code: "BS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Science"
    }
  },
  BSL: {
    coding: {
      code: "BSL",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Science - Law"
    }
  },
  BSN: {
    coding: {
      code: "BSN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor on Science - Nursing"
    }
  },
  BT: {
    coding: {
      code: "BT",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Bachelor of Theology"
    }
  },
  CER: {
    coding: {
      code: "CER",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certificate"
    }
  },
  CANP: {
    coding: {
      code: "CANP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Adult Nurse Practitioner"
    }
  },
  CMA: {
    coding: {
      code: "CMA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Medical Assistant"
    }
  },
  CNP: {
    coding: {
      code: "CNP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Nurse Practitioner"
    }
  },
  CNM: {
    coding: {
      code: "CNM",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Nurse Midwife"
    }
  },
  CRN: {
    coding: {
      code: "CRN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Registered Nurse"
    }
  },
  CNS: {
    coding: {
      code: "CNS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Nurse Specialist"
    }
  },
  CPNP: {
    coding: {
      code: "CPNP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Pediatric Nurse Practitioner"
    }
  },
  CTR: {
    coding: {
      code: "CTR",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Certified Tumor Registrar"
    }
  },
  DIP: {
    coding: {
      code: "DIP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Diploma"
    }
  },
  DBA: {
    coding: {
      code: "DBA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Business Administration"
    }
  },
  DED: {
    coding: {
      code: "DED",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Education"
    }
  },
  PharmD: {
    coding: {
      code: "PharmD",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Pharmacy"
    }
  },
  PHE: {
    coding: {
      code: "PHE",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Engineering"
    }
  },
  PHD: {
    coding: {
      code: "PHD",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Philosophy"
    }
  },
  PHS: {
    coding: { code: "PHS", system: "http://terminology.hl7.org/CodeSystem/v2-0360", display: "Doctor of Science" }
  },
  MD: {
    coding: {
      code: "MD",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Medicine"
    }
  },
  DO: {
    coding: {
      code: "DO",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Doctor of Osteopathy"
    }
  },
  EMT: {
    coding: {
      code: "EMT",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Emergency Medical Technician"
    }
  },
  EMTP: {
    coding: {
      code: "EMTP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Emergency Medical Technician - Paramedic"
    }
  },
  FPNP: {
    coding: {
      code: "FPNP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Family Practice Nurse Practitioner"
    }
  },
  HS: {
    coding: {
      code: "HS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "High School Graduate"
    }
  },
  JD: {
    coding: {
      code: "JD",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Juris Doctor"
    }
  },
  MA: {
    coding: {
      code: "MA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Arts"
    }
  },
  MBA: {
    coding: {
      code: "MBA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Business Administration"
    }
  },
  MCE: {
    coding: {
      code: "MCE",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Civil Engineering"
    }
  },
  MDI: {
    coding: {
      code: "MDI",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Divinity"
    }
  },
  MED: {
    coding: {
      code: "MED",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Education"
    }
  },
  MEE: {
    coding: {
      code: "MEE",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Electrical Engineering"
    }
  },
  ME: {
    coding: {
      code: "ME",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Engineering"
    }
  },
  MFA: {
    coding: {
      code: "MFA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Fine Arts"
    }
  },
  MME: {
    coding: {
      code: "MME",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Mechanical Engineering"
    }
  },
  MS: {
    coding: {
      code: "MS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Science"
    }
  },
  MSL: {
    coding: {
      code: "MSL",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Science - Law"
    }
  },
  MSN: {
    coding: {
      code: "MSN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Science - Nursing"
    }
  },
  MTH: {
    coding: {
      code: "MTH",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Master of Theology"
    }
  },
  MDA: {
    coding: {
      code: "MDA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Medical Assistant"
    }
  },
  MT: {
    coding: {
      code: "MT",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Medical Technician"
    }
  },
  NG: {
    coding: {
      code: "NG",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Non-Graduate"
    }
  },
  NP: {
    coding: {
      code: "NP",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Nurse Practitioner"
    }
  },
  PA: {
    coding: {
      code: "PA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Physician Assistant"
    }
  },
  RMA: {
    coding: {
      code: "RMA",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Registered Medical Assistant"
    }
  },
  RN: {
    coding: {
      code: "RN",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Registered Nurse"
    }
  },
  RPH: {
    coding: {
      code: "RPH",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Registered Pharmacist"
    }
  },
  SEC: {
    coding: { code: "SEC", system: "http://terminology.hl7.org/CodeSystem/v2-0360", display: "Secretarial Certificate" }
  },
  TS: {
    coding: {
      code: "TS",
      system: "http://terminology.hl7.org/CodeSystem/v2-0360",
      display: "Trade School Graduate"
    }
  }
};

export const DeviceMetricType = {
  urn0: {
    code: "0",
    system: "urn:iso:std:iso:11073:10101",
    display: "Unspecified"
  },
  urn1: {
    code: "1",
    system: "urn:iso:std:iso:11073:10101",
    display: "Object-oriented elements, Device nomenclature"
  },
  urn2: {
    code: "2",
    system: "urn:iso:std:iso:11073:10101",
    display: "Metrics"
  }
};

export const DeviceMetricUnits = {
  "%": {
    code: "%",
    system: "http://unitsofmeasure.org",
    display: "percent"
  },
  "%/100{WBC}": {
    code: "%/100{WBC}",
    system: "http://unitsofmeasure.org",
    display: "percent / 100 WBC"
  },
  "%{0to3Hours}": {
    code: "%{0to3Hours}",
    system: "http://unitsofmeasure.org",
    display: "percent 0to3Hours"
  },
  "%{Abnormal}": {
    code: "%{Abnormal}",
    system: "http://unitsofmeasure.org",
    display: "percent Abnormal"
  }
};

export const SpecialtyAppointment = {
  408467006: {
    code: 408467006,
    system: "http://snomed.info/sct",
    display: "Adult mental illness"
  },
  394577000: {
    code: 394577000,
    system: "http://snomed.info/sct",
    display: "Anesthetics"
  },
  394578005: {
    code: 394578005,
    system: "http://snomed.info/sct",
    display: "Audiological medicine"
  },
  421661004: {
    code: 421661004,
    system: "http://snomed.info/sct",
    display: "Blood banking and transfusion medicine"
  },
  408462000: {
    code: 408462000,
    system: "http://snomed.info/sct",
    display: "Burns care"
  }
};
