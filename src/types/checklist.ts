export interface ChecklistItemType {
  id: string;
  phase: string;
  item: string;
  checked: boolean;
  comment: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  checklist_id?: string;
}

export interface ChecklistData {
  [phase: string]: ChecklistItemType[];
}