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
import { Permit, ForestRange } from "@/lib/types";
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  X,
  Eye,
  Download,
  Upload,
  Filter,
  Search,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPermitSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function DigitalPermits() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: permits, isLoading: permitsLoading } = useQuery({
    queryKey: ['/api/permits'],
    queryFn: () => api.getPermits(),
  });

  const { data: forestRanges, isLoading: rangesLoading } = useQuery({
    queryKey: ['/api/forest-ranges'],
    queryFn: () => api.getForestRanges(),
  });

  const createPermitMutation = useMutation({
    mutationFn: api.createPermit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permits'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Permit application submitted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit permit application",
        variant: "destructive",
      });
    },
  });

  const updatePermitMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updatePermit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/permits'] });
      toast({
        title: "Success",
        description: "Permit status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update permit status",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertPermitSchema),
    defaultValues: {
      type: "tree_cutting",
      applicantName: "",
      applicantContact: "",
      rangeId: 0,
      status: "pending",
      description: "",
      fees: 0,
      validityPeriod: 365,
    },
  });

  const onSubmit = (data: any) => {
    createPermitMutation.mutate(data);
  };

  const handleStatusUpdate = (permitId: number, newStatus: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === "approved" || newStatus === "rejected") {
      updateData.processedDate = new Date();
    }
    updatePermitMutation.mutate({ id: permitId, data: updateData });
  };

  // Filter permits
  const filteredPermits = permits?.filter((permit: Permit) => {
    const matchesStatus = selectedStatus === "all" || permit.status === selectedStatus;
    const matchesType = selectedType === "all" || permit.type === selectedType;
    const matchesSearch = permit.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permit.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Calculate statistics
  const pendingPermits = permits?.filter((permit: Permit) => permit.status === "pending").length || 0;
  const approvedPermits = permits?.filter((permit: Permit) => permit.status === "approved").length || 0;
  const rejectedPermits = permits?.filter((permit: Permit) => permit.status === "rejected").length || 0;
  const underReviewPermits = permits?.filter((permit: Permit) => permit.status === "under_review").length || 0;

  const totalRevenue = permits?.filter((permit: Permit) => permit.status === "approved")
    .reduce((sum: number, permit: Permit) => sum + (permit.fees || 0), 0) || 0;

  const approvalRate = permits?.length ? (approvedPermits / permits.length) * 100 : 0;

  // Get permit types
  const permitTypes = [
    { value: "tree_cutting", label: "Tree Cutting Permission", avgDays: 8 },
    { value: "forest_produce", label: "Forest Produce License", avgDays: 6 },
    { value: "wildlife_rescue", label: "Wildlife Rescue Request", avgDays: 1 },
    { value: "research", label: "Research Permission", avgDays: 10 },
  ];

  if (permitsLoading || rangesLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">Digital Permits System</h2>
        <p className="text-gray-600 mt-1">Streamlined online permit applications and approvals for forest activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-warning-orange">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="text-warning-orange" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-warning-orange">{pendingPermits}</p>
                <p className="text-sm text-gray-600">Pending Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success-green">
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">{approvedPermits}</p>
                <p className="text-sm text-gray-600">Approved Permits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gov-blue">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{Math.round(approvalRate)}%</p>
                <p className="text-sm text-gray-600">Approval Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-maharashtra-saffron">
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-sm text-gray-600">Revenue Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apply" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="apply">Quick Apply</TabsTrigger>
            <TabsTrigger value="applications">All Applications</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gov-blue hover:bg-blue-700">
                <Plus className="mr-2" size={16} />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit New Permit Application</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Permit Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select permit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {permitTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="applicantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Applicant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name or organization" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="applicantContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Information</FormLabel>
                          <FormControl>
                            <Input placeholder="Email or phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of the activity/purpose..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Fees (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0"
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
                      name="validityPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Validity Period (days)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="365"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                      className="bg-gov-blue hover:bg-blue-700"
                      disabled={createPermitMutation.isPending}
                    >
                      Submit Application
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="apply" className="space-y-6">
          {/* Quick Apply Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {permitTypes.map((type) => (
              <Card key={type.value} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gov-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                      <FileText className="text-gov-blue" size={24} />
                    </div>
                    <Badge variant="outline">{type.avgDays} days avg</Badge>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{type.label}</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Average processing: {type.avgDays} days
                  </p>
                  <Button 
                    className="w-full bg-gov-blue hover:bg-blue-700"
                    onClick={() => {
                      form.setValue('type', type.value as any);
                      setShowAddDialog(true);
                    }}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Process Information */}
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gov-blue rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Submit Application</h3>
                  <p className="text-sm text-gray-600">Fill out the online form with required details</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-warning-orange rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Document Verification</h3>
                  <p className="text-sm text-gray-600">Upload supporting documents for review</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-maharashtra-saffron rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Field Inspection</h3>
                  <p className="text-sm text-gray-600">On-site verification by forest officials</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-success-green rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Approval & Issuance</h3>
                  <p className="text-sm text-gray-600">Receive digital permit certificate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by applicant name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {permitTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredPermits?.map((permit: Permit) => {
              const range = forestRanges?.find((r: ForestRange) => r.id === permit.rangeId);
              const permitType = permitTypes.find(t => t.value === permit.type);
              
              return (
                <Card key={permit.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{permit.applicantName}</h3>
                          <Badge className={
                            permit.status === 'approved' ? 'bg-success-green' :
                            permit.status === 'rejected' ? 'bg-alert-red' :
                            permit.status === 'under_review' ? 'bg-warning-orange' :
                            'bg-gray-500'
                          }>
                            {permit.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {permitType?.label || permit.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Range</p>
                            <p className="font-medium">{range?.name || 'Unknown'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Applied</p>
                            <p className="font-medium">{new Date(permit.appliedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Contact</p>
                            <p className="font-medium">{permit.applicantContact}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Fees</p>
                            <p className="font-medium">₹{permit.fees || 0}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">{permit.description}</p>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button size="sm" variant="outline">
                          <Eye className="mr-1" size={14} />
                          View
                        </Button>
                        
                        {permit.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(permit.id, "under_review")}
                              className="bg-warning-orange hover:bg-orange-600"
                            >
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(permit.id, "approved")}
                              className="bg-success-green hover:bg-green-600"
                            >
                              <CheckCircle className="mr-1" size={14} />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(permit.id, "rejected")}
                              className="text-alert-red border-alert-red hover:bg-red-50"
                            >
                              <X className="mr-1" size={14} />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {permit.status === 'approved' && (
                          <Button size="sm" className="bg-gov-blue hover:bg-blue-700">
                            <Download className="mr-1" size={14} />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPermits?.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Pending Applications requiring attention */}
          <div className="space-y-4">
            {permits?.filter((permit: Permit) => permit.status === 'pending' || permit.status === 'under_review')
              .map((permit: Permit) => {
                const range = forestRanges?.find((r: ForestRange) => r.id === permit.rangeId);
                const permitType = permitTypes.find(t => t.value === permit.type);
                const daysAgo = Math.floor((Date.now() - new Date(permit.appliedDate).getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <Card key={permit.id} className={`border-l-4 ${
                    daysAgo > 7 ? 'border-l-alert-red bg-red-50' :
                    daysAgo > 3 ? 'border-l-warning-orange bg-orange-50' :
                    'border-l-gov-blue bg-blue-50'
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{permit.applicantName}</h3>
                            <Badge className={
                              permit.status === 'under_review' ? 'bg-warning-orange' : 'bg-gray-500'
                            }>
                              {permit.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {permitType?.label || permit.type}
                            </Badge>
                            {daysAgo > 7 && (
                              <Badge className="bg-alert-red">
                                Urgent - {daysAgo} days
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Range</p>
                              <p className="font-medium">{range?.name || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Applied</p>
                              <p className="font-medium">{daysAgo} days ago</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Contact</p>
                              <p className="font-medium">{permit.applicantContact}</p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mt-2">{permit.description}</p>
                        </div>
                        
                        <div className="flex space-x-2 ml-6">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(permit.id, "approved")}
                            className="bg-success-green hover:bg-green-600"
                          >
                            <CheckCircle className="mr-1" size={14} />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(permit.id, "rejected")}
                            className="text-alert-red border-alert-red hover:bg-red-50"
                          >
                            <X className="mr-1" size={14} />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {permits?.filter((permit: Permit) => permit.status === 'pending' || permit.status === 'under_review').length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto mb-4 text-success-green" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending applications require your attention.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="text-gov-blue mr-2" size={20} />
                  Application Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gov-blue">{permits?.length || 0}</p>
                    <p className="text-sm text-gray-600">Total Applications</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-lg font-semibold text-success-green">{approvedPermits}</p>
                      <p className="text-xs text-gray-600">Approved</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-warning-orange">{pendingPermits}</p>
                      <p className="text-xs text-gray-600">Pending</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Most Requested</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {permitTypes.map((type) => {
                        const count = permits?.filter((p: Permit) => p.type === type.value).length || 0;
                        return (
                          <li key={type.value} className="flex justify-between">
                            <span>{type.label}</span>
                            <span className="font-medium">{count}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="text-maharashtra-saffron mr-2" size={20} />
                  Processing Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-maharashtra-saffron">{Math.round(approvalRate)}%</p>
                    <p className="text-sm text-gray-600">Approval Rate</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Processing Time</span>
                        <span>8 days</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Digital Adoption Rate</span>
                        <span>95%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Revenue Generated</span>
                        <span>₹{(totalRevenue / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Process Improvements</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 60% reduction in processing time</li>
                      <li>• 90% reduction in paperwork</li>
                      <li>• 24/7 application submission</li>
                      <li>• Real-time status tracking</li>
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
