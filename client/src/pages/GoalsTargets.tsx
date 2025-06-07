import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  Leaf,
  Users,
  TreePine,
  DollarSign,
  BarChart3,
  Eye
} from "lucide-react";

export default function GoalsTargets() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("2029");

  const { data: vision2047Progress, isLoading: visionLoading } = useQuery({
    queryKey: ['/api/vision-2047-progress'],
    queryFn: () => api.getVision2047Progress(),
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard-stats'],
    queryFn: () => api.getDashboardStats(),
  });

  if (visionLoading || statsLoading) {
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

  const currentForestCover = dashboardStats?.forestCoverPercentage || 21.51;
  
  // Vision 2047 milestones
  const milestones = [
    {
      year: 2029,
      title: "Forest Cover Enhancement Phase I",
      forestCoverTarget: 25,
      carbonTarget: 2000000, // 2M tons CO2
      revenueTarget: 500, // 500 Cr
      keyInitiatives: [
        "Afforestation of 50,000 hectares",
        "Digital permit system implementation",
        "TECH KRA performance framework",
        "Community engagement programs"
      ],
      status: "in_progress"
    },
    {
      year: 2035,
      title: "Sustainable Forest Management Phase II",
      forestCoverTarget: 30,
      carbonTarget: 5000000, // 5M tons CO2
      revenueTarget: 1500, // 1500 Cr
      keyInitiatives: [
        "Carbon credit marketplace establishment",
        "Wildlife corridor development",
        "Smart forest monitoring systems",
        "Green skill development programs"
      ],
      status: "planned"
    },
    {
      year: 2047,
      title: "Vision 2047 - Developed Maharashtra",
      forestCoverTarget: 35,
      carbonTarget: 10000000, // 10M tons CO2
      revenueTarget: 5000, // 5000 Cr
      keyInitiatives: [
        "Complete digital governance",
        "Net-zero forest operations",
        "International carbon market integration",
        "Maharashtra as forest conservation model"
      ],
      status: "planned"
    }
  ];

  const selectedMilestone = milestones.find(m => m.year.toString() === selectedTimeframe) || milestones[0];
  const progressToTarget = (currentForestCover / selectedMilestone.forestCoverTarget) * 100;

  // Calculate sectoral contributions
  const sectoralTargets = [
    {
      sector: "Afforestation & Reforestation",
      target: "2,50,000 hectares by 2047",
      current: "45,000 hectares",
      progress: 18,
      contribution: "40% of forest cover increase"
    },
    {
      sector: "Forest Protection & Conservation",
      target: "Zero net forest loss",
      current: "98.5% protection rate",
      progress: 98.5,
      contribution: "Maintain existing forest cover"
    },
    {
      sector: "Carbon Sequestration",
      target: "10M tons CO2 by 2047",
      current: "2.1M tons CO2",
      progress: 21,
      contribution: "₹25,000 Cr revenue potential"
    },
    {
      sector: "Digital Transformation",
      target: "100% digital operations",
      current: "65% digitization",
      progress: 65,
      contribution: "Enhanced transparency & efficiency"
    },
    {
      sector: "Community Engagement",
      target: "5,000 forest committees",
      current: "1,200 committees",
      progress: 24,
      contribution: "Grassroots conservation support"
    },
    {
      sector: "Economic Development",
      target: "₹5,000 Cr annual revenue",
      current: "₹450 Cr annual revenue",
      progress: 9,
      contribution: "Sustainable livelihood creation"
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vision 2047 Goals & Targets</h2>
        <p className="text-gray-600 mt-1">Maharashtra's roadmap to becoming a developed state through sustainable forest management</p>
      </div>

      {/* Milestone Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {milestones.map((milestone) => (
          <Card 
            key={milestone.year}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTimeframe === milestone.year.toString() 
                ? 'ring-2 ring-maharashtra-saffron border-maharashtra-saffron' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedTimeframe(milestone.year.toString())}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge 
                  variant={milestone.status === 'in_progress' ? 'default' : 'secondary'}
                  className={milestone.status === 'in_progress' ? 'bg-success-green' : ''}
                >
                  {milestone.year}
                </Badge>
                <Badge variant="outline">
                  {milestone.status === 'in_progress' ? 'In Progress' : 'Planned'}
                </Badge>
              </div>
              <CardTitle className="text-lg">{milestone.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Forest Cover</span>
                  <span className="font-semibold text-success-green">{milestone.forestCoverTarget}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Carbon Target</span>
                  <span className="font-semibold text-gov-blue">{(milestone.carbonTarget / 1000000).toFixed(1)}M tons</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Target</span>
                  <span className="font-semibold text-maharashtra-saffron">₹{milestone.revenueTarget} Cr</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectoral">Sectoral Targets</TabsTrigger>
          <TabsTrigger value="initiatives">Key Initiatives</TabsTrigger>
          <TabsTrigger value="monitoring">Progress Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 text-maharashtra-saffron" size={24} />
                {selectedMilestone.year} Target Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Forest Cover Progress</span>
                      <span className="text-sm text-gray-600">{currentForestCover.toFixed(2)}% / {selectedMilestone.forestCoverTarget}%</span>
                    </div>
                    <Progress value={progressToTarget} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">
                      {progressToTarget > 100 ? 'Target exceeded!' : `${(selectedMilestone.forestCoverTarget - currentForestCover).toFixed(2)}% remaining`}
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Time Progress</span>
                      <span className="text-sm text-gray-600">2024 / {selectedMilestone.year}</span>
                    </div>
                    <Progress value={((2024 - 2019) / (selectedMilestone.year - 2019)) * 100} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedMilestone.year - 2024} years remaining
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Key Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Forest Area</span>
                      <span className="font-medium">{dashboardStats?.totalForestArea?.toLocaleString()} hectares</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Active Officers</span>
                      <span className="font-medium">{dashboardStats?.activeOfficers}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Saplings Planted</span>
                      <span className="font-medium">{dashboardStats?.totalSaplingsPlanted?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectoral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectoralTargets.map((sector, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{sector.sector}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{sector.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={sector.progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target:</span>
                        <span className="font-medium">{sector.target}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-medium text-success-green">{sector.current}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-gray-600">Impact:</span>
                        <p className="font-medium text-maharashtra-saffron">{sector.contribution}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Initiatives for {selectedMilestone.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMilestone.keyInitiatives.map((initiative, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-maharashtra-saffron rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium">{initiative}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="text-gov-blue" size={24} />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gov-blue">95%</p>
                    <p className="text-sm text-gray-600">Transparency Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="text-success-green" size={24} />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-success-green">88%</p>
                    <p className="text-sm text-gray-600">Efficiency Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="text-maharashtra-saffron" size={24} />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-maharashtra-saffron">92%</p>
                    <p className="text-sm text-gray-600">Cost Effectiveness</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="text-alert-red" size={24} />
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-alert-red">94%</p>
                    <p className="text-sm text-gray-600">Humane Approach</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Tracking Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Monthly Reviews</h4>
                    <p className="text-sm text-gray-600">Range-wise progress assessment and performance evaluation</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Quarterly Audits</h4>
                    <p className="text-sm text-gray-600">Independent verification of forest cover and carbon data</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Annual Reports</h4>
                    <p className="text-sm text-gray-600">Comprehensive progress reports to Maharashtra Government</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}