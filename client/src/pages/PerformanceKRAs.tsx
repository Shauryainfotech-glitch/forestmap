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
import { Officer, OfficerPerformance } from "@/lib/types";
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Heart,
  Zap,
  Award,
  BarChart3,
  Users,
  Calendar,
  Filter,
  Download
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOfficerPerformanceSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function PerformanceKRAs() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: officers, isLoading: officersLoading } = useQuery({
    queryKey: ['/api/officers'],
    queryFn: () => api.getOfficers(),
  });

  const { data: officerPerformance, isLoading: performanceLoading } = useQuery({
    queryKey: ['/api/officer-performance'],
    queryFn: () => api.getOfficerPerformance(),
  });

  const createPerformanceMutation = useMutation({
    mutationFn: api.createOfficerPerformance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/officer-performance'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Performance record added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add performance record",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertOfficerPerformanceSchema),
    defaultValues: {
      officerId: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      transparencyScore: 0,
      efficiencyScore: 0,
      costEffectivenessScore: 0,
      humaneApproachScore: 0,
      overallScore: 0,
      notes: "",
    },
  });

  const onSubmit = (data: any) => {
    // Calculate overall score
    const overallScore = (
      data.transparencyScore + 
      data.efficiencyScore + 
      data.costEffectivenessScore + 
      data.humaneApproachScore
    ) / 4;
    
    createPerformanceMutation.mutate({
      ...data,
      overallScore
    });
  };

  // Filter performance data
  const filteredPerformance = officerPerformance?.filter((perf: OfficerPerformance) => {
    const matchesOfficer = selectedOfficer === "all" || perf.officerId.toString() === selectedOfficer;
    const matchesMonth = selectedMonth === "all" || perf.month.toString() === selectedMonth;
    const matchesYear = perf.year.toString() === selectedYear;
    return matchesOfficer && matchesMonth && matchesYear;
  });

  // Calculate aggregated statistics
  const totalRecords = filteredPerformance?.length || 0;
  const avgTransparency = filteredPerformance?.reduce((sum: number, perf: OfficerPerformance) => 
    sum + (perf.transparencyScore || 0), 0) / totalRecords || 0;
  const avgEfficiency = filteredPerformance?.reduce((sum: number, perf: OfficerPerformance) => 
    sum + (perf.efficiencyScore || 0), 0) / totalRecords || 0;
  const avgCostEffectiveness = filteredPerformance?.reduce((sum: number, perf: OfficerPerformance) => 
    sum + (perf.costEffectivenessScore || 0), 0) / totalRecords || 0;
  const avgHumaneApproach = filteredPerformance?.reduce((sum: number, perf: OfficerPerformance) => 
    sum + (perf.humaneApproachScore || 0), 0) / totalRecords || 0;
  const avgOverallScore = filteredPerformance?.reduce((sum: number, perf: OfficerPerformance) => 
    sum + (perf.overallScore || 0), 0) / totalRecords || 0;

  // Get top performers
  const topPerformers = filteredPerformance?.sort((a: OfficerPerformance, b: OfficerPerformance) => 
    (b.overallScore || 0) - (a.overallScore || 0)).slice(0, 5) || [];

  // Get performance trends
  const performanceTrends = officers?.map((officer: Officer) => {
    const officerPerf = officerPerformance?.filter((perf: OfficerPerformance) => 
      perf.officerId === officer.id && perf.year.toString() === selectedYear
    ) || [];
    
    const avgScore = officerPerf.reduce((sum: number, perf: OfficerPerformance) => 
      sum + (perf.overallScore || 0), 0) / officerPerf.length || 0;
    
    return {
      officer,
      avgScore,
      recordCount: officerPerf.length
    };
  }).filter(item => item.recordCount > 0) || [];

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  if (officersLoading || performanceLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">TECH KRAs Performance Management</h2>
        <p className="text-gray-600 mt-1">Transparency, Efficiency, Cost-effectiveness, and Humane approach evaluation system</p>
      </div>

      {/* TECH KRA Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-gov-blue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{Math.round(avgTransparency)}%</p>
                <p className="text-sm text-gray-600">Avg Transparency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Zap className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">{Math.round(avgEfficiency)}%</p>
                <p className="text-sm text-gray-600">Avg Efficiency</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning-orange">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="text-warning-orange" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-warning-orange">{Math.round(avgCostEffectiveness)}%</p>
                <p className="text-sm text-gray-600">Avg Cost-effectiveness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-alert-red">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="text-alert-red" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-alert-red">{Math.round(avgHumaneApproach)}%</p>
                <p className="text-sm text-gray-600">Avg Humane Approach</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="individual">Individual Performance</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-maharashtra-saffron hover:bg-orange-600">
                <Plus className="mr-2" size={16} />
                Add Performance Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add TECH KRA Performance Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="officerId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Officer</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select officer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {officers?.map((officer: Officer) => (
                                <SelectItem key={officer.id} value={officer.id.toString()}>
                                  {officer.name} - {officer.range}
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
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Month</FormLabel>
                          <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
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
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2024"
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
                      name="transparencyScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transparency Score (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              placeholder="0-100"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="efficiencyScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Efficiency Score (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              placeholder="0-100"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                      name="costEffectivenessScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost-effectiveness Score (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              placeholder="0-100"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="humaneApproachScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Humane Approach Score (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              max="100"
                              placeholder="0-100"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                            placeholder="Performance notes and observations..."
                            rows={3}
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
                      className="bg-maharashtra-saffron hover:bg-orange-600"
                      disabled={createPerformanceMutation.isPending}
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
          {/* Department Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="text-maharashtra-saffron mr-2" size={20} />
                Department TECH KRA Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Eye className="text-gov-blue mr-1" size={16} />
                        Transparency
                      </span>
                      <span className="text-sm font-semibold text-gov-blue">{Math.round(avgTransparency)}%</span>
                    </div>
                    <Progress value={avgTransparency} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Zap className="text-success-green mr-1" size={16} />
                        Efficiency
                      </span>
                      <span className="text-sm font-semibold text-success-green">{Math.round(avgEfficiency)}%</span>
                    </div>
                    <Progress value={avgEfficiency} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <DollarSign className="text-warning-orange mr-1" size={16} />
                        Cost-effectiveness
                      </span>
                      <span className="text-sm font-semibold text-warning-orange">{Math.round(avgCostEffectiveness)}%</span>
                    </div>
                    <Progress value={avgCostEffectiveness} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Heart className="text-alert-red mr-1" size={16} />
                        Humane Approach
                      </span>
                      <span className="text-sm font-semibold text-alert-red">{Math.round(avgHumaneApproach)}%</span>
                    </div>
                    <Progress value={avgHumaneApproach} className="h-3" />
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-maharashtra-saffron">{Math.round(avgOverallScore)}%</p>
                    <p className="text-sm text-gray-600 mt-1">Overall TECH Score</p>
                    <Badge 
                      className={`mt-2 ${
                        avgOverallScore >= 90 ? 'bg-success-green' :
                        avgOverallScore >= 75 ? 'bg-warning-orange' :
                        'bg-alert-red'
                      }`}
                    >
                      {avgOverallScore >= 90 ? 'Excellent' : avgOverallScore >= 75 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="text-gov-blue mr-2" size={20} />
                  Performance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Excellent (90-100%)', 'Good (75-89%)', 'Average (60-74%)', 'Below Average (<60%)'].map((category, index) => {
                    const ranges = [[90, 100], [75, 89], [60, 74], [0, 59]];
                    const [min, max] = ranges[index];
                    const count = performanceTrends.filter(item => 
                      item.avgScore >= min && item.avgScore <= max
                    ).length;
                    const percentage = performanceTrends.length > 0 ? (count / performanceTrends.length) * 100 : 0;
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                          <span className="text-sm text-gray-600">{count} officers</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="text-maharashtra-saffron mr-2" size={20} />
                  Recognition Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success-green">
                      {performanceTrends.filter(item => item.avgScore >= 90).length}
                    </p>
                    <p className="text-sm text-gray-600">Officers Eligible for Awards</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-maharashtra-saffron">
                        {performanceTrends.filter(item => item.avgScore >= 85).length}
                      </p>
                      <p className="text-xs text-gray-600">Promotion Ready</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-warning-orange">
                        {performanceTrends.filter(item => item.avgScore < 60).length}
                      </p>
                      <p className="text-xs text-gray-600">Need Support</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Recognition Programs</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Best Performer Awards (Monthly)</li>
                      <li>• Excellence Certificates</li>
                      <li>• Performance Incentives</li>
                      <li>• Leadership Development</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={selectedOfficer} onValueChange={setSelectedOfficer}>
              <SelectTrigger className="w-64">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by officer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Officers</SelectItem>
                {officers?.map((officer: Officer) => (
                  <SelectItem key={officer.id} value={officer.id.toString()}>
                    {officer.name} - {officer.range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Export Report
            </Button>
          </div>

          {/* Individual Performance Records */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPerformance?.map((performance: OfficerPerformance) => {
              const officer = officers?.find((o: Officer) => o.id === performance.officerId);
              const monthName = months.find(m => m.value === performance.month.toString())?.label;
              
              return (
                <Card key={performance.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{officer?.name}</h3>
                        <p className="text-sm text-gray-600">{officer?.range} Range</p>
                      </div>
                      <Badge 
                        className={`${
                          (performance.overallScore || 0) >= 90 ? 'bg-success-green' :
                          (performance.overallScore || 0) >= 75 ? 'bg-warning-orange' :
                          'bg-alert-red'
                        }`}
                      >
                        {Math.round(performance.overallScore || 0)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{monthName} {performance.year}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Eye className="mr-1" size={12} />
                            Transparency
                          </span>
                          <span className="font-medium">{performance.transparencyScore || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Zap className="mr-1" size={12} />
                            Efficiency
                          </span>
                          <span className="font-medium">{performance.efficiencyScore || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <DollarSign className="mr-1" size={12} />
                            Cost-effectiveness
                          </span>
                          <span className="font-medium">{performance.costEffectivenessScore || 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center">
                            <Heart className="mr-1" size={12} />
                            Humane
                          </span>
                          <span className="font-medium">{performance.humaneApproachScore || 0}%</span>
                        </div>
                      </div>

                      {performance.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {performance.notes}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Overall Score</span>
                        <span className="text-lg font-bold text-maharashtra-saffron">
                          {Math.round(performance.overallScore || 0)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPerformance?.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No performance records found</h3>
              <p className="text-gray-600">Try adjusting your filter criteria or add new performance records.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Performance Trends Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="text-success-green mr-2" size={20} />
                Performance Trends Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Monthly Trends ({selectedYear})</h4>
                  <div className="space-y-3">
                    {months.slice(0, 6).map((month) => {
                      const monthPerf = officerPerformance?.filter((perf: OfficerPerformance) => 
                        perf.month === parseInt(month.value) && perf.year.toString() === selectedYear
                      ) || [];
                      
                      const avgScore = monthPerf.reduce((sum: number, perf: OfficerPerformance) => 
                        sum + (perf.overallScore || 0), 0) / monthPerf.length || 0;
                      
                      return (
                        <div key={month.value}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{month.label}</span>
                            <span className="text-sm text-gray-600">{Math.round(avgScore)}%</span>
                          </div>
                          <Progress value={avgScore} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-4">TECH KRA Component Trends</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <Eye className="mr-1 text-gov-blue" size={14} />
                          Transparency
                        </span>
                        <span className="text-sm text-gov-blue">{Math.round(avgTransparency)}%</span>
                      </div>
                      <Progress value={avgTransparency} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <Zap className="mr-1 text-success-green" size={14} />
                          Efficiency
                        </span>
                        <span className="text-sm text-success-green">{Math.round(avgEfficiency)}%</span>
                      </div>
                      <Progress value={avgEfficiency} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <DollarSign className="mr-1 text-warning-orange" size={14} />
                          Cost-effectiveness
                        </span>
                        <span className="text-sm text-warning-orange">{Math.round(avgCostEffectiveness)}%</span>
                      </div>
                      <Progress value={avgCostEffectiveness} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 flex items-center">
                          <Heart className="mr-1 text-alert-red" size={14} />
                          Humane Approach
                        </span>
                        <span className="text-sm text-alert-red">{Math.round(avgHumaneApproach)}%</span>
                      </div>
                      <Progress value={avgHumaneApproach} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Focus Areas</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-alert-red rounded-full mr-2"></span>
                      Increase transparency in decision-making processes
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-warning-orange rounded-full mr-2"></span>
                      Optimize resource allocation and utilization
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Enhance community engagement programs
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-gov-blue rounded-full mr-2"></span>
                      Streamline administrative procedures
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Regular training programs on digital governance</li>
                    <li>• Monthly performance review meetings</li>
                    <li>• Peer learning and best practice sharing</li>
                    <li>• Technology adoption for efficiency improvement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          {/* Top Performers Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="text-maharashtra-saffron mr-2" size={20} />
                TECH KRA Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performance: OfficerPerformance, index: number) => {
                  const officer = officers?.find((o: Officer) => o.id === performance.officerId);
                  const monthName = months.find(m => m.value === performance.month.toString())?.label;
                  
                  return (
                    <div key={performance.id} className={`flex items-center justify-between p-4 rounded-lg ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' :
                      index === 1 ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200' :
                      index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200' :
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-700'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{officer?.name}</h4>
                          <p className="text-sm text-gray-600">{officer?.range} Range • {monthName} {performance.year}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-maharashtra-saffron">
                            {Math.round(performance.overallScore || 0)}%
                          </p>
                          <p className="text-xs text-gray-600">Overall Score</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <p className="font-medium text-gov-blue">{performance.transparencyScore || 0}%</p>
                            <p className="text-gray-600">T</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-success-green">{performance.efficiencyScore || 0}%</p>
                            <p className="text-gray-600">E</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-warning-orange">{performance.costEffectivenessScore || 0}%</p>
                            <p className="text-gray-600">C</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-alert-red">{performance.humaneApproachScore || 0}%</p>
                            <p className="text-gray-600">H</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {topPerformers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Award className="mx-auto mb-2" size={32} />
                  <p>No performance records available for leaderboard</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recognition and Awards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🏆 Excellence Award</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-600">
                    {topPerformers.length > 0 ? officers?.find((o: Officer) => o.id === topPerformers[0]?.officerId)?.name : 'TBD'}
                  </p>
                  <p className="text-sm text-gray-600">Top Performer</p>
                  <Badge className="mt-2 bg-yellow-500">
                    {topPerformers.length > 0 ? Math.round(topPerformers[0]?.overallScore || 0) : 0}% Score
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">📈 Most Improved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-xl font-bold text-success-green">
                    {officers?.find((o: Officer) => (o.techScore || 0) > 80)?.name || 'TBD'}
                  </p>
                  <p className="text-sm text-gray-600">Performance Growth</p>
                  <Badge className="mt-2 bg-success-green">
                    +15% Improvement
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🤝 Community Champion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-xl font-bold text-maharashtra-saffron">
                    {officers?.find((o: Officer) => o.range.includes('Nandgaon'))?.name || 'TBD'}
                  </p>
                  <p className="text-sm text-gray-600">Humane Approach Leader</p>
                  <Badge className="mt-2 bg-maharashtra-saffron">
                    Outstanding Service
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
