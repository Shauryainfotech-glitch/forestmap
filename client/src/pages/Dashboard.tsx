import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  TreePine, 
  Sprout, 
  Users, 
  Flame, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  TrendingUp,
  MapPin,
  Phone,
  Brain,
  Activity,
  Shield,
  Zap,
  BarChart3,
  Globe
} from "lucide-react";
import StatsCard from "@/components/StatsCard";
import MapInterface from "@/components/MapInterface";

export default function Dashboard() {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  const { data: officers, isLoading: officersLoading } = useQuery({
    queryKey: ['/api/officers'],
    queryFn: () => api.getOfficers(),
  });

  const { data: activeFireAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts/active'],
    queryFn: () => api.getActiveFireAlerts(),
  });

  const { data: permits, isLoading: permitsLoading } = useQuery({
    queryKey: ['/api/permits'],
    queryFn: () => api.getPermits(),
  });

  const { data: vision2047Progress, isLoading: visionLoading } = useQuery({
    queryKey: ['/api/vision-2047-progress'],
    queryFn: () => api.getVision2047Progress(),
  });

  if (statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Forest Department Dashboard</h2>
        <p className="text-gray-600 mt-1">Real-time monitoring and management for Maharashtra's forest ecosystem</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Forest Cover"
          value={`${dashboardStats?.forestCoverPercentage || 0}%`}
          subtitle="Target: 35% by 2029"
          icon={TreePine}
          color="green"
          trend={{ value: "+0.8% from last year", positive: true }}
        />
        
        <StatsCard
          title="Saplings Planted"
          value={`${(dashboardStats?.totalSaplingsPlanted || 0) / 1000000}M`}
          subtitle={`${dashboardStats?.overallSurvivalRate || 0}% survival rate`}
          icon={Sprout}
          color="saffron"
        />
        
        <StatsCard
          title="Active Officers"
          value={dashboardStats?.activeOfficers || 0}
          subtitle="Range Forest Officers"
          icon={Users}
          color="blue"
        />
        
        <StatsCard
          title="Fire Alerts"
          value={dashboardStats?.activeFireAlerts || 0}
          subtitle="Active incidents"
          icon={Flame}
          color="red"
          trend={{ value: "-65% vs last year", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Forest Coverage Map */}
        <MapInterface className="lg:col-span-2" />

        {/* Recent Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <AlertTriangle className="text-warning-orange mr-2" size={20} />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : activeFireAlerts && activeFireAlerts.length > 0 ? (
                activeFireAlerts.slice(0, 3).map((alert: any) => (
                  <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${
                    alert.severity === 'high' ? 'bg-red-50 border-alert-red' :
                    alert.severity === 'medium' ? 'bg-yellow-50 border-warning-orange' :
                    'bg-green-50 border-success-green'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'high' ? 'bg-alert-red' :
                      alert.severity === 'medium' ? 'bg-warning-orange' :
                      'bg-success-green'
                    }`}>
                      <Flame className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Fire Alert</p>
                      <p className="text-xs text-gray-600">Location: {alert.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.detectedAt).toLocaleDateString()} - {alert.severity} severity
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto mb-2" size={32} />
                  <p>No active alerts</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vision 2047 Progress Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Target className="text-maharashtra-saffron mr-2" size={20} />
              Vision 2047 Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visionLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : vision2047Progress && vision2047Progress.length > 0 ? (
                vision2047Progress.slice(0, 3).map((progress: any) => (
                  <div key={progress.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Forest Cover Target ({progress.targetYear})
                      </span>
                      <span className="text-sm text-gray-600">
                        {progress.currentProgress || 0}% → {progress.forestCoverTarget}%
                      </span>
                    </div>
                    <Progress 
                      value={(progress.currentProgress / progress.forestCoverTarget) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Progress: {Math.round((progress.currentProgress / progress.forestCoverTarget) * 100)}% completed
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="mx-auto mb-2" size={32} />
                  <p>No progress data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* TECH KRAs Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <TrendingUp className="text-gov-blue mr-2" size={20} />
              TECH KRAs Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {officersLoading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : officers && officers.length > 0 ? (
                officers.slice(0, 3).map((officer: any) => (
                  <div key={officer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {officer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{officer.range}</p>
                        <p className="text-xs text-gray-600">RFO: {officer.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-success-green">
                          {officer.techScore || 0}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-success-green h-2 rounded-full" 
                            style={{ width: `${officer.techScore || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">TECH Score</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto mb-2" size={32} />
                  <p>No officer data available</p>
                </div>
              )}
              
              <Button variant="outline" className="w-full mt-4">
                View Detailed Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Digital Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Flame className="text-alert-red" size={24} />
              </div>
              <Badge variant="destructive">Active</Badge>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Fire Alert System</h4>
            <p className="text-sm text-gray-600 mb-4">Real-time forest fire monitoring and WhatsApp alerts</p>
            <Button className="w-full bg-alert-red hover:bg-red-600">
              Monitor Fires
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="text-gov-blue" size={24} />
              </div>
              <Badge className="bg-success-green">Live</Badge>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Digital Permits</h4>
            <p className="text-sm text-gray-600 mb-4">Online tree cutting permissions and forest produce licenses</p>
            <Button className="w-full bg-gov-blue hover:bg-blue-600">
              Process Applications
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TreePine className="text-success-green" size={24} />
              </div>
              <Badge className="bg-warning-orange">Beta</Badge>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Carbon Credits</h4>
            <p className="text-sm text-gray-600 mb-4">Track and verify forest carbon sequestration</p>
            <Button className="w-full bg-success-green hover:bg-green-600">
              View Credits
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="text-maharashtra-saffron" size={24} />
              </div>
              <Badge className="bg-maharashtra-saffron">24/7</Badge>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Programs</h4>
            <p className="text-sm text-gray-600 mb-4">Tribal livelihood programs and forest conservation</p>
            <Button className="w-full bg-maharashtra-saffron hover:bg-orange-600">
              Manage Programs
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
