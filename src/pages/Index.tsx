import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { PhaseCard } from "@/components/PhaseCard";
import { SaveButton } from "@/components/SaveButton";
import { defaultChecklistItems } from "@/data/checklistData";
import { ChecklistItemType } from "@/types/checklist";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItemType[]>(defaultChecklistItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load checklist items from database on component mount
  useEffect(() => {
    loadChecklistItems();
  }, []);

  const loadChecklistItems = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('checklists', {
        method: 'GET'
      });

      if (error) throw error;

      // If we have data from the database, use it; otherwise use default
      if (data && data.length > 0) {
        setChecklistItems(data);
        toast({
          title: "Checklist loaded",
          description: `Loaded ${data.length} items from database.`,
        });
      }
    } catch (error) {
      console.error('Error loading checklist:', error);
      toast({
        title: "Using default checklist",
        description: "Could not load saved data, starting with default checklist.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSaveChecklist = async () => {
    try {
      setIsSaving(true);
      const { data, error } = await supabase.functions.invoke('checklists', {
        method: 'POST',
        body: checklistItems
      });

      if (error) throw error;

      const completedItems = checklistItems.filter(item => item.checked);
      toast({
        title: "Checklist saved successfully!",
        description: `${completedItems.length} completed items saved to database.`,
      });
    } catch (error) {
      console.error('Error saving checklist:', error);
      toast({
        title: "Error saving checklist",
        description: "Could not save to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
          <SaveButton 
            onSave={handleSaveChecklist} 
            isLoading={isSaving}
            showWarning={false}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
