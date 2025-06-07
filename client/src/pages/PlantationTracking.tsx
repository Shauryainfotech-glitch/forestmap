import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { PlantationRecord, ForestRange } from "@/lib/types";
import { 
  Sprout, 
  Plus, 
  TrendingUp, 
  Calendar, 
  MapPin,
  BarChart3,
  Target,
  Leaf,
  TreePine
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPlantationRecordSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function PlantationTracking() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plantationRecords, isLoading: recordsLoading } = useQuery({
    queryKey: ['/api/plantation-records'],
    queryFn: () => api.getPlantationRecords(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  const createPlantationMutation = useMutation({
    mutationFn: api.createPlantationRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plantation-records'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Plantation record added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add plantation record",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertPlantationRecordSchema),
    defaultValues: {
      rangeId: 0,
      species: "",
      saplingsPlanted: 0,
      survivalCount: 0,
      survivalRate: 0,
      plantedDate: new Date(),
      lastSurveyDate: new Date(),
      notes: "",
    },
  });

  const onSubmit = (data: any) => {
    // Calculate survival rate
    const survivalRate = data.saplingsPlanted > 0 ? (data.survivalCount / data.saplingsPlanted) * 100 : 0;
    createPlantationMutation.mutate({
      ...data,
      survivalRate,
      plantedDate: new Date(data.plantedDate),
      lastSurveyDate: new Date(data.lastSurveyDate),
    });
  };

  // Filter records by range
  const filteredRecords = plantationRecords?.filter((record: PlantationRecord) => 
    selectedRange === "all" || record.rangeId.toString() === selectedRange
  );

  // Calculate aggregated statistics
  const totalSaplingsPlanted = plantationRecords?.reduce((sum: number, record: PlantationRecord) => 
    sum + record.saplingsPlanted, 0) || 0;
  
  const totalSurvivors = plantationRecords?.reduce((sum: number, record: PlantationRecord) => 
    sum + (record.survivalCount || 0), 0) || 0;
  
  const overallSurvivalRate = totalSaplingsPlanted > 0 ? (totalSurvivors / totalSaplingsPlanted) * 100 : 0;

  // Target for 2025 - 50 crore saplings
  const target2025 = 500000000; // 50 crore
  const progressToTarget = (totalSaplingsPlanted / target2025) * 100;

  // Group records by range for display
  const recordsByRange = plantationRecords?.reduce((acc: any, record: PlantationRecord) => {
    const range = forestRanges?.find((r: ForestRange) => r.id === record.rangeId);
    const rangeName = range?.name || `Range ${record.rangeId}`;
    
    if (!acc[rangeName]) {
      acc[rangeName] = [];
    }
    acc[rangeName].push(record);
    return acc;
  }, {}) || {};

  if (recordsLoading || rangesLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">Plantation Tracking</h2>
        <p className="text-gray-600 mt-1">Monitor sapling plantation progress and survival rates across Maharashtra</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-forest-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Sprout className="text-forest-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-forest-green">
                  {(totalSaplingsPlanted / 1000000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-600">Total Saplings Planted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TreePine className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">
                  {Math.round(overallSurvivalRate)}%
                </p>
                <p className="text-sm text-gray-600">Overall Survival Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-maharashtra-saffron">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">
                  {Math.round(progressToTarget)}%
                </p>
                <p className="text-sm text-gray-600">2025 Target Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gov-blue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">
                  {plantationRecords?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Plantation Records</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-forest-green hover:bg-green-700">
                <Plus className="mr-2" size={16} />
                Add Plantation Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Plantation Record</DialogTitle>
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
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Species</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Teak, Neem, Banyan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="saplingsPlanted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Saplings Planted</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number of saplings"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="survivalCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surviving Count</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Number surviving"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="plantedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planted Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastSurveyDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Survey Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional notes about the plantation..."
                            {...field}
                          />
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
                      className="bg-forest-green hover:bg-green-700"
                      disabled={createPlantationMutation.isPending}
                    >
                      Add Record
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Vision 2047 Target Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="text-maharashtra-saffron mr-2" size={20} />
                Vision 2047 - Plantation Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">2025 Target: 50 Crore Saplings</span>
                    <span className="text-sm text-gray-600">{Math.round(progressToTarget)}% Complete</span>
                  </div>
                  <Progress value={progressToTarget} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {(totalSaplingsPlanted / 1000000).toFixed(1)}M of 500M saplings planted
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Survival Rate Target: 80%</span>
                    <span className={`text-sm ${overallSurvivalRate >= 80 ? 'text-success-green' : 'text-warning-orange'}`}>
                      {Math.round(overallSurvivalRate)}% Achieved
                    </span>
                  </div>
                  <Progress value={overallSurvivalRate} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {totalSurvivors.toLocaleString()} surviving saplings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Range-wise Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="text-forest-green mr-2" size={20} />
                Range-wise Plantation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(recordsByRange).map(([rangeName, records]: [string, PlantationRecord[]]) => {
                  const rangeSaplings = records.reduce((sum, record) => sum + record.saplingsPlanted, 0);
                  const rangeSurvivors = records.reduce((sum, record) => sum + (record.survivalCount || 0), 0);
                  const rangeSurvivalRate = rangeSaplings > 0 ? (rangeSurvivors / rangeSaplings) * 100 : 0;

                  return (
                    <div key={rangeName} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{rangeName}</span>
                        <p className="text-xs text-gray-600">{rangeSaplings.toLocaleString()} planted</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-semibold ${
                          rangeSurvivalRate >= 80 ? 'text-success-green' : 
                          rangeSurvivalRate >= 60 ? 'text-warning-orange' : 'text-alert-red'
                        }`}>
                          {Math.round(rangeSurvivalRate)}%
                        </span>
                        <p className="text-xs text-gray-600">{rangeSurvivors.toLocaleString()} surviving</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-6">
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ranges</SelectItem>
                {forestRanges?.map((range: ForestRange) => (
                  <SelectItem key={range.id} value={range.id.toString()}>
                    {range.name} Range
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords?.map((record: PlantationRecord) => {
              const range = forestRanges?.find((r: ForestRange) => r.id === record.rangeId);
              const survivalRate = record.survivalRate || 0;
              
              return (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{record.species}</h3>
                      <Badge 
                        className={
                          survivalRate >= 80 ? "bg-success-green" :
                          survivalRate >= 60 ? "bg-warning-orange" :
                          "bg-alert-red"
                        }
                      >
                        {Math.round(survivalRate)}% Survival
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{range?.name} Range</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Planted</p>
                          <p className="font-semibold">{record.saplingsPlanted.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Surviving</p>
                          <p className="font-semibold text-success-green">
                            {(record.survivalCount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2" size={14} />
                          <span>Planted: {new Date(record.plantedDate).toLocaleDateString()}</span>
                        </div>
                        {record.lastSurveyDate && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2" size={14} />
                            <span>Last Survey: {new Date(record.lastSurveyDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {record.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {record.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRecords?.length === 0 && (
            <div className="text-center py-12">
              <Sprout className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No plantation records found</h3>
              <p className="text-gray-600">Start by adding a new plantation record.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Species Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="text-forest-green mr-2" size={20} />
                  Species Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    plantationRecords?.reduce((acc: any, record: PlantationRecord) => {
                      if (!acc[record.species]) {
                        acc[record.species] = { planted: 0, survived: 0 };
                      }
                      acc[record.species].planted += record.saplingsPlanted;
                      acc[record.species].survived += record.survivalCount || 0;
                      return acc;
                    }, {}) || {}
                  ).map(([species, data]: [string, any]) => {
                    const survivalRate = data.planted > 0 ? (data.survived / data.planted) * 100 : 0;
                    
                    return (
                      <div key={species} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">{species}</span>
                          <span className="text-sm text-gray-600">{Math.round(survivalRate)}%</span>
                        </div>
                        <Progress value={survivalRate} className="h-2" />
                        <p className="text-xs text-gray-500">
                          {data.survived.toLocaleString()} of {data.planted.toLocaleString()} surviving
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="text-maharashtra-saffron mr-2" size={20} />
                  Planting Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-maharashtra-saffron">
                      {Math.round(overallSurvivalRate)}%
                    </p>
                    <p className="text-sm text-gray-600">Overall Success Rate</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-forest-green">
                        {(totalSaplingsPlanted / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-600">Total Planted</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-success-green">
                        {(totalSurvivors / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-600">Total Surviving</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Focus on high-survival species like {
                        Object.entries(
                          plantationRecords?.reduce((acc: any, record: PlantationRecord) => {
                            if (!acc[record.species]) {
                              acc[record.species] = { planted: 0, survived: 0 };
                            }
                            acc[record.species].planted += record.saplingsPlanted;
                            acc[record.species].survived += record.survivalCount || 0;
                            return acc;
                          }, {}) || {}
                        ).sort(([,a]: [string, any], [,b]: [string, any]) => 
                          (b.survived / b.planted) - (a.survived / a.planted)
                        )[0]?.[0] || "native species"
                      }</li>
                      <li>• Increase monitoring frequency during first 6 months</li>
                      <li>• Implement water conservation techniques</li>
                      <li>• Engage local communities in maintenance</li>
                    </ul>
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
