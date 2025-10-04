import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChecklistItemType } from "@/types/checklist";
import { Trash2 } from "lucide-react";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onUpdate: (id: string, updates: Partial<ChecklistItemType>) => void;
  onDelete: (id: string) => void;
  phaseColor: string;
}

export const ChecklistItem = ({ item, onUpdate, onDelete, phaseColor }: ChecklistItemProps) => {
  const [comment, setComment] = useState(item.comment);
  const [itemText, setItemText] = useState(item.item);

  const handleCheckedChange = (checked: boolean) => {
    onUpdate(item.id, { checked });
  };

  const handleItemTextChange = (value: string) => {
    setItemText(value);
    onUpdate(item.id, { item: value });
  };

  const handleCommentChange = (value: string) => {
    setComment(value);
    onUpdate(item.id, { comment: value });
  };

  return (
    <div className="p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start gap-3">
        <Checkbox
          id={item.id}
          checked={item.checked}
          onCheckedChange={handleCheckedChange}
          className="mt-1"
        />
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <Input
              value={itemText}
              onChange={(e) => handleItemTextChange(e.target.value)}
              className={`text-sm font-medium flex-1 ${
                item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
              placeholder="Enter item description..."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Add notes or comments..."
            value={comment}
            onChange={(e) => handleCommentChange(e.target.value)}
            className="min-h-[60px] text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};