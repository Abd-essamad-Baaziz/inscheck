import { Button } from "@/components/ui/button";
import { Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SaveButtonProps {
  onSave: () => void;
  isLoading?: boolean;
  showWarning?: boolean;
}

export const SaveButton = ({ onSave, isLoading = false, showWarning = true }: SaveButtonProps) => {
  return (
    <div className="space-y-4">
      {showWarning && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            To save checklist data to a database, you'll need to connect this project to Supabase. 
            Click the green Supabase button in the top right to set up the integration.
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={onSave}
        disabled={isLoading}
        size="lg"
        className="w-full sm:w-auto"
      >
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? "Saving..." : "Save Checklist"}
      </Button>
    </div>
  );
};