# Requirements Document

## Introduction

This feature enhances the Auto Schedule Generator modal to support automatic scheduling of both theory and lab classes together. When an admin schedules a theory class through the auto-scheduler, they should be able to simultaneously schedule the linked lab class with proper room validation (lab rooms only). The feature also removes the room preference field and replaces it with an "Add Lab" button, and ensures that confirmed auto-scheduled classes (both theory and lab) are persisted to the database and displayed in the class schedule view.

## Glossary

- **Auto_Schedule_Generator**: The modal component that generates optimized class schedules based on instructor availability and preferences
- **Theory_Class**: A standard lecture class scheduled in regular classrooms
- **Lab_Class**: A practical/laboratory class that must be scheduled in designated lab rooms (e.g., LIB601, LIB602, etc.)
- **Lab_Linkage**: The association between a theory class and its corresponding lab class, sharing the same section number
- **Lab_Room**: A designated laboratory room (rooms starting with "LIB" prefix)
- **Class_Schedule_View**: The UI component displaying all scheduled classes
- **ClassItem_Table**: The database table storing all class entries

## Requirements

### Requirement 1: Lab Class Linkage in Auto Schedule Generator

**User Story:** As an admin, I want to add a lab class linked to a theory class in the Auto Schedule Generator, so that both classes are scheduled together with the same section number.

#### Acceptance Criteria

1. WHEN an admin clicks the "Add Lab" button for an instructor slot in the Auto Schedule Generator, THE Auto_Schedule_Generator SHALL display a lab configuration panel for that instructor
2. WHEN a lab class is linked to a theory class, THE Auto_Schedule_Generator SHALL automatically inherit the course code (with "L" suffix), section number, and faculty from the theory class
3. WHEN generating schedules with linked lab classes, THE Auto_Schedule_Generator SHALL schedule both theory and lab classes for each section
4. THE Auto_Schedule_Generator SHALL allow admins to specify lab-specific day and time preferences separate from theory class preferences

### Requirement 2: Room Preference Field Replacement

**User Story:** As an admin, I want the room preference field replaced with an Add Lab button, so that I can easily add lab classes without unnecessary room selection.

#### Acceptance Criteria

1. THE Auto_Schedule_Generator SHALL NOT display the "Room Preference (Optional)" dropdown field
2. THE Auto_Schedule_Generator SHALL display an "Add Lab" button in the space previously occupied by the room preference field
3. WHEN the "Add Lab" button is clicked, THE Auto_Schedule_Generator SHALL show lab configuration options for that instructor slot

### Requirement 3: Lab Room Validation

**User Story:** As an admin, I want lab classes to only be scheduled in lab rooms, so that practical sessions have appropriate facilities.

#### Acceptance Criteria

1. WHEN scheduling a lab class, THE Auto_Schedule_Generator SHALL only assign rooms that are designated as lab rooms (LIB prefix)
2. IF no lab room is available for the selected time slot, THEN THE Auto_Schedule_Generator SHALL indicate a conflict and suggest alternative times
3. THE Auto_Schedule_Generator SHALL validate that lab rooms are not double-booked for the same time slot

### Requirement 4: Schedule Confirmation and Database Persistence

**User Story:** As an admin, I want confirmed auto-scheduled classes to be saved to the database, so that they appear in the class schedule view and persist across sessions.

#### Acceptance Criteria

1. WHEN an admin clicks "Apply This Schedule" for a generated schedule option, THE Auto_Schedule_Generator SHALL save all classes (both theory and lab) to the ClassItem_Table
2. WHEN classes are saved to the database, THE Auto_Schedule_Generator SHALL use the bulk class creation API endpoint
3. WHEN classes are successfully saved, THE Class_Schedule_View SHALL immediately display the newly added classes
4. IF a database save operation fails, THEN THE Auto_Schedule_Generator SHALL display an error notification and not close the modal

### Requirement 5: Lab Class Time Slot Options

**User Story:** As an admin, I want to select appropriate lab time slots, so that lab sessions have sufficient duration for practical work.

#### Acceptance Criteria

1. THE Auto_Schedule_Generator SHALL provide lab-specific time slot options including 3-hour slots (e.g., "08:00 AM - 11:10 AM")
2. THE Auto_Schedule_Generator SHALL provide single-day options (S, M, T, W, R, A) for lab scheduling
3. WHEN a lab time slot is selected, THE Auto_Schedule_Generator SHALL validate instructor availability for that specific slot
