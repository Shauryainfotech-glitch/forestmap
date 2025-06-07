import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { 
  AlertTriangle, 
  MapPin, 
  Clock,
  Phone,
  Users,
  TrendingDown,
  TrendingUp,
  Shield,
  Eye,
  Calendar,
  FileText,
  Camera,
  Radio,
  Zap,
  Target,
  HeartHandshake,
  TreePine,
  Home,
  Wheat,
  Car,
  Activity,
  CheckCircle
} from "lucide-react";

interface ConflictIncident {
  id: string;
  type: 'crop_damage' | 'livestock_attack' | 'human_injury' | 'property_damage' | 'road_accident';
  species: string;
  location: {
    village: string;
    range: string;
    coordinates: { lat: number; lng: number };
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'mitigating' | 'resolved';
  reportedDate: Date;
  resolvedDate?: Date;
  damageAssessment: {
    cropArea?: number;
    livestockCount?: number;
    propertyValue?: number;
    humanCasualties?: number;
  };
  reportedBy: string;
  assignedOfficer?: string;
  mitigationActions: string[];
  compensation: {
    claimed: number;
    approved: number;
    disbursed: number;
  };
}

interface MitigationStrategy {
  id: string;
  name: string;
  type: 'physical_barrier' | 'early_warning' | 'habitat_improvement' | 'community_engagement' | 'technology';
  effectiveness: number;
  costPerHectare: number;
  implementation: {
    villages: number;
    area: number;
    status: 'planned' | 'ongoing' | 'completed';
  };
  description: string;
}

interface CommunityProgram {
  id: string;
  name: string;
  type: 'awareness' | 'training' | 'livelihood' | 'compensation';
  participants: number;
  villages: number;
  completion: number;
  impact: 'high' | 'medium' | 'low';
  budget: number;
  startDate: Date;
  endDate: Date;
}

export default function HumanWildlifeConflict() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({
    type: '',
    species: '',
    village: '',
    severity: '',
    description: '',
    reporterName: '',
    reporterContact: '',
    damageDetails: ''
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  // Mock conflict data - in production, this would come from dedicated conflict management APIs
  const conflictIncidents: ConflictIncident[] = [
    {
      id: 'HWC001',
      type: 'crop_damage',
      species: 'Wild Boar',
      location: {
        village: 'Kanheri Village',
        range: 'Nashik Range',
        coordinates: { lat: 19.9975, lng: 73.7898 }
      },
      severity: 'high',
      status: 'mitigating',
      reportedDate: new Date(Date.now() - 86400000 * 2),
      damageAssessment: {
        cropArea: 2.5,
        propertyValue: 45000
      },
      reportedBy: 'राम पाटील',
      assignedOfficer: 'RFO Chandwad',
      mitigationActions: ['Installed solar fence', 'Crop guarding initiated', 'Community awareness'],
      compensation: {
        claimed: 45000,
        approved: 38000,
        disbursed: 25000
      }
    },
    {
      id: 'HWC002',
      type: 'livestock_attack',
      species: 'Leopard',
      location: {
        village: 'Bhandgaon',
        range: 'Yeola Range',
        coordinates: { lat: 20.0156, lng: 74.2289 }
      },
      severity: 'critical',
      status: 'investigating',
      reportedDate: new Date(Date.now() - 43200000),
      damageAssessment: {
        livestockCount: 2,
        propertyValue: 28000
      },
      reportedBy: 'सुनिता देशमुख',
      assignedOfficer: 'RFO Yeola',
      mitigationActions: ['Rapid response team deployed', 'Tracking initiated'],
      compensation: {
        claimed: 28000,
        approved: 0,
        disbursed: 0
      }
    },
    {
      id: 'HWC003',
      type: 'human_injury',
      species: 'Elephant',
      location: {
        village: 'Wadgaon',
        range: 'Taharabad Range',
        coordinates: { lat: 20.5937, lng: 78.9629 }
      },
      severity: 'critical',
      status: 'resolved',
      reportedDate: new Date(Date.now() - 86400000 * 7),
      resolvedDate: new Date(Date.now() - 86400000 * 2),
      damageAssessment: {
        humanCasualties: 1,
        propertyValue: 15000
      },
      reportedBy: 'गणेश कुलकर्णी',
      assignedOfficer: 'RFO Taharabad',
      mitigationActions: ['Medical aid provided', 'Elephant corridor secured', 'Compensation processed'],
      compensation: {
        claimed: 200000,
        approved: 200000,
        disbursed: 200000
      }
    }
  ];

  const mitigationStrategies: MitigationStrategy[] = [
    {
      id: 'MS001',
      name: 'Solar Electric Fencing',
      type: 'physical_barrier',
      effectiveness: 85,
      costPerHectare: 12000,
      implementation: {
        villages: 45,
        area: 2800,
        status: 'ongoing'
      },
      description: 'High-efficiency solar-powered electric fencing to prevent crop raiding'
    },
    {
      id: 'MS002',
      name: 'Early Warning SMS System',
      type: 'early_warning',
      effectiveness: 78,
      costPerHectare: 500,
      implementation: {
        villages: 120,
        area: 8500,
        status: 'completed'
      },
      description: 'Automated SMS alerts when wildlife movement detected near villages'
    },
    {
      id: 'MS003',
      name: 'Habitat Restoration',
      type: 'habitat_improvement',
      effectiveness: 92,
      costPerHectare: 25000,
      implementation: {
        villages: 25,
        area: 1500,
        status: 'planned'
      },
      description: 'Creating water sources and food plots within forest areas to reduce animal movement'
    },
    {
      id: 'MS004',
      name: 'Community Response Teams',
      type: 'community_engagement',
      effectiveness: 70,
      costPerHectare: 2000,
      implementation: {
        villages: 85,
        area: 5200,
        status: 'ongoing'
      },
      description: 'Trained village committees for immediate conflict response and coordination'
    }
  ];

  const communityPrograms: CommunityProgram[] = [
    {
      id: 'CP001',
      name: 'Conflict Awareness Campaign',
      type: 'awareness',
      participants: 15000,
      villages: 250,
      completion: 85,
      impact: 'high',
      budget: 2500000,
      startDate: new Date(Date.now() - 86400000 * 180),
      endDate: new Date(Date.now() + 86400000 * 90)
    },
    {
      id: 'CP002',
      name: 'Alternative Livelihood Training',
      type: 'livelihood',
      participants: 3200,
      villages: 65,
      completion: 60,
      impact: 'medium',
      budget: 5000000,
      startDate: new Date(Date.now() - 86400000 * 120),
      endDate: new Date(Date.now() + 86400000 * 150)
    },
    {
      id: 'CP003',
      name: 'Rapid Compensation System',
      type: 'compensation',
      participants: 850,
      villages: 180,
      completion: 95,
      impact: 'high',
      budget: 15000000,
      startDate: new Date(Date.now() - 86400000 * 365),
      endDate: new Date(Date.now() + 86400000 * 30)
    }
  ];

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to the conflict management API
    console.log('New conflict report:', reportForm);
    // Reset form
    setReportForm({
      type: '',
      species: '',
      village: '',
      severity: '',
      description: '',
      reporterName: '',
      reporterContact: '',
      damageDetails: ''
    });
  };

  const getIncidentTypeIcon = (type: string) => {
    switch (type) {
      case 'crop_damage': return Wheat;
      case 'livestock_attack': return Home;
      case 'human_injury': return Users;
      case 'property_damage': return Home;
      case 'road_accident': return Car;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'mitigating': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'reported': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (rangesLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalIncidents = conflictIncidents.length;
  const resolvedIncidents = conflictIncidents.filter(i => i.status === 'resolved').length;
  const activeIncidents = totalIncidents - resolvedIncidents;
  const totalCompensation = conflictIncidents.reduce((sum, incident) => sum + incident.compensation.disbursed, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Human-Wildlife Conflict Management</h2>
        <p className="text-gray-600 mt-1">Comprehensive monitoring and mitigation of wildlife conflicts across Maharashtra</p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="text-alert-red" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-alert-red">{activeIncidents}</p>
                <p className="text-sm text-gray-600">Active Conflicts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">{resolvedIncidents}</p>
                <p className="text-sm text-gray-600">Resolved This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <HeartHandshake className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">₹{(totalCompensation / 100000).toFixed(1)}L</p>
                <p className="text-sm text-gray-600">Compensation Disbursed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">-32%</p>
                <p className="text-sm text-gray-600">Incidents vs Last Year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Conflict Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incident Management</TabsTrigger>
          <TabsTrigger value="mitigation">Mitigation Strategies</TabsTrigger>
          <TabsTrigger value="community">Community Programs</TabsTrigger>
          <TabsTrigger value="report">Report Incident</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Conflict Hotspots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-red-800">Nashik Range</h4>
                      <p className="text-sm text-red-600">12 active incidents</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-orange-800">Yeola Range</h4>
                      <p className="text-sm text-orange-600">8 active incidents</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-yellow-800">Taharabad Range</h4>
                      <p className="text-sm text-yellow-600">4 active incidents</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Low Risk</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Species Involvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Wild Boar</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-24" />
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Leopard</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={28} className="w-24" />
                      <span className="text-sm text-gray-600">28%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Elephant</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={15} className="w-24" />
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bear</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={12} className="w-24" />
                      <span className="text-sm text-gray-600">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingDown className="mx-auto text-success-green mb-2" size={32} />
                  <div className="text-2xl font-bold text-success-green">-32%</div>
                  <div className="text-sm text-gray-600">Crop Damage Incidents</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="mx-auto text-maharashtra-saffron mb-2" size={32} />
                  <div className="text-2xl font-bold text-maharashtra-saffron">+85%</div>
                  <div className="text-sm text-gray-600">Compensation Efficiency</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Target className="mx-auto text-gov-blue mb-2" size={32} />
                  <div className="text-2xl font-bold text-gov-blue">72 hrs</div>
                  <div className="text-sm text-gray-600">Average Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="space-y-4">
            {conflictIncidents.map((incident) => {
              const IncidentIcon = getIncidentTypeIcon(incident.type);
              return (
                <Card key={incident.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <IncidentIcon className="text-gray-600" size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">#{incident.id}</h3>
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Species:</span>
                              <span className="ml-1 font-medium">{incident.species}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Location:</span>
                              <span className="ml-1 font-medium">{incident.location.village}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Reported:</span>
                              <span className="ml-1 font-medium">{incident.reportedDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-maharashtra-saffron">
                          ₹{incident.compensation.disbursed.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Compensation Paid</div>
                      </div>
                    </div>

                    {selectedIncident === incident.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Damage Assessment</h4>
                            <div className="space-y-2 text-sm">
                              {incident.damageAssessment.cropArea && (
                                <div className="flex justify-between">
                                  <span>Crop Area Affected:</span>
                                  <span>{incident.damageAssessment.cropArea} hectares</span>
                                </div>
                              )}
                              {incident.damageAssessment.livestockCount && (
                                <div className="flex justify-between">
                                  <span>Livestock Lost:</span>
                                  <span>{incident.damageAssessment.livestockCount} animals</span>
                                </div>
                              )}
                              {incident.damageAssessment.humanCasualties && (
                                <div className="flex justify-between">
                                  <span>Human Casualties:</span>
                                  <span>{incident.damageAssessment.humanCasualties}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-medium">
                                <span>Total Value:</span>
                                <span>₹{incident.damageAssessment.propertyValue?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Mitigation Actions</h4>
                            <div className="space-y-2">
                              {incident.mitigationActions.map((action, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle className="text-success-green" size={16} />
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4">
                              <h5 className="font-medium mb-2">Assigned Officer</h5>
                              <div className="flex items-center space-x-2">
                                <Phone size={16} className="text-gray-600" />
                                <span className="text-sm">{incident.assignedOfficer}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="mitigation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mitigationStrategies.map((strategy) => (
              <Card key={strategy.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {strategy.name}
                    <Badge variant="outline" className="bg-blue-50">
                      {strategy.effectiveness}% effective
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{strategy.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Implementation Status:</span>
                      <Badge className={
                        strategy.implementation.status === 'completed' ? 'bg-success-green' :
                        strategy.implementation.status === 'ongoing' ? 'bg-gov-blue' :
                        'bg-warning-orange'
                      }>
                        {strategy.implementation.status}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Villages Covered:</span>
                      <span className="font-medium">{strategy.implementation.villages}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Area Coverage:</span>
                      <span className="font-medium">{strategy.implementation.area} hectares</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Cost per Hectare:</span>
                      <span className="font-medium">₹{strategy.costPerHectare.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="space-y-6">
            {communityPrograms.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {program.name}
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={
                        program.impact === 'high' ? 'bg-success-green text-white' :
                        program.impact === 'medium' ? 'bg-warning-orange text-white' :
                        'bg-gray-500 text-white'
                      }>
                        {program.impact} impact
                      </Badge>
                      <Progress value={program.completion} className="w-20" />
                      <span className="text-sm font-medium">{program.completion}%</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="mx-auto text-gov-blue mb-1" size={20} />
                      <div className="text-lg font-bold">{program.participants.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Participants</div>
                    </div>
                    
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <MapPin className="mx-auto text-success-green mb-1" size={20} />
                      <div className="text-lg font-bold">{program.villages}</div>
                      <div className="text-xs text-gray-600">Villages</div>
                    </div>
                    
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <Calendar className="mx-auto text-maharashtra-saffron mb-1" size={20} />
                      <div className="text-lg font-bold">
                        {Math.ceil((program.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                      </div>
                      <div className="text-xs text-gray-600">Days Remaining</div>
                    </div>
                    
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Activity className="mx-auto text-purple-600 mb-1" size={20} />
                      <div className="text-lg font-bold">₹{(program.budget / 1000000).toFixed(1)}M</div>
                      <div className="text-xs text-gray-600">Budget</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Started: {program.startDate.toLocaleDateString()}</span>
                    <span>Ends: {program.endDate.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report New Human-Wildlife Conflict Incident</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Incident Type</Label>
                    <Select value={reportForm.type} onValueChange={(value) => setReportForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop_damage">Crop Damage</SelectItem>
                        <SelectItem value="livestock_attack">Livestock Attack</SelectItem>
                        <SelectItem value="human_injury">Human Injury</SelectItem>
                        <SelectItem value="property_damage">Property Damage</SelectItem>
                        <SelectItem value="road_accident">Road Accident</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="species">Wildlife Species</Label>
                    <Select value={reportForm.species} onValueChange={(value) => setReportForm(prev => ({ ...prev, species: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select species involved" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wild_boar">Wild Boar</SelectItem>
                        <SelectItem value="leopard">Leopard</SelectItem>
                        <SelectItem value="elephant">Elephant</SelectItem>
                        <SelectItem value="bear">Sloth Bear</SelectItem>
                        <SelectItem value="deer">Deer</SelectItem>
                        <SelectItem value="monkey">Monkey</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="village">Village/Location</Label>
                    <Input
                      id="village"
                      value={reportForm.village}
                      onChange={(e) => setReportForm(prev => ({ ...prev, village: e.target.value }))}
                      placeholder="Enter village name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="severity">Severity Level</Label>
                    <Select value={reportForm.severity} onValueChange={(value) => setReportForm(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="reporterName">Reporter Name</Label>
                    <Input
                      id="reporterName"
                      value={reportForm.reporterName}
                      onChange={(e) => setReportForm(prev => ({ ...prev, reporterName: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="reporterContact">Contact Number</Label>
                    <Input
                      id="reporterContact"
                      value={reportForm.reporterContact}
                      onChange={(e) => setReportForm(prev => ({ ...prev, reporterContact: e.target.value }))}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Incident Description</Label>
                  <Textarea
                    id="description"
                    value={reportForm.description}
                    onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed description of the incident"
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="damageDetails">Damage Assessment</Label>
                  <Textarea
                    id="damageDetails"
                    value={reportForm.damageDetails}
                    onChange={(e) => setReportForm(prev => ({ ...prev, damageDetails: e.target.value }))}
                    placeholder="Describe the damage caused (crop area, livestock count, property value, etc.)"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <Button type="submit" className="bg-alert-red hover:bg-red-700">
                    Submit Incident Report
                  </Button>
                  <Button type="button" variant="outline">
                    <Camera className="mr-2" size={16} />
                    Add Photos
                  </Button>
                  <Button type="button" variant="outline">
                    <MapPin className="mr-2" size={16} />
                    Mark Location
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="text-alert-red" size={20} />
                    <h4 className="font-semibold text-red-800">Emergency Helpline</h4>
                  </div>
                  <p className="text-2xl font-bold text-red-900">1926</p>
                  <p className="text-sm text-red-600">24/7 Wildlife Emergency</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Phone className="text-gov-blue" size={20} />
                    <h4 className="font-semibold text-blue-800">Range Office</h4>
                  </div>
                  <p className="text-lg font-bold text-blue-900">+91-253-2345678</p>
                  <p className="text-sm text-blue-600">Local Forest Range</p>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Radio className="text-success-green" size={20} />
                    <h4 className="font-semibold text-green-800">WhatsApp Alert</h4>
                  </div>
                  <p className="text-lg font-bold text-green-900">+91-9876543210</p>
                  <p className="text-sm text-green-600">Rapid Response Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}