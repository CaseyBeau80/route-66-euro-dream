
-- Allow public inserts into attractions table for migration purposes
CREATE POLICY "Allow migration inserts to attractions" 
  ON public.attractions 
  FOR INSERT 
  WITH CHECK (true);

-- Also allow updates for migration purposes  
CREATE POLICY "Allow migration updates to attractions"
  ON public.attractions
  FOR UPDATE
  USING (true);

-- Allow deletes for cleanup if needed
CREATE POLICY "Allow migration deletes from attractions"
  ON public.attractions
  FOR DELETE
  USING (true);
