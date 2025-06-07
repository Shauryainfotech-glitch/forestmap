import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Officer } from "@/lib/types";
import { 
  Users, 
  Handshake, 
  TreePine,
  Shield,
  Zap,
  Heart,
  Target,
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building
} from "lucide-react";

interface SectoralGroup {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  leader: string;
  members: number;
  responsibilities: string[];
  currentProjects: number;
  completedProjects: number;
  budget: number;
  performance: number;
  icon: any;
  color: string;
}

export default function SectoralGroups() {
  const [selectedGroup, setSelectedGroup] = useState<string>("afforestation");

  const { data: officers, isLoading: officersLoading } = useQuery({
    queryKey: ['/api/officers'],
    queryFn: () => api.getOfficers(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  // Define sectoral groups based on Vision 2047 framework
  const sectoralGroups: SectoralGroup[] = [
    {
      id: "afforestation",
      name: "Afforestation & Plantation",
      nameHi: "वनीकरण आणि लागवड",
      description: "Leading afforestation drives and plantation programs across Maharashtra",
      leader: "श्री राहुल पाटील",
      members: 45,
      responsibilities: [
        "Species selection and plantation planning",
        "Nursery management and sapling production",
        "Survival rate monitoring and maintenance",
        "Community plantation programs",
        "Carbon sequestration projects"
      ],
      currentProjects: 12,
      completedProjects: 28,
      budget: 150,
      performance: 92,
      icon: TreePine,
      color: "success-green"
    },
    {
      id: "protection",
      name: "Forest Protection & Security",
      nameHi: "वन संरक्षण आणि सुरक्षा",
      description: "Ensuring forest protection through advanced monitoring and security measures",
      leader: "श्री अनिल शर्मा",
      members: 38,
      responsibilities: [
        "Fire prevention and management",
        "Anti-poaching operations",
        "Illegal encroachment monitoring",
        "Wildlife protection initiatives",
        "Emergency response coordination"
      ],
      currentProjects: 8,
      completedProjects: 22,
      budget: 200,
      performance: 89,
      icon: Shield,
      color: "gov-blue"
    },
    {
      id: "technology",
      name: "Digital Innovation & Technology",
      nameHi: "डिजिटल नवाचार आणि तंत्रज्ञान",
      description: "Implementing cutting-edge technology for forest management",
      leader: "डॉ. प्रिया देशमुख",
      members: 25,
      responsibilities: [
        "GIS mapping and satellite monitoring",
        "Digital permit system management",
        "Data analytics and reporting",
        "Mobile app development",
        "IoT sensor deployment"
      ],
      currentProjects: 15,
      completedProjects: 18,
      budget: 180,
      performance: 95,
      icon: Zap,
      color: "maharashtra-saffron"
    },
    {
      id: "community",
      name: "Community Engagement & Welfare",
      nameHi: "समुदायिक सहभाग आणि कल्याण",
      description: "Building partnerships with local communities for sustainable forest management",
      leader: "श्रीमती सुनीता जोशी",
      members: 32,
      responsibilities: [
        "Community forest committees",
        "Livelihood generation programs",
        "Awareness and education campaigns",
        "Traditional knowledge integration",
        "Conflict resolution"
      ],
      currentProjects: 10,
      completedProjects: 35,
      budget: 120,
      performance: 88,
      icon: Heart,
      color: "alert-red"
    },
    {
      id: "research",
      name: "Research & Development",
      nameHi: "संशोधन आणि विकास",
      description: "Scientific research and innovation for sustainable forest practices",
      leader: "डॉ. विकास कुलकर्णी",
      members: 18,
      responsibilities: [
        "Species research and development",
        "Climate adaptation studies",
        "Biodiversity conservation research",
        "Carbon credit methodology",
        "Best practices documentation"
      ],
      currentProjects: 6,
      completedProjects: 12,
      budget: 100,
      performance: 94,
      icon: Target,
      color: "warning-orange"
    },
    {
      id: "governance",
      name: "Governance & Administration",
      nameHi: "शासन आणि प्रशासन",
      description: "Ensuring transparent and efficient forest department operations",
      leader: "श्री महेश वाघ",
      members: 28,
      responsibilities: [
        "Policy implementation",
        "Performance monitoring",
        "Budget management",
        "Inter-departmental coordination",
        "Legal compliance"
      ],
      currentProjects: 5,
      completedProjects: 20,
      budget: 90,
      performance: 91,
      icon: Award,
      color: "gov-blue"
    }
  ];

  const selectedGroupData = sectoralGroups.find(group => group.id === selectedGroup) || sectoralGroups[0];

  // Get officers for the selected group (simulated assignment)
  const groupOfficers = officers?.slice(0, selectedGroupData.members / 5) || [];

  if (officersLoading || rangesLoading) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sectoral Groups</h2>
        <p className="text-gray-600 mt-1">Specialized teams driving Maharashtra's Vision 2047 forest management objectives</p>
      </div>

      {/* Group Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {sectoralGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card 
              key={group.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedGroup === group.id 
                  ? `ring-2 ring-${group.color} border-${group.color}` 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedGroup(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${group.color} bg-opacity-10 rounded-lg`}>
                    <Icon className={`text-${group.color}`} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{group.name}</h3>
                    <p className="text-xs text-gray-600">{group.nameHi}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{group.members} members</span>
                      <Badge variant="outline" className="text-xs">
                        {group.performance}% performance
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Group Details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Team Members</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 bg-${selectedGroupData.color} bg-opacity-10 rounded-lg`}>
                  <selectedGroupData.icon className={`text-${selectedGroupData.color}`} size={32} />
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedGroupData.name}</CardTitle>
                  <p className="text-gray-600">{selectedGroupData.nameHi}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-6">{selectedGroupData.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedGroupData.members}</div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-maharashtra-saffron">{selectedGroupData.currentProjects}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-success-green">{selectedGroupData.completedProjects}</div>
                  <div className="text-sm text-gray-600">Completed Projects</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gov-blue">₹{selectedGroupData.budget}Cr</div>
                  <div className="text-sm text-gray-600">Annual Budget</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Key Responsibilities</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedGroupData.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-2 h-2 bg-maharashtra-saffron rounded-full mt-2"></div>
                      <span className="text-sm text-gray-700">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-maharashtra-saffron rounded-full flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedGroupData.leader}</h4>
                  <p className="text-sm text-gray-600">Group Leader - {selectedGroupData.name}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Phone size={12} className="mr-1" />
                      +91 98765 43210
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Mail size={12} className="mr-1" />
                      leader@mahaforest.gov.in
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupOfficers.map((officer: Officer) => (
                  <div key={officer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-gov-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {officer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{officer.name}</h4>
                      <p className="text-xs text-gray-600">{officer.designation}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{officer.range} Range</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {officer.techScore || 85}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(selectedGroupData.currentProjects)].slice(0, 5).map((_, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Project {String.fromCharCode(65 + index)} - Vision 2047</h4>
                        <Badge variant="outline" className="text-xs">
                          {['Planning', 'In Progress', 'Review', 'Testing'][index % 4]}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Strategic initiative aligned with {selectedGroupData.name} objectives
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs text-gray-500">{25 + (index * 15)}%</span>
                      </div>
                      <Progress value={25 + (index * 15)} className="h-1 mt-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(Math.min(selectedGroupData.completedProjects, 5))].map((_, index) => (
                    <div key={index} className="p-3 bg-success-green bg-opacity-10 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="text-success-green" size={16} />
                        <h4 className="font-semibold text-sm">Achievement {index + 1}</h4>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        Successfully completed strategic initiative contributing to Vision 2047 goals
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-success-green font-semibold">Completed</span>
                        <span className="text-xs text-gray-500">
                          {new Date(2024, (index + 8) % 12, 1).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <span className="text-sm text-gray-600">{selectedGroupData.performance}%</span>
                    </div>
                    <Progress value={selectedGroupData.performance} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Project Delivery</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((selectedGroupData.completedProjects / (selectedGroupData.completedProjects + selectedGroupData.currentProjects)) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(selectedGroupData.completedProjects / (selectedGroupData.completedProjects + selectedGroupData.currentProjects)) * 100} 
                      className="h-3" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Budget Utilization</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <Progress value={78} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Vision 2047 Alignment</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <Progress value={95} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Impact Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Environmental Impact</h4>
                    <p className="text-xs text-gray-600">
                      Contributed to {Math.round(selectedGroupData.performance * 0.1)}% increase in forest cover through strategic initiatives
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Economic Impact</h4>
                    <p className="text-xs text-gray-600">
                      Generated ₹{Math.round(selectedGroupData.budget * 0.3)}Cr in economic value through sustainable practices
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Social Impact</h4>
                    <p className="text-xs text-gray-600">
                      Engaged {selectedGroupData.members * 50} community members in forest conservation activities
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Innovation Impact</h4>
                    <p className="text-xs text-gray-600">
                      Implemented {Math.round(selectedGroupData.currentProjects * 0.5)} innovative solutions aligned with digital transformation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}