export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      allergies_adverse_reactions: {
        Row: {
          allergen: string
          created_at: string | null
          id: string
          onset_date: string | null
          patient_id: string
          reaction_type: string
          severity: string
          status: string | null
          symptoms: string | null
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          allergen: string
          created_at?: string | null
          id?: string
          onset_date?: string | null
          patient_id: string
          reaction_type: string
          severity: string
          status?: string | null
          symptoms?: string | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          allergen?: string
          created_at?: string | null
          id?: string
          onset_date?: string | null
          patient_id?: string
          reaction_type?: string
          severity?: string
          status?: string | null
          symptoms?: string | null
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "allergies_adverse_reactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allergies_adverse_reactions_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_type: string
          chief_complaint: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          provider_id: string
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_type: string
          chief_complaint?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          provider_id: string
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_type?: string
          chief_complaint?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          provider_id?: string
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      care_plans: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          goals: Json | null
          id: string
          interventions: Json | null
          patient_id: string
          plan_name: string
          plan_type: string
          start_date: string
          status: string | null
          target_date: string | null
          target_outcomes: Json | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          goals?: Json | null
          id?: string
          interventions?: Json | null
          patient_id: string
          plan_name: string
          plan_type: string
          start_date: string
          status?: string | null
          target_date?: string | null
          target_outcomes?: Json | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          goals?: Json | null
          id?: string
          interventions?: Json | null
          patient_id?: string
          plan_name?: string
          plan_type?: string
          start_date?: string
          status?: string | null
          target_date?: string | null
          target_outcomes?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_plans_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_plans_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      claim_denials: {
        Row: {
          appeal_deadline: string | null
          appeal_submitted_date: string | null
          billing_charge_id: string | null
          created_at: string | null
          denial_code: string
          denial_date: string
          denial_reason: string
          id: string
          resolution_amount: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appeal_deadline?: string | null
          appeal_submitted_date?: string | null
          billing_charge_id?: string | null
          created_at?: string | null
          denial_code: string
          denial_date?: string
          denial_reason: string
          id?: string
          resolution_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appeal_deadline?: string | null
          appeal_submitted_date?: string | null
          billing_charge_id?: string | null
          created_at?: string | null
          denial_code?: string
          denial_date?: string
          denial_reason?: string
          id?: string
          resolution_amount?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_denials_billing_charge_id_fkey"
            columns: ["billing_charge_id"]
            isOneToOne: false
            referencedRelation: "billing_charges"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_message: string
          alert_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          patient_id: string | null
          severity: string
          triggered_by: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_message: string
          alert_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string | null
          severity: string
          triggered_by?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_message?: string
          alert_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          patient_id?: string | null
          severity?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_alerts_acknowledged_by_fkey"
            columns: ["acknowledged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_notes_templates: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          note_type: string
          specialty: string | null
          template_content: Json
          template_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          note_type: string
          specialty?: string | null
          template_content: Json
          template_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          note_type?: string
          specialty?: string | null
          template_content?: Json
          template_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_notes_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_orders: {
        Row: {
          created_at: string | null
          end_date: string | null
          frequency: string | null
          id: string
          order_details: Json
          order_type: string
          ordering_provider_id: string
          patient_id: string
          priority: string | null
          special_instructions: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          order_details: Json
          order_type: string
          ordering_provider_id: string
          patient_id: string
          priority?: string | null
          special_instructions?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          order_details?: Json
          order_type?: string
          ordering_provider_id?: string
          patient_id?: string
          priority?: string | null
          special_instructions?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clinical_orders_ordering_provider_id_fkey"
            columns: ["ordering_provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_orders_patient_id_fkey"
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
      discharge_planning: {
        Row: {
          barriers_to_discharge: string | null
          created_at: string | null
          discharge_disposition: string | null
          discharge_location: string | null
          discharge_planner_id: string
          equipment_needs: Json | null
          estimated_discharge_date: string | null
          follow_up_appointments: Json | null
          id: string
          medication_reconciliation: boolean | null
          patient_education: Json | null
          patient_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          barriers_to_discharge?: string | null
          created_at?: string | null
          discharge_disposition?: string | null
          discharge_location?: string | null
          discharge_planner_id: string
          equipment_needs?: Json | null
          estimated_discharge_date?: string | null
          follow_up_appointments?: Json | null
          id?: string
          medication_reconciliation?: boolean | null
          patient_education?: Json | null
          patient_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          barriers_to_discharge?: string | null
          created_at?: string | null
          discharge_disposition?: string | null
          discharge_location?: string | null
          discharge_planner_id?: string
          equipment_needs?: Json | null
          estimated_discharge_date?: string | null
          follow_up_appointments?: Json | null
          id?: string
          medication_reconciliation?: boolean | null
          patient_education?: Json | null
          patient_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discharge_planning_discharge_planner_id_fkey"
            columns: ["discharge_planner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discharge_planning_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      immunizations: {
        Row: {
          administered_by: string | null
          administration_date: string
          created_at: string | null
          dose_number: number | null
          id: string
          lot_number: string | null
          manufacturer: string | null
          next_due_date: string | null
          patient_id: string
          reaction: string | null
          route: string | null
          series_complete: boolean | null
          site: string | null
          vaccine_code: string | null
          vaccine_name: string
        }
        Insert: {
          administered_by?: string | null
          administration_date: string
          created_at?: string | null
          dose_number?: number | null
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          next_due_date?: string | null
          patient_id: string
          reaction?: string | null
          route?: string | null
          series_complete?: boolean | null
          site?: string | null
          vaccine_code?: string | null
          vaccine_name: string
        }
        Update: {
          administered_by?: string | null
          administration_date?: string
          created_at?: string | null
          dose_number?: number | null
          id?: string
          lot_number?: string | null
          manufacturer?: string | null
          next_due_date?: string | null
          patient_id?: string
          reaction?: string | null
          route?: string | null
          series_complete?: boolean | null
          site?: string | null
          vaccine_code?: string | null
          vaccine_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "immunizations_administered_by_fkey"
            columns: ["administered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "immunizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          actions_taken: string | null
          contributing_factors: string | null
          created_at: string | null
          description: string
          id: string
          incident_date: string
          incident_type: string
          location: string | null
          patient_id: string | null
          reporter_id: string
          severity: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actions_taken?: string | null
          contributing_factors?: string | null
          created_at?: string | null
          description: string
          id?: string
          incident_date: string
          incident_type: string
          location?: string | null
          patient_id?: string | null
          reporter_id: string
          severity?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actions_taken?: string | null
          contributing_factors?: string | null
          created_at?: string | null
          description?: string
          id?: string
          incident_date?: string
          incident_type?: string
          location?: string | null
          patient_id?: string | null
          reporter_id?: string
          severity?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          ai_coding_suggestions: Json | null
          assessment: string | null
          chief_complaint: string | null
          coding_confidence_score: number | null
          coding_reviewed_at: string | null
          coding_reviewed_by: string | null
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
          ai_coding_suggestions?: Json | null
          assessment?: string | null
          chief_complaint?: string | null
          coding_confidence_score?: number | null
          coding_reviewed_at?: string | null
          coding_reviewed_by?: string | null
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
          ai_coding_suggestions?: Json | null
          assessment?: string | null
          chief_complaint?: string | null
          coding_confidence_score?: number | null
          coding_reviewed_at?: string | null
          coding_reviewed_by?: string | null
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
      medication_administration_records: {
        Row: {
          actual_time: string | null
          administered_by: string
          created_at: string | null
          dose_given: string | null
          id: string
          medication_id: string
          patient_id: string
          reason_held: string | null
          route: string | null
          scheduled_time: string
          status: string | null
          witness_id: string | null
        }
        Insert: {
          actual_time?: string | null
          administered_by: string
          created_at?: string | null
          dose_given?: string | null
          id?: string
          medication_id: string
          patient_id: string
          reason_held?: string | null
          route?: string | null
          scheduled_time: string
          status?: string | null
          witness_id?: string | null
        }
        Update: {
          actual_time?: string | null
          administered_by?: string
          created_at?: string | null
          dose_given?: string | null
          id?: string
          medication_id?: string
          patient_id?: string
          reason_held?: string | null
          route?: string | null
          scheduled_time?: string
          status?: string | null
          witness_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medication_administration_records_administered_by_fkey"
            columns: ["administered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_administration_records_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_administration_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_administration_records_witness_id_fkey"
            columns: ["witness_id"]
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
      nursing_assessments: {
        Row: {
          assessment_data: Json
          assessment_type: string
          created_at: string | null
          fall_risk_score: number | null
          id: string
          mobility_status: string | null
          nurse_id: string
          pain_scale: number | null
          patient_id: string
          skin_integrity: string | null
          updated_at: string | null
          vital_signs: Json | null
        }
        Insert: {
          assessment_data: Json
          assessment_type: string
          created_at?: string | null
          fall_risk_score?: number | null
          id?: string
          mobility_status?: string | null
          nurse_id: string
          pain_scale?: number | null
          patient_id: string
          skin_integrity?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Update: {
          assessment_data?: Json
          assessment_type?: string
          created_at?: string | null
          fall_risk_score?: number | null
          id?: string
          mobility_status?: string | null
          nurse_id?: string
          pain_scale?: number | null
          patient_id?: string
          skin_integrity?: string | null
          updated_at?: string | null
          vital_signs?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "nursing_assessments_nurse_id_fkey"
            columns: ["nurse_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nursing_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      order_sets: {
        Row: {
          created_at: string | null
          created_by: string
          diagnosis: string | null
          id: string
          is_active: boolean | null
          name: string
          orders: Json
          specialty: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          diagnosis?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          orders: Json
          specialty?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          diagnosis?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          orders?: Json
          specialty?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_sets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      payment_postings: {
        Row: {
          adjustment_reason: string | null
          billing_charge_id: string | null
          created_at: string | null
          id: string
          payer_name: string | null
          payment_amount: number
          payment_date: string
          payment_method: string
          reference_number: string | null
        }
        Insert: {
          adjustment_reason?: string | null
          billing_charge_id?: string | null
          created_at?: string | null
          id?: string
          payer_name?: string | null
          payment_amount: number
          payment_date?: string
          payment_method: string
          reference_number?: string | null
        }
        Update: {
          adjustment_reason?: string | null
          billing_charge_id?: string | null
          created_at?: string | null
          id?: string
          payer_name?: string | null
          payment_amount?: number
          payment_date?: string
          payment_method?: string
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_postings_billing_charge_id_fkey"
            columns: ["billing_charge_id"]
            isOneToOne: false
            referencedRelation: "billing_charges"
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
      prior_authorizations: {
        Row: {
          approval_date: string | null
          auth_number: string | null
          created_at: string | null
          denial_reason: string | null
          estimated_cost: number | null
          expiration_date: string | null
          id: string
          insurance_provider: string
          patient_id: string
          requested_date: string
          requesting_provider_id: string | null
          service_code: string
          service_description: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          auth_number?: string | null
          created_at?: string | null
          denial_reason?: string | null
          estimated_cost?: number | null
          expiration_date?: string | null
          id?: string
          insurance_provider: string
          patient_id: string
          requested_date?: string
          requesting_provider_id?: string | null
          service_code: string
          service_description: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          auth_number?: string | null
          created_at?: string | null
          denial_reason?: string | null
          estimated_cost?: number | null
          expiration_date?: string | null
          id?: string
          insurance_provider?: string
          patient_id?: string
          requested_date?: string
          requesting_provider_id?: string | null
          service_code?: string
          service_description?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prior_authorizations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_list: {
        Row: {
          created_at: string | null
          icd10_code: string | null
          id: string
          notes: string | null
          onset_date: string | null
          patient_id: string
          problem_name: string
          provider_id: string | null
          resolved_date: string | null
          severity: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          icd10_code?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          patient_id: string
          problem_name: string
          provider_id?: string | null
          resolved_date?: string | null
          severity?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          icd10_code?: string | null
          id?: string
          notes?: string | null
          onset_date?: string | null
          patient_id?: string
          problem_name?: string
          provider_id?: string | null
          resolved_date?: string | null
          severity?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_list_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_list_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          hospital_id: string | null
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
          hospital_id?: string | null
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
          hospital_id?: string | null
          id?: string
          last_name?: string
          license_number?: string | null
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_metrics: {
        Row: {
          created_at: string | null
          denominator: number | null
          hospital_id: string
          id: string
          measurement_period_end: string
          measurement_period_start: string
          metric_category: string | null
          metric_name: string
          metric_value: number | null
          numerator: number | null
          patient_population: number | null
          target_value: number | null
        }
        Insert: {
          created_at?: string | null
          denominator?: number | null
          hospital_id: string
          id?: string
          measurement_period_end: string
          measurement_period_start: string
          metric_category?: string | null
          metric_name: string
          metric_value?: number | null
          numerator?: number | null
          patient_population?: number | null
          target_value?: number | null
        }
        Update: {
          created_at?: string | null
          denominator?: number | null
          hospital_id?: string
          id?: string
          measurement_period_end?: string
          measurement_period_start?: string
          metric_category?: string | null
          metric_name?: string
          metric_value?: number | null
          numerator?: number | null
          patient_population?: number | null
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_metrics_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
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
      revenue_analytics: {
        Row: {
          created_at: string | null
          hospital_id: string
          id: string
          metric_name: string
          metric_period: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Insert: {
          created_at?: string | null
          hospital_id: string
          id?: string
          metric_name: string
          metric_period: string
          metric_value: number
          period_end: string
          period_start: string
        }
        Update: {
          created_at?: string | null
          hospital_id?: string
          id?: string
          metric_name?: string
          metric_period?: string
          metric_value?: number
          period_end?: string
          period_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_analytics_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
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
      surgical_cases: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          anesthesia_type: string | null
          complications: string | null
          cpt_code: string | null
          created_at: string | null
          estimated_blood_loss: number | null
          id: string
          operating_room: string | null
          patient_id: string
          procedure_name: string
          procedure_notes: string | null
          scheduled_date: string
          status: string | null
          surgeon_id: string
          updated_at: string | null
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          anesthesia_type?: string | null
          complications?: string | null
          cpt_code?: string | null
          created_at?: string | null
          estimated_blood_loss?: number | null
          id?: string
          operating_room?: string | null
          patient_id: string
          procedure_name: string
          procedure_notes?: string | null
          scheduled_date: string
          status?: string | null
          surgeon_id: string
          updated_at?: string | null
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          anesthesia_type?: string | null
          complications?: string | null
          cpt_code?: string | null
          created_at?: string | null
          estimated_blood_loss?: number | null
          id?: string
          operating_room?: string | null
          patient_id?: string
          procedure_name?: string
          procedure_notes?: string | null
          scheduled_date?: string
          status?: string | null
          surgeon_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "surgical_cases_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "surgical_cases_surgeon_id_fkey"
            columns: ["surgeon_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      get_user_hospital_id: {
        Args: { user_uuid: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
