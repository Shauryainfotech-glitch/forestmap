import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Minus, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
}

interface MapAlert {
  id: string;
  type: 'fire' | 'wildlife' | 'general';
  location: string;
  coordinates: { lat: number; lng: number };
  severity: 'low' | 'medium' | 'high';
}

interface MapRange {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
}

const initialLayers: MapLayer[] = [
  { id: 'forest', name: 'Forest Boundaries', enabled: true, color: 'green' },
  { id: 'fire', name: 'Fire Risk Zones', enabled: true, color: 'red' },
  { id: 'water', name: 'Water Bodies', enabled: false, color: 'blue' },
  { id: 'plantation', name: 'Plantation Areas', enabled: false, color: 'yellow' },
];

const mapAlerts: MapAlert[] = [
  {
    id: '1',
    type: 'fire',
    location: 'Fire Alert - Nashik Range',
    coordinates: { lat: 45, lng: 32 },
    severity: 'high'
  }
];

const mapRanges: MapRange[] = [
  { id: '1', name: 'Trimbak', coordinates: { lat: 24, lng: 32 } },
  { id: '2', name: 'Igatpuri', coordinates: { lat: 40, lng: 20 } },
  { id: '3', name: 'Nashik', coordinates: { lat: 60, lng: 40 } },
];

interface MapInterfaceProps {
  className?: string;
}

export default function MapInterface({ className = "" }: MapInterfaceProps) {
  const [layers, setLayers] = useState<MapLayer[]>(initialLayers);
  const [mapType, setMapType] = useState<'satellite' | 'terrain' | 'roads'>('terrain');

  const toggleLayer = (layerId: string) => {
    setLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, enabled: !layer.enabled }
          : layer
      )
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <MapPin className="text-forest-green mr-2" size={20} />
            Interactive Forest Mapping
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={mapType === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapType('satellite')}
            >
              Satellite
            </Button>
            <Button
              variant={mapType === 'terrain' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapType('terrain')}
              className="bg-maharashtra-saffron hover:bg-maharashtra-saffron text-white"
            >
              Terrain
            </Button>
            <Button
              variant={mapType === 'roads' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapType('roads')}
            >
              Roads
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mock Map Interface */}
        <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-200 rounded-lg overflow-hidden">
          {/* Background forest landscape */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Map Overlays */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow p-3">
            <h4 className="font-semibold text-sm mb-2">Map Layers</h4>
            <div className="space-y-1">
              {layers.map(layer => (
                <label key={layer.id} className="flex items-center text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={layer.enabled}
                    onChange={() => toggleLayer(layer.id)}
                    className="mr-2 accent-forest-green"
                  />
                  {layer.name}
                </label>
              ))}
            </div>
          </div>

          {/* Fire Alert Markers */}
          {mapAlerts.map(alert => (
            <div 
              key={alert.id}
              className="absolute animate-pulse cursor-pointer"
              style={{ 
                top: `${alert.coordinates.lat}%`, 
                left: `${alert.coordinates.lng}%` 
              }}
            >
              <div className="w-4 h-4 bg-alert-red rounded-full shadow-lg"></div>
              <div className="absolute -top-8 -left-12 bg-alert-red text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {alert.location}
              </div>
            </div>
          ))}

          {/* Forest Range Markers */}
          {mapRanges.map(range => (
            <div 
              key={range.id}
              className="absolute cursor-pointer"
              style={{ 
                top: `${range.coordinates.lat}%`, 
                left: `${range.coordinates.lng}%` 
              }}
            >
              <div className="w-3 h-3 bg-forest-green rounded-full"></div>
              <div className="absolute -top-6 -left-8 bg-forest-green text-white text-xs px-1 py-0.5 rounded text-center">
                {range.name}
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <Button size="sm" variant="outline" className="w-8 h-8 p-0">
              <Plus size={16} />
            </Button>
            <Button size="sm" variant="outline" className="w-8 h-8 p-0">
              <Minus size={16} />
            </Button>
          </div>
        </div>
        
        {/* Map Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-forest-green">61,939</p>
            <p className="text-xs text-gray-600">Total Area (sq km)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-maharashtra-saffron">13,143</p>
            <p className="text-xs text-gray-600">Forest Area (sq km)</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gov-blue">5,429</p>
            <p className="text-xs text-gray-600">Protected Area (sq km)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
