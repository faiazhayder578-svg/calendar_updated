# Design Document: Auto Schedule Lab Linkage

## Overview

This design extends the Auto Schedule Generator modal to support simultaneous scheduling of theory and lab classes. The enhancement replaces the room preference field with an "Add Lab" button, implements lab room validation, and ensures proper database persistence of confirmed schedules.

## Architecture

The feature follows the existing React component architecture with Flask backend API integration:

```
┌─────────────────────────────────────────────────────────────┐
│                    AIScheduleModal.jsx                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Instructor Slot Component                           │    │
│  │  ├── Instructor Name                                 │    │
│  │  ├── Course Code                                     │    │
│  │  ├── Preferred Days/Times                            │    │
│  │  ├── [Add Lab Button] ← Replaces Room Preference     │    │
│  │  └── Lab Configuration Panel (conditional)           │    │
│  │      ├── Lab Day Selection                           │    │
│  │      └── Lab Time Slot Selection                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Generated Schedule Display                          │    │
│  │  ├── Theory Classes                                  │    │
│  │  └── Lab Classes (with LIB room prefix)              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Flask)                       │
│  ├── POST /api/generate-schedule (enhanced)                 │
│  └── POST /api/classes/bulk (existing)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                         │
│  └── ClassItem table                                         │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. AIScheduleModal Component Changes

#### State Additions
```javascript
// New state for lab configuration per instructor
const [instructorAvailability, setInstructorAvailability] = useState([
  {
    id: 1,
    name: '',
    courseCode: '',
    preferredDays: [],
    availableTimes: [],
    maxSections: 3,
    // NEW: Lab configuration
    hasLab: false,
    labDays: [],
    labTimes: []
  }
]);
```

#### UI Changes
- Remove `roomPreference` field from instructor slot
- Add "Add Lab" button in its place
- Add collapsible lab configuration panel

### 2. Backend API Enhancement

#### Enhanced `/api/generate-schedule` Request
```javascript
{
  "instructors": [
    {
      "name": "Dr. Smith",
      "courseCode": "CSE327",
      "preferredDays": ["ST", "MW"],
      "availableTimes": ["08:00 AM - 09:30 AM", "09:40 AM - 11:10 AM"],
      "maxSections": 3,
      "hasLab": true,
      "labDays": ["S", "M"],
      "labTimes": ["08:00 AM - 11:10 AM", "02:40 PM - 05:50 PM"]
    }
  ],
  "totalSections": 5
}
```

#### Enhanced Response
```javascript
{
  "schedules": [
    {
      "option": 1,
      "classes": [
        {
          "courseCode": "CSE327",
          "section": "01",
          "faculty": "Dr. Smith",
          "days": "ST",
          "time": "08:00 AM - 09:30 AM",
          "room": "NAC501",
          "type": "theory"
        },
        {
          "courseCode": "CSE327L",
          "section": "01",
          "faculty": "Dr. Smith",
          "days": "S",
          "time": "08:00 AM - 11:10 AM",
          "room": "LIB601",
          "type": "lab"
        }
      ]
    }
  ]
}
```

### 3. Lab Room Configuration

```javascript
const LAB_ROOMS = [
  'LIB601', 'LIB602', 'LIB603', 'LIB604', 'LIB605',
  'LIB606', 'LIB607', 'LIB608'
];

const LAB_TIME_SLOTS = [
  // 3-hour lab slots
  '08:00 AM - 11:10 AM',
  '09:40 AM - 12:50 PM',
  '11:20 AM - 02:30 PM',
  '12:50 PM - 04:10 PM',
  '02:40 PM - 05:50 PM'
];

