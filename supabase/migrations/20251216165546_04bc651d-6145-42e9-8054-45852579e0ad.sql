-- Drop the existing policy that requires authentication
DROP POLICY IF EXISTS "Authenticated users can view all hospitals" ON hospitals;

-- Create a policy that allows anyone (including anon) to view hospitals
CREATE POLICY "Anyone can view hospitals"
ON hospitals
FOR SELECT
TO public
USING (true);