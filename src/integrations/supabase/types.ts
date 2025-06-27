export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          confidence_score: number | null
          created_at: string | null
          data_sources: string[] | null
          description: string
          hospital_id: string
          id: string
          insight_type: string
          patient_id: string
          recommendations: string[] | null
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          description: string
          hospital_id: string
          id?: string
          insight_type: string
          patient_id: string
          recommendations?: string[] | null
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          confidence_score?: number | null
          created_at?: string | null
          data_sources?: string[] | null
          description?: string
          hospital_id?: string
          id?: string
          insight_type?: string
          patient_id?: string
          recommendations?: string[] | null
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          hospital_id: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          patient_id: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          hospital_id: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          hospital_id?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          patient_id?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_charges: {
        Row: {
          adjustment_amount: number | null
          amount: number
          balance_due: number | null
          billing_date: string | null
          charge_code: string
          charge_description: string
          charge_type: string | null
          created_at: string | null
          hospital_id: string
          id: string
          insurance_claim_number: string | null
          medical_record_id: string | null
          patient_id: string
          payment_amount: number | null
          service_date: string
          status: string | null
          units: number | null
        }
        Insert: {
          adjustment_amount?: number | null
          amount: number
          balance_due?: number | null
          billing_date?: string | null
          charge_code: string
          charge_description: string
          charge_type?: string | null
          created_at?: string | null
          hospital_id: string
          id?: string
          insurance_claim_number?: string | null
          medical_record_id?: string | null
          patient_id: string
          payment_amount?: number | null
          service_date: string
          status?: string | null
          units?: number | null
        }
        Update: {
          adjustment_amount?: number | null
          amount?: number
          balance_due?: number | null
          billing_date?: string | null
          charge_code?: string
          charge_description?: string
          charge_type?: string | null
          created_at?: string | null
          hospital_id?: string
          id?: string
          insurance_claim_number?: string | null
          medical_record_id?: string | null
          patient_id?: string
          payment_amount?: number | null
          service_date?: string
          status?: string | null
          units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_charges_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_charges_medical_record_id_fkey"
            columns: ["medical_record_id"]
            isOneToOne: false
            referencedRelation: "medical_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_charges_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_quality_measures: {
        Row: {
          benchmark_rate: number | null
          denominator: number | null
          hospital_id: string
          id: string
          improvement_target: number | null
          last_updated: string | null
          measure_id: string
          measure_name: string
          numerator: number | null
          performance_rate: number | null
          reporting_period: string
          status: string | null
        }
        Insert: {
          benchmark_rate?: number | null
          denominator?: number | null
          hospital_id: string
          id?: string
          improvement_target?: number | null
          last_updated?: string | null
          measure_id: string
          measure_name: string
          numerator?: number | null
          performance_rate?: number | null
          reporting_period: string
          status?: string | null
        }
        Update: {
          benchmark_rate?: number | null
          denominator?: number | null
          hospital_id?: string
          id?: string
          improvement_target?: number | null
          last_updated?: string | null
          measure_id?: string
          measure_name?: string
          numerator?: number | null
          performance_rate?: number | null
          reporting_period?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_quality_measures_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_requests: {
        Row: {
          ai_recommendation: string | null
          clinical_question: string | null
          consulted_physician_id: string | null
          created_at: string
          id: string
          message_id: string
          patient_id: string | null
          requested_specialty_id: string | null
          requesting_physician_id: string | null
          status: string | null
          updated_at: string
          urgency: string | null
        }
        Insert: {
          ai_recommendation?: string | null
          clinical_question?: string | null
          consulted_physician_id?: string | null
          created_at?: string
          id?: string
          message_id: string
          patient_id?: string | null
          requested_specialty_id?: string | null
          requesting_physician_id?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          ai_recommendation?: string | null
          clinical_question?: string | null
          consulted_physician_id?: string | null
          created_at?: string
          id?: string
          message_id?: string
          patient_id?: string | null
          requested_specialty_id?: string | null
          requesting_physician_id?: string | null
          status?: string | null
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_requests_consulted_physician_id_fkey"
            columns: ["consulted_physician_id"]
            isOneToOne: false
            referencedRelation: "physicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_requests_requested_specialty_id_fkey"
            columns: ["requested_specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_requests_requesting_physician_id_fkey"
            columns: ["requesting_physician_id"]
            isOneToOne: false
            referencedRelation: "physicians"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          city: string
          created_at: string | null
          email: string | null
          emr_type: string
          id: string
          license_number: string | null
          name: string
          phone: string
          state: string
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          email?: string | null
          emr_type: string
          id?: string
          license_number?: string | null
          name: string
          phone: string
          state: string
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          email?: string | null
          emr_type?: string
          id?: string
          license_number?: string | null
          name?: string
          phone?: string
          state?: string
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      lab_orders: {
        Row: {
          abnormal_flags: string[] | null
          collected_at: string | null
          completed_at: string | null
          id: string
          notes: string | null
          ordered_at: string | null
          ordered_by: string
          patient_id: string
          priority: string | null
          reference_ranges: Json | null
          results: Json | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          test_code: string | null
          test_name: string
        }
        Insert: {
          abnormal_flags?: string[] | null
          collected_at?: string | null
          completed_at?: string | null
          id?: string
          notes?: string | null
          ordered_at?: string | null
          ordered_by: string
          patient_id: string
          priority?: string | null
          reference_ranges?: Json | null
          results?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          test_code?: string | null
          test_name: string
        }
        Update: {
          abnormal_flags?: string[] | null
          collected_at?: string | null
          completed_at?: string | null
          id?: string
          notes?: string | null
          ordered_at?: string | null
          ordered_by?: string
          patient_id?: string
          priority?: string | null
          reference_ranges?: Json | null
          results?: Json | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          test_code?: string | null
          test_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_orders_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          assessment: string | null
          chief_complaint: string | null
          created_at: string | null
          diagnosis_codes: string[] | null
          discharge_summary: string | null
          encounter_type: string
          follow_up_instructions: string | null
          history_present_illness: string | null
          hospital_id: string
          id: string
          patient_id: string
          physical_examination: string | null
          plan: string | null
          procedure_codes: string[] | null
          provider_id: string
          updated_at: string | null
          visit_date: string | null
        }
        Insert: {
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis_codes?: string[] | null
          discharge_summary?: string | null
          encounter_type: string
          follow_up_instructions?: string | null
          history_present_illness?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          physical_examination?: string | null
          plan?: string | null
          procedure_codes?: string[] | null
          provider_id: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Update: {
          assessment?: string | null
          chief_complaint?: string | null
          created_at?: string | null
          diagnosis_codes?: string[] | null
          discharge_summary?: string | null
          encounter_type?: string
          follow_up_instructions?: string | null
          history_present_illness?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          physical_examination?: string | null
          plan?: string | null
          procedure_codes?: string[] | null
          provider_id?: string
          updated_at?: string | null
          visit_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          dosage: string
          end_date: string | null
          frequency: string
          generic_name: string | null
          id: string
          indication: string | null
          instructions: string | null
          last_filled: string | null
          medication_name: string
          ndc_number: string | null
          notes: string | null
          patient_id: string
          pharmacy_name: string | null
          prescribed_at: string | null
          prescribed_by: string
          quantity: number | null
          refills: number | null
          route: string
          start_date: string
          status: string | null
        }
        Insert: {
          dosage: string
          end_date?: string | null
          frequency: string
          generic_name?: string | null
          id?: string
          indication?: string | null
          instructions?: string | null
          last_filled?: string | null
          medication_name: string
          ndc_number?: string | null
          notes?: string | null
          patient_id: string
          pharmacy_name?: string | null
          prescribed_at?: string | null
          prescribed_by: string
          quantity?: number | null
          refills?: number | null
          route: string
          start_date: string
          status?: string | null
        }
        Update: {
          dosage?: string
          end_date?: string | null
          frequency?: string
          generic_name?: string | null
          id?: string
          indication?: string | null
          instructions?: string | null
          last_filled?: string | null
          medication_name?: string
          ndc_number?: string | null
          notes?: string | null
          patient_id?: string
          pharmacy_name?: string | null
          prescribed_at?: string | null
          prescribed_by?: string
          quantity?: number | null
          refills?: number | null
          route?: string
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medications_prescribed_by_fkey"
            columns: ["prescribed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      on_call_schedules: {
        Row: {
          created_at: string
          end_time: string
          id: string
          is_primary: boolean | null
          physician_id: string
          specialty_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          is_primary?: boolean | null
          physician_id: string
          specialty_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          is_primary?: boolean | null
          physician_id?: string
          specialty_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "on_call_schedules_physician_id_fkey"
            columns: ["physician_id"]
            isOneToOne: false
            referencedRelation: "physicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "on_call_schedules_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          admission_date: string | null
          allergies: string[] | null
          bed_number: string | null
          blood_type: string | null
          city: string | null
          created_at: string | null
          current_medications: string[] | null
          date_of_birth: string
          discharge_date: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          hospital_id: string
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string
          medical_conditions: string[] | null
          mrn: string
          phone: string | null
          room_number: string | null
          ssn: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          allergies?: string[] | null
          bed_number?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          current_medications?: string[] | null
          date_of_birth: string
          discharge_date?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          hospital_id: string
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name: string
          medical_conditions?: string[] | null
          mrn: string
          phone?: string | null
          room_number?: string | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          allergies?: string[] | null
          bed_number?: string | null
          blood_type?: string | null
          city?: string | null
          created_at?: string | null
          current_medications?: string[] | null
          date_of_birth?: string
          discharge_date?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          hospital_id?: string
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          medical_conditions?: string[] | null
          mrn?: string
          phone?: string | null
          room_number?: string | null
          ssn?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      physicians: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          phone: string | null
          specialty_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_active?: boolean | null
          last_name: string
          phone?: string | null
          specialty_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          phone?: string | null
          specialty_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physicians_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          license_number: string | null
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          license_number?: string | null
          phone?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          license_number?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      radiology_orders: {
        Row: {
          ai_analysis: Json | null
          body_part: string
          clinical_indication: string | null
          critical_results: boolean | null
          findings: string | null
          id: string
          images_url: string[] | null
          impression: string | null
          modality: string
          ordered_at: string | null
          ordered_by: string | null
          patient_id: string
          performed_at: string | null
          priority: string | null
          radiologist_id: string | null
          recommendations: string | null
          reviewed_at: string | null
          scheduled_at: string | null
          status: string | null
          study_type: string
        }
        Insert: {
          ai_analysis?: Json | null
          body_part: string
          clinical_indication?: string | null
          critical_results?: boolean | null
          findings?: string | null
          id?: string
          images_url?: string[] | null
          impression?: string | null
          modality: string
          ordered_at?: string | null
          ordered_by?: string | null
          patient_id: string
          performed_at?: string | null
          priority?: string | null
          radiologist_id?: string | null
          recommendations?: string | null
          reviewed_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          study_type: string
        }
        Update: {
          ai_analysis?: Json | null
          body_part?: string
          clinical_indication?: string | null
          critical_results?: boolean | null
          findings?: string | null
          id?: string
          images_url?: string[] | null
          impression?: string | null
          modality?: string
          ordered_at?: string | null
          ordered_by?: string | null
          patient_id?: string
          performed_at?: string | null
          priority?: string | null
          radiologist_id?: string | null
          recommendations?: string | null
          reviewed_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          study_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "radiology_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_orders_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "radiology_orders_radiologist_id_fkey"
            columns: ["radiologist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      specialties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      vital_signs: {
        Row: {
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          bmi: number | null
          heart_rate: number | null
          height: number | null
          id: string
          notes: string | null
          oxygen_saturation: number | null
          pain_scale: number | null
          patient_id: string
          recorded_at: string | null
          recorded_by: string
          respiratory_rate: number | null
          temperature: number | null
          weight: number | null
        }
        Insert: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          patient_id: string
          recorded_at?: string | null
          recorded_by: string
          respiratory_rate?: number | null
          temperature?: number | null
          weight?: number | null
        }
        Update: {
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          bmi?: number | null
          heart_rate?: number | null
          height?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_scale?: number | null
          patient_id?: string
          recorded_at?: string | null
          recorded_by?: string
          respiratory_rate?: number | null
          temperature?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vital_signs_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
