# Lab Class Quick Guide

## How to Add a Lab Class

### Step 1: Open Add Class Modal
Click the "Add Class" button in the admin dashboard.

### Step 2: Fill Theory Class Information
```
Course Code: CSE115
Section: 01
Faculty: Dr. Rezwanul Huq
Days: ST (Sun-Tue)
Time: 08:00 AM - 09:30 AM
Room: NAC501
Max Capacity: 35
```

### Step 3: Click "Add Lab Class" Button
Located at the bottom of the Add Class modal, below the "Create Entry" button.

### Step 4: Lab Modal Opens
The lab modal appears with auto-filled information:
```
Lab Course Code: CSE115L (auto-generated)
Section: 01 (inherited)
Lab Instructor: Dr. Rezwanul Huq (inherited)
Max Capacity: 35 (inherited)
```

### Step 5: Select Lab-Specific Options

**Day (Single Day)**:
- S - Sunday
- M - Monday
- T - Tuesday
- W - Wednesday
- R - Thursday
- A - Saturday

**Time (3-Hour Slots)**:
- 08:00 AM - 11:10 AM
- 09:40 AM - 12:50 PM
- 11:20 AM - 02:30 PM
- 12:50 PM - 04:10 PM
- 02:40 PM - 05:50 PM

**Lab Room**:
- Enter lab room (e.g., LAB101, LAB205)

### Step 6: Validation
The system automatically checks:
- ✅ Instructor availability
- ✅ Section availability
- ✅ Room conflicts

**Green Indicator**: Instructor is available
**Red Alert**: Instructor has a conflict

### Step 7: Submit
Click "Create Lab Class" button.

## Key Features

### Data Inheritance
- Course code automatically gets 'L' suffix
- Section number matches theory class
- Faculty pre-filled
- Capacity inherited

### Lab-Specific Options
- **Single days** instead of 2-day combinations
- **3-hour slots** instead of 1.5-hour slots
- **Lab rooms** (LAB101, LAB205, etc.)

### Visual Distinction
- **Purple/blue gradient** header
- **Flask icon** to indicate lab
- Shows "Linked to" theory course

## Examples

### Example 1: Basic Lab
```
Theory: CSE115 Section 01 (ST, 08:00-09:30, NAC501)
Lab: CSE115L Section 01 (S, 08:00-11:10, LAB101)
```

### Example 2: Different Instructor
```
Theory: CSE327 (Dr. Johnson)
Lab: CSE327L (Dr. Ahmed) ← Changed instructor
```

### Example 3: Multiple Sections
```
CSE115 Sec 01 → CSE115L Sec 01 (Sunday)
CSE115 Sec 02 → CSE115L Sec 02 (Monday)
CSE115 Sec 03 → CSE115L Sec 03 (Tuesday)
```

## Tips

1. **Always create theory class first** - Lab modal inherits data
2. **Check instructor availability** - Green = good, Red = conflict
3. **Use lab room naming** - LAB prefix helps identify lab rooms
4. **Single day selection** - Labs typically meet once per week
5. **3-hour blocks** - Standard lab duration

## Troubleshooting

### Lab Modal Not Opening
- Ensure you're creating a new class (not editing)
- Check that Add Class modal is open

### Instructor Conflict
- Choose different day or time
- Assign different instructor
- Check instructor's full schedule

### Section Already Taken
- System will suggest next available section
- Or enter custom section (11, 12, etc.)

## Quick Reference

| Aspect | Theory Class | Lab Class |
|--------|-------------|-----------|
| Days | ST, MW, RA | S, M, T, W, R, A |
| Duration | 1.5 hours | 3+ hours |
| Slots | 6 options | 5 options |
| Code | CSE115 | CSE115L |
| Theme | Gray | Purple |

## Need Help?

- See full documentation: `PHASE3_LAB_CLASS_IMPLEMENTATION.md`
- Check implementation details: `IMPLEMENTATION_SUMMARY.md`
- Review routing: `ROUTING_IMPLEMENTATION.md`
