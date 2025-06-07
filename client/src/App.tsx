import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/pages/Dashboard";
import ForestMapping from "@/pages/ForestMapping";
import OfficerDirectory from "@/pages/OfficerDirectory";
import PlantationTracking from "@/pages/PlantationTracking";
import FireMonitoring from "@/pages/FireMonitoring";
import DigitalPermits from "@/pages/DigitalPermits";
import PerformanceKRAs from "@/pages/PerformanceKRAs";
import CarbonCredits from "@/pages/CarbonCredits";
import GoalsTargets from "@/pages/GoalsTargets";
import SectoralGroups from "@/pages/SectoralGroups";
import AIAnalytics from "@/pages/AIAnalytics";
import RealTimeMonitoring from "@/pages/RealTimeMonitoring";
import HumanWildlifeConflict from "@/pages/HumanWildlifeConflict";
import EmergencyModal from "@/components/EmergencyModal";
import SecurityModal from "@/components/SecurityModal";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/forest-mapping" component={ForestMapping} />
      <Route path="/officers" component={OfficerDirectory} />
      <Route path="/plantation" component={PlantationTracking} />
      <Route path="/fire-monitoring" component={FireMonitoring} />
      <Route path="/permits" component={DigitalPermits} />
      <Route path="/performance" component={PerformanceKRAs} />
      <Route path="/carbon-credits" component={CarbonCredits} />
      <Route path="/goals" component={GoalsTargets} />
      <Route path="/sectoral" component={SectoralGroups} />
      <Route path="/ai-analytics" component={AIAnalytics} />
      <Route path="/real-time-monitoring" component={RealTimeMonitoring} />
      <Route path="/human-wildlife-conflict" component={HumanWildlifeConflict} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [language, setLanguage] = useState<'en' | 'mr' | 'hi'>('en');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Header 
            language={language} 
            setLanguage={setLanguage}
            onEmergencyClick={() => setShowEmergencyModal(true)}
            onSecurityClick={() => setShowSecurityModal(true)}
          />
          
          <div className="flex h-[calc(100vh-64px)]">
            <Sidebar />
            <main className="flex-1 overflow-auto">
              <Router />
            </main>
          </div>
          
          <EmergencyModal 
            isOpen={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
          />
          
          <SecurityModal 
            isOpen={showSecurityModal}
            onClose={() => setShowSecurityModal(false)}
          />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
