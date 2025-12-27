/**
 * Property-Based Test: Schedule Persistence Round-Trip
 * 
 * Feature: auto-schedule-lab-linkage
 * Property 5: Schedule Persistence Round-Trip
 * 
 * *For any* schedule that is applied via "Apply This Schedule", querying the 
 * ClassItem table SHALL return all classes from that schedule with matching 
 * courseCode, section, faculty, days, time, and room values.
 * 
 * **Validates: Requirements 4.1**
 */

import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import * as fc from 'fast-check';

const BASE_URL = 'http://localhost:5000';

// Check if backend is available
async function isBackendAvailable() {
  try {
    const response = await fetch(`${BASE_URL}/api/classes`, { 
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Test data prefix to identify test-generated data for cleanup
const TEST_PREFIX = 'TEST_';

// Arbitrary generators for schedule data - using TEST_ prefix for easy identification
const courseCodeArb = fc.stringMatching(/^[A-Z]{2,4}[0-9]{3}L?$/).map(code => TEST_PREFIX + code);
const sectionArb = fc.integer({ min: 1, max: 99 }).map(n => n.toString().padStart(2, '0'));
const facultyArb = fc.stringMatching(/^Dr\. [A-Z][a-z]+ [A-Z][a-z]+$/);

const daysArb = fc.constantFrom('ST', 'MW', 'RA', 'S', 'M', 'T', 'W', 'R', 'A');

const timeArb = fc.constantFrom(
  '08:00 AM - 09:30 AM',
  '09:40 AM - 11:10 AM',
  '11:20 AM - 12:50 PM',
  '01:00 PM - 02:30 PM',
  '02:40 PM - 04:10 PM',
  '08:00 AM - 11:10 AM',
  '02:40 PM - 05:50 PM'
);

const theoryRoomArb = fc.constantFrom(
  'NAC210', 'NAC302', 'NAC411', 'NAC510', 'NAC612',
  'SAC201', 'SAC304', 'SAC402', 'SAC505'
);

const labRoomArb = fc.constantFrom(
  'LIB601', 'LIB602', 'LIB603', 'LIB604', 'LIB605',
  'LIB606', 'LIB607', 'LIB608'
);

// Generate a valid class item for persistence
const classItemArb = fc.record({
  courseCode: courseCodeArb,
  section: sectionArb,
  faculty: facultyArb,
  days: daysArb,
  time: timeArb,
  room: fc.oneof(theoryRoomArb, labRoomArb),
  maxCapacity: fc.integer({ min: 20, max: 50 }),
  enrolled: fc.integer({ min: 0, max: 20 })
});

// Generate a list of 1-5 class items (small to keep tests fast)
const scheduleArb = fc.array(classItemArb, { minLength: 1, maxLength: 5 });

// Helper to clean up test data
async function deleteClassById(id) {
  try {
    await fetch(`${BASE_URL}/api/classes/${id}`, { method: 'DELETE' });
  } catch {
    // Ignore cleanup errors
  }
}

// Track created class IDs for cleanup
let createdClassIds = [];

describe('Schedule Persistence Round-Trip Property Test', () => {
  let backendAvailable = false;

  beforeAll(async () => {
    backendAvailable = await isBackendAvailable();
    if (!backendAvailable) {
      console.warn('⚠️ Backend server not available at localhost:5000. Start the backend to run this test.');
    } else {
      // Clean up any leftover test data from previous runs
      await cleanupTestData();
    }
  });

  // Clean up test data (anything with TEST_ prefix)
  async function cleanupTestData() {
    try {
      const response = await fetch(`${BASE_URL}/api/classes`);
      if (response.ok) {
        const allClasses = await response.json();
        const testClasses = allClasses.filter(c => c.courseCode && c.courseCode.startsWith(TEST_PREFIX));
        for (const cls of testClasses) {
          await deleteClassById(cls.id);
        }
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  // Clean up after each test
  afterEach(async () => {
    if (backendAvailable) {
      for (const id of createdClassIds) {
        await deleteClassById(id);
      }
    }
    createdClassIds = [];
  });

  /**
   * Property 5: Schedule Persistence Round-Trip
   * 
   * For any schedule that is applied via "Apply This Schedule", querying the 
   * ClassItem table SHALL return all classes from that schedule with matching 
   * courseCode, section, faculty, days, time, and room values.
   * 
   * **Validates: Requirements 4.1**
   */
  it('Property 5: Schedule data persists correctly through save and retrieve cycle', async () => {
    if (!backendAvailable) {
      console.log('Skipping test - backend not available');
      return;
    }

    await fc.assert(
      fc.asyncProperty(scheduleArb, async (schedule) => {
        // Step 1: Save the schedule via bulk API
        const saveResponse = await fetch(`${BASE_URL}/api/classes/bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(schedule)
        });

        // Verify save was successful
        expect(saveResponse.ok).toBe(true);
        
        const savedClasses = await saveResponse.json();
        
        // Track IDs for cleanup
        createdClassIds = savedClasses.map(c => c.id);

        // Step 2: Retrieve all classes from the database
        const getResponse = await fetch(`${BASE_URL}/api/classes`);
        expect(getResponse.ok).toBe(true);
        
        const allClasses = await getResponse.json();

        // Step 3: Verify each saved class can be found with matching data
        for (const originalClass of schedule) {
          const matchingClass = allClasses.find(c => 
            c.courseCode === originalClass.courseCode &&
            c.section === originalClass.section &&
            c.faculty === originalClass.faculty &&
            c.days === originalClass.days &&
            c.time === originalClass.time &&
            c.room === originalClass.room
          );

          // The class should exist in the database with matching fields
          expect(matchingClass).toBeDefined();
          expect(matchingClass.courseCode).toBe(originalClass.courseCode);
          expect(matchingClass.section).toBe(originalClass.section);
          expect(matchingClass.faculty).toBe(originalClass.faculty);
          expect(matchingClass.days).toBe(originalClass.days);
          expect(matchingClass.time).toBe(originalClass.time);
          expect(matchingClass.room).toBe(originalClass.room);
        }

        // Step 4: Verify the count of saved classes matches
        const savedCount = savedClasses.length;
        expect(savedCount).toBe(schedule.length);

        // Cleanup: Delete created classes before next iteration
        for (const id of createdClassIds) {
          await deleteClassById(id);
        }
        createdClassIds = [];

        return true;
      }),
      { 
        numRuns: 100,
        verbose: false 
      }
    );
  }, 120000); // 2 minute timeout for 100 iterations
});