const LAB_DAYS = [
  { value: 'S', label: 'Sunday' },
  { value: 'M', label: 'Monday' },
  { value: 'T', label: 'Tuesday' },
  { value: 'W', label: 'Wednesday' },
  { value: 'R', label: 'Thursday' },
  { value: 'A', label: 'Saturday' }
];
```

## Data Models

### Instructor Slot Model (Frontend)
```typescript
interface InstructorSlot {
  id: number;
  name: string;
  courseCode: string;
  preferredDays: string[];
  availableTimes: string[];
  maxSections: number;
  // Lab configuration
  hasLab: boolean;
  labDays: string[];
  labTimes: string[];
}
```

### Generated Class Model
```typescript
interface GeneratedClass {
  courseCode: string;
  section: string;
  faculty: string;
  days: string;
  time: string;
  room: string;
  type: 'theory' | 'lab';
  rationale?: string;
}
```

### ClassItem Database Model (Existing)
```python
class ClassItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    courseCode = db.Column(db.String(50), nullable=False)
    section = db.Column(db.String(20), nullable=False)
    faculty = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(50), nullable=False)
    days = db.Column(db.String(50), nullable=False)
    maxCapacity = db.Column(db.Integer, default=35)
    enrolled = db.Column(db.Integer, default=0)
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Lab Class Data Inheritance
*For any* theory class with lab linkage enabled, the generated lab class SHALL have:
- courseCode equal to theory courseCode + "L" suffix
- section equal to theory section
- faculty equal to theory faculty

**Validates: Requirements 1.2**

### Property 2: Schedule Completeness for Linked Classes
*For any* instructor slot with `hasLab: true`, the generated schedule SHALL contain exactly one lab class for each theory class section assigned to that instructor.

**Validates: Requirements 1.3**

### Property 3: Lab Room Type Constraint
*For any* generated lab class (where type === 'lab'), the assigned room SHALL have a "LIB" prefix.

**Validates: Requirements 3.1**

### Property 4: No Room Double-Booking
*For any* generated schedule, no two classes SHALL have the same combination of (room, days, time).

**Validates: Requirements 3.3**

### Property 5: Schedule Persistence Round-Trip
*For any* schedule that is applied via "Apply This Schedule", querying the ClassItem table SHALL return all classes from that schedule with matching courseCode, section, faculty, days, time, and room values.

**Validates: Requirements 4.1**

### Property 6: Lab Instructor Availability Validation
*For any* lab class in a generated schedule, the assigned faculty SHALL NOT have another class (theory or lab) at the same day and overlapping time.

**Validates: Requirements 5.3**

## Error Handling

### Lab Room Unavailability
When no lab room is available for a requested time slot:
1. Mark the lab class as "UNASSIGNED" with room "TBD"
2. Set `conflict: true` on the schedule option
3. Include conflict message: "Could not schedule lab for section X - no lab rooms available"

### Database Save Failure
When bulk class creation fails:
1. Display error notification with API error message
2. Keep modal open
3. Do not update local state with unsaved classes

### Instructor Conflict
When instructor has overlapping theory and lab times:
1. Prioritize theory class scheduling
2. Attempt alternative lab time slots
3. If no valid slot found, mark lab as conflict

## Testing Strategy

### Unit Tests
- Test lab course code generation (courseCode + "L")
- Test lab room filtering (LIB prefix only)
- Test instructor availability checking for lab slots
- Test UI state changes when "Add Lab" is clicked

### Property-Based Tests
Using a property-based testing library (e.g., fast-check for JavaScript):

1. **Lab Data Inheritance Property Test**
   - Generate random theory class data
   - Verify lab class inherits correct values
   - Minimum 100 iterations

2. **Schedule Completeness Property Test**
   - Generate random instructor configurations with hasLab
   - Verify each theory section has corresponding lab
   - Minimum 100 iterations

3. **Lab Room Constraint Property Test**
   - Generate random schedules with lab classes
   - Verify all lab rooms have LIB prefix
   - Minimum 100 iterations

4. **No Double-Booking Property Test**
   - Generate random schedules
   - Verify no room/day/time collisions
   - Minimum 100 iterations

5. **Persistence Round-Trip Property Test**
   - Generate random schedule data
   - Save via API, query back
   - Verify data integrity
   - Minimum 100 iterations

6. **Instructor Availability Property Test**
   - Generate random instructor schedules
   - Verify no time overlaps for same instructor
   - Minimum 100 iterations

### Integration Tests
- Test full flow: configure → generate → apply → verify in schedule view
- Test error handling when API fails
- Test conflict detection and display
