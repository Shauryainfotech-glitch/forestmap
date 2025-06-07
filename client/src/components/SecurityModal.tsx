import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Lock, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  FileCheck
} from "lucide-react";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  const [authStep, setAuthStep] = useState<'login' | 'mfa' | 'success'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mfaCode: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    setTimeout(() => {
      setAuthStep('mfa');
    }, 1000);
  };

  const handleMFA = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate MFA verification
    setTimeout(() => {
      setAuthStep('success');
      setTimeout(() => {
        onClose();
        setAuthStep('login');
      }, 2000);
    }, 1000);
  };

  const securityFeatures = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "All data encrypted using AES-256 standards",
      status: "active"
    },
    {
      icon: Lock,
      title: "Multi-Factor Authentication",
      description: "SMS and email verification required",
      status: "active"
    },
    {
      icon: Key,
      title: "Role-Based Access Control",
      description: "Granular permissions per user role",
      status: "active"
    },
    {
      icon: FileCheck,
      title: "DPDP Act 2023 Compliance",
      description: "Full compliance with India's data protection laws",
      status: "verified"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 text-gov-blue" size={24} />
            Secure Access Portal
          </DialogTitle>
        </DialogHeader>

        {authStep === 'login' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Secure authentication required for forest department officers
              </p>
              <Badge variant="outline" className="bg-green-50 border-success-green text-success-green">
                <Shield size={12} className="mr-1" />
                DPDP Act 2023 Compliant
              </Badge>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Official Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="officer@mahaforest.gov.in"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter secure password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gov-blue hover:bg-blue-700">
                Secure Login
              </Button>
            </form>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Security Features</h4>
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <feature.icon className="text-success-green" size={16} />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{feature.title}</p>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                  <CheckCircle className="text-success-green" size={14} />
                </div>
              ))}
            </div>
          </div>
        )}

        {authStep === 'mfa' && (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="mx-auto text-gov-blue mb-3" size={48} />
              <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">
                Enter the 6-digit code sent to your registered mobile number
              </p>
            </div>

            <form onSubmit={handleMFA} className="space-y-4">
              <div>
                <Label htmlFor="mfaCode">Verification Code</Label>
                <Input
                  id="mfaCode"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.mfaCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, mfaCode: e.target.value }))}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-success-green hover:bg-green-700">
                Verify & Access
              </Button>
            </form>

            <div className="flex items-center justify-center space-x-4 text-sm">
              <button className="text-gov-blue hover:underline flex items-center">
                <Mail size={14} className="mr-1" />
                Resend via Email
              </button>
              <button className="text-gov-blue hover:underline flex items-center">
                <Smartphone size={14} className="mr-1" />
                Resend via SMS
              </button>
            </div>
          </div>
        )}

        {authStep === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto text-success-green" size={64} />
            <h3 className="text-lg font-semibold text-success-green">Authentication Successful</h3>
            <p className="text-sm text-gray-600">
              Secure access granted. Redirecting to dashboard...
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield size={12} />
              <span>Session encrypted and monitored</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}