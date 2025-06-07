import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Flame, Zap } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const handleEmergencyAction = (type: string) => {
    // In a real application, this would trigger actual emergency protocols
    console.log(`Emergency action triggered: ${type}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="mr-2 text-alert-red" size={20} />
            Emergency Response
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Button
            onClick={() => handleEmergencyAction('fire')}
            className="w-full bg-alert-red hover:bg-red-700 text-white py-3 px-4 text-left flex items-center"
          >
            <Flame className="mr-3" size={20} />
            <div>
              <div className="font-semibold">Report Forest Fire</div>
              <div className="text-sm opacity-90">Immediate alert to all ranges</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleEmergencyAction('wildlife')}
            className="w-full bg-warning-orange hover:bg-orange-700 text-white py-3 px-4 text-left flex items-center"
          >
            <span className="mr-3 text-xl">🐾</span>
            <div>
              <div className="font-semibold">Wildlife Emergency</div>
              <div className="text-sm opacity-90">Human-animal conflict response</div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleEmergencyAction('general')}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-4 text-left flex items-center"
          >
            <Zap className="mr-3" size={20} />
            <div>
              <div className="font-semibold">Other Emergency</div>
              <div className="text-sm opacity-90">General forest department emergency</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
