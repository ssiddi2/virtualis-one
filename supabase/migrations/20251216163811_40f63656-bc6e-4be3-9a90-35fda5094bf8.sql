-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view hospitals" ON hospitals;

-- Create a permissive policy that allows all authenticated users to view hospitals
CREATE POLICY "Authenticated users can view all hospitals"
ON hospitals
FOR SELECT
TO authenticated
USING (true);