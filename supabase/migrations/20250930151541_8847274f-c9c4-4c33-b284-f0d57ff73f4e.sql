-- Add checklist_id to group items by a single saved checklist
ALTER TABLE public.checklist_items
ADD COLUMN IF NOT EXISTS checklist_id UUID;

-- Helpful index for grouping and deletion
CREATE INDEX IF NOT EXISTS idx_checklist_items_checklist_id
ON public.checklist_items(checklist_id);
