import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Eye,
  Zap,
  TreePine,
  Flame,
  CloudRain,
  Wind,
  ThermometerSun,
  MapPin,
  Calendar,
  Activity,
  BarChart3
} from "lucide-react";

interface PredictiveModel {
  id: string;
  name: string;
  type: 'fire_risk' | 'deforestation' | 'wildlife_migration' | 'carbon_estimation';
  accuracy: number;
  lastUpdated: Date;
  status: 'active' | 'training' | 'maintenance';
  predictions: number;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  rangeId?: number;
}

export default function AIAnalytics() {
  const [selectedModel, setSelectedModel] = useState<string>("fire_risk");
  const [timeframe, setTimeframe] = useState<string>("7_days");

  const { data: forestStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/forest-stats'],
    queryFn: () => api.getForestStats(),
  });

  const { data: fireAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts'],
    queryFn: () => api.getFireAlerts(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  // Mock AI models data
  const predictiveModels: PredictiveModel[] = [
    {
      id: 'fire_risk',
      name: 'Fire Risk Prediction',
      type: 'fire_risk',
      accuracy: 94.2,
      lastUpdated: new Date(),
      status: 'active',
      predictions: 156
    },
    {
      id: 'deforestation',
      name: 'Deforestation Detection',
      type: 'deforestation',
      accuracy: 89.8,
      lastUpdated: new Date(Date.now() - 86400000),
      status: 'active',
      predictions: 89
    },
    {
      id: 'wildlife_migration',
      name: 'Wildlife Movement Tracker',
      type: 'wildlife_migration',
      accuracy: 87.5,
      lastUpdated: new Date(Date.now() - 172800000),
      status: 'training',
      predictions: 234
    },
    {
      id: 'carbon_estimation',
      name: 'Carbon Sequestration Estimator',
      type: 'carbon_estimation',
      accuracy: 92.1,
      lastUpdated: new Date(Date.now() - 259200000),
      status: 'active',
      predictions: 45
    }
  ];

  // Mock AI insights based on real data
  const generateAIInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High Fire Risk Alert - Nashik Range',
        description: 'Weather conditions and vegetation moisture indicate 85% probability of fire incidents in the next 72 hours.',
        confidence: 85,
        impact: 'high',
        actionRequired: true,
        rangeId: 1
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Optimal Plantation Window',
        description: 'Soil moisture and temperature conditions are ideal for plantation activities in Aurangabad Range.',
        confidence: 92,
        impact: 'medium',
        actionRequired: false,
        rangeId: 2
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Carbon Credit Optimization',
        description: 'Implementing advanced agroforestry in 3 ranges could increase carbon sequestration by 15%.',
        confidence: 78,
        impact: 'high',
        actionRequired: false
      },
      {
        id: '4',
        type: 'warning',
        title: 'Wildlife Corridor Disruption',
        description: 'Satellite imagery shows potential illegal encroachment affecting elephant migration routes.',
        confidence: 88,
        impact: 'high',
        actionRequired: true,
        rangeId: 4
      },
      {
        id: '5',
        type: 'opportunity',
        title: 'Eco-tourism Potential',
        description: 'AI analysis identifies 3 locations with high biodiversity suitable for sustainable eco-tourism development.',
        confidence: 82,
        impact: 'medium',
        actionRequired: false
      }
    ];

    return insights;
  };

  const aiInsights = generateAIInsights();

  // Fire risk assessment data
  const fireRiskData = [
    { range: 'Nashik', risk: 85, factors: ['Low humidity (25%)', 'High temperature (38°C)', 'Dry vegetation'], alert: 'critical' },
    { range: 'Aurangabad', risk: 45, factors: ['Moderate humidity (60%)', 'Normal temperature (32°C)', 'Recent rainfall'], alert: 'low' },
    { range: 'Pune', risk: 62, factors: ['Wind speed (25 km/h)', 'Moderate temperature (35°C)', 'Mixed vegetation'], alert: 'medium' },
    { range: 'Nagpur', risk: 38, factors: ['High humidity (75%)', 'Cloudy weather', 'Green vegetation'], alert: 'low' },
    { range: 'Mumbai', risk: 28, factors: ['Coastal humidity (80%)', 'Cool temperature (29°C)', 'Recent plantation'], alert: 'low' }
  ];

  // Environmental parameters for AI analysis
  const environmentalParams = [
    { name: 'Temperature', value: 35, unit: '°C', trend: 'up', critical: 40, icon: ThermometerSun },
    { name: 'Humidity', value: 45, unit: '%', trend: 'down', critical: 30, icon: CloudRain },
    { name: 'Wind Speed', value: 18, unit: 'km/h', trend: 'up', critical: 25, icon: Wind },
    { name: 'Soil Moisture', value: 62, unit: '%', trend: 'stable', critical: 40, icon: TreePine }
  ];

  if (statsLoading || alertsLoading || rangesLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">AI Analytics & Predictive Intelligence</h2>
        <p className="text-gray-600 mt-1">Advanced machine learning models for forest management and decision support</p>
      </div>

      {/* AI Model Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {predictiveModels.map((model) => (
          <Card 
            key={model.id} 
            className={`cursor-pointer transition-all duration-200 ${
              selectedModel === model.id ? 'ring-2 ring-gov-blue border-gov-blue' : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedModel(model.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Brain className="text-gov-blue" size={24} />
                <Badge 
                  variant={model.status === 'active' ? 'default' : 'secondary'}
                  className={model.status === 'active' ? 'bg-success-green' : ''}
                >
                  {model.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-2">{model.name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Accuracy</span>
                  <span className="font-semibold">{model.accuracy}%</span>
                </div>
                <Progress value={model.accuracy} className="h-1" />
                <div className="text-xs text-gray-500">
                  {model.predictions} predictions today
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="fire-risk">Fire Risk Analysis</TabsTrigger>
          <TabsTrigger value="environmental">Environmental Monitoring</TabsTrigger>
          <TabsTrigger value="predictions">Predictive Models</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {insight.type === 'warning' && <AlertTriangle className="text-alert-red" size={20} />}
                      {insight.type === 'opportunity' && <TrendingUp className="text-success-green" size={20} />}
                      {insight.type === 'recommendation' && <Eye className="text-gov-blue" size={20} />}
                      <Badge 
                        variant="outline" 
                        className={
                          insight.impact === 'high' ? 'border-alert-red text-alert-red' :
                          insight.impact === 'medium' ? 'border-warning-orange text-warning-orange' :
                          'border-gray-400 text-gray-600'
                        }
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{insight.confidence}% confidence</span>
                  </div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {insight.rangeId && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1" />
                          Range ID: {insight.rangeId}
                        </div>
                      )}
                    </div>
                    {insight.actionRequired && (
                      <Button size="sm" className="bg-maharashtra-saffron hover:bg-orange-600">
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fire-risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="mr-2 text-alert-red" size={24} />
                Real-time Fire Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fireRiskData.map((data, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{data.range} Range</h4>
                      <Badge 
                        variant="outline"
                        className={
                          data.alert === 'critical' ? 'border-alert-red text-alert-red bg-red-50' :
                          data.alert === 'medium' ? 'border-warning-orange text-warning-orange bg-orange-50' :
                          'border-success-green text-success-green bg-green-50'
                        }
                      >
                        {data.alert}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Risk Level</span>
                        <span className="font-semibold">{data.risk}%</span>
                      </div>
                      <Progress 
                        value={data.risk} 
                        className={`h-2 ${
                          data.risk > 70 ? 'bg-red-100' : 
                          data.risk > 50 ? 'bg-orange-100' : 
                          'bg-green-100'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-sm font-medium text-gray-700">Contributing Factors:</h5>
                      {data.factors.map((factor, factorIndex) => (
                        <div key={factorIndex} className="text-xs text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {environmentalParams.map((param, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <param.icon className="text-gov-blue" size={24} />
                    <div className={`text-xs px-2 py-1 rounded ${
                      param.trend === 'up' ? 'bg-red-100 text-red-700' :
                      param.trend === 'down' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {param.trend}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {param.value}{param.unit}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{param.name}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Critical: {param.critical}{param.unit}</span>
                    <span className={
                      param.value >= param.critical ? 'text-alert-red font-semibold' : 'text-success-green'
                    }>
                      {param.value >= param.critical ? 'Alert' : 'Normal'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Environmental Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Activity className="mr-2 text-success-green" size={18} />
                    Forest Health Index
                  </h4>
                  <div className="text-3xl font-bold text-success-green mb-1">87.5</div>
                  <div className="text-sm text-gray-600">Improving by 3.2% this month</div>
                  <Progress value={87.5} className="mt-2" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <BarChart3 className="mr-2 text-gov-blue" size={18} />
                    Biodiversity Score
                  </h4>
                  <div className="text-3xl font-bold text-gov-blue mb-1">92.8</div>
                  <div className="text-sm text-gray-600">Stable over last quarter</div>
                  <Progress value={92.8} className="mt-2" />
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <TreePine className="mr-2 text-maharashtra-saffron" size={18} />
                    Carbon Absorption Rate
                  </h4>
                  <div className="text-3xl font-bold text-maharashtra-saffron mb-1">4.2M</div>
                  <div className="text-sm text-gray-600">tons CO2/year</div>
                  <Progress value={84} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-semibold text-sm">{model.name}</h4>
                        <p className="text-xs text-gray-600">Last updated: {model.lastUpdated.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gov-blue">{model.accuracy}%</div>
                        <div className="text-xs text-gray-500">accuracy</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Sources Active</span>
                    <Badge className="bg-success-green">12/12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Models Running</span>
                    <Badge className="bg-gov-blue">4/4</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Predictions Generated Today</span>
                    <Badge className="bg-maharashtra-saffron">524</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Health</span>
                    <Badge className="bg-success-green">Optimal</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="text-gray-600" size={16} />
                    <span className="text-sm">Next fire risk assessment</span>
                  </div>
                  <span className="text-sm font-semibold">In 4 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="text-gray-600" size={16} />
                    <span className="text-sm">Wildlife migration analysis</span>
                  </div>
                  <span className="text-sm font-semibold">Tomorrow 6 AM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <TreePine className="text-gray-600" size={16} />
                    <span className="text-sm">Carbon sequestration report</span>
                  </div>
                  <span className="text-sm font-semibold">Weekly (Sunday)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}