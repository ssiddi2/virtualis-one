import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PatientClinicalData {
  patient: any;
  vitalSigns: any[];
  medications: any[];
  labOrders: any[];
  radiologyOrders: any[];
  problemList: any[];
  allergies: any[];
  nursingAssessments: any[];
  medicalRecords: any[];
  completeness: number;
}

export const usePatientClinicalData = (patientId?: string) => {
  return useQuery({
    queryKey: ['patient-clinical-data', patientId],
    queryFn: async () => {
      if (!patientId) return null;

      console.log('Fetching comprehensive clinical data for patient:', patientId);

      // Fetch all patient data in parallel
      const [
        patientData,
        vitalSignsData,
        medicationsData,
        labOrdersData,
        radiologyOrdersData,
        problemListData,
        allergiesData,
        nursingAssessmentsData,
        medicalRecordsData,
      ] = await Promise.all([
        supabase.from('patients').select('*').eq('id', patientId).single(),
        supabase.from('vital_signs').select('*').eq('patient_id', patientId).order('recorded_at', { ascending: false }).limit(10),
        supabase.from('medications').select('*').eq('patient_id', patientId).eq('status', 'active').order('prescribed_at', { ascending: false }),
        supabase.from('lab_orders').select('*').eq('patient_id', patientId).order('ordered_at', { ascending: false }).limit(10),
        supabase.from('radiology_orders').select('*').eq('patient_id', patientId).order('ordered_at', { ascending: false }).limit(10),
        supabase.from('problem_list').select('*').eq('patient_id', patientId).eq('status', 'active'),
        supabase.from('allergies_adverse_reactions').select('*').eq('patient_id', patientId).eq('status', 'active'),
        supabase.from('nursing_assessments').select('*').eq('patient_id', patientId).order('created_at', { ascending: false }).limit(5),
        supabase.from('medical_records').select('*').eq('patient_id', patientId).order('visit_date', { ascending: false }).limit(5),
      ]);

      // Calculate data completeness
      const dataPoints = [
        patientData.data,
        vitalSignsData.data?.length,
        medicationsData.data?.length,
        labOrdersData.data?.length,
        radiologyOrdersData.data?.length,
        problemListData.data?.length,
        allergiesData.data?.length,
        nursingAssessmentsData.data?.length,
        medicalRecordsData.data?.length,
      ];

      const completedPoints = dataPoints.filter(point => point && (typeof point === 'object' || point > 0)).length;
      const completeness = Math.round((completedPoints / dataPoints.length) * 100);

      const clinicalData: PatientClinicalData = {
        patient: patientData.data,
        vitalSigns: vitalSignsData.data || [],
        medications: medicationsData.data || [],
        labOrders: labOrdersData.data || [],
        radiologyOrders: radiologyOrdersData.data || [],
        problemList: problemListData.data || [],
        allergies: allergiesData.data || [],
        nursingAssessments: nursingAssessmentsData.data || [],
        medicalRecords: medicalRecordsData.data || [],
        completeness,
      };

      console.log('Clinical data loaded:', { completeness, recordCounts: {
        vitals: clinicalData.vitalSigns.length,
        meds: clinicalData.medications.length,
        labs: clinicalData.labOrders.length,
        imaging: clinicalData.radiologyOrders.length,
        problems: clinicalData.problemList.length,
        allergies: clinicalData.allergies.length,
      }});

      return clinicalData;
    },
    enabled: !!patientId,
  });
};
