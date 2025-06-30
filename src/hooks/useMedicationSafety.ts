
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DrugInteraction {
  severity: 'high' | 'moderate' | 'low';
  description: string;
  recommendation: string;
}

interface AllergyAlert {
  allergen: string;
  reaction: string;
  severity: string;
}

export const useMedicationSafety = (patientId: string) => {
  const { toast } = useToast();

  const { data: allergies } = useQuery({
    queryKey: ['patient-allergies', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allergies_adverse_reactions')
        .select('*')
        .eq('patient_id', patientId);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: currentMedications } = useQuery({
    queryKey: ['patient-medications', patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  const checkDrugAllergies = (medicationName: string): AllergyAlert[] => {
    if (!allergies) return [];
    
    return allergies
      .filter(allergy => 
        medicationName.toLowerCase().includes(allergy.allergen.toLowerCase()) ||
        allergy.allergen.toLowerCase().includes(medicationName.toLowerCase())
      )
      .map(allergy => ({
        allergen: allergy.allergen,
        reaction: allergy.symptoms || 'Unknown reaction',
        severity: allergy.severity || 'Unknown'
      }));
  };

  const checkDrugInteractions = (newMedication: string): DrugInteraction[] => {
    if (!currentMedications) return [];
    
    // Basic interaction checking - in production, use a comprehensive drug database
    const commonInteractions: Record<string, string[]> = {
      'warfarin': ['aspirin', 'ibuprofen', 'acetaminophen'],
      'metformin': ['contrast dye', 'alcohol'],
      'digoxin': ['furosemide', 'potassium'],
      'lisinopril': ['potassium', 'nsaids'],
    };

    const interactions: DrugInteraction[] = [];
    const newMedLower = newMedication.toLowerCase();

    currentMedications.forEach(currentMed => {
      const currentMedLower = currentMed.medication_name.toLowerCase();
      
      // Check if new med interacts with current med
      if (commonInteractions[newMedLower]?.some(drug => currentMedLower.includes(drug))) {
        interactions.push({
          severity: 'high',
          description: `${newMedication} may interact with ${currentMed.medication_name}`,
          recommendation: 'Consult pharmacist before administration'
        });
      }
      
      // Check reverse interaction
      if (commonInteractions[currentMedLower]?.some(drug => newMedLower.includes(drug))) {
        interactions.push({
          severity: 'moderate',
          description: `${currentMed.medication_name} may interact with ${newMedication}`,
          recommendation: 'Monitor patient closely'
        });
      }
    });

    return interactions;
  };

  const validateMedication = (medicationName: string, dosage?: string) => {
    const allergyAlerts = checkDrugAllergies(medicationName);
    const interactions = checkDrugInteractions(medicationName);

    // Show critical alerts
    if (allergyAlerts.length > 0) {
      toast({
        title: "🚨 ALLERGY ALERT",
        description: `Patient allergic to ${allergyAlerts[0].allergen}. Reaction: ${allergyAlerts[0].reaction}`,
        variant: "destructive",
        duration: 10000,
      });
    }

    if (interactions.some(i => i.severity === 'high')) {
      toast({
        title: "⚠️ DRUG INTERACTION",
        description: interactions.find(i => i.severity === 'high')?.description,
        variant: "destructive",
        duration: 8000,
      });
    }

    return {
      isSafe: allergyAlerts.length === 0 && interactions.filter(i => i.severity === 'high').length === 0,
      allergyAlerts,
      interactions,
      warnings: [...allergyAlerts.map(a => `Allergy: ${a.allergen}`), ...interactions.map(i => i.description)]
    };
  };

  return {
    validateMedication,
    checkDrugAllergies,
    checkDrugInteractions,
    allergies,
    currentMedications
  };
};
