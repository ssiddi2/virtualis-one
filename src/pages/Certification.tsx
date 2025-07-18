import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EMRCertificationDashboard from '@/components/certification/EMRCertificationDashboard';
import EMRTestSuite from '@/components/certification/EMRTestSuite';
import ComplianceValidator from '@/components/certification/ComplianceValidator';

const Certification = () => {
  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Certification Dashboard</TabsTrigger>
          <TabsTrigger value="testing">Test Suite</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Validator</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <EMRCertificationDashboard />
        </TabsContent>

        <TabsContent value="testing">
          <EMRTestSuite />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceValidator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Certification;