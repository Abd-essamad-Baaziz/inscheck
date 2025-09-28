import { useState } from "react";
import { Header } from "@/components/Header";
import { PhaseCard } from "@/components/PhaseCard";
import { SaveButton } from "@/components/SaveButton";
import { defaultChecklistItems } from "@/data/checklistData";
import { ChecklistItemType } from "@/types/checklist";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItemType[]>(defaultChecklistItems);
  const { toast } = useToast();

  const updateItem = (id: string, updates: Partial<ChecklistItemType>) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleNewChecklist = () => {
    setChecklistItems(defaultChecklistItems.map(item => ({
      ...item,
      checked: false,
      comment: ""
    })));
    toast({
      title: "New checklist started",
      description: "All items have been reset. You can now begin a fresh installation checklist.",
    });
  };

  const handleSaveChecklist = () => {
    // This would normally send data to the backend API
    // For now, we'll show a demo message
    const completedItems = checklistItems.filter(item => item.checked);
    
    toast({
      title: "Checklist saved locally",
      description: `${completedItems.length} completed items saved. Connect Supabase to persist data.`,
    });
    
    // Demo: Log the data that would be sent to the API
    console.log("Checklist data to save:", checklistItems);
  };

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.phase]) {
      acc[item.phase] = [];
    }
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<string, ChecklistItemType[]>);

  const phases = ["Pre-Installation", "Installation", "Post-Installation"];
  const phaseColors = ["pre-installation", "installation", "post-installation"];
  
  const totalCompleted = checklistItems.filter(item => item.checked).length;
  const totalItems = checklistItems.length;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onNewChecklist={handleNewChecklist}
        totalCompleted={totalCompleted}
        totalItems={totalItems}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase}
              phase={phase}
              items={groupedItems[phase] || []}
              onUpdateItem={updateItem}
              phaseColor={phaseColors[index]}
              accentColor={phaseColors[index]}
            />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <SaveButton onSave={handleSaveChecklist} />
        </div>
      </main>
    </div>
  );
};

export default Index;
