# Maharashtra Forest Department - Database Schema Mapping

## Overview
The system uses PostgreSQL with Drizzle ORM for type-safe database operations. All tables are interconnected through foreign key relationships to maintain data integrity and enable comprehensive forest management.

## Core Entity Relationships

```
officers (1) ←→ (N) forestRanges (rfoId)
forestRanges (1) ←→ (N) fireAlerts (rangeId)
forestRanges (1) ←→ (N) plantationRecords (rangeId)
forestRanges (1) ←→ (N) permits (rangeId)
forestRanges (1) ←→ (N) forestStats (rangeId)
forestRanges (1) ←→ (N) vision2047Progress (rangeId)
officers (1) ←→ (N) permits (processedBy)
officers (1) ←→ (N) officerPerformance (officerId)
```

## Table Structures

### 1. Officers Table
**Purpose**: Forest department personnel management
```sql
CREATE TABLE officers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    designation TEXT NOT NULL,
    range TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    whatsapp_number TEXT,
    circle TEXT NOT NULL,
    headquarters TEXT,
    is_active BOOLEAN DEFAULT true,
    tech_score REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Fields**:
- `id`: Primary key, auto-increment
- `email`: Unique identifier for authentication
- `tech_score`: TECH KRA performance metric (0-100)
- `circle`: Administrative forest circle assignment
- `range`: Specific forest range responsibility

### 2. Forest Ranges Table
**Purpose**: Geographic forest area management
```sql
CREATE TABLE forest_ranges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    circle TEXT NOT NULL,
    area REAL NOT NULL,
    forest_cover REAL NOT NULL,
    coordinates JSON,
    rfo_id INTEGER REFERENCES officers(id),
    headquarters TEXT,
    is_active BOOLEAN DEFAULT true
);
```

**Key Fields**:
- `area`: Total area in square kilometers
- `forest_cover`: Forest coverage percentage
- `coordinates`: GeoJSON polygon data for mapping
- `rfo_id`: Range Forest Officer assignment

### 3. Fire Alerts Table
**Purpose**: Forest fire incident tracking
```sql
CREATE TABLE fire_alerts (
    id SERIAL PRIMARY KEY,
    range_id INTEGER REFERENCES forest_ranges(id) NOT NULL,
    location TEXT NOT NULL,
    coordinates JSON,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    detected_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    response_time INTEGER,
    alerted_officers JSON
);
```

**Key Fields**:
- `severity`: 'low', 'medium', 'high', 'critical'
- `status`: 'active', 'resolved', 'investigating'
- `response_time`: Response time in minutes
- `alerted_officers`: Array of officer IDs notified

### 4. Plantation Records Table
**Purpose**: Tree plantation and survival tracking
```sql
CREATE TABLE plantation_records (
    id SERIAL PRIMARY KEY,
    range_id INTEGER REFERENCES forest_ranges(id) NOT NULL,
    species TEXT NOT NULL,
    saplings_planted INTEGER NOT NULL,
    survival_count INTEGER DEFAULT 0,
    survival_rate REAL DEFAULT 0,
    planted_date TIMESTAMP NOT NULL,
    last_survey_date TIMESTAMP,
    coordinates JSON,
    notes TEXT
);
```

**Key Fields**:
- `survival_rate`: Calculated percentage (survival_count/saplings_planted)
- `coordinates`: GeoJSON point data for plantation location
- `species`: Native/exotic species classification

### 5. Digital Permits Table
**Purpose**: Forest permit application management
```sql
CREATE TABLE permits (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    applicant_name TEXT NOT NULL,
    applicant_contact TEXT NOT NULL,
    range_id INTEGER REFERENCES forest_ranges(id) NOT NULL,
    status TEXT DEFAULT 'pending',
    description TEXT NOT NULL,
    documents JSON,
    applied_date TIMESTAMP DEFAULT NOW(),
    processed_date TIMESTAMP,
    processed_by INTEGER REFERENCES officers(id),
    validity_period INTEGER,
    fees REAL DEFAULT 0
);
```

**Key Fields**:
- `type`: 'tree_cutting', 'forest_produce', 'wildlife_rescue', 'research'
- `status`: 'pending', 'under_review', 'approved', 'rejected'
- `documents`: Array of uploaded document URLs
- `validity_period`: Permit validity in days

### 6. Forest Statistics Table
**Purpose**: Comprehensive forest health metrics
```sql
CREATE TABLE forest_stats (
    id SERIAL PRIMARY KEY,
    range_id INTEGER REFERENCES forest_ranges(id),
    stat_date TIMESTAMP DEFAULT NOW(),
    forest_cover_percentage REAL NOT NULL,
    total_area REAL NOT NULL,
    dense_forest_area REAL DEFAULT 0,
    medium_forest_area REAL DEFAULT 0,
    open_forest_area REAL DEFAULT 0,
    carbon_sequestration REAL DEFAULT 0,
    biodiversity_index REAL DEFAULT 0
);
```

**Key Fields**:
- `carbon_sequestration`: Carbon storage in tons
- `biodiversity_index`: Calculated biodiversity metric (0-1)
- Forest density classification (dense/medium/open)

### 7. Vision 2047 Progress Table
**Purpose**: Maharashtra 2047 vision tracking
```sql
CREATE TABLE vision_2047_progress (
    id SERIAL PRIMARY KEY,
    range_id INTEGER REFERENCES forest_ranges(id),
    target_year INTEGER NOT NULL,
    forest_cover_target REAL NOT NULL,
    current_progress REAL DEFAULT 0,
    initiatives_completed INTEGER DEFAULT 0,
    total_initiatives INTEGER NOT NULL,
    carbon_credit_generated REAL DEFAULT 0,
    revenue_generated REAL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);
