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
import { ForestStats, ForestRange, Vision2047Progress } from "@/lib/types";
import { 
  Leaf, 
  Plus, 
  TrendingUp, 
  DollarSign,
  Target,
  BarChart3,
  Award,
  Globe,
  Calculator,
  Download,
  Upload,
  Filter,
  RefreshCw
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVision2047ProgressSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface CarbonCreditRecord {
  id: number;
  rangeId: number;
  year: number;
  carbonSequestered: number; // tons
  creditsGenerated: number;
  creditsVerified: number;
  creditsSold: number;
  pricePerCredit: number; // INR
  totalRevenue: number; // INR
  verificationStatus: 'pending' | 'verified' | 'rejected';
  certificationBody: string;
  createdAt: Date;
}

export default function CarbonCredits() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: forestStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/forest-stats'],
    queryFn: () => api.getForestStats(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  const { data: vision2047Progress, isLoading: visionLoading } = useQuery({
    queryKey: ['/api/vision-2047-progress'],
    queryFn: () => api.getVision2047Progress(),
  });

  const createVisionProgressMutation = useMutation({
    mutationFn: api.createVision2047Progress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vision-2047-progress'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Carbon credit record added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add carbon credit record",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertVision2047ProgressSchema),
    defaultValues: {
      rangeId: 0,
      targetYear: new Date().getFullYear(),
      forestCoverTarget: 35.0,
      currentProgress: 0,
      initiativesCompleted: 0,
      totalInitiatives: 10,
      carbonCreditGenerated: 0,
      revenueGenerated: 0,
    },
  });

  const onSubmit = (data: any) => {
    createVisionProgressMutation.mutate(data);
  };

  // Calculate carbon credit statistics from forest stats
  const totalCarbonSequestration = forestStats?.reduce((sum: number, stat: ForestStats) => 
    sum + (stat.carbonSequestration || 0), 0) || 0;

  // Estimate carbon credits (1 ton CO2 = 1 credit, with efficiency factor)
  const estimatedCredits = Math.round(totalCarbonSequestration * 0.8); // 80% efficiency
  const creditPrice = 2500; // Average price per credit in INR
  const totalRevenue = estimatedCredits * creditPrice;

  // Vision 2047 carbon targets
  const carbonTarget2029 = 2000000; // 2M tons CO2
  const carbonTarget2035 = 5000000; // 5M tons CO2
  const carbonTarget2047 = 10000000; // 10M tons CO2

  const progressTo2029 = (totalCarbonSequestration / carbonTarget2029) * 100;
  const progressTo2035 = (totalCarbonSequestration / carbonTarget2035) * 100;
  const progressTo2047 = (totalCarbonSequestration / carbonTarget2047) * 100;

  // Mock carbon credit records for demonstration
  const mockCarbonRecords: CarbonCreditRecord[] = forestRanges?.slice(0, 5).map((range: ForestRange, index: number) => ({
    id: index + 1,
    rangeId: range.id,
    year: 2024,
    carbonSequestered: 1500 + (index * 300),
    creditsGenerated: 1200 + (index * 240),
    creditsVerified: 1000 + (index * 200),
    creditsSold: 800 + (index * 160),
    pricePerCredit: 2400 + (index * 50),
    totalRevenue: (800 + (index * 160)) * (2400 + (index * 50)),
    verificationStatus: index % 3 === 0 ? 'verified' : index % 3 === 1 ? 'pending' : 'verified',
    certificationBody: 'Maharashtra Forest Carbon Verification Authority',
    createdAt: new Date()
  })) || [];

  // Filter records
  const filteredRecords = mockCarbonRecords.filter((record: CarbonCreditRecord) => {
    const matchesRange = selectedRange === "all" || record.rangeId.toString() === selectedRange;
    const matchesYear = record.year.toString() === selectedYear;
    return matchesRange && matchesYear;
  });

  // Calculate aggregated statistics
  const totalCreditsGenerated = filteredRecords.reduce((sum, record) => sum + record.creditsGenerated, 0);
  const totalCreditsVerified = filteredRecords.reduce((sum, record) => sum + record.creditsVerified, 0);
  const totalCreditsSold = filteredRecords.reduce((sum, record) => sum + record.creditsSold, 0);
  const totalRevenueGenerated = filteredRecords.reduce((sum, record) => sum + record.totalRevenue, 0);

  const verificationRate = totalCreditsGenerated > 0 ? (totalCreditsVerified / totalCreditsGenerated) * 100 : 0;
  const salesRate = totalCreditsVerified > 0 ? (totalCreditsSold / totalCreditsVerified) * 100 : 0;

  if (statsLoading || rangesLoading || visionLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">Carbon Credits Management</h2>
        <p className="text-gray-600 mt-1">Track carbon sequestration, generate credits, and manage revenue streams aligned with Vision 2047</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-success-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Leaf className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">{totalCreditsGenerated.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Credits Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gov-blue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{totalCreditsVerified.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Credits Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-maharashtra-saffron">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">{totalCreditsSold.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Credits Sold</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning-orange">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="text-warning-orange" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-warning-orange">₹{(totalRevenueGenerated / 10000000).toFixed(1)}Cr</p>
                <p className="text-sm text-gray-600">Revenue Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="credits">Credit Management</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-success-green hover:bg-green-700">
                <Plus className="mr-2" size={16} />
                Add Carbon Assessment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Carbon Credit Assessment</DialogTitle>
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
                      name="targetYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assessment Year</FormLabel>
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
                      name="carbonCreditGenerated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbon Credits Generated</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Credits count"
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
                      name="revenueGenerated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Revenue Generated (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Revenue amount"
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
                      name="currentProgress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forest Cover Progress (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              placeholder="Progress percentage"
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
                      name="forestCoverTarget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forest Cover Target (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Target percentage"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-success-green hover:bg-green-700"
                      disabled={createVisionProgressMutation.isPending}
                    >
                      Add Assessment
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {/* Vision 2047 Carbon Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="text-maharashtra-saffron mr-2" size={20} />
                Vision 2047 - Carbon Sequestration Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">2029 Target: 2M tons CO₂</span>
                    <span className="text-sm text-gray-600">{Math.round(progressTo2029)}% Complete</span>
                  </div>
                  <Progress value={progressTo2029} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    {totalCarbonSequestration.toLocaleString()} tons sequestered of 2M target
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">2035 Target: 5M tons CO₂</span>
                    <span className="text-sm text-gray-600">{Math.round(progressTo2035)}% Complete</span>
                  </div>
                  <Progress value={progressTo2035} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    Carbon neutral forest ecosystem milestone
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">2047 Target: 10M tons CO₂</span>
                    <span className="text-sm text-gray-600">{Math.round(progressTo2047)}% Complete</span>
                  </div>
                  <Progress value={progressTo2047} className="h-3" />
                  <p className="text-xs text-gray-500 mt-1">
                    Net-zero emissions and global leadership target
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Credit Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="text-success-green mr-2" size={20} />
                  Carbon Credit Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-success-green">{Math.round(verificationRate)}%</p>
                    <p className="text-sm text-gray-600">Verification Success Rate</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Credits Generated</span>
                        <span>{totalCreditsGenerated.toLocaleString()}</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Credits Verified</span>
                        <span>{totalCreditsVerified.toLocaleString()}</span>
                      </div>
                      <Progress value={verificationRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Credits Sold</span>
                        <span>{totalCreditsSold.toLocaleString()}</span>
                      </div>
                      <Progress value={salesRate} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Pipeline Status</h4>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="font-semibold text-warning-orange">{totalCreditsGenerated - totalCreditsVerified}</p>
                        <p className="text-gray-600">Pending Verification</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gov-blue">{totalCreditsVerified - totalCreditsSold}</p>
                        <p className="text-gray-600">Ready for Sale</p>
                      </div>
                      <div>
                        <p className="font-semibold text-success-green">{totalCreditsSold}</p>
                        <p className="text-gray-600">Revenue Generated</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="text-warning-orange mr-2" size={20} />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-warning-orange">₹{(totalRevenueGenerated / 10000000).toFixed(1)}Cr</p>
                    <p className="text-sm text-gray-600">Total Revenue Generated</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-maharashtra-saffron">₹{creditPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Avg Price/Credit</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-success-green">{Math.round(salesRate)}%</p>
                      <p className="text-xs text-gray-600">Sales Conversion</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Revenue Potential</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Current inventory: ₹{((totalCreditsVerified - totalCreditsSold) * creditPrice / 10000000).toFixed(1)}Cr</li>
                      <li>• Pipeline value: ₹{((totalCreditsGenerated - totalCreditsVerified) * creditPrice / 10000000).toFixed(1)}Cr</li>
                      <li>• Annual projection: ₹{(totalRevenueGenerated * 1.2 / 10000000).toFixed(1)}Cr</li>
                      <li>• Vision 2047 target: ₹500Cr</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Range-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="text-gov-blue mr-2" size={20} />
                Range-wise Carbon Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRecords.map((record: CarbonCreditRecord) => {
                  const range = forestRanges?.find((r: ForestRange) => r.id === record.rangeId);
                  const efficiency = record.creditsGenerated > 0 ? (record.creditsVerified / record.creditsGenerated) * 100 : 0;
                  
                  return (
                    <div key={record.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{range?.name} Range</h4>
                        <p className="text-sm text-gray-600">{record.carbonSequestered.toLocaleString()} tons CO₂ sequestered</p>
                      </div>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-success-green">{record.creditsGenerated.toLocaleString()}</p>
                          <p className="text-gray-600">Generated</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gov-blue">{record.creditsVerified.toLocaleString()}</p>
                          <p className="text-gray-600">Verified</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-maharashtra-saffron">₹{(record.totalRevenue / 1000000).toFixed(1)}L</p>
                          <p className="text-gray-600">Revenue</p>
                        </div>
                        <Badge className={
                          efficiency >= 90 ? 'bg-success-green' :
                          efficiency >= 75 ? 'bg-warning-orange' :
                          'bg-alert-red'
                        }>
                          {Math.round(efficiency)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
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
              <RefreshCw className="mr-2" size={16} />
              Refresh Data
            </Button>

            <Button variant="outline">
              <Download className="mr-2" size={16} />
              Export Report
            </Button>
          </div>

          {/* Credit Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecords.map((record: CarbonCreditRecord) => {
              const range = forestRanges?.find((r: ForestRange) => r.id === record.rangeId);
              
              return (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{range?.name} Range</h3>
                        <p className="text-sm text-gray-600">Assessment Year: {record.year}</p>
                      </div>
                      <Badge className={
                        record.verificationStatus === 'verified' ? 'bg-success-green' :
                        record.verificationStatus === 'pending' ? 'bg-warning-orange' :
                        'bg-alert-red'
                      }>
                        {record.verificationStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Carbon Sequestered</p>
                          <p className="font-semibold">{record.carbonSequestered.toLocaleString()} tons</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Credits Generated</p>
                          <p className="font-semibold text-success-green">{record.creditsGenerated.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Credits Verified</p>
                          <p className="font-semibold text-gov-blue">{record.creditsVerified.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Credits Sold</p>
                          <p className="font-semibold text-maharashtra-saffron">{record.creditsSold.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Verification Progress</span>
                          <span className="text-sm font-medium">
                            {Math.round((record.creditsVerified / record.creditsGenerated) * 100)}%
                          </span>
                        </div>
                        <Progress value={(record.creditsVerified / record.creditsGenerated) * 100} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="text-lg font-bold text-warning-orange">
                          ₹{(record.totalRevenue / 1000000).toFixed(2)}L
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calculator className="mr-1" size={14} />
                          Recalculate
                        </Button>
                        <Button size="sm" className="flex-1 bg-success-green hover:bg-green-600">
                          <Upload className="mr-1" size={14} />
                          Submit for Verification
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No carbon credit records found</h3>
              <p className="text-gray-600">Start by adding carbon assessments for your forest ranges.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Carbon Credit Marketplace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="text-maharashtra-saffron mr-2" size={20} />
                  Carbon Credit Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-success-green">₹2,450</p>
                      <p className="text-sm text-gray-600">Current Market Price</p>
                      <Badge className="mt-1 bg-success-green">+2.5% today</Badge>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gov-blue">{(totalCreditsVerified - totalCreditsSold).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Available for Sale</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-warning-orange">₹{((totalCreditsVerified - totalCreditsSold) * 2450 / 1000000).toFixed(1)}L</p>
                      <p className="text-sm text-gray-600">Market Value</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Active Listings</h4>
                    <div className="space-y-3">
                      {filteredRecords.slice(0, 3).map((record: CarbonCreditRecord) => {
                        const range = forestRanges?.find((r: ForestRange) => r.id === record.rangeId);
                        const availableCredits = record.creditsVerified - record.creditsSold;
                        
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <h5 className="font-semibold text-gray-900">{range?.name} Range Credits</h5>
                              <p className="text-sm text-gray-600">{availableCredits.toLocaleString()} credits available</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-maharashtra-saffron">₹{record.pricePerCredit.toLocaleString()}</p>
                              <p className="text-xs text-gray-600">per credit</p>
                            </div>
                            <Button size="sm" className="bg-success-green hover:bg-green-600">
                              List for Sale
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Price Trends</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>7-day avg</span>
                        <span className="text-success-green">₹2,380</span>
                      </div>
                      <div className="flex justify-between">
                        <span>30-day avg</span>
                        <span className="text-gov-blue">₹2,320</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year high</span>
                        <span className="text-maharashtra-saffron">₹2,650</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Year low</span>
                        <span className="text-gray-600">₹2,100</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Market Demand</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• High demand from tech companies</li>
                      <li>• Government carbon offset programs</li>
                      <li>• International ESG compliance</li>
                      <li>• Net-zero commitment companies</li>
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Selling Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Best selling months: Q4</li>
                      <li>• Bundle credits for better prices</li>
                      <li>• Include biodiversity co-benefits</li>
                      <li>• Target sustainability-focused buyers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Buyer Interest */}
          <Card>
            <CardHeader>
              <CardTitle>Buyer Interest & Matching</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Tech Corp Industries</h4>
                  <p className="text-sm text-gray-600 mb-3">Looking for 50,000 verified credits</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Offer: ₹2,400/credit</span>
                    <Badge className="bg-gov-blue">Interested</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Green Energy Solutions</h4>
                  <p className="text-sm text-gray-600 mb-3">Bulk purchase of 100,000+ credits</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Offer: ₹2,350/credit</span>
                    <Badge className="bg-success-green">Negotiating</Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">International Climate Fund</h4>
                  <p className="text-sm text-gray-600 mb-3">Long-term partnership opportunity</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Offer: ₹2,500/credit</span>
                    <Badge className="bg-maharashtra-saffron">Premium</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="text-gov-blue mr-2" size={20} />
                Carbon Credit Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-warning-orange">
                    {filteredRecords.filter(r => r.verificationStatus === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending Verification</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success-green">
                    {filteredRecords.filter(r => r.verificationStatus === 'verified').length}
                  </p>
                  <p className="text-sm text-gray-600">Verified Credits</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-alert-red">
                    {filteredRecords.filter(r => r.verificationStatus === 'rejected').length}
                  </p>
                  <p className="text-sm text-gray-600">Rejected Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Process */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gov-blue rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Collection</h3>
                  <p className="text-sm text-gray-600">Forest inventory and biomass assessment</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Third-party Review</h3>
                  <p className="text-sm text-gray-600">Independent verification body assessment</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-maharashtra-saffron rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                  <p className="text-sm text-gray-600">Compliance with international standards</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Certification</h3>
                  <p className="text-sm text-gray-600">Issue verified carbon credits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Standards */}
          <Card>
            <CardHeader>
              <CardTitle>Verification Standards & Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Certification Bodies</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Maharashtra Forest Carbon Authority</span>
                      <Badge className="bg-success-green">Accredited</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Verified Carbon Standard (VCS)</span>
                      <Badge className="bg-success-green">Partner</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Gold Standard Foundation</span>
                      <Badge className="bg-warning-orange">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Climate Action Reserve</span>
                      <Badge className="bg-gov-blue">Evaluating</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Quality Assurance</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Satellite monitoring and ground truthing
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Biodiversity impact assessments
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Community benefit verification
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Permanence and additionality checks
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-success-green rounded-full mr-2"></span>
                      Regular monitoring and reporting
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
