# Lab Class Modal - Updated

## Changes Made

### 1. Section Inheritance (LOCKED)
- **Section field is now read-only** and automatically inherits from the theory class
- Shows "(Inherited)" label to indicate it's locked
- Helper text: "Same as theory class section"
- No longer fetches available sections - section is always matched to theory class

### 2. Day Options - EXPANDED
Added 2-day combinations alongside existing single-day options:

**Single Days (existing):**
- S (Sunday)
- M (Monday)
- T (Tuesday)
- W (Wednesday)
- R (Thursday)
- A (Saturday)

**NEW - 2-Day Combinations:**
- ST (Sunday-Tuesday)
- MW (Monday-Wednesday)
- RA (Thursday-Saturday)

### 3. Time Slots - EXPANDED
Added standard time slots alongside existing 3-hour lab slots:

**3-Hour Lab Slots (existing):**
- 08:00 AM - 11:10 AM
- 09:40 AM - 12:50 PM
- 11:20 AM - 02:30 PM
- 12:50 PM - 04:10 PM
- 02:40 PM - 05:50 PM

**NEW - Standard Time Slots:**
- 08:00 AM - 09:30 AM
- 09:40 AM - 11:10 AM
- 11:20 AM - 12:50 PM
- 01:00 PM - 02:30 PM
- 02:40 PM - 04:10 PM
- 04:20 PM - 05:50 PM

## How It Works

1. **When adding a lab class:**
   - Click "Add Lab Class" button in the theory class modal
   - Lab course code is auto-generated (e.g., CSE115 → CSE115L)
   - **Section is locked** to match theory class (e.g., if theory is Section 02, lab will be Section 02)
   - Faculty is pre-filled from theory class (can be changed)
   - Capacity is inherited from theory class (can be changed)

2. **Flexibility:**
   - Choose from 6 single days OR 3 two-day combinations
   - Choose from 5 three-hour slots OR 6 standard slots
   - Change instructor if needed
   - Change room and capacity as needed

3. **Validation:**
   - Instructor availability checking still works
   - Section management is bypassed (section is locked)
   - All other validations remain active

## Example Usage

**Theory Class:**
- Course: CSE115
- Section: 03
- Faculty: Dr. Smith
- Days: ST
- Time: 08:00 AM - 09:30 AM

**Lab Class (auto-generated):**
- Course: CSE115L
- Section: 03 (locked, inherited)
- Faculty: Dr. Smith (can change)
- Days: S (choose any: S, M, T, W, R, A, ST, MW, RA)
- Time: 08:00 AM - 11:10 AM (choose any from 11 options)

## Files Modified
- `src/components/AddLabClassModal.jsx`