```

**Key Fields**:
- `target_year`: Milestone years (2029, 2035, 2047)
- `forest_cover_target`: Target forest coverage percentage
- `carbon_credit_generated`: Carbon credits earned (tons CO2)
- `revenue_generated`: Revenue from carbon credits (INR)

### 8. Officer Performance Table
**Purpose**: TECH KRA performance evaluation
```sql
CREATE TABLE officer_performance (
    id SERIAL PRIMARY KEY,
    officer_id INTEGER REFERENCES officers(id) NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    transparency_score REAL DEFAULT 0,
    efficiency_score REAL DEFAULT 0,
    cost_effectiveness_score REAL DEFAULT 0,
    humane_approach_score REAL DEFAULT 0,
    overall_score REAL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Fields**:
- TECH KRA components: Transparency, Efficiency, Cost-effectiveness, Humane approach
- All scores range from 0-100
- `overall_score`: Weighted average of TECH components

## Data Flow Architecture

### 1. Authentication & Authorization
```
User Login → Officer Verification → Role-based Access → Module Permissions
```

### 2. Forest Management Workflow
```
Range Assignment → Statistical Monitoring → Alert Generation → Response Coordination
```

### 3. Performance Tracking
```
Officer Actions → KRA Evaluation → Performance Scoring → Report Generation
```

### 4. Vision 2047 Tracking
```
Target Setting → Initiative Execution → Progress Monitoring → Impact Assessment
```

## Advanced Features Integration

### AI Analytics Data Sources
- **Fire Prediction**: Historical fire_alerts + weather data + forest_stats
- **Biodiversity Monitoring**: plantation_records + forest_stats + species data
- **Carbon Credit Estimation**: forest_stats.carbon_sequestration + vision_2047_progress

### Real-Time Monitoring
- **IoT Sensor Data**: Integrated with fire_alerts for early detection
- **Satellite Imagery**: Processed for forest_stats updates
- **Mobile App Integration**: Field officer data collection

### Human-Wildlife Conflict (Proposed Extension)
```sql
-- Additional tables for HWC management
CREATE TABLE conflict_incidents (
    id SERIAL PRIMARY KEY,
    range_id INTEGER REFERENCES forest_ranges(id),
    incident_type TEXT NOT NULL, -- crop_damage, livestock_attack, human_injury
    species TEXT NOT NULL,
    location_details JSON,
    severity TEXT NOT NULL,
    status TEXT DEFAULT 'reported',
    reported_date TIMESTAMP DEFAULT NOW(),
    compensation_amount REAL DEFAULT 0,
    mitigation_actions JSON,
    assigned_officer INTEGER REFERENCES officers(id)
);
```

## Performance Optimization

### Indexing Strategy
```sql
-- Primary performance indexes
CREATE INDEX idx_fire_alerts_range_status ON fire_alerts(range_id, status);
CREATE INDEX idx_permits_status_date ON permits(status, applied_date);
CREATE INDEX idx_performance_officer_year ON officer_performance(officer_id, year, month);
CREATE INDEX idx_plantation_range_date ON plantation_records(range_id, planted_date);

-- Geospatial indexes for mapping
CREATE INDEX idx_ranges_coordinates ON forest_ranges USING GIN(coordinates);
CREATE INDEX idx_fire_coordinates ON fire_alerts USING GIN(coordinates);
```

### Query Optimization Patterns
1. **Dashboard Statistics**: Aggregated queries with range-level grouping
2. **Performance Reports**: Time-series analysis with monthly/yearly partitioning
3. **Geospatial Queries**: Efficient coordinate-based filtering for map displays
4. **Vision 2047 Progress**: Progressive milestone tracking with trend analysis

## Data Integrity Constraints

### Business Logic Constraints
- Forest cover percentage must be between 0-100
- Survival rate cannot exceed 100%
- Officer performance scores range 0-100
- Permit validity periods are positive integers
- Fire alert response times are non-negative

### Referential Integrity
- All range-related records must reference valid forest_ranges
- Permit processing requires valid officer assignment
- Performance records linked to active officers only
- Vision 2047 progress tied to specific ranges

## Security & Compliance

### Data Protection (DPDP Act 2023)
- Personal data encryption for officer contact information
- Audit trails for all data modifications
- Role-based access control implementation
- Data retention policies for different record types

### Backup & Recovery
- Daily automated backups with 30-day retention
- Point-in-time recovery capabilities
- Disaster recovery with geographical replication
- Data export capabilities for compliance reporting

This database schema supports the complete Maharashtra Forest Department management system with comprehensive tracking, performance evaluation, and vision 2047 progress monitoring capabilities.