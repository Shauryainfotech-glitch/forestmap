import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { MapPin, Layers, Satellite, Compass, Info } from "lucide-react";

export default function ForestMapping() {
  const [selectedView, setSelectedView] = useState<'satellite' | 'terrain' | 'boundaries'>('terrain');
  const [showLayers, setShowLayers] = useState(true);

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  const { data: forestStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/forest-stats'],
    queryFn: () => api.getForestStats(),
  });

  const { data: activeFireAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts/active'],
    queryFn: () => api.getActiveFireAlerts(),
  });

  if (rangesLoading || statsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Interactive Forest Mapping</h2>
        <p className="text-gray-600 mt-1">GIS-enabled forest boundary mapping and real-time monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* View Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm font-semibold">
                <Layers className="mr-2" size={16} />
                Map Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">View Type</label>
                <div className="space-y-2">
                  <Button
                    variant={selectedView === 'satellite' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedView('satellite')}
                  >
                    <Satellite className="mr-2" size={16} />
                    Satellite View
                  </Button>
                  <Button
                    variant={selectedView === 'terrain' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedView('terrain')}
                  >
                    <Compass className="mr-2" size={16} />
                    Terrain View
                  </Button>
                  <Button
                    variant={selectedView === 'boundaries' ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedView('boundaries')}
                  >
                    <MapPin className="mr-2" size={16} />
                    Forest Boundaries
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Map Layers</label>
                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="mr-2 accent-forest-green" />
                    Forest Boundaries
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" defaultChecked className="mr-2 accent-red-500" />
                    Fire Risk Zones
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 accent-blue-500" />
                    Water Bodies
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 accent-yellow-500" />
                    Plantation Areas
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 accent-purple-500" />
                    Wildlife Corridors
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm font-semibold">
                <Info className="mr-2" size={16} />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Ranges</span>
                  <span className="text-sm font-semibold">{forestRanges?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Area</span>
                  <span className="text-sm font-semibold">
                    {forestStats?.reduce((sum: number, stat: any) => sum + (stat.totalArea || 0), 0).toLocaleString()} km²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Forest Cover</span>
                  <span className="text-sm font-semibold">
                    {Math.round(
                      forestStats?.reduce((sum: number, stat: any) => sum + (stat.forestCoverPercentage || 0), 0) / 
                      (forestStats?.length || 1)
                    )}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Alerts</span>
                  <span className="text-sm font-semibold text-red-600">{activeFireAlerts?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Range List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm font-semibold">
                <MapPin className="mr-2" size={16} />
                Forest Ranges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {forestRanges?.map((range: any) => (
                  <div 
                    key={range.id} 
                    className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{range.name}</p>
                        <p className="text-xs text-gray-600">{range.circle} Circle</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {range.forestCover}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Map Display */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MapPin className="text-forest-green mr-2" size={20} />
                  Maharashtra Forest Map - {selectedView.charAt(0).toUpperCase() + selectedView.slice(1)} View
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Live Data</Badge>
                  <Badge className="bg-success-green">Real-time</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Interactive Map Container */}
              <div className="relative h-[600px] bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                {/* Background Map Image */}
                <div 
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage: selectedView === 'satellite' 
                      ? `url('https://images.unsplash.com/photo-1516905365727-5c8e00dd1a81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')`
                      : selectedView === 'terrain'
                      ? `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')`
                      : `url('https://images.unsplash.com/photo-1574482620131-3ad29b15b8ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />

                {/* Maharashtra State Outline */}
                <svg 
                  className="absolute inset-0 w-full h-full" 
                  viewBox="0 0 400 300"
                  style={{ zIndex: 10 }}
                >
                  {/* State boundary */}
                  <path 
                    d="M50 80 Q100 60, 150 70 T 280 90 Q320 95, 350 110 L340 220 Q300 230, 250 225 T 150 210 Q100 205, 80 210 Z" 
                    fill="none" 
                    stroke="#4A5568" 
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Forest areas - different shades of green */}
                  <circle cx="120" cy="130" r="25" fill="#2E7D32" opacity="0.8" />
                  <circle cx="180" cy="160" r="20" fill="#388E3C" opacity="0.7" />
                  <circle cx="250" cy="140" r="30" fill="#43A047" opacity="0.8" />
                  <circle cx="300" cy="170" r="22" fill="#4CAF50" opacity="0.6" />
                  <circle cx="160" cy="120" r="18" fill="#2E7D32" opacity="0.9" />
                  <circle cx="220" cy="180" r="15" fill="#388E3C" opacity="0.8" />
                  
                  {/* Range headquarters markers */}
                  {forestRanges?.map((range: any, index: number) => {
                    const positions = [
                      { x: 180, y: 130 },
                      { x: 250, y: 150 },
                      { x: 200, y: 170 },
                      { x: 150, y: 140 },
                      { x: 280, y: 160 }
                    ];
                    const pos = positions[index % positions.length];
                    
                    return (
                      <g key={range.id}>
                        <circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r="4" 
                          fill="#FF6B35"
                          className="cursor-pointer hover:r-6 transition-all"
                        />
                        <text 
                          x={pos.x} 
                          y={pos.y - 10} 
                          textAnchor="middle" 
                          className="text-xs font-medium fill-gray-700"
                        >
                          {range.name}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Fire alert markers */}
                  {activeFireAlerts?.map((alert: any, index: number) => {
                    const firePositions = [
                      { x: 210, y: 140 },
                      { x: 270, y: 180 }
                    ];
                    const pos = firePositions[index % firePositions.length];
                    
                    return (
                      <g key={alert.id}>
                        <circle 
                          cx={pos.x} 
                          cy={pos.y} 
                          r="6" 
                          fill="#EF4444"
                          className="animate-pulse cursor-pointer"
                        />
                        <text 
                          x={pos.x} 
                          y={pos.y - 15} 
                          textAnchor="middle" 
                          className="text-xs font-medium fill-red-600"
                        >
                          🔥 Fire Alert
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg" style={{ zIndex: 20 }}>
                  <h4 className="text-sm font-semibold mb-2">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-forest-green rounded mr-2"></div>
                      <span>Dense Forest</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-success-green rounded mr-2"></div>
                      <span>Medium Forest</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-maharashtra-saffron rounded mr-2"></div>
                      <span>Range Offices</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded mr-2 animate-pulse"></div>
                      <span>Fire Alerts</span>
                    </div>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 flex flex-col space-y-2" style={{ zIndex: 20 }}>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white">
                    +
                  </Button>
                  <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white">
                    −
                  </Button>
                </div>

                {/* Coordinates Display */}
                <div className="absolute top-4 right-4 bg-white p-2 rounded shadow text-xs" style={{ zIndex: 20 }}>
                  <div>Lat: 19.9975°N</div>
                  <div>Lng: 73.7898°E</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
