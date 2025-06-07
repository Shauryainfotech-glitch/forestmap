import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Officer } from "@/lib/types";
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Edit,
  Star,
  Award,
  TrendingUp,
  Filter
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOfficerSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function OfficerDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCircle, setSelectedCircle] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  
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

  const createOfficerMutation = useMutation({
    mutationFn: api.createOfficer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/officers'] });
      setShowAddDialog(false);
      toast({
        title: "Success",
        description: "Officer added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add officer",
        variant: "destructive",
      });
    },
  });

  const updateOfficerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateOfficer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/officers'] });
      setSelectedOfficer(null);
      toast({
        title: "Success",
        description: "Officer updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update officer",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertOfficerSchema),
    defaultValues: {
      name: "",
      designation: "",
      range: "",
      email: "",
      phone: "",
      whatsappNumber: "",
      circle: "",
      headquarters: "",
      isActive: true,
      techScore: 0,
    },
  });

  const onSubmit = (data: any) => {
    if (selectedOfficer) {
      updateOfficerMutation.mutate({ id: selectedOfficer.id, data });
    } else {
      createOfficerMutation.mutate(data);
    }
  };

  // Filter officers based on search and circle
  const filteredOfficers = officers?.filter((officer: Officer) => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.range.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCircle = selectedCircle === "all" || officer.circle === selectedCircle;
    return matchesSearch && matchesCircle;
  });

  // Get unique circles for filter
  const circles = Array.from(new Set(officers?.map((officer: Officer) => officer.circle) || []));

  // Get top performers
  const topPerformers = officers?.filter((officer: Officer) => (officer.techScore || 0) > 90);

  if (officersLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        <h2 className="text-2xl font-bold text-gray-900">Officer Directory</h2>
        <p className="text-gray-600 mt-1">Manage forest officers and their assignments across Maharashtra</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="text-gov-blue" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-gov-blue">{officers?.length || 0}</p>
                <p className="text-sm text-gray-600">Total Officers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="text-maharashtra-saffron" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-maharashtra-saffron">{topPerformers?.length || 0}</p>
                <p className="text-sm text-gray-600">Top Performers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="text-forest-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-forest-green">{circles.length}</p>
                <p className="text-sm text-gray-600">Forest Circles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="text-success-green" size={24} />
              <div className="ml-4">
                <p className="text-2xl font-bold text-success-green">
                  {Math.round(officers?.reduce((sum: number, officer: Officer) => sum + (officer.techScore || 0), 0) / (officers?.length || 1))}%
                </p>
                <p className="text-sm text-gray-600">Avg TECH Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Officers</TabsTrigger>
            <TabsTrigger value="performers">Top Performers</TabsTrigger>
            <TabsTrigger value="hierarchy">Hierarchy</TabsTrigger>
          </TabsList>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-maharashtra-saffron hover:bg-orange-600">
                <Plus className="mr-2" size={16} />
                Add Officer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedOfficer ? "Edit Officer" : "Add New Officer"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Officer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Range Forest Officer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="range"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Range</FormLabel>
                          <FormControl>
                            <Input placeholder="Forest range" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="circle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Circle</FormLabel>
                          <FormControl>
                            <Input placeholder="Forest circle" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="officer@mahaforest.gov.in" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+91-XXX-XXXXXXX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="headquarters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Headquarters</FormLabel>
                        <FormControl>
                          <Input placeholder="Office address" {...field} />
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
                      disabled={createOfficerMutation.isPending || updateOfficerMutation.isPending}
                    >
                      {selectedOfficer ? "Update" : "Add"} Officer
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search officers by name, range, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCircle} onValueChange={setSelectedCircle}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2" size={16} />
                <SelectValue placeholder="Filter by circle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Circles</SelectItem>
                {circles.map(circle => (
                  <SelectItem key={circle} value={circle}>{circle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Officers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOfficers?.map((officer: Officer) => (
              <Card key={officer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {officer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{officer.name}</h3>
                        <p className="text-sm text-gray-600">{officer.designation}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOfficer(officer);
                        form.reset(officer);
                        setShowAddDialog(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2" size={14} />
                      <span>{officer.range} Range, {officer.circle} Circle</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="mr-2" size={14} />
                      <span className="truncate">{officer.email}</span>
                    </div>
                    
                    {officer.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="mr-2" size={14} />
                        <span>{officer.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={officer.isActive ? "default" : "secondary"}>
                        {officer.isActive ? "Active" : "Inactive"}
                      </Badge>
                      
                      {officer.techScore && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">TECH Score:</span>
                          <Badge 
                            className={
                              officer.techScore >= 90 ? "bg-success-green" :
                              officer.techScore >= 75 ? "bg-warning-orange" :
                              "bg-alert-red"
                            }
                          >
                            {officer.techScore}%
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="mr-1" size={12} />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-success-green text-white hover:bg-green-600">
                        <span className="mr-1">📱</span>
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOfficers?.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No officers found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="performers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="text-maharashtra-saffron mr-2" size={20} />
                Top Performing Officers (TECH Score ≥ 90%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers?.map((officer: Officer, index: number) => (
                  <div key={officer.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-maharashtra-saffron text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.range} Range</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className="bg-success-green">
                        {officer.techScore}% TECH Score
                      </Badge>
                      <Badge variant="outline">
                        {officer.designation}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {topPerformers?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Star className="mx-auto mb-2" size={32} />
                  <p>No top performers found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="text-gov-blue mr-2" size={20} />
                Organizational Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group officers by designation */}
                {Object.entries(
                  filteredOfficers?.reduce((acc: any, officer: Officer) => {
                    if (!acc[officer.designation]) {
                      acc[officer.designation] = [];
                    }
                    acc[officer.designation].push(officer);
                    return acc;
                  }, {}) || {}
                ).map(([designation, officers]: [string, Officer[]]) => (
                  <div key={designation}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                      {designation} ({officers.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {officers.map((officer: Officer) => (
                        <div key={officer.id} className="p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{officer.name}</h4>
                              <p className="text-sm text-gray-600">{officer.range} Range</p>
                              <p className="text-xs text-gray-500">{officer.circle} Circle</p>
                            </div>
                            {officer.techScore && (
                              <Badge 
                                variant="outline"
                                className={
                                  officer.techScore >= 90 ? "border-success-green text-success-green" :
                                  officer.techScore >= 75 ? "border-warning-orange text-warning-orange" :
                                  "border-alert-red text-alert-red"
                                }
                              >
                                {officer.techScore}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
