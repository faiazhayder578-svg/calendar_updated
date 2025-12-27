# Implementation Plan: Auto Schedule Lab Linkage

## Overview

This implementation plan covers enhancing the Auto Schedule Generator modal to support theory-lab class linkage, replacing the room preference field with an Add Lab button, implementing lab room validation, and ensuring database persistence of confirmed schedules.

## Tasks

- [x] 1. Update AIScheduleModal state and data model
  - [x] 1.1 Add lab configuration fields to instructor slot state
    - Add `hasLab`, `labDays`, `labTimes` fields to instructor availability state
    - Remove `roomPreference` field from state
    - _Requirements: 1.1, 2.1_

  - [ ]* 1.2 Write property test for lab data inheritance
    - **Property 1: Lab Class Data Inheritance**
    - **Validates: Requirements 1.2**

- [x] 2. Implement UI changes for lab configuration
  - [x] 2.1 Remove room preference dropdown and add "Add Lab" button
    - Remove the Room Preference select element
    - Add "Add Lab" button with FlaskConical icon in its place
    - Style button to match existing UI patterns
    - _Requirements: 2.1, 2.2_

  - [x] 2.2 Create lab configuration panel component
    - Add collapsible panel that shows when "Add Lab" is clicked
    - Include lab day selection (single days: S, M, T, W, R, A)
    - Include lab time slot selection (3-hour slots)
    - Add toggle to enable/disable lab for instructor
    - _Requirements: 1.1, 1.4, 2.3, 5.1, 5.2_

- [x] 3. Checkpoint - Verify UI changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Enhance backend schedule generation
  - [x] 4.1 Update generate-schedule endpoint to handle lab classes
    - Parse `hasLab`, `labDays`, `labTimes` from instructor data
    - Generate lab classes with courseCode + "L" suffix
    - Assign same section number as theory class
    - _Requirements: 1.2, 1.3_

  - [x] 4.2 Implement lab room assignment logic
    - Define LAB_ROOMS array with LIB-prefixed rooms
    - Only assign lab rooms to lab classes
    - Track lab room availability separately
    - _Requirements: 3.1, 3.3_

  - [ ]* 4.3 Write property test for lab room constraint
    - **Property 3: Lab Room Type Constraint**
    - **Validates: Requirements 3.1**

  - [ ]* 4.4 Write property test for no double-booking
    - **Property 4: No Room Double-Booking**
    - **Validates: Requirements 3.3**

- [x] 5. Checkpoint - Verify backend changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement schedule application and persistence
  - [x] 6.1 Update handleApplySchedule to save to database
    - Call bulk class creation API with all generated classes
    - Handle both theory and lab classes in single request
    - Update local state only after successful API response
    - _Requirements: 4.1, 4.2_

  - [x] 6.2 Implement error handling for save failures
    - Display error notification on API failure
    - Keep modal open on failure
    - Show specific error message from API
    - _Requirements: 4.4_

  - [x] 6.3 Ensure schedule view updates after save
    - Trigger refresh of class list after successful save
    - Verify new classes appear in ScheduleView component
    - _Requirements: 4.3_

  - [x] 6.4 Write property test for persistence round-trip

    - **Property 5: Schedule Persistence Round-Trip**
    - **Validates: Requirements 4.1**

- [x] 7. Implement instructor availability validation for labs
  - [x] 7.1 Add lab time conflict checking
    - Check instructor doesn't have theory class during lab time
    - Check instructor doesn't have another lab at same time
    - Handle overlapping time slots (3-hour labs vs 1.5-hour theory)
    - _Requirements: 5.3_

  - [ ]* 7.2 Write property test for instructor availability
    - **Property 6: Lab Instructor Availability Validation**
    - **Validates: Requirements 5.3**

- [x] 8. Final checkpoint - Full integration verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
