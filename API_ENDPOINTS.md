# Maharashtra Forest Department - API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

## Authentication Endpoints

### POST /auth/login
Login forest department officer
```json
Request:
{
  "email": "officer@forest.gov.in",
  "password": "securePassword"
}

Response:
{
  "success": true,
  "officer": {
    "id": 1,
    "name": "श्री राज पाटील",
    "designation": "Range Forest Officer",
    "range": "Nashik Range"
  }
}
```

## Core Data Endpoints

### Officers Management

#### GET /api/officers
Retrieve all forest officers
```json
Response: [
  {
    "id": 1,
    "name": "श्री मिलद म्हैसकर",
    "designation": "Range Forest Officer",
    "range": "Nashik Range",
    "circle": "Nashik Circle",
    "email": "rfo.nashik@maharashtra.gov.in",
    "phone": "+91-9876543210",
    "whatsappNumber": "+91-9876543210",
    "headquarters": "Nashik",
    "isActive": true,
    "techScore": 85.5,
    "createdAt": "2024-01-15T09:00:00Z"
  }
]
```

#### GET /api/officers/:id
Retrieve specific officer details

#### POST /api/officers
Create new officer
```json
Request:
{
  "name": "श्री नरेश कुमार",
  "designation": "Assistant Conservator of Forests",
  "range": "Yeola Range",
  "circle": "Nashik Circle",
  "email": "acf.yeola@maharashtra.gov.in",
  "phone": "+91-9876543211",
  "headquarters": "Yeola"
}
```

### Forest Ranges Management

#### GET /api/forest-ranges
Retrieve all forest ranges
```json
Response: [
  {
    "id": 1,
    "name": "Nashik Range",
    "circle": "Nashik Circle",
    "area": 1250.75,
    "forestCover": 68.2,
    "coordinates": {
      "type": "Polygon",
      "coordinates": [[[73.7898, 19.9975], [74.1234, 20.1234], ...]]
    },
    "rfoId": 1,
    "headquarters": "Nashik",
    "isActive": true
  }
]
```

#### GET /api/forest-ranges/:id
Retrieve specific range details

### Fire Alerts Management

#### GET /api/fire-alerts
Retrieve all fire alerts
```json
Response: [
  {
    "id": 1,
    "rangeId": 1,
    "location": "Trimbak Forest Area",
    "coordinates": {
      "type": "Point",
      "coordinates": [73.5287, 19.9327]
    },
    "severity": "high",
    "status": "active",
    "detectedAt": "2024-06-07T14:30:00Z",
    "resolvedAt": null,
    "responseTime": null,
    "alertedOfficers": [1, 2, 3]
  }
]
```

#### GET /api/fire-alerts/active
Retrieve only active fire alerts

#### POST /api/fire-alerts
Create new fire alert
```json
Request:
{
  "rangeId": 1,
  "location": "Brahmagiri Hills",
  "coordinates": {
    "type": "Point",
    "coordinates": [73.4567, 19.8901]
  },
  "severity": "medium",
  "alertedOfficers": [1, 2]
}
```

#### PATCH /api/fire-alerts/:id
Update fire alert status
```json
Request:
{
  "status": "resolved",
  "resolvedAt": "2024-06-07T18:45:00Z",
  "responseTime": 255
}
```

### Plantation Records

#### GET /api/plantation-records
Retrieve all plantation records

#### GET /api/plantation-records/range/:rangeId
Retrieve plantation records for specific range

#### POST /api/plantation-records
Create new plantation record
```json
Request:
{
  "rangeId": 1,
  "species": "Teak (Tectona grandis)",
  "saplingsPlanted": 5000,
  "plantedDate": "2024-03-15T00:00:00Z",
  "coordinates": {
    "type": "Polygon",
    "coordinates": [[[73.7898, 19.9975], ...]]
  },
  "notes": "Monsoon plantation drive 2024"
}
```

### Digital Permits

#### GET /api/permits
Retrieve all permits

#### GET /api/permits/status/:status
Retrieve permits by status (pending, approved, rejected)

#### POST /api/permits
Submit new permit application
```json
Request:
{
  "type": "tree_cutting",
  "applicantName": "Maharashtra State Road Development Corporation",
  "applicantContact": "+91-9876543212",
  "rangeId": 1,
  "description": "Tree cutting for highway expansion project NH-160",
  "documents": ["doc1.pdf", "doc2.pdf"],
  "validityPeriod": 180,
  "fees": 25000
}
```

#### PATCH /api/permits/:id
Process permit application
```json
Request:
{
  "status": "approved",
  "processedBy": 1,
  "processedDate": "2024-06-07T16:30:00Z"
}
```

### Forest Statistics

#### GET /api/forest-stats
Retrieve forest statistics

#### GET /api/forest-stats/range/:rangeId
Retrieve statistics for specific range

