import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { 
  Satellite, 
  Camera, 
  Activity, 
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Signal,
  Wifi,
  Battery,
  Thermometer,
  Eye,
  Zap,
  Radio,
  MonitorSpeaker
} from "lucide-react";

interface IoTSensor {
  id: string;
  name: string;
  type: 'weather' | 'soil' | 'air_quality' | 'wildlife_camera' | 'fire_detector';
  location: {
    rangeId: number;
    coordinates: { lat: number; lng: number };
    description: string;
  };
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: Date;
  batteryLevel: number;
  signalStrength: number;
  data: {
    value: number;
    unit: string;
    timestamp: Date;
  };
}

interface LiveAlert {
  id: string;
  type: 'fire' | 'wildlife' | 'intrusion' | 'weather' | 'equipment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  sensorId?: string;
}

export default function RealTimeMonitoring() {
  const [selectedSensor, setSelectedSensor] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: fireAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts/active'],
    queryFn: () => api.getActiveFireAlerts(),
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  // Mock IoT sensors data - in production, this would come from real IoT devices
  const iotSensors: IoTSensor[] = [
    {
      id: 'weather_001',
      name: 'Nashik Weather Station',
      type: 'weather',
      location: {
        rangeId: 1,
        coordinates: { lat: 19.9975, lng: 73.7898 },
        description: 'Central monitoring station'
      },
      status: 'online',
      lastUpdate: new Date(),
      batteryLevel: 85,
      signalStrength: 92,
      data: {
        value: 35.2,
        unit: '°C',
        timestamp: new Date()
      }
    },
    {
      id: 'fire_det_002',
      name: 'Trimbak Fire Detector',
      type: 'fire_detector',
      location: {
        rangeId: 1,
        coordinates: { lat: 19.9328, lng: 73.5267 },
        description: 'High-risk fire zone'
      },
      status: 'online',
      lastUpdate: new Date(Date.now() - 120000),
      batteryLevel: 67,
      signalStrength: 78,
      data: {
        value: 42,
        unit: 'ppm smoke',
        timestamp: new Date(Date.now() - 120000)
      }
    },
    {
      id: 'wildlife_003',
      name: 'Elephant Corridor Camera',
      type: 'wildlife_camera',
      location: {
        rangeId: 4,
        coordinates: { lat: 21.1458, lng: 79.0882 },
        description: 'Main wildlife corridor'
      },
      status: 'online',
      lastUpdate: new Date(Date.now() - 300000),
      batteryLevel: 91,
      signalStrength: 84,
      data: {
        value: 15,
        unit: 'detections/hour',
        timestamp: new Date(Date.now() - 300000)
      }
    },
    {
      id: 'soil_004',
      name: 'Aurangabad Soil Monitor',
      type: 'soil',
      location: {
        rangeId: 2,
        coordinates: { lat: 19.8762, lng: 75.3433 },
        description: 'Plantation monitoring area'
      },
      status: 'maintenance',
      lastUpdate: new Date(Date.now() - 3600000),
      batteryLevel: 23,
      signalStrength: 0,
      data: {
        value: 68,
        unit: '% moisture',
        timestamp: new Date(Date.now() - 3600000)
      }
    },
    {
      id: 'air_005',
      name: 'Mumbai Air Quality Monitor',
      type: 'air_quality',
      location: {
        rangeId: 5,
        coordinates: { lat: 19.0760, lng: 72.8777 },
        description: 'Urban forest interface'
      },
      status: 'online',
      lastUpdate: new Date(Date.now() - 180000),
      batteryLevel: 76,
      signalStrength: 95,
      data: {
        value: 45,
        unit: 'AQI',
        timestamp: new Date(Date.now() - 180000)
      }
    }
  ];

  // Mock live alerts based on sensor data
  const liveAlerts: LiveAlert[] = [
    {
      id: 'alert_001',
      type: 'fire',
      severity: 'high',
      location: 'Trimbak Forest Area - Sector 7',
      description: 'Elevated smoke levels detected by fire sensor FD_002',
      timestamp: new Date(Date.now() - 1800000),
      status: 'active',
      sensorId: 'fire_det_002'
    },
    {
      id: 'alert_002',
      type: 'wildlife',
      severity: 'medium',
      location: 'Nagpur Range - Elephant Corridor',
      description: 'Unusual elephant movement pattern detected',
      timestamp: new Date(Date.now() - 3600000),
      status: 'acknowledged',
      sensorId: 'wildlife_003'
    },
    {
      id: 'alert_003',
      type: 'equipment',
      severity: 'low',
      location: 'Aurangabad Range - Station SM_004',
      description: 'Soil sensor battery level critical (23%)',
      timestamp: new Date(Date.now() - 7200000),
      status: 'active',
      sensorId: 'soil_004'
    }
  ];

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'weather': return Thermometer;
      case 'fire_detector': return AlertCircle;
      case 'wildlife_camera': return Camera;
      case 'soil': return Activity;
      case 'air_quality': return Eye;
      default: return MonitorSpeaker;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success-green';
      case 'offline': return 'text-alert-red';
      case 'maintenance': return 'text-warning-orange';
      default: return 'text-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-alert-red text-alert-red bg-red-50';
      case 'high': return 'border-alert-red text-alert-red bg-red-50';
      case 'medium': return 'border-warning-orange text-warning-orange bg-orange-50';
      case 'low': return 'border-success-green text-success-green bg-green-50';
      default: return 'border-gray-400 text-gray-600 bg-gray-50';
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // In production, this would trigger sensor data refresh
        console.log('Refreshing sensor data...');
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (alertsLoading || rangesLoading) {
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

  const onlineSensors = iotSensors.filter(s => s.status === 'online').length;
  const activeSensors = iotSensors.length;
  const activeAlerts = liveAlerts.filter(a => a.status === 'active').length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Forest Monitoring</h2>
          <p className="text-gray-600 mt-1">Live IoT sensor network and satellite surveillance system</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2"
          >
            <Activity size={16} />
            <span>{autoRefresh ? 'Live Mode' : 'Manual Mode'}</span>
          </Button>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Signal size={16} />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Satellite className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{onlineSensors}/{activeSensors}</p>
                <p className="text-sm text-gray-600">Sensors Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="text-alert-red" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-alert-red">{activeAlerts}</p>
                <p className="text-sm text-gray-600">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">98.2%</p>
                <p className="text-sm text-gray-600">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Radio className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">2.3TB</p>
                <p className="text-sm text-gray-600">Data Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">IoT Sensors</TabsTrigger>
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="satellite">Satellite Feed</TabsTrigger>
          <TabsTrigger value="analytics">Data Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iotSensors.map((sensor) => {
              const SensorIcon = getSensorIcon(sensor.type);
              return (
                <Card 
                  key={sensor.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedSensor === sensor.id ? 'ring-2 ring-gov-blue border-gov-blue' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedSensor(sensor.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <SensorIcon className={getStatusColor(sensor.status)} size={20} />
                      <Badge 
                        variant="outline"
                        className={
                          sensor.status === 'online' ? 'border-success-green text-success-green' :
                          sensor.status === 'offline' ? 'border-alert-red text-alert-red' :
                          'border-warning-orange text-warning-orange'
                        }
                      >
                        {sensor.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{sensor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{sensor.location.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Latest Reading</span>
                        <span className="font-semibold">{sensor.data.value} {sensor.data.unit}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Battery size={14} className="mr-1" />
                          Battery
                        </span>
                        <span className={`font-semibold ${
                          sensor.batteryLevel > 50 ? 'text-success-green' :
                          sensor.batteryLevel > 20 ? 'text-warning-orange' :
                          'text-alert-red'
                        }`}>
                          {sensor.batteryLevel}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Wifi size={14} className="mr-1" />
                          Signal
                        </span>
                        <span className={`font-semibold ${
                          sensor.signalStrength > 70 ? 'text-success-green' :
                          sensor.signalStrength > 40 ? 'text-warning-orange' :
                          'text-alert-red'
                        }`}>
                          {sensor.signalStrength}%
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        Last update: {sensor.lastUpdate.toLocaleTimeString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="space-y-4">
            {liveAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertCircle className={
                          alert.severity === 'critical' || alert.severity === 'high' ? 'text-alert-red' :
                          alert.severity === 'medium' ? 'text-warning-orange' :
                          'text-success-green'
                        } size={20} />
                        <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                          {alert.severity} priority
                        </Badge>
                        <Badge variant="outline">
                          {alert.type}
                        </Badge>
                        <Badge 
                          variant={alert.status === 'active' ? 'destructive' : 'secondary'}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {alert.location}
                      </h3>
                      <p className="text-gray-700 mb-3">{alert.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {alert.timestamp.toLocaleString()}
                        </div>
                        {alert.sensorId && (
                          <div className="flex items-center">
                            <MapPin size={14} className="mr-1" />
                            Sensor: {alert.sensorId}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      {alert.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline">
                            Acknowledge
                          </Button>
                          <Button size="sm" className="bg-success-green hover:bg-green-700">
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="satellite" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Satellite className="mr-2 text-gov-blue" size={24} />
                  Live Satellite Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Camera className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">Live satellite imagery feed</p>
                    <p className="text-sm text-gray-500">Updated every 15 minutes</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Coverage Area:</span>
                    <span className="font-semibold">Maharashtra Forest Ranges</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="font-semibold">10m/pixel</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Capture:</span>
                    <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Detection Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-1">Forest Cover Increase</h4>
                    <p className="text-sm text-green-700">+2.3% increase detected in Nashik Range</p>
                    <p className="text-xs text-green-600">Detected: 2 hours ago</p>
                  </div>
                  
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-1">Deforestation Alert</h4>
                    <p className="text-sm text-red-700">Possible illegal clearing in Sector 12</p>
                    <p className="text-xs text-red-600">Detected: 6 hours ago</p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Water Body Changes</h4>
                    <p className="text-sm text-blue-700">New water body formation after rainfall</p>
                    <p className="text-xs text-blue-600">Detected: 1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Collection Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gov-blue mb-2">2.3TB</div>
                <div className="text-sm text-gray-600 mb-4">Collected today</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sensor Data</span>
                    <span>1.8TB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Satellite Images</span>
                    <span>450GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Camera Feeds</span>
                    <span>50GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success-green mb-2">94.8%</div>
                <div className="text-sm text-gray-600 mb-4">Processing efficiency</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Real-time Processing</span>
                    <span>98.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Batch Processing</span>
                    <span>91.4%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Efficiency</span>
                    <span>95.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-maharashtra-saffron mb-2">98.5%</div>
                <div className="text-sm text-gray-600 mb-4">Overall system health</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Network Uptime</span>
                    <span>99.1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sensor Availability</span>
                    <span>97.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Data Integrity</span>
                    <span>99.8%</span>
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