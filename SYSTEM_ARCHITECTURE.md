# Maharashtra Forest Department - System Architecture & Data Flow

## System Overview

The Maharashtra Forest Department management system is built on a modern full-stack architecture with PostgreSQL database, Express.js backend, React frontend, and comprehensive API layer supporting real-time forest management operations.

## Architecture Components

### Database Layer (PostgreSQL)
- **Primary Database**: PostgreSQL 14+ with PostGIS extension for geospatial data
- **Connection Pool**: Neon serverless with auto-scaling
- **Data Types**: Relational tables with JSON columns for flexible metadata
- **Indexing**: B-tree and GIN indexes for optimal query performance

### Backend Layer (Node.js + Express)
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with middleware stack
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Session-based with secure cookie management
- **Validation**: Zod schemas for request/response validation

### Frontend Layer (React + TypeScript)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **State Management**: TanStack Query for server state
- **UI Components**: shadcn/ui with Tailwind CSS
- **Routing**: Wouter for lightweight client-side routing

### Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │    │   (Express)     │    │   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Dashboard   │ │◄──►│ │ API Routes  │ │◄──►│ │ Core Tables │ │
│ │ Components  │ │    │ │ /api/*      │ │    │ │ officers    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ │ ranges      │ │
│                 │    │                 │    │ │ alerts      │ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ └─────────────┘ │
│ │ Forms &     │ │◄──►│ │ Storage     │ │    │                 │
│ │ Data Entry  │ │    │ │ Interface   │ │    │ ┌─────────────┐ │
│ └─────────────┘ │    │ └─────────────┘ │    │ │ Analytics   │ │
│                 │    │                 │    │ │ Views       │ │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ └─────────────┘ │
│ │ Real-time   │ │◄──►│ │ WebSocket   │ │    │                 │
│ │ Monitoring  │ │    │ │ Server      │ │    │                 │
│ └─────────────┘ │    │ └─────────────┘ │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Data Relationships & Flow

### Core Entity Dependencies

1. **Officers → Forest Ranges**
   - One-to-many relationship (one officer can manage multiple ranges)
   - Primary assignment through `rfoId` foreign key
   - Performance tracking linked to range activities

2. **Forest Ranges → All Operations**
   - Central hub for all forest activities
   - Geographic boundary definitions with GeoJSON coordinates
   - Area calculations and forest cover statistics

3. **Range-based Activities**
   ```
   Forest Range (1) ──┬── Fire Alerts (N)
                      ├── Plantation Records (N)
                      ├── Digital Permits (N)
                      ├── Forest Statistics (N)
                      └── Vision 2047 Progress (N)
   ```

### Data Flow Patterns

#### 1. Incident Management Flow
```
External Event → Sensor Detection → Alert Creation → Officer Assignment → Response Coordination → Resolution Tracking
```

**Database Operations:**
1. Insert into `fire_alerts` table
2. Update `alertedOfficers` JSON array
3. Track `responseTime` and `status` changes
4. Link to range via `rangeId` foreign key

#### 2. Performance Evaluation Flow
```
Officer Activities → Monthly Assessment → TECH KRA Scoring → Overall Performance → Career Progression
```

**Database Operations:**
1. Aggregate activities from multiple tables
2. Calculate TECH scores (Transparency, Efficiency, Cost-effectiveness, Humane approach)
3. Insert into `officer_performance` table
4. Update `techScore` in officers table

#### 3. Vision 2047 Progress Flow
```
Range Targets → Initiative Execution → Progress Measurement → Impact Assessment → Revenue Generation
```

**Database Operations:**
1. Set targets in `vision_2047_progress` table
2. Track `currentProgress` against `forestCoverTarget`
3. Calculate `carbonCreditGenerated` from forest statistics
4. Monitor `revenueGenerated` from carbon credit sales

## Advanced Features Implementation

### AI Analytics Integration

#### Fire Risk Prediction Model
```sql
-- Data aggregation for ML model
WITH fire_history AS (
  SELECT 
    fa.range_id,
    COUNT(*) as incident_count,
    AVG(fa.response_time) as avg_response,
    fr.forest_cover,
    fs.carbon_sequestration
  FROM fire_alerts fa
  JOIN forest_ranges fr ON fa.range_id = fr.id
  JOIN forest_stats fs ON fr.id = fs.range_id
  WHERE fa.detected_at >= NOW() - INTERVAL '2 years'
  GROUP BY fa.range_id, fr.forest_cover, fs.carbon_sequestration
)
SELECT * FROM fire_history;
```

#### Deforestation Detection Pipeline
```
Satellite Data → Image Processing → Change Detection → Alert Generation → Database Update
```

**Database Impact:**
- Updates `forest_stats.forest_cover_percentage`
- Creates entries in `fire_alerts` for suspicious activities
- Triggers notifications to assigned officers

### Real-Time Monitoring System

#### IoT Sensor Network Integration
```typescript
interface SensorReading {
  sensorId: string;
  rangeId: number;
  readings: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    soilMoisture: number;
  };
  timestamp: Date;
  gpsCoordinates: [number, number];
}
```

**Database Storage:**
- Raw sensor data in dedicated `sensor_readings` table
- Aggregated metrics in `forest_stats` table
- Automated alert generation in `fire_alerts` table

### Human-Wildlife Conflict Management

#### Conflict Incident Tracking
```sql
CREATE TABLE conflict_incidents (
  id SERIAL PRIMARY KEY,
  range_id INTEGER REFERENCES forest_ranges(id),
  incident_type TEXT NOT NULL, -- crop_damage, livestock_attack, human_injury, property_damage, road_accident
  species TEXT NOT NULL,
  location_village TEXT NOT NULL,
  coordinates JSON NOT NULL,
  severity TEXT NOT NULL, -- low, medium, high, critical
  status TEXT DEFAULT 'reported', -- reported, investigating, mitigating, resolved
  reported_date TIMESTAMP DEFAULT NOW(),
  resolved_date TIMESTAMP,
  damage_assessment JSON, -- cropArea, livestockCount, propertyValue, humanCasualties
  reported_by TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  assigned_officer INTEGER REFERENCES officers(id),
  mitigation_actions JSON, -- array of action descriptions
  compensation_claimed REAL DEFAULT 0,
  compensation_approved REAL DEFAULT 0,
  compensation_disbursed REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mitigation_strategies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  strategy_type TEXT NOT NULL, -- physical_barrier, early_warning, habitat_improvement, community_engagement, technology
  effectiveness_percentage REAL NOT NULL,
  cost_per_hectare REAL NOT NULL,
  villages_covered INTEGER DEFAULT 0,
  area_covered REAL DEFAULT 0,
  implementation_status TEXT DEFAULT 'planned', -- planned, ongoing, completed
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_programs (
  id SERIAL PRIMARY KEY,
  program_name TEXT NOT NULL,
  program_type TEXT NOT NULL, -- awareness, training, livelihood, compensation
  participants_count INTEGER DEFAULT 0,
  villages_count INTEGER DEFAULT 0,
  completion_percentage REAL DEFAULT 0,
  impact_level TEXT DEFAULT 'medium', -- high, medium, low
  budget_allocated REAL DEFAULT 0,
  budget_utilized REAL DEFAULT 0,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  program_manager INTEGER REFERENCES officers(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Performance Optimization Strategies

### Database Performance

#### Query Optimization
```sql
-- Materialized view for dashboard statistics
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT 
  (SELECT AVG(forest_cover) FROM forest_ranges WHERE is_active = true) as avg_forest_cover,
  (SELECT COUNT(*) FROM officers WHERE is_active = true) as active_officers,
  (SELECT COUNT(*) FROM fire_alerts WHERE status = 'active') as active_fire_alerts,
  (SELECT SUM(saplings_planted) FROM plantation_records) as total_saplings,
  (SELECT AVG(survival_rate) FROM plantation_records WHERE survival_rate > 0) as avg_survival_rate;

-- Refresh materialized view hourly
CREATE OR REPLACE FUNCTION refresh_dashboard_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh
SELECT cron.schedule('refresh-dashboard', '0 * * * *', 'SELECT refresh_dashboard_stats();');
```

#### Indexing Strategy
```sql
-- Performance-critical indexes
CREATE INDEX CONCURRENTLY idx_fire_alerts_range_status ON fire_alerts(range_id, status) WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_permits_status_date ON permits(status, applied_date) WHERE status IN ('pending', 'under_review');
CREATE INDEX CONCURRENTLY idx_performance_officer_period ON officer_performance(officer_id, year, month);
CREATE INDEX CONCURRENTLY idx_plantation_survival ON plantation_records(range_id, survival_rate) WHERE survival_rate > 0;

-- Geospatial indexes for mapping
CREATE INDEX CONCURRENTLY idx_ranges_geo ON forest_ranges USING GIST(coordinates);
CREATE INDEX CONCURRENTLY idx_fire_geo ON fire_alerts USING GIST(coordinates);
CREATE INDEX CONCURRENTLY idx_plantation_geo ON plantation_records USING GIST(coordinates);
```

### Application Performance

#### Caching Strategy
- **Redis Cache**: Frequently accessed dashboard data (5-minute TTL)
- **Query Result Caching**: TanStack Query with 10-minute stale time
- **Static Asset CDN**: Images and documents served from edge locations

#### API Rate Limiting
```typescript
// Rate limiting configuration
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
};
```

## Security Implementation

### Data Protection (DPDP Act 2023 Compliance)

#### Personal Data Encryption
```sql
-- Encrypted PII storage
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive officer data
UPDATE officers SET 
  phone = pgp_sym_encrypt(phone, 'encryption_key'),
  whatsapp_number = pgp_sym_encrypt(whatsapp_number, 'encryption_key')
WHERE phone IS NOT NULL OR whatsapp_number IS NOT NULL;
```

#### Audit Trail Implementation
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id INTEGER NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSON,
  new_values JSON,
  changed_by INTEGER REFERENCES officers(id),
  changed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Trigger function for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log(table_name, record_id, operation, new_values)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log(table_name, record_id, operation, old_values, new_values)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log(table_name, record_id, operation, old_values)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Backup & Disaster Recovery

### Backup Strategy
```bash
# Daily automated backups
#!/bin/bash
pg_dump $DATABASE_URL | gzip > /backups/forest_db_$(date +%Y%m%d).sql.gz

# Retention policy: 30 days local, 1 year remote
find /backups -name "forest_db_*.sql.gz" -mtime +30 -delete
aws s3 sync /backups s3://forest-backup-bucket/
```

### Point-in-Time Recovery
```sql
-- Enable WAL archiving for PITR
archive_mode = on
archive_command = 'aws s3 cp %p s3://forest-wal-bucket/%f'
wal_level = replica
```

This comprehensive architecture supports all Maharashtra Forest Department operations with high performance, security, and scalability for the state's vision 2047 goals.