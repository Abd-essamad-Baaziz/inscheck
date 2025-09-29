-- Add user_id column to checklist_items table
ALTER TABLE public.checklist_items 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to be user-specific
DROP POLICY IF EXISTS "Allow public read access to checklist_items" ON public.checklist_items;
DROP POLICY IF EXISTS "Allow public insert to checklist_items" ON public.checklist_items;
DROP POLICY IF EXISTS "Allow public update to checklist_items" ON public.checklist_items;
DROP POLICY IF EXISTS "Allow public delete from checklist_items" ON public.checklist_items;

-- Create user-specific RLS policies
CREATE POLICY "Users can view their own checklist items" 
ON public.checklist_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items" 
ON public.checklist_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist items" 
ON public.checklist_items 
FOR DELETE 
USING (auth.uid() = user_id);