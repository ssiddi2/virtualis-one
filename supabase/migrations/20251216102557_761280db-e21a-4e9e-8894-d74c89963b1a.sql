-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view hospitals" ON hospitals;

-- Create a permissive policy (default is PERMISSIVE) so users can see all hospitals
CREATE POLICY "Authenticated users can view hospitals"
ON hospitals
FOR SELECT
TO authenticated
USING (true);