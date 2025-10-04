import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { ChecklistItemType } from "@/types/checklist";

interface SavedChecklist {
  id: string;
  title: string;
  date: string;
  items: ChecklistItemType[];
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
}

const SavedChecklists = () => {
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChecklist, setSelectedChecklist] = useState<SavedChecklist | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedChecklists();
  }, []);

  const loadSavedChecklists = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('checklists', {
        body: { method: 'GET' }
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const formatted = data.map((checklist: any) => {
          const items = checklist.checklist_items || [];
          const completedCount = items.filter((item: any) => item.checked).length;
          const totalCount = items.length;
          
          return {
            id: checklist.id,
            title: checklist.title,
            date: new Date(checklist.created_at).toLocaleString(),
            items: items,
            completedCount,
            totalCount,
            completionPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
          };
        });
        setSavedChecklists(formatted);
      }
    } catch (error) {
      console.error('Error loading saved checklists:', error);
      toast({
        title: "Error",
        description: "Failed to load saved checklists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChecklist = async (checklistId: string, event?: React.MouseEvent) => {
    // Prevent event bubbling if triggered from a button inside a card
    event?.stopPropagation();
    
    try {
      const { error } = await supabase.functions.invoke('checklists', {
        body: { 
          method: 'DELETE',
          checklistId 
        }
      });

      if (error) throw error;

      setSavedChecklists(prev => prev.filter(cl => cl.id !== checklistId));
      toast({
        title: "Success",
        description: "Checklist deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting checklist:', error);
      toast({
        title: "Error",
        description: "Failed to delete checklist",
        variant: "destructive",
      });
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Pre-Installation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Installation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Post-Installation':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Current Checklist
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading saved checklists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Current Checklist
          </Button>
          <h1 className="text-3xl font-bold">Saved Checklists</h1>
        </div>

        {savedChecklists.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No saved checklists yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete a checklist and save it to see it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedChecklists.map((checklist) => (
              <Card key={checklist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{checklist.title}</CardTitle>
                      <CardDescription>{checklist.date}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => deleteChecklist(checklist.id, e)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {checklist.completedCount} of {checklist.totalCount} items completed
                      </span>
                      <span className="text-sm font-bold">
                        {checklist.completionPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${checklist.completionPercentage}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['Pre-Installation', 'Installation', 'Post-Installation'].map((phase) => {
                        const phaseItems = checklist.items.filter(item => item.phase === phase);
                        const phaseCompleted = phaseItems.filter(item => item.checked).length;
                        return phaseItems.length > 0 && (
                          <Badge key={phase} variant="outline" className={getPhaseColor(phase)}>
                            {phase}: {phaseCompleted}/{phaseItems.length}
                          </Badge>
                        );
                      })}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" onClick={() => setSelectedChecklist(checklist)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{checklist.title}</DialogTitle>
                          <DialogDescription>
                            Saved on {checklist.date}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                            <div className="text-center">
                              <p className="text-2xl font-bold">{checklist.totalCount}</p>
                              <p className="text-sm text-muted-foreground">Total Items</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-green-600">{checklist.completedCount}</p>
                              <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-bold text-blue-600">{checklist.completionPercentage}%</p>
                              <p className="text-sm text-muted-foreground">Progress</p>
                            </div>
                          </div>

                          {['Pre-Installation', 'Installation', 'Post-Installation'].map((phase) => {
                            const phaseItems = checklist.items.filter(item => item.phase === phase);
                            if (phaseItems.length === 0) return null;

                            const phaseCompleted = phaseItems.filter(item => item.checked).length;
                            const phasePercentage = Math.round((phaseCompleted / phaseItems.length) * 100);

                            return (
                              <div key={phase} className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold">{phase}</h3>
                                  <Badge variant="outline" className={getPhaseColor(phase)}>
                                    {phaseCompleted}/{phaseItems.length} ({phasePercentage}%)
                                  </Badge>
                                </div>
                                
                                <div className="space-y-3">
                                  {phaseItems.map((item) => (
                                    <div key={item.id} className="p-4 border rounded-lg space-y-2">
                                      <div className="flex items-start gap-3">
                                        <Checkbox 
                                          checked={item.checked}
                                          disabled
                                          className="mt-1"
                                        />
                                        <div className="flex-1">
                                          <p className={`font-medium ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                                            {item.item}
                                          </p>
                                          {item.comment && (
                                            <Textarea
                                              value={item.comment}
                                              disabled
                                              className="mt-2 resize-none"
                                              rows={2}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedChecklists;
