import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, CheckCircle2, Circle, ArrowLeft, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChecklistItemType } from "@/types/checklist";

interface SavedChecklist {
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
  const { toast } = useToast();

  useEffect(() => {
    loadSavedChecklists();
  }, []);

  const loadSavedChecklists = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('checklists', {
        method: 'GET'
      });

      if (error) {
        console.error('Error loading checklists:', error);
        toast({
          title: "Error",
          description: "Failed to load saved checklists",
          variant: "destructive",
        });
        return;
      }

      // Group checklist items by creation date
      const groupedChecklists = groupChecklistsByDate(data || []);
      setSavedChecklists(groupedChecklists);
    } catch (error) {
      console.error('Error loading checklists:', error);
      toast({
        title: "Error",
        description: "Failed to load saved checklists",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupChecklistsByDate = (items: any[]): SavedChecklist[] => {
    const grouped = items.reduce((acc: { [key: string]: ChecklistItemType[] }, item) => {
      const date = new Date(item.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({
        id: item.id,
        phase: item.phase,
        item: item.item,
        checked: item.checked,
        comment: item.comment,
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_id: item.user_id
      });
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, items]: [string, ChecklistItemType[]]) => {
        const completedCount = items.filter(item => item.checked).length;
        const totalCount = items.length;
        return {
          date,
          items,
          completedCount,
          totalCount,
          completionPercentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const deleteChecklist = async (date: string) => {
    try {
      const checklistToDelete = savedChecklists.find(cl => cl.date === date);
      if (!checklistToDelete) return;

      // Delete all items from this checklist date
      const { error } = await supabase
        .from('checklist_items')
        .delete()
        .in('id', checklistToDelete.items.map(item => item.id));

      if (error) {
        console.error('Error deleting checklist:', error);
        toast({
          title: "Error",
          description: "Failed to delete checklist",
          variant: "destructive",
        });
        return;
      }

      setSavedChecklists(prev => prev.filter(cl => cl.date !== date));
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
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Current Checklist
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-muted-foreground">Loading saved checklists...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Current Checklist
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Saved Checklists</h1>
              <p className="text-muted-foreground mt-1">
                View and manage your previously saved installation checklists
              </p>
            </div>
          </div>
        </div>

        {/* Checklists Grid */}
        {savedChecklists.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Checklists</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't saved any checklists yet. Complete and save your first checklist to see it here.
              </p>
              <Link to="/" className="mt-4">
                <Button>Go to Current Checklist</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedChecklists.map((checklist) => (
              <Card key={checklist.date} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {new Date(checklist.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteChecklist(checklist.date)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {checklist.items.length} items • {checklist.completionPercentage}% completed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Summary */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {checklist.completedCount}/{checklist.totalCount}
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${checklist.completionPercentage}%` }}
                      />
                    </div>

                    <Separator />

                    {/* Phase Summary */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Phases</h4>
                      {['Pre-Installation', 'Installation', 'Post-Installation'].map((phase) => {
                        const phaseItems = checklist.items.filter(item => item.phase === phase);
                        const phaseCompleted = phaseItems.filter(item => item.checked).length;
                        const phasePercentage = phaseItems.length > 0 ? Math.round((phaseCompleted / phaseItems.length) * 100) : 0;

                        return (
                          <div key={phase} className="flex items-center justify-between">
                            <Badge variant="outline" className={`text-xs ${getPhaseColor(phase)}`}>
                              {phase}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm">
                              {phaseCompleted === phaseItems.length ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-muted-foreground">
                                {phaseCompleted}/{phaseItems.length}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            size="sm"
                            onClick={() => setSelectedChecklist(checklist)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5" />
                              Checklist Details - {new Date(checklist.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </DialogTitle>
                            <DialogDescription>
                              Complete overview of your installation checklist with {checklist.totalCount} items
                              • {checklist.completionPercentage}% completed
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            {/* Progress Overview */}
                            <div className="grid grid-cols-3 gap-4">
                              {['Pre-Installation', 'Installation', 'Post-Installation'].map((phase) => {
                                const phaseItems = checklist.items.filter(item => item.phase === phase);
                                const phaseCompleted = phaseItems.filter(item => item.checked).length;
                                const phasePercentage = phaseItems.length > 0 ? Math.round((phaseCompleted / phaseItems.length) * 100) : 0;

                                return (
                                  <Card key={phase}>
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <Badge className={`text-xs ${getPhaseColor(phase)}`}>
                                          {phase}
                                        </Badge>
                                        <div className="text-2xl font-bold">
                                          {phaseCompleted}/{phaseItems.length}
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-1.5">
                                          <div
                                            className="bg-primary h-1.5 rounded-full transition-all"
                                            style={{ width: `${phasePercentage}%` }}
                                          />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {phasePercentage}% complete
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>

                            <Separator />

                            {/* Detailed Checklist Items by Phase */}
                            <div className="space-y-6">
                              {['Pre-Installation', 'Installation', 'Post-Installation'].map((phase) => {
                                const phaseItems = checklist.items.filter(item => item.phase === phase);
                                if (phaseItems.length === 0) return null;

                                return (
                                  <div key={phase} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                      <Badge className={`${getPhaseColor(phase)}`}>
                                        {phase}
                                      </Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {phaseItems.filter(item => item.checked).length}/{phaseItems.length} completed
                                      </span>
                                    </div>
                                    
                                    <div className="grid gap-3">
                                      {phaseItems.map((item) => (
                                        <div key={item.id} className="p-4 bg-card rounded-lg border border-border">
                                          <div className="flex items-start gap-3">
                                            <Checkbox
                                              checked={item.checked}
                                              disabled
                                              className="mt-1"
                                            />
                                            <div className="flex-1 space-y-2">
                                              <div className={`text-sm font-medium leading-relaxed ${
                                                item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                                              }`}>
                                                {item.item}
                                              </div>
                                              {item.comment && (
                                                <Textarea
                                                  value={item.comment}
                                                  disabled
                                                  className="min-h-[60px] text-sm resize-none bg-muted"
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
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
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