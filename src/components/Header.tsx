import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  onNewChecklist: () => void;
  totalCompleted: number;
  totalItems: number;
}

export const Header = ({ onNewChecklist, totalCompleted, totalItems }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const overallProgress = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Software Installation Checklist
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your installation progress across all phases
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              Overall Progress: <span className="font-medium text-primary">{totalCompleted}/{totalItems}</span> 
              <span className="ml-2 text-primary font-medium">({overallProgress.toFixed(0)}%)</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/saved-checklists">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Saved Checklists
              </Button>
            </Link>
            <Button 
              onClick={onNewChecklist}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Checklist
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user?.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};