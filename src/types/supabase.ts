export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  pgbouncer: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_auth: {
        Args: {
          p_usename: string;
        };
        Returns: {
          username: string;
          password: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Appointment: {
        Row: {
          appointmentType: Json | null;
          approval: Json | null;
          cancellationDate: number | null;
          created: number | null;
          description: string | null;
          end: number | null;
          id: string;
          name: string | null;
          note: Json | null;
          participant: Json | null;
          priority: Json | null;
          reason: Json | null;
          resourceType: string;
          specialty: Json | null;
          start: number | null;
          status: string;
          subject: Json | null;
          supportingInformation: Json | null;
          virtualService: Json | null;
        };
        Insert: {
          appointmentType?: Json | null;
          approval?: Json | null;
          cancellationDate?: number | null;
          created?: number | null;
          description?: string | null;
          end?: number | null;
          id: string;
          name?: string | null;
          note?: Json | null;
          participant?: Json | null;
          priority?: Json | null;
          reason?: Json | null;
          resourceType?: string;
          specialty?: Json | null;
          start?: number | null;
          status: string;
          subject?: Json | null;
          supportingInformation?: Json | null;
          virtualService?: Json | null;
        };
        Update: {
          appointmentType?: Json | null;
          approval?: Json | null;
          cancellationDate?: number | null;
          created?: number | null;
          description?: string | null;
          end?: number | null;
          id?: string;
          name?: string | null;
          note?: Json | null;
          participant?: Json | null;
          priority?: Json | null;
          reason?: Json | null;
          resourceType?: string;
          specialty?: Json | null;
          start?: number | null;
          status?: string;
          subject?: Json | null;
          supportingInformation?: Json | null;
          virtualService?: Json | null;
        };
        Relationships: [];
      };
      BloodCode: {
        Row: {
          actualVolume: string;
          code: string;
          createdAt: string;
          id: string;
          note: string | null;
          preparations: string;
          updatedAt: string;
        };
        Insert: {
          actualVolume: string;
          code: string;
          createdAt?: string;
          id: string;
          note?: string | null;
          preparations: string;
          updatedAt?: string;
        };
        Update: {
          actualVolume?: string;
          code?: string;
          createdAt?: string;
          id?: string;
          note?: string | null;
          preparations?: string;
          updatedAt?: string;
        };
        Relationships: [];
      };
      CalendarEvent: {
        Row: {
          description: string | null;
          id: string;
          nameEvent: string;
          periodEnd: number;
          periodStart: number;
        };
        Insert: {
          description?: string | null;
          id?: string;
          nameEvent: string;
          periodEnd: number;
          periodStart: number;
        };
        Update: {
          description?: string | null;
          id?: string;
          nameEvent?: string;
          periodEnd?: number;
          periodStart?: number;
        };
        Relationships: [];
      };
      Certification: {
        Row: {
          classification: string | null;
          field: string | null;
          id: string;
          isInternational: boolean;
          issueDate: number | null;
          level: string | null;
          name: string;
          periodEnd: number | null;
          periodStart: number | null;
          pointsAchieved: string | null;
          schoolingMode: string | null;
          staffId: string;
          trainingFacility: string | null;
          trainingLocation: string | null;
        };
        Insert: {
          classification?: string | null;
          field?: string | null;
          id: string;
          isInternational: boolean;
          issueDate?: number | null;
          level?: string | null;
          name: string;
          periodEnd?: number | null;
          periodStart?: number | null;
          pointsAchieved?: string | null;
          schoolingMode?: string | null;
          staffId: string;
          trainingFacility?: string | null;
          trainingLocation?: string | null;
        };
        Update: {
          classification?: string | null;
          field?: string | null;
          id?: string;
          isInternational?: boolean;
          issueDate?: number | null;
          level?: string | null;
          name?: string;
          periodEnd?: number | null;
          periodStart?: number | null;
          pointsAchieved?: string | null;
          schoolingMode?: string | null;
          staffId?: string;
          trainingFacility?: string | null;
          trainingLocation?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Certification_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      Cities: {
        Row: {
          cityCode: string;
          cityName: string;
        };
        Insert: {
          cityCode: string;
          cityName: string;
        };
        Update: {
          cityCode?: string;
          cityName?: string;
        };
        Relationships: [];
      };
      Conclusion: {
        Row: {
          appointmentId: string | null;
          content: string | null;
          createdAt: string;
          createdBy: string | null;
          id: string;
          updatedAt: number | null;
        };
        Insert: {
          appointmentId?: string | null;
          content?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          updatedAt?: number | null;
        };
        Update: {
          appointmentId?: string | null;
          content?: string | null;
          createdAt?: string;
          createdBy?: string | null;
          id?: string;
          updatedAt?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "Conclusion_appointmentId_fkey";
            columns: ["appointmentId"];
            referencedRelation: "Appointment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Conclusion_createdBy_fkey";
            columns: ["createdBy"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      DataMonitor: {
        Row: {
          create_at: string | null;
          DBP: string | null;
          host_name: string | null;
          HR: string | null;
          id: string;
          P: string | null;
          RR: string | null;
          SBP: string | null;
          SpO2: string | null;
          Temp: string | null;
          Wt: string | null;
        };
        Insert: {
          create_at?: string | null;
          DBP?: string | null;
          host_name?: string | null;
          HR?: string | null;
          id?: string;
          P?: string | null;
          RR?: string | null;
          SBP?: string | null;
          SpO2?: string | null;
          Temp?: string | null;
          Wt?: string | null;
        };
        Update: {
          create_at?: string | null;
          DBP?: string | null;
          host_name?: string | null;
          HR?: string | null;
          id?: string;
          P?: string | null;
          RR?: string | null;
          SBP?: string | null;
          SpO2?: string | null;
          Temp?: string | null;
          Wt?: string | null;
        };
        Relationships: [];
      };
      Degree: {
        Row: {
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          description: string;
          id: string;
          name: string;
        };
        Update: {
          description?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Device: {
        Row: {
          availabilityStatus: Json | null;
          biologicalSourceEvent: Json | null;
          category: Json | null;
          conformsTo: Json | null;
          contact: Json | null;
          cycle: Json | null;
          definition: Json | null;
          displayName: string | null;
          duration: Json | null;
          endpoint: Json | null;
          expirationDate: number | null;
          gateway: Json | null;
          id: string;
          identifier: Json | null;
          location: Json | null;
          lotNumber: string | null;
          manufactureDate: number | null;
          manufacturer: string | null;
          mode: Json | null;
          modelNumber: string | null;
          name: Json | null;
          note: Json | null;
          owner: Json | null;
          parent: Json | null;
          partNumber: string | null;
          property: Json | null;
          resourceType: string | null;
          safety: Json | null;
          serialNumber: string | null;
          status: string | null;
          type: Json | null;
          udiCarrier: Json | null;
          url: string | null;
          version: Json | null;
        };
        Insert: {
          availabilityStatus?: Json | null;
          biologicalSourceEvent?: Json | null;
          category?: Json | null;
          conformsTo?: Json | null;
          contact?: Json | null;
          cycle?: Json | null;
          definition?: Json | null;
          displayName?: string | null;
          duration?: Json | null;
          endpoint?: Json | null;
          expirationDate?: number | null;
          gateway?: Json | null;
          id: string;
          identifier?: Json | null;
          location?: Json | null;
          lotNumber?: string | null;
          manufactureDate?: number | null;
          manufacturer?: string | null;
          mode?: Json | null;
          modelNumber?: string | null;
          name?: Json | null;
          note?: Json | null;
          owner?: Json | null;
          parent?: Json | null;
          partNumber?: string | null;
          property?: Json | null;
          resourceType?: string | null;
          safety?: Json | null;
          serialNumber?: string | null;
          status?: string | null;
          type?: Json | null;
          udiCarrier?: Json | null;
          url?: string | null;
          version?: Json | null;
        };
        Update: {
          availabilityStatus?: Json | null;
          biologicalSourceEvent?: Json | null;
          category?: Json | null;
          conformsTo?: Json | null;
          contact?: Json | null;
          cycle?: Json | null;
          definition?: Json | null;
          displayName?: string | null;
          duration?: Json | null;
          endpoint?: Json | null;
          expirationDate?: number | null;
          gateway?: Json | null;
          id?: string;
          identifier?: Json | null;
          location?: Json | null;
          lotNumber?: string | null;
          manufactureDate?: number | null;
          manufacturer?: string | null;
          mode?: Json | null;
          modelNumber?: string | null;
          name?: Json | null;
          note?: Json | null;
          owner?: Json | null;
          parent?: Json | null;
          partNumber?: string | null;
          property?: Json | null;
          resourceType?: string | null;
          safety?: Json | null;
          serialNumber?: string | null;
          status?: string | null;
          type?: Json | null;
          udiCarrier?: Json | null;
          url?: string | null;
          version?: Json | null;
        };
        Relationships: [];
      };
      DeviceDefinition: {
        Row: {
          chargeItem: Json | null;
          classification: Json | null;
          conformsTo: Json | null;
          contact: Json | null;
          correctiveAction: Json | null;
          description: string | null;
          deviceName: Json | null;
          guideline: Json | null;
          hasPart: Json | null;
          id: string;
          identifier: Json | null;
          languageCode: Json | null;
          link: Json | null;
          manufacturer: Json | null;
          material: Json | null;
          modelNumber: string | null;
          note: Json | null;
          owner: Json | null;
          packaging: Json | null;
          partNumber: string | null;
          productionIdentifierInUDI: string[] | null;
          property: Json | null;
          regulatoryIdentifier: Json | null;
          resourceType: string;
          safety: Json | null;
          shelfLifeStorage: Json | null;
          udiDeviceIdentifier: Json | null;
          version: Json | null;
        };
        Insert: {
          chargeItem?: Json | null;
          classification?: Json | null;
          conformsTo?: Json | null;
          contact?: Json | null;
          correctiveAction?: Json | null;
          description?: string | null;
          deviceName?: Json | null;
          guideline?: Json | null;
          hasPart?: Json | null;
          id: string;
          identifier?: Json | null;
          languageCode?: Json | null;
          link?: Json | null;
          manufacturer?: Json | null;
          material?: Json | null;
          modelNumber?: string | null;
          note?: Json | null;
          owner?: Json | null;
          packaging?: Json | null;
          partNumber?: string | null;
          productionIdentifierInUDI?: string[] | null;
          property?: Json | null;
          regulatoryIdentifier?: Json | null;
          resourceType?: string;
          safety?: Json | null;
          shelfLifeStorage?: Json | null;
          udiDeviceIdentifier?: Json | null;
          version?: Json | null;
        };
        Update: {
          chargeItem?: Json | null;
          classification?: Json | null;
          conformsTo?: Json | null;
          contact?: Json | null;
          correctiveAction?: Json | null;
          description?: string | null;
          deviceName?: Json | null;
          guideline?: Json | null;
          hasPart?: Json | null;
          id?: string;
          identifier?: Json | null;
          languageCode?: Json | null;
          link?: Json | null;
          manufacturer?: Json | null;
          material?: Json | null;
          modelNumber?: string | null;
          note?: Json | null;
          owner?: Json | null;
          packaging?: Json | null;
          partNumber?: string | null;
          productionIdentifierInUDI?: string[] | null;
          property?: Json | null;
          regulatoryIdentifier?: Json | null;
          resourceType?: string;
          safety?: Json | null;
          shelfLifeStorage?: Json | null;
          udiDeviceIdentifier?: Json | null;
          version?: Json | null;
        };
        Relationships: [];
      };
      DeviceMetric: {
        Row: {
          calibration: Json | null;
          category: string | null;
          color: string | null;
          device: Json | null;
          id: string;
          identifier: Json | null;
          measurementFrequency: Json | null;
          operationalStatus: string | null;
          resourceType: string;
          type: Json | null;
          unit: Json | null;
        };
        Insert: {
          calibration?: Json | null;
          category?: string | null;
          color?: string | null;
          device?: Json | null;
          id: string;
          identifier?: Json | null;
          measurementFrequency?: Json | null;
          operationalStatus?: string | null;
          resourceType?: string;
          type?: Json | null;
          unit?: Json | null;
        };
        Update: {
          calibration?: Json | null;
          category?: string | null;
          color?: string | null;
          device?: Json | null;
          id?: string;
          identifier?: Json | null;
          measurementFrequency?: Json | null;
          operationalStatus?: string | null;
          resourceType?: string;
          type?: Json | null;
          unit?: Json | null;
        };
        Relationships: [];
      };
      DeviceRequest: {
        Row: {
          asNeeded: boolean | null;
          asNeededFor: Json | null;
          authoredOn: number | null;
          basedOn: Json | null;
          code: Json | null;
          doNotPerform: boolean | null;
          encounter: Json | null;
          groupIdentifier: Json | null;
          id: string;
          identifier: Json | null;
          instantiatesCanonical: string[] | null;
          instantiateUri: string[] | null;
          insurance: Json | null;
          intent: string;
          note: Json | null;
          occurrenceDateTime: number | null;
          occurrencePeriod: Json | null;
          occurrenceTiming: Json | null;
          parameter: Json | null;
          performer: Json | null;
          priority: string | null;
          quantity: number | null;
          reason: Json | null;
          relevantHistory: Json | null;
          replaces: Json | null;
          requester: Json | null;
          resourceType: string;
          status: string | null;
          subject: Json;
          supportingInfo: Json | null;
        };
        Insert: {
          asNeeded?: boolean | null;
          asNeededFor?: Json | null;
          authoredOn?: number | null;
          basedOn?: Json | null;
          code?: Json | null;
          doNotPerform?: boolean | null;
          encounter?: Json | null;
          groupIdentifier?: Json | null;
          id: string;
          identifier?: Json | null;
          instantiatesCanonical?: string[] | null;
          instantiateUri?: string[] | null;
          insurance?: Json | null;
          intent: string;
          note?: Json | null;
          occurrenceDateTime?: number | null;
          occurrencePeriod?: Json | null;
          occurrenceTiming?: Json | null;
          parameter?: Json | null;
          performer?: Json | null;
          priority?: string | null;
          quantity?: number | null;
          reason?: Json | null;
          relevantHistory?: Json | null;
          replaces?: Json | null;
          requester?: Json | null;
          resourceType?: string;
          status?: string | null;
          subject: Json;
          supportingInfo?: Json | null;
        };
        Update: {
          asNeeded?: boolean | null;
          asNeededFor?: Json | null;
          authoredOn?: number | null;
          basedOn?: Json | null;
          code?: Json | null;
          doNotPerform?: boolean | null;
          encounter?: Json | null;
          groupIdentifier?: Json | null;
          id?: string;
          identifier?: Json | null;
          instantiatesCanonical?: string[] | null;
          instantiateUri?: string[] | null;
          insurance?: Json | null;
          intent?: string;
          note?: Json | null;
          occurrenceDateTime?: number | null;
          occurrencePeriod?: Json | null;
          occurrenceTiming?: Json | null;
          parameter?: Json | null;
          performer?: Json | null;
          priority?: string | null;
          quantity?: number | null;
          reason?: Json | null;
          relevantHistory?: Json | null;
          replaces?: Json | null;
          requester?: Json | null;
          resourceType?: string;
          status?: string | null;
          subject?: Json;
          supportingInfo?: Json | null;
        };
        Relationships: [];
      };
      Discipline: {
        Row: {
          decisionCode: string | null;
          decisionDate: number | null;
          departmentDecisionId: string | null;
          description: string | null;
          effectiveDate: number | null;
          files: Json | null;
          formDiscipline: string | null;
          id: string;
          signerDecision: string | null;
          staffId: string | null;
        };
        Insert: {
          decisionCode?: string | null;
          decisionDate?: number | null;
          departmentDecisionId?: string | null;
          description?: string | null;
          effectiveDate?: number | null;
          files?: Json | null;
          formDiscipline?: string | null;
          id: string;
          signerDecision?: string | null;
          staffId?: string | null;
        };
        Update: {
          decisionCode?: string | null;
          decisionDate?: number | null;
          departmentDecisionId?: string | null;
          description?: string | null;
          effectiveDate?: number | null;
          files?: Json | null;
          formDiscipline?: string | null;
          id?: string;
          signerDecision?: string | null;
          staffId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Discipline_departmentDecisionId_fkey";
            columns: ["departmentDecisionId"];
            referencedRelation: "Organization";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Discipline_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      Disease: {
        Row: {
          chaptercode: string;
          chaptername1: string;
          chaptername2: string;
          chapternumber: string;
          description1: string;
          description2: string;
          detailcode: string;
          diseasecode: string;
          id: string;
          maingroupcode: string;
          maingroupname1: string;
          maingroupname2: string;
          name1: string;
          name2: string;
          subgroupcode1: string;
          subgroupcode2: string;
          subgroupname1: string;
          subgroupname11: string;
          subgroupname2: string;
          subgroupname22: string;
          teamcode: string;
          typecode: string;
          typename1: string;
          typename2: string;
        };
        Insert: {
          chaptercode: string;
          chaptername1: string;
          chaptername2: string;
          chapternumber: string;
          description1: string;
          description2: string;
          detailcode: string;
          diseasecode: string;
          id: string;
          maingroupcode: string;
          maingroupname1: string;
          maingroupname2: string;
          name1: string;
          name2: string;
          subgroupcode1: string;
          subgroupcode2: string;
          subgroupname1: string;
          subgroupname11: string;
          subgroupname2: string;
          subgroupname22: string;
          teamcode: string;
          typecode: string;
          typename1: string;
          typename2: string;
        };
        Update: {
          chaptercode?: string;
          chaptername1?: string;
          chaptername2?: string;
          chapternumber?: string;
          description1?: string;
          description2?: string;
          detailcode?: string;
          diseasecode?: string;
          id?: string;
          maingroupcode?: string;
          maingroupname1?: string;
          maingroupname2?: string;
          name1?: string;
          name2?: string;
          subgroupcode1?: string;
          subgroupcode2?: string;
          subgroupname1?: string;
          subgroupname11?: string;
          subgroupname2?: string;
          subgroupname22?: string;
          teamcode?: string;
          typecode?: string;
          typename1?: string;
          typename2?: string;
        };
        Relationships: [];
      };
      Districts: {
        Row: {
          cityId: string;
          cityName: string;
          districtCode: string;
          districtName: string;
        };
        Insert: {
          cityId: string;
          cityName: string;
          districtCode: string;
          districtName: string;
        };
        Update: {
          cityId?: string;
          cityName?: string;
          districtCode?: string;
          districtName?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Districts_cityId_fkey";
            columns: ["cityId"];
            referencedRelation: "Cities";
            referencedColumns: ["cityCode"];
          }
        ];
      };
      DocumentAppointment: {
        Row: {
          appointmentId: string | null;
          created_at: string;
          documentTime: number | null;
          fileNameOriginal: string | null;
          id: number;
          name: string | null;
          path: string | null;
          url: string | null;
        };
        Insert: {
          appointmentId?: string | null;
          created_at?: string;
          documentTime?: number | null;
          fileNameOriginal?: string | null;
          id?: number;
          name?: string | null;
          path?: string | null;
          url?: string | null;
        };
        Update: {
          appointmentId?: string | null;
          created_at?: string;
          documentTime?: number | null;
          fileNameOriginal?: string | null;
          id?: number;
          name?: string | null;
          path?: string | null;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "DocumentAppointment_appointmentId_fkey";
            columns: ["appointmentId"];
            referencedRelation: "Appointment";
            referencedColumns: ["id"];
          }
        ];
      };
      Education: {
        Row: {
          attachment: Json | null;
          dateOfIssue: number;
          end: number | null;
          id: string;
          isSent: boolean;
          note: string | null;
          priority: boolean;
          rank: string;
          staffId: string;
          start: number | null;
          trainingFacility: string;
          trainingForm: string;
          trainingLevel: string;
          trainingSpecialize: string;
          trainingTitle: string;
          trainingType: string;
        };
        Insert: {
          attachment?: Json | null;
          dateOfIssue: number;
          end?: number | null;
          id: string;
          isSent?: boolean;
          note?: string | null;
          priority?: boolean;
          rank: string;
          staffId: string;
          start?: number | null;
          trainingFacility: string;
          trainingForm: string;
          trainingLevel: string;
          trainingSpecialize: string;
          trainingTitle: string;
          trainingType: string;
        };
        Update: {
          attachment?: Json | null;
          dateOfIssue?: number;
          end?: number | null;
          id?: string;
          isSent?: boolean;
          note?: string | null;
          priority?: boolean;
          rank?: string;
          staffId?: string;
          start?: number | null;
          trainingFacility?: string;
          trainingForm?: string;
          trainingLevel?: string;
          trainingSpecialize?: string;
          trainingTitle?: string;
          trainingType?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Education_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      Furlough: {
        Row: {
          approverId: string;
          daysCountInPast: number;
          daysCountOfYear: number;
          description: string | null;
          id: string;
          periodEnd: number;
          periodStart: number;
          reason: string;
          receiverId: string;
          relatedId: string[] | null;
          site: string;
          staffId: string;
          statusReview: Database["public"]["Enums"]["StatusReview"];
        };
        Insert: {
          approverId: string;
          daysCountInPast: number;
          daysCountOfYear: number;
          description?: string | null;
          id: string;
          periodEnd: number;
          periodStart: number;
          reason: string;
          receiverId: string;
          relatedId?: string[] | null;
          site: string;
          staffId: string;
          statusReview: Database["public"]["Enums"]["StatusReview"];
        };
        Update: {
          approverId?: string;
          daysCountInPast?: number;
          daysCountOfYear?: number;
          description?: string | null;
          id?: string;
          periodEnd?: number;
          periodStart?: number;
          reason?: string;
          receiverId?: string;
          relatedId?: string[] | null;
          site?: string;
          staffId?: string;
          statusReview?: Database["public"]["Enums"]["StatusReview"];
        };
        Relationships: [
          {
            foreignKeyName: "Furlough_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      ICU_Patient: {
        Row: {
          address: string | null;
          deviceId: string | null;
          deviceName: string | null;
          dOB: number | null;
          end: number | null;
          id: string;
          identifier: string | null;
          insuranceId: string | null;
          name: string;
          patientId: string | null;
          start: number | null;
          status: string | null;
        };
        Insert: {
          address?: string | null;
          deviceId?: string | null;
          deviceName?: string | null;
          dOB?: number | null;
          end?: number | null;
          id?: string;
          identifier?: string | null;
          insuranceId?: string | null;
          name: string;
          patientId?: string | null;
          start?: number | null;
          status?: string | null;
        };
        Update: {
          address?: string | null;
          deviceId?: string | null;
          deviceName?: string | null;
          dOB?: number | null;
          end?: number | null;
          id?: string;
          identifier?: string | null;
          insuranceId?: string | null;
          name?: string;
          patientId?: string | null;
          start?: number | null;
          status?: string | null;
        };
        Relationships: [];
      };
      Location: {
        Row: {
          address: Json | null;
          alias: string[] | null;
          characteristic: Json | null;
          contact: Json | null;
          description: string | null;
          endpoint: Json | null;
          form: Json | null;
          hoursOfOperation: Json | null;
          id: string;
          identifier: Json | null;
          managingOrganization: Json | null;
          mode: string | null;
          name: string;
          operationalStatus: Json | null;
          partOf: Json | null;
          partOfId: string | null;
          position: Json | null;
          resourceType: string;
          status: Database["public"]["Enums"]["Status"] | null;
          type: Json | null;
          virtualService: Json | null;
        };
        Insert: {
          address?: Json | null;
          alias?: string[] | null;
          characteristic?: Json | null;
          contact?: Json | null;
          description?: string | null;
          endpoint?: Json | null;
          form?: Json | null;
          hoursOfOperation?: Json | null;
          id: string;
          identifier?: Json | null;
          managingOrganization?: Json | null;
          mode?: string | null;
          name: string;
          operationalStatus?: Json | null;
          partOf?: Json | null;
          partOfId?: string | null;
          position?: Json | null;
          resourceType?: string;
          status?: Database["public"]["Enums"]["Status"] | null;
          type?: Json | null;
          virtualService?: Json | null;
        };
        Update: {
          address?: Json | null;
          alias?: string[] | null;
          characteristic?: Json | null;
          contact?: Json | null;
          description?: string | null;
          endpoint?: Json | null;
          form?: Json | null;
          hoursOfOperation?: Json | null;
          id?: string;
          identifier?: Json | null;
          managingOrganization?: Json | null;
          mode?: string | null;
          name?: string;
          operationalStatus?: Json | null;
          partOf?: Json | null;
          partOfId?: string | null;
          position?: Json | null;
          resourceType?: string;
          status?: Database["public"]["Enums"]["Status"] | null;
          type?: Json | null;
          virtualService?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "Location_partOfId_fkey";
            columns: ["partOfId"];
            referencedRelation: "Location";
            referencedColumns: ["id"];
          }
        ];
      };
      Manufacturer: {
        Row: {
          code: string;
          country: string;
          description: string | null;
          id: string;
          name: string;
        };
        Insert: {
          code: string;
          country: string;
          description?: string | null;
          id: string;
          name: string;
        };
        Update: {
          code?: string;
          country?: string;
          description?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Material: {
        Row: {
          category: string;
          code: string | null;
          country: string | null;
          description: string | null;
          group: string;
          id: string;
          manufacturer: string | null;
          name: string | null;
          signalCode: string | null;
          type: string | null;
          unit: string | null;
        };
        Insert: {
          category: string;
          code?: string | null;
          country?: string | null;
          description?: string | null;
          group: string;
          id: string;
          manufacturer?: string | null;
          name?: string | null;
          signalCode?: string | null;
          type?: string | null;
          unit?: string | null;
        };
        Update: {
          category?: string;
          code?: string | null;
          country?: string | null;
          description?: string | null;
          group?: string;
          id?: string;
          manufacturer?: string | null;
          name?: string | null;
          signalCode?: string | null;
          type?: string | null;
          unit?: string | null;
        };
        Relationships: [];
      };
      Medicine: {
        Row: {
          content: string | null;
          country: string;
          id: string;
          ingredient: string;
          ingredientCode: string;
          ingredientRegistration: string;
          manufacture: string;
          name: string;
          pack: string;
          registrationNumber: string;
          sugar: string;
          sugarCode: string;
        };
        Insert: {
          content?: string | null;
          country: string;
          id: string;
          ingredient: string;
          ingredientCode: string;
          ingredientRegistration: string;
          manufacture: string;
          name: string;
          pack: string;
          registrationNumber: string;
          sugar: string;
          sugarCode: string;
        };
        Update: {
          content?: string | null;
          country?: string;
          id?: string;
          ingredient?: string;
          ingredientCode?: string;
          ingredientRegistration?: string;
          manufacture?: string;
          name?: string;
          pack?: string;
          registrationNumber?: string;
          sugar?: string;
          sugarCode?: string;
        };
        Relationships: [];
      };
      Monitor: {
        Row: {
          ae_title: string | null;
          host_name: string | null;
          id: number;
          port: string | null;
          status: boolean | null;
        };
        Insert: {
          ae_title?: string | null;
          host_name?: string | null;
          id?: number;
          port?: string | null;
          status?: boolean | null;
        };
        Update: {
          ae_title?: string | null;
          host_name?: string | null;
          id?: number;
          port?: string | null;
          status?: boolean | null;
        };
        Relationships: [];
      };
      Organization: {
        Row: {
          active: boolean | null;
          alias: string[] | null;
          contact: Json | null;
          createdAt: string;
          description: string | null;
          endpoint: Json | null;
          id: string;
          identifier: Json | null;
          logo: string | null;
          name: string | null;
          partOfId: string | null;
          qualification: Json | null;
          type: Json | null;
          unitId: string;
          updatedAt: string;
          website: string | null;
        };
        Insert: {
          active?: boolean | null;
          alias?: string[] | null;
          contact?: Json | null;
          createdAt?: string;
          description?: string | null;
          endpoint?: Json | null;
          id: string;
          identifier?: Json | null;
          logo?: string | null;
          name?: string | null;
          partOfId?: string | null;
          qualification?: Json | null;
          type?: Json | null;
          unitId: string;
          updatedAt?: string;
          website?: string | null;
        };
        Update: {
          active?: boolean | null;
          alias?: string[] | null;
          contact?: Json | null;
          createdAt?: string;
          description?: string | null;
          endpoint?: Json | null;
          id?: string;
          identifier?: Json | null;
          logo?: string | null;
          name?: string | null;
          partOfId?: string | null;
          qualification?: Json | null;
          type?: Json | null;
          unitId?: string;
          updatedAt?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      OrganizationalExpertise: {
        Row: {
          description: string | null;
          fieldId: string;
          fieldName: string;
          id: string;
          updatedAt: number | null;
          updatedBy: string | null;
        };
        Insert: {
          description?: string | null;
          fieldId: string;
          fieldName: string;
          id: string;
          updatedAt?: number | null;
          updatedBy?: string | null;
        };
        Update: {
          description?: string | null;
          fieldId?: string;
          fieldName?: string;
          id?: string;
          updatedAt?: number | null;
          updatedBy?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "OrganizationalExpertise_updatedBy_fkey";
            columns: ["updatedBy"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      OrganizationToStaff: {
        Row: {
          organizationId: string;
          staffId: string;
        };
        Insert: {
          organizationId: string;
          staffId: string;
        };
        Update: {
          organizationId?: string;
          staffId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "OrganizationToStaff_organizationId_fkey";
            columns: ["organizationId"];
            referencedRelation: "Organization";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "OrganizationToStaff_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      Patient: {
        Row: {
          active: boolean | null;
          address: Json | null;
          birthDate: number | null;
          communication: Json | null;
          contact: Json | null;
          deceasedBoolean: boolean;
          deceasedDateTime: number | null;
          gender: Database["public"]["Enums"]["Gender"] | null;
          id: string;
          identifier: Json | null;
          link: Json | null;
          managingOrganization: Json | null;
          maritalStatus: Json | null;
          multipleBirthBoolean: boolean;
          multipleBirthInterger: number | null;
          name: Json | null;
          parentId: string | null;
          photo: Json | null;
          resourceType: string;
          telecom: Json | null;
        };
        Insert: {
          active?: boolean | null;
          address?: Json | null;
          birthDate?: number | null;
          communication?: Json | null;
          contact?: Json | null;
          deceasedBoolean?: boolean;
          deceasedDateTime?: number | null;
          gender?: Database["public"]["Enums"]["Gender"] | null;
          id: string;
          identifier?: Json | null;
          link?: Json | null;
          managingOrganization?: Json | null;
          maritalStatus?: Json | null;
          multipleBirthBoolean?: boolean;
          multipleBirthInterger?: number | null;
          name?: Json | null;
          parentId?: string | null;
          photo?: Json | null;
          resourceType?: string;
          telecom?: Json | null;
        };
        Update: {
          active?: boolean | null;
          address?: Json | null;
          birthDate?: number | null;
          communication?: Json | null;
          contact?: Json | null;
          deceasedBoolean?: boolean;
          deceasedDateTime?: number | null;
          gender?: Database["public"]["Enums"]["Gender"] | null;
          id?: string;
          identifier?: Json | null;
          link?: Json | null;
          managingOrganization?: Json | null;
          maritalStatus?: Json | null;
          multipleBirthBoolean?: boolean;
          multipleBirthInterger?: number | null;
          name?: Json | null;
          parentId?: string | null;
          photo?: Json | null;
          resourceType?: string;
          telecom?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "Patient_parentId_fkey";
            columns: ["parentId"];
            referencedRelation: "Patient";
            referencedColumns: ["id"];
          }
        ];
      };
      Position: {
        Row: {
          code: string;
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          code: string;
          description: string;
          id: string;
          name: string;
        };
        Update: {
          code?: string;
          description?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      Practitioner: {
        Row: {
          accountId: string | null;
          active: boolean | null;
          address: Json | null;
          birthDate: number | null;
          communication: Json | null;
          deceasedBoolean: boolean | null;
          deceasedDateTime: number | null;
          education: string | null;
          gender: Database["public"]["Enums"]["Gender"] | null;
          id: string;
          identifier: Json | null;
          link: Json | null;
          name: Json | null;
          nationality: string | null;
          organizationIds: string[] | null;
          photo: Json | null;
          qualification: Json | null;
          religion: string | null;
          speciality: string | null;
          staffId: string | null;
          telecom: Json | null;
        };
        Insert: {
          accountId?: string | null;
          active?: boolean | null;
          address?: Json | null;
          birthDate?: number | null;
          communication?: Json | null;
          deceasedBoolean?: boolean | null;
          deceasedDateTime?: number | null;
          education?: string | null;
          gender?: Database["public"]["Enums"]["Gender"] | null;
          id: string;
          identifier?: Json | null;
          link?: Json | null;
          name?: Json | null;
          nationality?: string | null;
          organizationIds?: string[] | null;
          photo?: Json | null;
          qualification?: Json | null;
          religion?: string | null;
          speciality?: string | null;
          staffId?: string | null;
          telecom?: Json | null;
        };
        Update: {
          accountId?: string | null;
          active?: boolean | null;
          address?: Json | null;
          birthDate?: number | null;
          communication?: Json | null;
          deceasedBoolean?: boolean | null;
          deceasedDateTime?: number | null;
          education?: string | null;
          gender?: Database["public"]["Enums"]["Gender"] | null;
          id?: string;
          identifier?: Json | null;
          link?: Json | null;
          name?: Json | null;
          nationality?: string | null;
          organizationIds?: string[] | null;
          photo?: Json | null;
          qualification?: Json | null;
          religion?: string | null;
          speciality?: string | null;
          staffId?: string | null;
          telecom?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "Practitioner_accountId_fkey";
            columns: ["accountId"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          email: string | null;
          id: string;
          image: string | null;
          name: Json | null;
        };
        Insert: {
          email?: string | null;
          id: string;
          image?: string | null;
          name?: Json | null;
        };
        Update: {
          email?: string | null;
          id?: string;
          image?: string | null;
          name?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "profile_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      Property: {
        Row: {
          code: string;
          dataType: string;
          englishName: string;
          id: string;
          name: string;
          note: string | null;
        };
        Insert: {
          code: string;
          dataType: string;
          englishName: string;
          id: string;
          name: string;
          note?: string | null;
        };
        Update: {
          code?: string;
          dataType?: string;
          englishName?: string;
          id?: string;
          name?: string;
          note?: string | null;
        };
        Relationships: [];
      };
      RelatedPerson: {
        Row: {
          address: Json | null;
          career: string | null;
          deceasedBoolean: boolean;
          deceasedDateTime: number | null;
          dOB: number;
          gender: Database["public"]["Enums"]["Gender"];
          id: string;
          name: string;
          note: string | null;
          relatedId: string;
          relatedType: Database["public"]["Enums"]["RelatedType"];
          taxNumber: string | null;
          telecom: Json | null;
          workUnit: string | null;
        };
        Insert: {
          address?: Json | null;
          career?: string | null;
          deceasedBoolean?: boolean;
          deceasedDateTime?: number | null;
          dOB: number;
          gender: Database["public"]["Enums"]["Gender"];
          id: string;
          name: string;
          note?: string | null;
          relatedId: string;
          relatedType: Database["public"]["Enums"]["RelatedType"];
          taxNumber?: string | null;
          telecom?: Json | null;
          workUnit?: string | null;
        };
        Update: {
          address?: Json | null;
          career?: string | null;
          deceasedBoolean?: boolean;
          deceasedDateTime?: number | null;
          dOB?: number;
          gender?: Database["public"]["Enums"]["Gender"];
          id?: string;
          name?: string;
          note?: string | null;
          relatedId?: string;
          relatedType?: Database["public"]["Enums"]["RelatedType"];
          taxNumber?: string | null;
          telecom?: Json | null;
          workUnit?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "RelatedPerson_relatedId_fkey";
            columns: ["relatedId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      role_permissions: {
        Row: {
          id: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Insert: {
          id?: number;
          permission: Database["public"]["Enums"]["app_permission"];
          role: Database["public"]["Enums"]["app_role"];
        };
        Update: {
          id?: number;
          permission?: Database["public"]["Enums"]["app_permission"];
          role?: Database["public"]["Enums"]["app_role"];
        };
        Relationships: [];
      };
      share_links: {
        Row: {
          created_at: string | null;
          devive_name: string | null;
          diagnose_info: string | null;
          diagnose_note: string | null;
          diagnose_result: string | null;
          expiration: string | null;
          health_identification_code: string | null;
          id: string;
          images: string[] | null;
          imaging_service_name: string | null;
          medical_imaging_code: string | null;
          medical_imaging_create_at: string | null;
          medical_imaging_report_at: string | null;
          ordering_physician: string | null;
          patient_doB: string | null;
          patient_gender: string | null;
          patient_id: string | null;
          patient_name: string | null;
          radiologist: string | null;
          role: string | null;
          study_uid: string | null;
          technicians: string | null;
        };
        Insert: {
          created_at?: string | null;
          devive_name?: string | null;
          diagnose_info?: string | null;
          diagnose_note?: string | null;
          diagnose_result?: string | null;
          expiration?: string | null;
          health_identification_code?: string | null;
          id?: string;
          images?: string[] | null;
          imaging_service_name?: string | null;
          medical_imaging_code?: string | null;
          medical_imaging_create_at?: string | null;
          medical_imaging_report_at?: string | null;
          ordering_physician?: string | null;
          patient_doB?: string | null;
          patient_gender?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          radiologist?: string | null;
          role?: string | null;
          study_uid?: string | null;
          technicians?: string | null;
        };
        Update: {
          created_at?: string | null;
          devive_name?: string | null;
          diagnose_info?: string | null;
          diagnose_note?: string | null;
          diagnose_result?: string | null;
          expiration?: string | null;
          health_identification_code?: string | null;
          id?: string;
          images?: string[] | null;
          imaging_service_name?: string | null;
          medical_imaging_code?: string | null;
          medical_imaging_create_at?: string | null;
          medical_imaging_report_at?: string | null;
          ordering_physician?: string | null;
          patient_doB?: string | null;
          patient_gender?: string | null;
          patient_id?: string | null;
          patient_name?: string | null;
          radiologist?: string | null;
          role?: string | null;
          study_uid?: string | null;
          technicians?: string | null;
        };
        Relationships: [];
      };
      Staff: {
        Row: {
          culturalLevel: string | null;
          dojCPV: number | null;
          dojCYU: number | null;
          education: string | null;
          ethnicMinority: string | null;
          habit: string | null;
          id: string;
          nationality: string | null;
          officialDojCPV: number | null;
          religion: string | null;
          speciality: string | null;
          staffId: string | null;
        };
        Insert: {
          culturalLevel?: string | null;
          dojCPV?: number | null;
          dojCYU?: number | null;
          education?: string | null;
          ethnicMinority?: string | null;
          habit?: string | null;
          id?: string;
          nationality?: string | null;
          officialDojCPV?: number | null;
          religion?: string | null;
          speciality?: string | null;
          staffId?: string | null;
        };
        Update: {
          culturalLevel?: string | null;
          dojCPV?: number | null;
          dojCYU?: number | null;
          education?: string | null;
          ethnicMinority?: string | null;
          habit?: string | null;
          id?: string;
          nationality?: string | null;
          officialDojCPV?: number | null;
          religion?: string | null;
          speciality?: string | null;
          staffId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Staff_id_fkey";
            columns: ["id"];
            referencedRelation: "Practitioner";
            referencedColumns: ["id"];
          }
        ];
      };
      Timekeeping: {
        Row: {
          checkIn: string | null;
          checkOut: string | null;
          date: number;
          description: string | null;
          id: string;
          staffId: string;
          status: boolean | null;
          statusReview: Database["public"]["Enums"]["StatusReview"] | null;
          teamId: string;
        };
        Insert: {
          checkIn?: string | null;
          checkOut?: string | null;
          date: number;
          description?: string | null;
          id: string;
          staffId: string;
          status?: boolean | null;
          statusReview?: Database["public"]["Enums"]["StatusReview"] | null;
          teamId: string;
        };
        Update: {
          checkIn?: string | null;
          checkOut?: string | null;
          date?: number;
          description?: string | null;
          id?: string;
          staffId?: string;
          status?: boolean | null;
          statusReview?: Database["public"]["Enums"]["StatusReview"] | null;
          teamId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Timekeeping_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      TrainingProcess: {
        Row: {
          description: string;
          end: number | null;
          files: Json | null;
          id: string;
          name: string;
          project: string;
          staffId: string | null;
          start: number | null;
          trainingform: string;
        };
        Insert: {
          description: string;
          end?: number | null;
          files?: Json | null;
          id: string;
          name: string;
          project: string;
          staffId?: string | null;
          start?: number | null;
          trainingform: string;
        };
        Update: {
          description?: string;
          end?: number | null;
          files?: Json | null;
          id?: string;
          name?: string;
          project?: string;
          staffId?: string | null;
          start?: number | null;
          trainingform?: string;
        };
        Relationships: [
          {
            foreignKeyName: "TrainingProcess_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      TravelProcess: {
        Row: {
          country: string | null;
          description: string | null;
          end: number | null;
          id: string;
          purpose: string | null;
          staffId: string;
          start: number | null;
          status: Database["public"]["Enums"]["TravelStatus"];
        };
        Insert: {
          country?: string | null;
          description?: string | null;
          end?: number | null;
          id: string;
          purpose?: string | null;
          staffId: string;
          start?: number | null;
          status: Database["public"]["Enums"]["TravelStatus"];
        };
        Update: {
          country?: string | null;
          description?: string | null;
          end?: number | null;
          id?: string;
          purpose?: string | null;
          staffId?: string;
          start?: number | null;
          status?: Database["public"]["Enums"]["TravelStatus"];
        };
        Relationships: [
          {
            foreignKeyName: "TravelProcess_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          }
        ];
      };
      user_roles: {
        Row: {
          id: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: number;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: number;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      Wards: {
        Row: {
          cityId: string;
          cityName: string;
          districtId: string;
          districtName: string;
          wardCode: string;
          wardName: string;
        };
        Insert: {
          cityId: string;
          cityName: string;
          districtId: string;
          districtName: string;
          wardCode: string;
          wardName: string;
        };
        Update: {
          cityId?: string;
          cityName?: string;
          districtId?: string;
          districtName?: string;
          wardCode?: string;
          wardName?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Wards_cityId_fkey";
            columns: ["cityId"];
            referencedRelation: "Cities";
            referencedColumns: ["cityCode"];
          },
          {
            foreignKeyName: "Wards_districtId_fkey";
            columns: ["districtId"];
            referencedRelation: "Districts";
            referencedColumns: ["districtCode"];
          }
        ];
      };
      Work: {
        Row: {
          code: string;
          coefficient: number | null;
          decisionDate: number | null;
          decisionNo: string;
          description: string | null;
          id: string;
          name: string;
          organization: string;
          point: number | null;
          start: number | null;
          type: string;
        };
        Insert: {
          code: string;
          coefficient?: number | null;
          decisionDate?: number | null;
          decisionNo: string;
          description?: string | null;
          id: string;
          name: string;
          organization: string;
          point?: number | null;
          start?: number | null;
          type: string;
        };
        Update: {
          code?: string;
          coefficient?: number | null;
          decisionDate?: number | null;
          decisionNo?: string;
          description?: string | null;
          id?: string;
          name?: string;
          organization?: string;
          point?: number | null;
          start?: number | null;
          type?: string;
        };
        Relationships: [];
      };
      WorkingProcess: {
        Row: {
          allowance: string | null;
          coefficient: number | null;
          coefficientsSalary: number | null;
          decisionNumber: string | null;
          degree: string;
          departmentId: string;
          files: Json | null;
          id: string;
          periodEnd: number | null;
          periodStart: number | null;
          position: string;
          staffId: string;
          unitAllowance: string | null;
          unitId: string;
          unitSalary: number | null;
          workingForm: string | null;
        };
        Insert: {
          allowance?: string | null;
          coefficient?: number | null;
          coefficientsSalary?: number | null;
          decisionNumber?: string | null;
          degree: string;
          departmentId: string;
          files?: Json | null;
          id: string;
          periodEnd?: number | null;
          periodStart?: number | null;
          position: string;
          staffId: string;
          unitAllowance?: string | null;
          unitId: string;
          unitSalary?: number | null;
          workingForm?: string | null;
        };
        Update: {
          allowance?: string | null;
          coefficient?: number | null;
          coefficientsSalary?: number | null;
          decisionNumber?: string | null;
          degree?: string;
          departmentId?: string;
          files?: Json | null;
          id?: string;
          periodEnd?: number | null;
          periodStart?: number | null;
          position?: string;
          staffId?: string;
          unitAllowance?: string | null;
          unitId?: string;
          unitSalary?: number | null;
          workingForm?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "WorkingProcess_degree_fkey";
            columns: ["degree"];
            referencedRelation: "Degree";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "WorkingProcess_departmentId_fkey";
            columns: ["departmentId"];
            referencedRelation: "Organization";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "WorkingProcess_position_fkey";
            columns: ["position"];
            referencedRelation: "Position";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "WorkingProcess_staffId_fkey";
            columns: ["staffId"];
            referencedRelation: "Staff";
            referencedColumns: ["staffId"];
          },
          {
            foreignKeyName: "WorkingProcess_unitId_fkey";
            columns: ["unitId"];
            referencedRelation: "Organization";
            referencedColumns: ["unitId"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"];
        };
        Returns: boolean;
      };
      custom_access_token_hook: {
        Args: {
          event: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      app_permission: "appointment.delete" | "appointment.create" | "appointment.update" | "appointment.view";
      app_role:
        | "appointment.admin"
        | "appointment.approve_level_1"
        | "appointment.approve_level_2"
        | "appointment.moderator"
        | "appointment.participant";
      Gender: "male" | "female" | "other" | "unknown";
      RelatedType: "father" | "mother" | "fatherInLaw" | "motherInLaw" | "son" | "daughter";
      Status: "active" | "suspend" | "inactive";
      StatusReview: "draft" | "approved" | "pending" | "rejected";
      TravelStatus: "self" | "recommendation";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads: {
        Row: {
          bucket_id: string;
          created_at: string;
          id: string;
          in_progress_size: number;
          key: string;
          owner_id: string | null;
          upload_signature: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          id: string;
          in_progress_size?: number;
          key: string;
          owner_id?: string | null;
          upload_signature: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          id?: string;
          in_progress_size?: number;
          key?: string;
          owner_id?: string | null;
          upload_signature?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string;
          created_at: string;
          etag: string;
          id: string;
          key: string;
          owner_id: string | null;
          part_number: number;
          size: number;
          upload_id: string;
          version: string;
        };
        Insert: {
          bucket_id: string;
          created_at?: string;
          etag: string;
          id?: string;
          key: string;
          owner_id?: string | null;
          part_number: number;
          size?: number;
          upload_id: string;
          version: string;
        };
        Update: {
          bucket_id?: string;
          created_at?: string;
          etag?: string;
          id?: string;
          key?: string;
          owner_id?: string | null;
          part_number?: number;
          size?: number;
          upload_id?: string;
          version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey";
            columns: ["bucket_id"];
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey";
            columns: ["upload_id"];
            referencedRelation: "s3_multipart_uploads";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          next_key_token?: string;
          next_upload_token?: string;
        };
        Returns: {
          key: string;
          id: string;
          created_at: string;
        }[];
      };
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string;
          prefix_param: string;
          delimiter_param: string;
          max_keys?: number;
          start_after?: string;
          next_token?: string;
        };
        Returns: {
          name: string;
          id: string;
          metadata: Json;
          updated_at: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
