export interface ChecklistItemType {
  id: string;
  phase: string;
  item: string;
  checked: boolean;
  comment: string;
}

export interface ChecklistData {
  [phase: string]: ChecklistItemType[];
}