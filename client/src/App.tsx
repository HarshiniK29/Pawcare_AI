import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { AppLayout } from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import DiseaseDetection from "./pages/DiseaseDetection";
import NgoLocator from "./pages/NgoLocator";
import CaseTracker from "./pages/CaseTracker";
import AdoptionPortal from "./pages/AdoptionPortal";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/disease-detection" component={DiseaseDetection} />
        <Route path="/ngo-locator" component={NgoLocator} />
        <Route path="/cases" component={CaseTracker} />
        <Route path="/adoption" component={AdoptionPortal} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
