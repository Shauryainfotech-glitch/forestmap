import { useLocation } from "wouter";
import { 
  BarChart3, 
  TreePine, 
  Users, 
  Sprout, 
  Flame, 
  FileText, 
  Target, 
  Leaf, 
  Map,
  Handshake,
  Brain,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", nameHi: "डॅशबोर्ड", href: "/", icon: BarChart3 },
  { name: "Forest Mapping", nameHi: "वन नकाशा", href: "/forest-mapping", icon: Map },
  { name: "Officer Directory", nameHi: "अधिकारी यादी", href: "/officers", icon: Users },
  { name: "Plantation Tracking", nameHi: "लागवड ट्रॅकिंग", href: "/plantation", icon: Sprout },
  { name: "Fire Monitoring", nameHi: "आग निरीक्षण", href: "/fire-monitoring", icon: Flame },
  { name: "Digital Permits", nameHi: "डिजिटल परवाने", href: "/permits", icon: FileText },
  { name: "Performance KRAs", nameHi: "कामगिरी KRAs", href: "/performance", icon: Target },
  { name: "Carbon Credits", nameHi: "कार्बन क्रेडिट", href: "/carbon-credits", icon: Leaf },
];

const visionNavigation = [
  { name: "Goals & Targets", nameHi: "उद्दिष्टे", href: "/goals", icon: Target },
  { name: "Sectoral Groups", nameHi: "क्षेत्रीय गट", href: "/sectoral", icon: Handshake },
];

const advancedNavigation = [
  { name: "AI Analytics", nameHi: "AI विश्लेषण", href: "/ai-analytics", icon: Brain },
  { name: "Real-Time Monitoring", nameHi: "रियल-टाइम निरीक्षण", href: "/real-time-monitoring", icon: Activity },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <nav className="mt-8 px-4">
        {/* Vision 2047 Progress Card */}
        <div className="mb-6">
          <div className="maharashtra-gradient text-white p-4 rounded-lg">
            <h3 className="font-semibold text-sm">Vision 2047 Progress</h3>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Forest Cover Target</span>
                <span>21% → 35%</span>
              </div>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  location === item.href
                    ? "bg-maharashtra-saffron text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="mr-3" size={18} />
                <span className="flex-1">{item.name}</span>
                <span className="text-xs opacity-75">{item.nameHi}</span>
              </a>
            );
          })}
        </div>
        
        {/* Vision 2047 Section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Vision 2047
          </h3>
          <div className="mt-2 space-y-1">
            {visionNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-maharashtra-saffron text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3" size={18} />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-xs opacity-75">{item.nameHi}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Advanced Technology Section */}
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Advanced Technology
          </h3>
          <div className="mt-2 space-y-1">
            {advancedNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-gov-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-3" size={18} />
                  <span className="flex-1">{item.name}</span>
                  <span className="text-xs opacity-75">{item.nameHi}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Emergency Contact Card */}
        <div className="mt-6">
          <div className="bg-forest-green bg-opacity-10 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-forest-green mb-2">Emergency Contact</h4>
            <p className="text-xs text-gray-600 mb-1">Forest Fire Helpline</p>
            <p className="text-sm font-bold text-forest-green">1926</p>
            <button className="mt-2 w-full bg-success-green text-white py-2 rounded text-xs font-medium hover:bg-green-600 transition-colors">
              <span className="mr-1">📱</span> WhatsApp Alert
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