#### POST /api/forest-stats
Record new forest statistics
```json
Request:
{
  "rangeId": 1,
  "forestCoverPercentage": 68.5,
  "totalArea": 1250.75,
  "denseForestArea": 450.25,
  "mediumForestArea": 380.50,
  "openForestArea": 270.00,
  "carbonSequestration": 12500.75,
  "biodiversityIndex": 0.78
}
```

### Vision 2047 Progress

#### GET /api/vision-2047-progress
Retrieve all vision 2047 progress data

#### GET /api/vision-2047-progress/range/:rangeId
Retrieve progress for specific range

#### POST /api/vision-2047-progress
Record new progress data
```json
Request:
{
  "rangeId": 1,
  "targetYear": 2029,
  "forestCoverTarget": 75.0,
  "currentProgress": 68.5,
  "initiativesCompleted": 45,
  "totalInitiatives": 120,
  "carbonCreditGenerated": 2500.50,
  "revenueGenerated": 12500000
}
```

### Officer Performance (TECH KRAs)

#### GET /api/officer-performance
Retrieve all performance records

#### GET /api/officer-performance/officer/:officerId
Retrieve performance for specific officer

#### POST /api/officer-performance
Record monthly performance
```json
Request:
{
  "officerId": 1,
  "month": 6,
  "year": 2024,
  "transparencyScore": 88.5,
  "efficiencyScore": 92.0,
  "costEffectivenessScore": 85.5,
  "humaneApproachScore": 90.0,
  "overallScore": 89.0,
  "notes": "Excellent performance in digital transformation initiatives"
}
```

## Dashboard Analytics

#### GET /api/dashboard-stats
Comprehensive dashboard statistics
```json
Response:
{
  "forestCoverPercentage": 21.61,
  "totalRanges": 12,
  "activeOfficers": 45,
  "totalSaplingsPlanted": 2500000,
  "overallSurvivalRate": 82.5,
  "activeFireAlerts": 3,
  "pendingPermits": 28,
  "carbonCreditsGenerated": 15000.75,
  "vision2047Progress": {
    "2029": {
      "target": 25.0,
      "current": 21.61,
      "progressPercentage": 86.4
    },
    "2035": {
      "target": 30.0,
      "current": 21.61,
      "progressPercentage": 72.0
    },
    "2047": {
      "target": 35.0,
      "current": 21.61,
      "progressPercentage": 61.7
    }
  }
}
```

## Advanced Analytics Endpoints

### AI Analytics

#### GET /api/ai-analytics/fire-risk
Fire risk prediction analysis
```json
Response:
{
  "overallRiskLevel": "medium",
  "highRiskRanges": [
    {
      "rangeId": 1,
      "name": "Nashik Range",
      "riskScore": 78.5,
      "factors": ["dry_weather", "high_temperature", "wind_speed"]
    }
  ],
  "prediction": {
    "nextWeekRisk": "high",
    "confidence": 94.2
  }
}
```

#### GET /api/ai-analytics/deforestation
Deforestation detection results

#### GET /api/ai-analytics/carbon-estimation
Carbon sequestration estimates

### Real-Time Monitoring

#### GET /api/monitoring/sensors
IoT sensor network status
```json
Response:
{
  "totalSensors": 150,
  "activeSensors": 147,
  "sensorData": [
    {
      "sensorId": "TEMP_001",
      "rangeId": 1,
      "type": "temperature",
      "value": 42.5,
      "unit": "°C",
      "timestamp": "2024-06-07T15:30:00Z",
      "status": "normal"
    },
    {
      "sensorId": "HUMID_001",
      "rangeId": 1,
      "type": "humidity",
      "value": 25.5,
      "unit": "%",
      "timestamp": "2024-06-07T15:30:00Z",
      "status": "low"
    }
  ]
}
```

#### GET /api/monitoring/satellite
Satellite imagery analysis results

#### GET /api/monitoring/alerts
Real-time automated alerts

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  }
}
```

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting
- 1000 requests per hour per IP
- 100 requests per minute for data modification endpoints
- No limit for dashboard and read-only endpoints

## Data Validation Rules

### Officers
- Email must be unique and follow government domain pattern
- Phone numbers must be valid Indian mobile numbers
- Tech scores range from 0-100

### Forest Ranges
- Area must be positive value in square kilometers
- Forest cover percentage between 0-100
- Coordinates must be valid GeoJSON

### Fire Alerts
- Severity: one of ['low', 'medium', 'high', 'critical']
- Status: one of ['active', 'resolved', 'investigating']
- Response time must be positive integer (minutes)

### Permits
- Type: one of ['tree_cutting', 'forest_produce', 'wildlife_rescue', 'research']
- Status: one of ['pending', 'under_review', 'approved', 'rejected']
- Validity period must be positive integer (days)
- Fees must be non-negative value

This API documentation provides complete access to all Maharashtra Forest Department system functionality with proper validation and error handling.