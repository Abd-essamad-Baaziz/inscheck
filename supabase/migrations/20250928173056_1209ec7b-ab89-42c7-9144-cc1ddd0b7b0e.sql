-- Create checklist_items table
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase TEXT NOT NULL,
  item TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  comment TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication specified yet)
CREATE POLICY "Allow public read access to checklist_items" 
ON public.checklist_items 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to checklist_items" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update to checklist_items" 
ON public.checklist_items 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete from checklist_items" 
ON public.checklist_items 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();