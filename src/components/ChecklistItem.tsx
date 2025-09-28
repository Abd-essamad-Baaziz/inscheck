import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ChecklistItemType } from "@/types/checklist";

interface ChecklistItemProps {
  item: ChecklistItemType;
  onUpdate: (id: string, updates: Partial<ChecklistItemType>) => void;
  phaseColor: string;
}

export const ChecklistItem = ({ item, onUpdate, phaseColor }: ChecklistItemProps) => {
  const [comment, setComment] = useState(item.comment);

  const handleCheckedChange = (checked: boolean) => {
    onUpdate(item.id, { checked });
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
          <label 
            htmlFor={item.id}
            className={`text-sm font-medium leading-relaxed cursor-pointer ${
              item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
            }`}
          >
            {item.item}
          </label>
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