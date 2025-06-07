import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, TreePine, User, Shield, Settings, LogOut, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  language: 'en' | 'mr' | 'hi';
  setLanguage: (lang: 'en' | 'mr' | 'hi') => void;
  onEmergencyClick: () => void;
  onSecurityClick: () => void;
}

const translations = {
  en: {
    title: "Forest Department Maharashtra",
    subtitle: "विकसित महाराष्ट्र 2047 Vision",
    emergency: "Emergency Alert",
    officer: "DyCF Nashik East"
  },
  mr: {
    title: "वन विभाग महाराष्ट्र",
    subtitle: "विकसित महाराष्ट्र 2047 दृष्टीकोन",
    emergency: "आपत्कालीन सूचना",
    officer: "डीवायसीएफ नाशिक पूर्व"
  },
  hi: {
    title: "वन विभाग महाराष्ट्र",
    subtitle: "विकसित महाराष्ट्र 2047 दृष्टिकोण",
    emergency: "आपातकालीन चेतावनी",
    officer: "डीवाईसीएफ नाशिक पूर्व"
  }
};

export default function Header({ language, setLanguage, onEmergencyClick, onSecurityClick }: HeaderProps) {
  const t = translations[language];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-maharashtra-saffron rounded-lg flex items-center justify-center">
                <TreePine className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t.title}</h1>
                <p className="text-xs text-gray-600">{t.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="relative">
                <Bell size={18} />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-alert-red">
                  3
                </Badge>
              </Button>
            </div>

            {/* Language Switcher */}
            <Select value={language} onValueChange={(value: 'en' | 'mr' | 'hi') => setLanguage(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Emergency Alert Button */}
            <Button 
              onClick={onEmergencyClick}
              className="bg-alert-red hover:bg-red-700 text-white px-4 py-2 text-sm font-medium"
            >
              <AlertTriangle className="mr-2" size={16} />
              {t.emergency}
            </Button>
            
            {/* Security Access Button */}
            <Button 
              onClick={onSecurityClick}
              variant="outline"
              className="border-gov-blue text-gov-blue hover:bg-gov-blue hover:text-white"
            >
              <Shield className="mr-2" size={16} />
              Secure Access
            </Button>
            
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-maharashtra-saffron rounded-full flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <span className="text-sm text-gray-700">{t.officer}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2" size={16} />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSecurityClick}>
                  <Shield className="mr-2" size={16} />
                  Security Center
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2" size={16} />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-alert-red">
                  <LogOut className="mr-2" size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
