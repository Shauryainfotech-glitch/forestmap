import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { FireAlert, ForestRange, Officer } from "@/lib/types";
import { 
  Flame, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Eye,
  Phone,
  MessageSquare,
  TrendingDown,
  Activity
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFireAlertSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function FireMonitoring() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fireAlerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts'],
    queryFn: () => api.getFireAlerts(),
  });

  const { data: activeFireAlerts, isLoading: activeAlertsLoading } = useQuery({
    queryKey: ['/api/fire-alerts/active'],
    queryFn: () => api.getActiveFireAlerts(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  const { data: officers, isLoading: officersLoading } = useQuery({
    queryKey: ['/api/officers'],
    queryFn: () => api.getOfficers(),
  });

  const createFireAlertMutation = useMutation({
    mutationFn: api.createFireAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fire-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fire-alerts/active'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Fire alert created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create fire alert",
        variant: "destructive",
      });
    },
  });

  const updateFireAlertMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateFireAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fire-alerts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/fire-alerts/active'] });
      toast({
        title: "Success",
        description: "Fire alert updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update fire alert",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertFireAlertSchema),
    defaultValues: {
      rangeId: 0,
      location: "",
      severity: "medium",
      status: "active",
      coordinates: null,
      alertedOfficers: [],
    },
  });

  const onSubmit = (data: any) => {
    createFireAlertMutation.mutate(data);
  };

  const handleStatusUpdate = (alertId: number, newStatus: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === "resolved") {
      updateData.resolvedAt = new Date();
    }
    updateFireAlertMutation.mutate({ id: alertId, data: updateData });
  };

  const handleWhatsAppAlert = (alert: FireAlert) => {
    // In a real application, this would integrate with WhatsApp Business API
    toast({
      title: "WhatsApp Alert Sent",
      description: `Emergency alert sent to all officers for ${alert.location}`,
    });
  };

  // Filter alerts
  const filteredAlerts = fireAlerts?.filter((alert: FireAlert) => {
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus;
    return matchesSeverity && matchesStatus;
  });

  // Calculate statistics
  const thisYear = new Date().getFullYear();
  const fireIncidentsThisYear = fireAlerts?.filter((alert: FireAlert) => 
    new Date(alert.detectedAt).getFullYear() === thisYear
  ).length || 0;

  const resolvedIncidents = fireAlerts?.filter((alert: FireAlert) => alert.status === "resolved").length || 0;
  const resolutionRate = fireAlerts?.length ? (resolvedIncidents / fireAlerts.length) * 100 : 0;

  const averageResponseTime = fireAlerts?.filter((alert: FireAlert) => alert.responseTime)
    .reduce((sum: number, alert: FireAlert) => sum + (alert.responseTime || 0), 0) / 
    (fireAlerts?.filter((alert: FireAlert) => alert.responseTime).length || 1) || 0;

  if (alertsLoading || rangesLoading || officersLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <h2 className="text-2xl font-bold text-gray-900">Fire Monitoring System</h2>
        <p className="text-gray-600 mt-1">Real-time forest fire detection, monitoring, and response coordination</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-alert-red">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Flame className="text-alert-red" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-alert-red">{activeFireAlerts?.length || 0}</p>
                <p className="text-sm text-gray-600">Active Fire Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning-orange">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity className="text-warning-orange" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-warning-orange">{fireIncidentsThisYear}</p>
                <p className="text-sm text-gray-600">Incidents This Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">{Math.round(resolutionRate)}%</p>
                <p className="text-sm text-gray-600">Resolution Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gov-blue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{Math.round(averageResponseTime)}</p>
                <p className="text-sm text-gray-600">Avg Response (min)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="response">Response Teams</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-alert-red hover:bg-red-700">
                <Plus className="mr-2" size={16} />
                Report Fire Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <AlertTriangle className="text-alert-red mr-2" size={20} />
                  Report New Fire Alert
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rangeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forest Range</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {forestRanges?.map((range: ForestRange) => (
                                <SelectItem key={range.id} value={range.id.toString()}>
                                  {range.name} Range
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Details</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Grid A4, near Trimbak forest area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-alert-red hover:bg-red-700"
                      disabled={createFireAlertMutation.isPending}
                    >
                      Report Alert
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="active" className="space-y-6">
          {/* WhatsApp Integration Status */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="text-success-green mr-3" size={24} />
                  <div>
                    <h3 className="font-semibold text-green-800">WhatsApp Alert System</h3>
                    <p className="text-sm text-green-700">
                      {officers?.length || 0} Officers Connected | Auto-alerts enabled
                    </p>
                  </div>
                </div>
                <Badge className="bg-success-green">Live</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <div className="space-y-4">
            {activeFireAlerts && activeFireAlerts.length > 0 ? (
              activeFireAlerts.map((alert: FireAlert) => {
                const range = forestRanges?.find((r: ForestRange) => r.id === alert.rangeId);
                const alertAge = Math.floor((Date.now() - new Date(alert.detectedAt).getTime()) / (1000 * 60)); // minutes
                
                return (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.severity === 'high' ? 'border-l-alert-red bg-red-50' :
                    alert.severity === 'medium' ? 'border-l-warning-orange bg-orange-50' :
                    'border-l-yellow-500 bg-yellow-50'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Flame className={`${
                              alert.severity === 'high' ? 'text-alert-red' :
                              alert.severity === 'medium' ? 'text-warning-orange' :
                              'text-yellow-500'
                            }`} size={20} />
                            <h3 className="font-semibold text-gray-900">{alert.location}</h3>
                            <Badge className={
                              alert.severity === 'high' ? 'bg-alert-red' :
                              alert.severity === 'medium' ? 'bg-warning-orange' :
                              'bg-yellow-500'
                            }>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Range</p>
                              <p className="font-medium">{range?.name || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Detected</p>
                              <p className="font-medium">{alertAge} min ago</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Status</p>
                              <p className="font-medium capitalize">{alert.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Response Time</p>
                              <p className="font-medium">{alert.responseTime || 'Pending'}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2 ml-6">
                          <Button
                            size="sm"
                            onClick={() => handleWhatsAppAlert(alert)}
                            className="bg-success-green hover:bg-green-600"
                          >
                            <MessageSquare className="mr-1" size={14} />
                            WhatsApp Alert
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(alert.id, "investigating")}
                          >
                            <Eye className="mr-1" size={14} />
                            Investigate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(alert.id, "resolved")}
                            className="text-success-green border-success-green hover:bg-green-50"
                          >
                            <CheckCircle className="mr-1" size={14} />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="mx-auto mb-4 text-success-green" size={48} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Fire Alerts</h3>
                  <p className="text-gray-600">All forest areas are currently safe. Continue monitoring.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* All Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts?.map((alert: FireAlert) => {
              const range = forestRanges?.find((r: ForestRange) => r.id === alert.rangeId);
              
              return (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        alert.severity === 'high' ? 'bg-alert-red' :
                        alert.severity === 'medium' ? 'bg-warning-orange' :
                        'bg-yellow-500'
                      }>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant={alert.status === 'resolved' ? 'default' : 'secondary'}>
                        {alert.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900">{alert.location}</h3>
                    <p className="text-sm text-gray-600">{range?.name} Range</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="mr-2" size={14} />
                        <span>Detected: {new Date(alert.detectedAt).toLocaleString()}</span>
                      </div>
                      
                      {alert.resolvedAt && (
                        <div className="flex items-center text-success-green">
                          <CheckCircle className="mr-2" size={14} />
                          <span>Resolved: {new Date(alert.resolvedAt).toLocaleString()}</span>
                        </div>
                      )}
                      
                      {alert.responseTime && (
                        <div className="flex items-center text-gray-600">
                          <Activity className="mr-2" size={14} />
                          <span>Response: {alert.responseTime} minutes</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAlerts?.length === 0 && (
            <div className="text-center py-12">
              <Flame className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-600">Try adjusting your filter criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="text-success-green mr-2" size={20} />
                  Fire Incident Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success-green">-65%</p>
                    <p className="text-sm text-gray-600">Reduction vs Last Year</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-alert-red">{fireIncidentsThisYear}</p>
                      <p className="text-xs text-gray-600">This Year</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-400">
                        {Math.round(fireIncidentsThisYear / 0.35)}
                      </p>
                      <p className="text-xs text-gray-600">Last Year</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Success Factors</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Early detection systems</li>
                      <li>• Rapid response protocols</li>
                      <li>• Community awareness programs</li>
                      <li>• WhatsApp alert network</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="text-gov-blue mr-2" size={20} />
                  Response Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gov-blue">{Math.round(averageResponseTime)}</p>
                    <p className="text-sm text-gray-600">Average Response Time (minutes)</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Target (≤ 20 min)</span>
                        <span>{averageResponseTime <= 20 ? '✅' : '⚠️'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resolution Rate</span>
                        <span>{Math.round(resolutionRate)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>WhatsApp Coverage</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Improvement Areas</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Deploy more rapid response teams</li>
                      <li>• Enhance monitoring technology</li>
                      <li>• Increase firefighting equipment</li>
                      <li>• Strengthen inter-range coordination</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          {/* Response Teams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="text-maharashtra-saffron mr-2" size={20} />
                Emergency Response Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officers?.slice(0, 6).map((officer: Officer) => (
                  <div key={officer.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {officer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.range} Range</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className="bg-success-green">Available</Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Phone className="mr-1" size={12} />
                          Call
                        </Button>
                        <Button size="sm" className="flex-1 bg-success-green hover:bg-green-600">
                          <MessageSquare className="mr-1" size={12} />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="text-alert-red mr-2" size={20} />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Flame className="mx-auto mb-2 text-alert-red" size={32} />
                  <h3 className="font-semibold text-gray-900">Fire Department</h3>
                  <p className="text-2xl font-bold text-alert-red">101</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Phone className="mx-auto mb-2 text-gov-blue" size={32} />
                  <h3 className="font-semibold text-gray-900">Forest Helpline</h3>
                  <p className="text-2xl font-bold text-gov-blue">1926</p>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <AlertTriangle className="mx-auto mb-2 text-maharashtra-saffron" size={32} />
                  <h3 className="font-semibold text-gray-900">Emergency Services</h3>
                  <p className="text-2xl font-bold text-maharashtra-saffron">112</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
