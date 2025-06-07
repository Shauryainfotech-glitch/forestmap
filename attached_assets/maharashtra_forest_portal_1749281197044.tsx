import React, { useState, useEffect } from 'react';
import { 
  TreePine, 
  Shield, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Search, 
  FileText, 
  Camera, 
  AlertTriangle, 
  Award, 
  BarChart3, 
  Globe, 
  MessageCircle, 
  Download,
  ChevronRight,
  Calendar,
  Clock,
  Star,
  Heart,
  Leaf,
  Mountain
} from 'lucide-react';

const MaharashtraForestPortal = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [selectedRange, setSelectedRange] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');

  const languages = {
    en: {
      title: "Maharashtra Forest Department",
      subtitle: "Digital Transformation for विकसित महाराष्ट्र 2047",
      nav: {
        home: "Home",
        services: "Services", 
        ranges: "Forest Ranges",
        dashboard: "Dashboard",
        contact: "Contact"
      },
      welcome: "Welcome to Digital Forest Maharashtra",
      mission: "Leading India's Digital Forest Governance Revolution"
    },
    mr: {
      title: "महाराष्ट्र वन विभाग",
      subtitle: "विकसित महाराष्ट्र 2047 साठी डिजिटल परिवर्तन",
      nav: {
        home: "मुख्यपृष्ठ",
        services: "सेवा",
        ranges: "वन श्रेणी", 
        dashboard: "डॅशबोर्ड",
        contact: "संपर्क"
      },
      welcome: "डिजिटल वन महाराष्ट्रात आपले स्वागत",
      mission: "भारताच्या डिजिटल वन शासन क्रांतीचे नेतृत्व"
    },
    hi: {
      title: "महाराष्ट्र वन विभाग", 
      subtitle: "विकसित महाराष्ट्र 2047 के लिए डिजिटल परिवर्तन",
      nav: {
        home: "मुख्य पृष्ठ",
        services: "सेवाएं",
        ranges: "वन रेंज",
        dashboard: "डैशबोर्ड", 
        contact: "संपर्क"
      },
      welcome: "डिजिटल वन महाराष्ट्र में आपका स्वागत",
      mission: "भारत की डिजिटल वन शासन क्रांति का नेतृत्व"
    }
  };

  const currentLang = languages[language];

  const ranges = [
    { id: 'nashik', name: 'Nashik Range', officer: 'RFO Chandwad', email: 'rfochandwad1@gmail.com', phone: '+91-9876543210' },
    { id: 'yeola', name: 'Yeola Range', officer: 'RFO Yeola', email: 'rfoyeola@gmail.com', phone: '+91-9876543211' },
    { id: 'nandgaon', name: 'Nandgaon Range', officer: 'RFO Nandgaon', email: 'rfonandt@gmail.com', phone: '+91-9876543212' },
    { id: 'malegaon', name: 'Malegaon Range', officer: 'RFO Malegaon', email: 'rfo_malegaon@rediffmail.com', phone: '+91-9876543213' },
    { id: 'satana', name: 'Satana Range', officer: 'RFO Satana', email: 'rfosatana2012@gmail.com', phone: '+91-9876543214' },
    { id: 'taharabad', name: 'Taharabad Range', officer: 'RFO Taharabad', email: 'rfotaharabad.t@gmail.com', phone: '+91-9876543215' }
  ];

  const services = [
    {
      id: 'tree-cutting',
      title: 'Tree Cutting Permission',
      description: 'Apply for tree cutting permits online',
      icon: TreePine,
      processing: '7 days',
      documents: 3,
      fee: '₹500'
    },
    {
      id: 'forest-produce',
      title: 'Forest Produce License',
      description: 'Collect forest produce legally',
      icon: Leaf,
      processing: '5 days', 
      documents: 2,
      fee: '₹200'
    },
    {
      id: 'wildlife-rescue',
      title: 'Wildlife Rescue',
      description: '24/7 emergency wildlife rescue',
      icon: Shield,
      processing: '2 hours',
      documents: 0,
      fee: 'Free'
    },
    {
      id: 'plantation',
      title: 'Plantation Certificate',
      description: 'Get certified for your plantation',
      icon: Mountain,
      processing: '3 days',
      documents: 2,
      fee: '₹100'
    }
  ];

  const stats = [
    { label: 'Forest Cover', value: '21.6%', target: '35%', icon: TreePine, color: 'text-green-600' },
    { label: 'Digital Services', value: '85%', target: '100%', icon: Globe, color: 'text-blue-600' },
    { label: 'Citizen Satisfaction', value: '92%', target: '95%', icon: Heart, color: 'text-red-600' },
    { label: 'Carbon Sequestration', value: '4.2M tons', target: '5M tons', icon: Leaf, color: 'text-emerald-600' }
  ];

  const HomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 to-green-600 text-white p-8 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">{currentLang.welcome}</h1>
          <p className="text-xl mb-6">{currentLang.mission}</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply for Services
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-800 transition-colors">
              Emergency Contact: 1926
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-sm text-gray-500">Target: {stat.target}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Featured Services */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <service.icon className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Processing:</span>
                  <span className="font-medium">{service.processing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee:</span>
                  <span className="font-medium text-green-600">{service.fee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News & Updates */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-900">150-Day Digital Transformation Plan Launched</h3>
            <p className="text-gray-600 text-sm">Forest Department begins comprehensive digitization under विकसित महाराष्ट्र 2047</p>
            <p className="text-gray-500 text-xs mt-1">2 days ago</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-900">WhatsApp Service Integration Complete</h3>
            <p className="text-gray-600 text-sm">All 42+ forest ranges now accessible via WhatsApp for emergency services</p>
            <p className="text-gray-500 text-xs mt-1">1 week ago</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-900">Carbon Credit Program Launched</h3>
            <p className="text-gray-600 text-sm">Maharashtra leads India in forest carbon credit verification system</p>
            <p className="text-gray-500 text-xs mt-1">2 weeks ago</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ServicesPage = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Forest Services</h1>
        <p className="text-gray-600 mb-6">Apply for forest-related services online through our integrated platform</p>
      </div>

      {/* Service Application Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for Service</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Choose a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Range</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
            >
              <option value="">Choose your nearest range...</option>
              {ranges.map((range) => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicant Name</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
            <input 
              type="tel" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose/Description</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
              placeholder="Describe the purpose of your application"
            ></textarea>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Submit Application
          </button>
        </div>
      </div>

      {/* Track Application */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Your Application</h2>
        <div className="flex gap-4">
          <input 
            type="text" 
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter your application number"
            value={applicationStatus}
            onChange={(e) => setApplicationStatus(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Track Status
          </button>
        </div>
        {applicationStatus && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Application Under Review</span>
            </div>
            <p className="text-green-700 text-sm">Your application #{applicationStatus} is being processed by the concerned Range Forest Officer. Expected completion in 3-5 working days.</p>
          </div>
        )}
      </div>

      {/* Emergency Services */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-semibold text-red-800">Emergency Services</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="font-semibold text-red-800">Forest Fire</div>
            <div className="text-red-600">Call: 1926</div>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="font-semibold text-red-800">Wildlife Rescue</div>
            <div className="text-red-600">WhatsApp: 94234-56789</div>
          </div>
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="font-semibold text-red-800">Report Illegal Activity</div>
            <div className="text-red-600">SMS: 56070</div>
          </div>
        </div>
      </div>
    </div>
  );

  const RangesPage = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Forest Ranges</h1>
        <p className="text-gray-600 mb-6">Connect with your local Range Forest Officer for personalized assistance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranges.map((range) => (
          <div key={range.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">{range.name}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{range.officer}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${range.email}`} className="text-sm text-blue-600 hover:underline">
                  {range.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${range.phone}`} className="text-sm text-blue-600 hover:underline">
                  {range.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-gray-500" />
                <a href={`https://wa.me/${range.phone.replace(/[^0-9]/g, '')}`} className="text-sm text-green-600 hover:underline">
                  WhatsApp Support
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Contact Range Office
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Range Map Placeholder */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Interactive Range Map</h2>
        <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Interactive GIS map showing all forest ranges</p>
            <p className="text-sm text-gray-500 mt-2">Click on any range for detailed information</p>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Real-time Forest Dashboard</h1>
        <p className="text-gray-600 mb-6">Monitor forest conservation progress across Maharashtra</p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">Target: {stat.target}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${stat.color.replace('text-', 'bg-')}`}
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fire Alert System</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">All Ranges Clear</span>
              </div>
              <span className="text-sm text-gray-500">Last updated: 2 min ago</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Active Monitoring: 42 ranges</div>
              <div className="text-sm text-gray-600">Satellite Coverage: 100%</div>
              <div className="text-sm text-gray-600">Weather Integration: Active</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Wildlife Monitoring</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Camera Traps Active</span>
              <span className="font-semibold">156</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Species Detected</span>
              <span className="font-semibold">23</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Human-Animal Conflicts</span>
              <span className="font-semibold text-green-600">0 (This month)</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">AI-powered prediction system active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1,247</div>
            <div className="text-sm text-gray-600">Applications Processed</div>
            <div className="text-xs text-gray-500">This month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.2 days</div>
            <div className="text-sm text-gray-600">Average Processing Time</div>
            <div className="text-xs text-gray-500">Target: 5 days</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">92%</div>
            <div className="text-sm text-gray-600">Citizen Satisfaction</div>
            <div className="text-xs text-gray-500">Based on feedback</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
            <div className="text-sm text-gray-600">Digital Adoption</div>
            <div className="text-xs text-gray-500">vs offline services</div>
          </div>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-6">Get in touch with Maharashtra Forest Department</p>
      </div>

      {/* Main Office */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Headquarters</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">DyCF Office, Nashik East</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-gray-800">Green New Hotel Forest Colony</div>
                  <div className="text-gray-600">Trimbak Road, Nashik - 422002</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <a href="mailto:dycfnashikeast@mahaforest.gov.in" className="text-blue-600 hover:underline">
                  dycfnashikeast@mahaforest.gov.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-800">09-13-2572671</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Office Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday:</span>
                <span className="text-gray-800">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday:</span>
                <span className="text-gray-800">10:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday:</span>
                <span className="text-gray-800">Closed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency:</span>
                <span className="text-red-600">24/7 Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Form */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Send us a Message</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input 
              type="text" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input 
              type="tel" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Select subject...</option>
              <option value="service">Service Inquiry</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-32"
              placeholder="Your message..."
            ></textarea>
          </div>
        </div>
        <div className="mt-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Send Message
          </button>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-red-800 mb-4">Emergency Contacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold text-red-800">Forest Fire Emergency</div>
              <div className="text-red-600 text-lg font-bold">1926</div>
              <div className="text-red-500 text-sm">24/7 Helpline</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="text-center">
              <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold text-red-800">Wildlife Emergency</div>
              <div className="text-red-600 text-lg font-bold">94234-56789</div>
              <div className="text-red-500 text-sm">WhatsApp Available</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-red-200">
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold text-red-800">Control Room</div>
              <div className="text-red-600 text-lg font-bold">0253-2311234</div>
              <div className="text-red-500 text-sm">State Forest HQ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch(activeTab) {
      case 'home': return <HomePage />;
      case 'services': return <ServicesPage />;
      case 'ranges': return <RangesPage />;
      case 'dashboard': return <DashboardPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <TreePine className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentLang.title}</h1>
                <p className="text-xs text-gray-600">{currentLang.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="mr">मराठी</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {Object.entries(currentLang.nav).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === key 
                    ? 'border-white text-white' 
                    : 'border-transparent text-green-100 hover:text-white hover:border-green-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400">RTI Portal</a></li>
                <li><a href="#" className="hover:text-green-400">Tenders</a></li>
                <li><a href="#" className="hover:text-green-400">Careers</a></li>
                <li><a href="#" className="hover:text-green-400">Downloads</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400">Tree Cutting Permission</a></li>
                <li><a href="#" className="hover:text-green-400">Forest Produce License</a></li>
                <li><a href="#" className="hover:text-green-400">Wildlife Rescue</a></li>
                <li><a href="#" className="hover:text-green-400">Plantation Certificate</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-400">Forest Policy</a></li>
                <li><a href="#" className="hover:text-green-400">Conservation Guidelines</a></li>
                <li><a href="#" className="hover:text-green-400">Research Papers</a></li>
                <li><a href="#" className="hover:text-green-400">Annual Reports</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-2 text-sm">
                <div>📧 dycfnashikeast@mahaforest.gov.in</div>
                <div>📞 09-13-2572671</div>
                <div>🏢 Trimbak Road, Nashik-422002</div>
                <div className="mt-4">
                  <span className="text-green-400 font-semibold">विकसित महाराष्ट्र 2047</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Maharashtra Forest Department. All rights reserved. | Developed under विकसित महाराष्ट्र 2047 Initiative</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MaharashtraForestPortal;