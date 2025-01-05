import {
  Address,
  Annotation,
  Attachment,
  CodeableConcept,
  Coding,
  ContactPoint,
  ExtendedContactDetail,
  HumanName,
  Identifier,
  PatientCommunication,
  PatientContact,
  Period,
  PractitionerQualification,
  Reference,
  ProductShelfLife,
  RelatedArtifact,
  CodeableReference,
  Quantity,
  Timing,
  Range
} from "fhir/r5";
import { AddressDisplay } from "./AddressDisplay";
import AddressInput from "./AddressInput";
import EndpointInput from "./EndpointInput";
import ExtendedContactDetailInput from "./ExtendedContactDetailInput";
import { HumanNameDisplay } from "./HumanNameDisplay";
import HumanNameInput from "./HumanNameInput";
import { IdentifierDisplay } from "./IdentifierDisplay";
import IdentifierInput from "./IdentifierInput";
import PatientCommunicationInput from "./PatientCommunicationInput";
import PatientContactInput from "./PatientContactInput";
import QualificationCodeInput from "./QualificationCodeInput";
import QualificationInput from "./QualificationInput";
import ResourceArrayInput from "./ResourceArrayInput";
import TelecomInput from "./TelecomInput";
import TypesInput from "./TypesInput";

export {
  AddressDisplay,
  AddressInput,
  EndpointInput,
  ExtendedContactDetailInput,
  HumanNameDisplay,
  HumanNameInput,
  IdentifierDisplay,
  IdentifierInput,
  PatientCommunicationInput,
  PatientContactInput,
  QualificationCodeInput,
  QualificationInput,
  ResourceArrayInput,
  TelecomInput,
  TypesInput
};

export const DEFAULT_CODING: Coding = {
  system: undefined,
  code: undefined,
  display: undefined
};

export const DEFAULT_PERIOD: Period = {
  start: undefined,
  end: undefined
};

export const DEFAULT_CODEABLE_CONCEPT: CodeableConcept = {
  coding: [DEFAULT_CODING],
  text: ""
};

export const DEFAULT_SIMPLE_QUANTITY = {
  value: undefined,
  unit: "",
  system: "",
  code: ""
};

export const DEFAULT_RANGE: Range = {
  low: DEFAULT_SIMPLE_QUANTITY,
  high: DEFAULT_SIMPLE_QUANTITY
};

export const DEFAULT_TIMING: Timing = {
  code: DEFAULT_CODEABLE_CONCEPT,
  event: [],
  repeat: {
    boundsDuration: undefined,
    boundsRange: undefined,
    boundsPeriod: DEFAULT_PERIOD,
    count: 0,
    countMax: undefined,
    duration: undefined,
    durationMax: undefined,
    durationUnit: undefined,
    frequency: undefined,
    frequencyMax: undefined,
    period: undefined,
    periodMax: undefined,
    periodUnit: undefined,
    dayOfWeek: [],
    timeOfDay: [],
    when: [],
    offset: undefined
  }
};

export const DEFAULT_AVAILABLETIME = {
  daysOfWeek: undefined,
  allDay: false,
  availableStartTime: undefined,
  availableEndTime: undefined
};

export const DEFAULT_NOTAVAILABLETIME = {
  description: "",
  during: {
    start: undefined,
    end: undefined
  }
};

export const DEFAULT_HOURSOFOPERATION = {
  availableTime: [DEFAULT_AVAILABLETIME],
  notAvailableTime: [DEFAULT_NOTAVAILABLETIME]
};

export const DEFAULT_REFERENCE: Reference = {
  reference: "",
  type: "",
  display: ""
};

export const DEFAULT_CODEABLEREFERENCE: CodeableReference = {
  concept: DEFAULT_CODEABLE_CONCEPT,
  reference: DEFAULT_REFERENCE
};

export const DEFAULT_IDENTIFIER: Identifier = {
  type: DEFAULT_CODEABLE_CONCEPT,
  value: "",
  assigner: DEFAULT_REFERENCE,
  period: DEFAULT_PERIOD
};

export const DEFAULT_PRODUCTSHELFLIFE: ProductShelfLife = {
  type: DEFAULT_CODEABLE_CONCEPT,
  periodString: ""
};

export const DEFAULT_NOTE: Annotation = {
  text: ""
};

export const DEFAULT_UDIDEVICEIDENTIFIER = {
  deviceIdentifier: "",
  issuer: null,
  jurisdiction: null,
  marketDistribution: [
    {
      marketPeriod: {
        start: undefined,
        end: undefined
      },
      subJurisdiction: null
    }
  ]
};

