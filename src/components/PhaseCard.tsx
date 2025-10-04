import { ChecklistItem } from "./ChecklistItem";
import { ChecklistItemType } from "@/types/checklist";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PhaseCardProps {
  phase: string;
  items: ChecklistItemType[];
  onUpdateItem: (id: string, updates: Partial<ChecklistItemType>) => void;
  onAddItem: (phase: string) => void;
  onDeleteItem: (id: string) => void;
  phaseColor: string;
  accentColor: string;
}

export const PhaseCard = ({ phase, items, onUpdateItem, onAddItem, onDeleteItem, phaseColor, accentColor }: PhaseCardProps) => {
  const completedItems = items.filter(item => item.checked).length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Pre-Installation": return "🔍";
      case "Installation": return "⚙️";
      case "Post-Installation": return "✅";
      default: return "📋";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div 
        className="p-6 rounded-t-xl"
        style={{ backgroundColor: `hsl(var(--${phaseColor}-light))` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getPhaseIcon(phase)}</span>
            <h2 className="text-xl font-semibold text-foreground">{phase}</h2>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {completedItems}/{totalItems} completed
          </div>
        </div>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {progressPercentage.toFixed(0)}% complete
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddItem(phase)}
              className="h-8"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        {items.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onUpdate={onUpdateItem}
            onDelete={onDeleteItem}
            phaseColor={phaseColor}
          />
        ))}
      </div>
    </div>
  );
};