import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import { AuthPage } from "@/pages/Auth";
import { HomePage } from "@/pages/Home";
import { ActivitiesPage } from "@/pages/Activities";
import { ReportPage } from "@/pages/Report";
import { ProfilePage } from "@/pages/Profile";
import { ManualPage } from "@/pages/Manual";
import { AnnouncementsPage } from "@/pages/Announcements";
import { ScannerPage } from "@/pages/Scanner";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useAuth } from "@/hooks/use-auth";

// Auth wrapper to handle conditional rendering
function AuthWrapper() {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <MobileLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/activities" component={ActivitiesPage} />
        <Route path="/report" component={ReportPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/manual" component={ManualPage} />
        <Route path="/announcements" component={AnnouncementsPage} />
        <Route path="/scanner" component={ScannerPage} />
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthWrapper />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