export const DEFAULT_HASPART = {
  reference: {
    reference: ""
  },
  count: null
};

export const DEFAULT_MATERIAL = {
  substance: {
    text: ""
  },
  alternate: false,
  allergenicIndicator: false
};

export const DEFAULT_DEVICEDEFINITIONNAME = {
  name: "",
  type: "registered-name"
};

export const DEFAULT_DEVICENAME = {
  value: "",
  type: "registered-name"
};
export const DEFAULT_CLASSIFICATION = {
  type: {
    coding: [],
    text: ""
  }
};

export const DEFAULT_ATTACHMENT: Attachment = {
  url: undefined,
  title: undefined
};

export const DEFAULT_PROPERTY = {
  type: DEFAULT_CODEABLE_CONCEPT,
  valueQuantity: {
    value: null,
    comparator: null,
    unit: "",
    system: undefined,
    code: undefined
  },
  valueCodeableConcept: DEFAULT_CODEABLE_CONCEPT,
  valueString: "",
  valueBoolean: false,
  valueInteger: 0,
  valueRange: {
    low: {
      unit: "",
      value: null
    },
    high: {
      unit: "",
      value: null
    }
  },
  valueAttachment: DEFAULT_ATTACHMENT
};

export const DEFAULT_HUMAN_NAME: HumanName = {
  use: undefined,
  prefix: [],
  family: "",
  given: [],
  suffix: [],
  period: DEFAULT_PERIOD
};

export const DEFAULT_CONTACT_POINT: ContactPoint = {
  system: undefined,
  value: "",
  use: undefined,
  rank: undefined,
  period: DEFAULT_PERIOD
};

export const DEFAULT_ADDRESS: Address = {
  use: undefined,
  type: undefined,
  city: "",
  district: "",
  line: ["", ""],
  text: "",
  state: "",
  postalCode: "",
  country: "",
  period: DEFAULT_PERIOD
};

export const DEFAULT_EXTENDED_CONTACT_DETAIL: ExtendedContactDetail = {
  address: DEFAULT_ADDRESS,
  name: [],
  organization: DEFAULT_REFERENCE,
  period: DEFAULT_PERIOD,
  purpose: DEFAULT_CODEABLE_CONCEPT,
  telecom: []
};

export const DEFAULT_PATIENT_CONTACT: PatientContact = {
  address: DEFAULT_ADDRESS,
  gender: undefined,
  name: DEFAULT_HUMAN_NAME,
  organization: DEFAULT_REFERENCE,
  period: DEFAULT_PERIOD,
  relationship: undefined,
  telecom: [DEFAULT_CONTACT_POINT]
};

export const DEFAULT_PATIENT_COMMUNICATION: PatientCommunication = {
  language: DEFAULT_CODEABLE_CONCEPT,
  preferred: false
};

export const DEFAULT_PRACTITIONER_QUALIFICATION: PractitionerQualification = {
  identifier: [DEFAULT_IDENTIFIER],
  code: {
    coding: [],
    text: ""
  },
  period: DEFAULT_PERIOD,
  issuer: DEFAULT_REFERENCE
};

export const DEFAULT_QUANTITY = {
  value: null,
  comparator: null,
  unit: "",
  system: undefined,
  code: undefined
};

export const DEFAULT_CALIBRATION = {
  type: null,
  state: null,
  time: undefined
};

export const DEFAULT_PARTICIPANT = {
  type: [DEFAULT_CODEABLE_CONCEPT],
  period: {
    start: undefined,
    end: undefined
  },
  actor: {
    reference: ""
  },
  require: null,
  status: null
};

export const DEFAULT_VIRTUALSERVICE = {
  channelType: [DEFAULT_CODEABLE_CONCEPT],
  additionalInfo: null,
  maxParticipants: undefined,
  sessionKey: null
};

export const DEFAULT_REASON = {
  concept: DEFAULT_CODEABLE_CONCEPT,
  reference: DEFAULT_REFERENCE
};

export const DEFAULT_APPOINTMENT_SUBJECT = {
  name: undefined,
  birthDate: undefined,
  gender: undefined,
  ethnic: undefined,
  nationality: undefined,
  occupation: undefined,
  address: {
    details: "",
    ward: "",
    district: "",
    city: ""
  },
  admissionNumber: undefined,
  insuranceNumber: undefined,
  admissionTime: undefined,
  admissionDepartment: undefined,
  requestConsultation: undefined,
  summaryMedicalHistory: undefined,
  conditionAdmission: undefined,
  diagnose: undefined,
  summary: undefined
};
