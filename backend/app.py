from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import time
import json
import PyPDF2
import re
import secrets

app = Flask(__name__)

# CORS configuration with explicit settings
CORS(app, 
     supports_credentials=True,
     origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000", "http://127.0.0.1:5000"],
     allow_headers=["Content-Type"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///scheduler.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # Set to True in production with HTTPS
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = 3600  # 1 hour session lifetime

# File upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy(app)

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    return response

class AdminUser(db.Model):
    __tablename__ = 'admin_user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def set_password(self, password):
        """Hash and set the password"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify password against hash"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Return safe dictionary without password"""
        return {
            "id": self.id,
            "username": self.username,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class InstructorTimetable(db.Model):
    __tablename__ = 'instructor_timetable'
    id = db.Column(db.Integer, primary_key=True)
    instructor_name = db.Column(db.String(100), nullable=False)
    days = db.Column(db.String(50), nullable=False)
    time_slot = db.Column(db.String(50), nullable=False)
    course_code = db.Column(db.String(50), nullable=True)
    section = db.Column(db.String(20), nullable=True)
    room = db.Column(db.String(50), nullable=True)
    is_available = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def to_dict(self):
        return {
            "id": self.id,
            "instructorName": self.instructor_name,
            "days": self.days,
            "timeSlot": self.time_slot,
            "courseCode": self.course_code,
            "section": self.section,
            "room": self.room,
            "isAvailable": self.is_available,
            "createdAt": self.created_at.isoformat() if self.created_at else None
        }

class InstructorPreference(db.Model):
    """Stores instructor availability preferences - editable via database"""
    __tablename__ = 'instructor_preference'
    id = db.Column(db.Integer, primary_key=True)
    initials = db.Column(db.String(10), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    preferable_courses = db.Column(db.String(255), nullable=True)  # Comma-separated course codes
    preferable_times = db.Column(db.String(255), nullable=True)    # Comma-separated time codes (ST1, MW2, etc.)
    created_at = db.Column(db.String(50), nullable=True)  # Changed to String to handle empty values
    updated_at = db.Column(db.String(50), nullable=True)  # Changed to String to handle empty values

    def to_dict(self):
        return {
            "id": self.id,
            "initials": self.initials,
            "fullName": self.full_name,
            "preferableCourses": self.preferable_courses or "",
            "preferableTimes": [t.strip() for t in (self.preferable_times or "").split(",") if t.strip()],
            "createdAt": self.created_at if self.created_at else None,
            "updatedAt": self.updated_at if self.updated_at else None
        }

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

    def to_dict(self):
        return {
            "id": self.id,
            "courseCode": self.courseCode,
            "section": self.section,
            "faculty": self.faculty,
            "room": self.room,
            "time": self.time,
            "days": self.days,
            "maxCapacity": self.maxCapacity,
            "enrolled": self.enrolled
        }

def categorize_event(title):
    """Categorize event based on title keywords"""
    title_lower = title.lower()
    
    event_keywords = {
        'holiday': ['holiday', 'eid', 'independence', 'victory', 'martyrs', 'pohela boishakh', 'durga puja', 'christmas', 'new year'],
        'exam': ['exam', 'final', 'midterm', 'mid-term', 'assessment', 'test'],
        'advising': ['advising', 'advisor', 'counseling', 'guidance', 'academic planning'],
        'evaluation': ['evaluation', 'survey', 'feedback', 'course evaluation', 'faculty evaluation', 'teaching evaluation'],
        'registration': ['registration', 'enroll', 'add/drop', 'course selection', 'add drop', 'section change'],
        'break': ['break', 'recess', 'vacation', 'intersession', 'no classes']
    }
    
    for event_type, keywords in event_keywords.items():
        if any(keyword in title_lower for keyword in keywords):
            return event_type
    
    return 'other'

def parse_events_from_text(text):
    """Parse events from extracted PDF text"""
    events = []
    lines = text.split('\n')
    
    # Abbreviated month map
    month_abbr_map = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
        'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
        'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    }
    
    # Full month map
    month_map = {
        'january': '01', 'february': '02', 'march': '03', 'april': '04',
        'may': '05', 'june': '06', 'july': '07', 'august': '08',
        'september': '09', 'october': '10', 'november': '11', 'december': '12'
    }
    
    for line in lines:
        line = line.strip()
        if not line or len(line) < 5:
            continue
        
        found_date = None
        title = line
        day_of_week = None
        
        # Pattern 1: "6-Sep-25 Saturday" format (MAIN FORMAT IN NSU PDF)
        match1 = re.search(r'(\d{1,2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2})\s+(\w+)\s+(.+)', line, re.IGNORECASE)
        if match1:
            day = match1.group(1).zfill(2)
            month = month_abbr_map[match1.group(2).lower()]
            year = f"20{match1.group(3)}"
            day_of_week = match1.group(4)
            title = match1.group(5).strip()
            found_date = f"{year}-{month}-{day}"
        
        # Pattern 2: "15 January 2025"
        if not found_date:
            match2 = re.search(r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})', line, re.IGNORECASE)
            if match2:
                day = match2.group(1).zfill(2)
                month = month_map[match2.group(2).lower()]
                year = match2.group(3)
                found_date = f"{year}-{month}-{day}"
                title = line.replace(match2.group(0), '').strip()
        
        if found_date and title:
            title = re.sub(r'\s+', ' ', title)
            title = title.strip()
            
            if title and len(title) > 2 and len(title) < 300:
                event_type = categorize_event(title)
                
                event = {
                    'date': found_date,
                    'title': title,
                    'type': event_type,
                    'dayOfWeek': day_of_week if day_of_week else ''
                }
                events.append(event)
    
    return events

def parse_pdf_calendar(pdf_path):
    """Extract academic calendar events from PDF"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            # Extract text from all pages
            full_text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                full_text += page_text + "\n"
        
        # Parse events from text
        events = parse_events_from_text(full_text)
        
        return events
        
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return []

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/upload-calendar", methods=["POST"])
def upload_calendar():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Only PDF files are allowed"}), 400
        
        # Generate secure filename with timestamp
        filename = secure_filename(file.filename)
        timestamp = os.path.splitext(filename)[0] + "_" + str(int(time.time())) + ".pdf"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], timestamp)
        
        # Save the file
        file.save(filepath)
        
        # Parse the PDF and extract events
        print(f"Parsing PDF: {filepath}")
        extracted_events = parse_pdf_calendar(filepath)
        
        # Save extracted events to JSON file
        json_filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extracted_events.json')
        with open(json_filepath, 'w', encoding='utf-8') as f:
            json.dump(extracted_events, f, indent=2, ensure_ascii=False)
        
        print(f"Extracted {len(extracted_events)} events and saved to {json_filepath}")
        
        return jsonify({
            "message": "PDF uploaded successfully!",
            "filename": timestamp,
            "filepath": filepath,
            "eventsExtracted": len(extracted_events),
            "eventsFile": "extracted_events.json",
            "events": extracted_events
        }), 200
        
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/academic-events", methods=["GET"])
def get_academic_events():
    json_filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extracted_events.json')
    if os.path.exists(json_filepath):
        try:
            with open(json_filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return jsonify(data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    return jsonify([]), 200

@app.route("/api/academic-events", methods=["POST"])
def save_academic_events():
    try:
        events = request.json
        json_filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'extracted_events.json')
        with open(json_filepath, 'w', encoding='utf-8') as f:
            json.dump(events, f, indent=2, ensure_ascii=False)
        return jsonify({"message": "Events saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/generate-schedule", methods=["POST"])
def generate_schedule():
    import random
    
    try:
        data = request.json
        instructors = data.get('instructors', [])
        total_sections = data.get('totalSections', 1)
        
        if not instructors:
            return jsonify({"error": "No instructor data provided"}), 400

        # Regular classroom resources (non-lab rooms)
        theory_rooms = [
            'NAC210', 'NAC302', 'NAC411', 'NAC510', 'NAC612',
            'SAC201', 'SAC304', 'SAC402', 'SAC505'
        ]
        
        # Lab rooms (LIB prefix) - only for lab classes
        lab_rooms = [
            'LIB601', 'LIB602', 'LIB603', 'LIB604', 'LIB605',
            'LIB606', 'LIB607', 'LIB608'
        ]
        
        # Theory class time slots (1.5 hour slots)
        time_slots = [
            '08:00 AM - 09:30 AM',
            '09:40 AM - 11:10 AM',
            '11:20 AM - 12:50 PM',
            '01:00 PM - 02:30 PM',
            '02:40 PM - 04:10 PM',
            '04:20 PM - 05:50 PM'
        ]
        
        # Lab time slots (3-hour slots)
        lab_time_slots = [
            '08:00 AM - 11:10 AM',
            '09:40 AM - 12:50 PM',
            '11:20 AM - 02:30 PM',
            '12:50 PM - 04:10 PM',
            '02:40 PM - 05:50 PM'
        ]
        
        # Single days for labs
        single_days = ['S', 'M', 'T', 'W', 'R', 'A']
        
        # Theory day patterns
        days = ['ST', 'MW', 'RA']
        
        generated_schedules = []
        
        # Generate 3 different options
        for option_num in range(1, 4):
            schedule_classes = []
            used_theory_slots = set()  # (day, time, room) for theory classes
            used_lab_slots = set()     # (day, time, room) for lab classes
            
            # Shuffle instructors to get different results each time
            current_instructors = instructors.copy()
            random.shuffle(current_instructors)
            
            # Use sequential section numbers
            section_counter = 1
            
            # Track instructor schedules: {instructor_name: set( (day, time) ) }
            instructor_schedules = {}
            # Track assigned sections count
            instructor_workload = {}
            # Track primary assigned day pattern per instructor
            instructor_primary_day = {}
            
            for inst in instructors:
                name = inst.get('name')
                instructor_schedules[name] = set()
                instructor_workload[name] = 0
                instructor_primary_day[name] = None
            
            # Queue for Round Robin distribution
            instructor_queue = current_instructors.copy()
            
            # Limit iterations to prevent infinite loops
            max_attempts = total_sections * 10 
            attempts = 0
            
            # Track lab conflicts
            lab_conflict_count = 0
            lab_conflict_messages = []
            
            while section_counter <= total_sections and attempts < max_attempts:
                attempts += 1
                
                if not instructor_queue:
                    break
                
                inst = instructor_queue.pop(0)
                
                max_sections = int(inst.get('maxSections', 3))
                current_load = instructor_workload.get(inst.get('name'), 0)
                
                if current_load >= max_sections:
                    continue

                instructor_queue.append(inst)
                
                section_num = section_counter
                section_str = f"{section_num:02d}"
                
                assigned = False
                name = inst.get('name', 'Unknown')
                course = inst.get('courseCode', 'Unknown')
                pref_days = inst.get('preferredDays', [])
                pref_times = inst.get('availableTimes', [])
                
                # Lab configuration
                has_lab = inst.get('hasLab', False)
                lab_days_pref = inst.get('labDays', [])
                lab_times_pref = inst.get('labTimes', [])
                
                inst_schedule = instructor_schedules.get(name, set())
                
                target_days = pref_days if pref_days else days
                target_times = pref_times if pref_times else time_slots
                
                primary_day = instructor_primary_day.get(name)
                
                tier1_slots = []
                tier2_slots = []
                
                for d in target_days:
                    for t in target_times:
                        if primary_day and d == primary_day:
                            tier1_slots.append((d, t))
                        else:
                            tier2_slots.append((d, t))
                
                existing_times = [t for d, t in inst_schedule if d == primary_day]
                if existing_times and tier1_slots:
                    time_map = {t: i for i, t in enumerate(time_slots)}
                    existing_indices = [time_map.get(t, 0) for t in existing_times]
                    tier1_slots.sort(key=lambda slot: min(abs(time_map.get(slot[1], 0) - idx) for idx in existing_indices) if existing_indices else 0)
                else:
                    random.shuffle(tier1_slots)
                
                random.shuffle(tier2_slots)
                
                possible_slots = tier1_slots + tier2_slots
                
                # Try to find a room & time for theory class
                for day_val, time_val in possible_slots:
                    if assigned: break
                    
                    if (day_val, time_val) in inst_schedule:
                        continue
                    
                    current_rooms = theory_rooms.copy()
                    random.shuffle(current_rooms)
                        
                    for r in current_rooms:
                        if (day_val, time_val, r) not in used_theory_slots:
                            # Assign theory class
                            used_theory_slots.add((day_val, time_val, r))
                            inst_schedule.add((day_val, time_val))
                            instructor_workload[name] = instructor_workload.get(name, 0) + 1
                            
                            if not instructor_primary_day[name]:
                                instructor_primary_day[name] = day_val
                                
                            schedule_classes.append({
                                "courseCode": course,
                                "section": section_str,
                                "faculty": name,
                                "days": day_val,
                                "time": time_val,
                                "room": r,
                                "type": "theory",
                                "rationale": f"Matched {day_val} {time_val}"
                            })
                            assigned = True
                            
                            # If instructor has lab enabled, schedule lab class with same section
                            if has_lab:
                                lab_assigned = False
                                lab_target_days = lab_days_pref if lab_days_pref else single_days
                                lab_target_times = lab_times_pref if lab_times_pref else lab_time_slots
                                
                                # Shuffle for variety
                                lab_day_list = list(lab_target_days)
                                lab_time_list = list(lab_target_times)
                                random.shuffle(lab_day_list)
                                random.shuffle(lab_time_list)
                                
                                lab_conflict_reason = None
                                
                                for lab_day in lab_day_list:
                                    if lab_assigned: break
                                    for lab_time in lab_time_list:
                                        if lab_assigned: break
                                        
                                        # Use comprehensive validation for instructor availability
                                        # This checks:
                                        # 1. Instructor doesn't have theory class during lab time
                                        # 2. Instructor doesn't have another lab at same time
                                        # 3. Handles overlapping time slots (3-hour labs vs 1.5-hour theory)
                                        is_available, conflict_msg = validate_instructor_availability_for_lab(
                                            name, 
                                            inst_schedule, 
                                            lab_day, 
                                            lab_time, 
                                            schedule_classes
                                        )
                                        
                                        if not is_available:
                                            lab_conflict_reason = conflict_msg
                                            continue
                                        
                                        # Try to find available lab room
                                        available_lab_rooms = lab_rooms.copy()
                                        random.shuffle(available_lab_rooms)
                                        
                                        for lab_room in available_lab_rooms:
                                            if (lab_day, lab_time, lab_room) not in used_lab_slots:
                                                # Assign lab class
                                                used_lab_slots.add((lab_day, lab_time, lab_room))
                                                inst_schedule.add((lab_day, lab_time))
                                                
                                                schedule_classes.append({
                                                    "courseCode": f"{course}L",  # Add "L" suffix for lab
                                                    "section": section_str,      # Same section as theory
                                                    "faculty": name,             # Same faculty
                                                    "days": lab_day,
                                                    "time": lab_time,
                                                    "room": lab_room,
                                                    "type": "lab",
                                                    "rationale": f"Lab for {course} section {section_str}"
                                                })
                                                lab_assigned = True
                                                break
                                
                                # If lab couldn't be assigned, add conflict entry with detailed reason
                                if not lab_assigned:
                                    lab_conflict_count += 1
                                    conflict_detail = lab_conflict_reason or "No available lab room/time slot"
                                    lab_conflict_messages.append(f"Could not schedule lab for {course} section {section_str}: {conflict_detail}")
                                    schedule_classes.append({
                                        "courseCode": f"{course}L",
                                        "section": section_str,
                                        "faculty": name,
                                        "days": "TBD",
                                        "time": "TBD",
                                        "room": "TBD",
                                        "type": "lab",
                                        "conflict": True,
                                        "rationale": conflict_detail
                                    })
                            
                            break
                            
                if assigned:
                    section_counter += 1
                else:
                    if inst in instructor_queue:
                         instructor_queue.pop()
                    pass
            
            # Post-check: If we couldn't fill all sections
            conflict_count = 0
            while section_counter <= total_sections:
                 schedule_classes.append({
                        "courseCode": "UNASSIGNED",
                        "section": f"{section_counter:02d}",
                        "faculty": "Unassigned (No Slots)",
                        "days": "TBD",
                        "time": "TBD",
                        "room": "TBD",
                        "type": "theory",
                        "rationale": "Could not find valid slot for any instructor"
                 })
                 section_counter += 1
                 conflict_count += 1
            
            # Prepare Workload Summary
            workload_summary = [{"name": k, "count": v} for k, v in instructor_workload.items()]
            
            # Combine conflict messages
            total_conflicts = conflict_count + lab_conflict_count
            conflict_message = None
            if total_conflicts > 0:
                messages = []
                if conflict_count > 0:
                    messages.append(f"Could not schedule {conflict_count} section(s)")
                if lab_conflict_count > 0:
                    messages.append(f"Could not schedule {lab_conflict_count} lab(s)")
                conflict_message = " and ".join(messages) + " due to availability conflicts."

            generated_schedules.append({
                "option": option_num,
                "classes": schedule_classes,
                "conflict": total_conflicts > 0,
                "conflictCount": total_conflicts,
                "conflictMessage": conflict_message,
                "workload": workload_summary
            })
            
        return jsonify({"schedules": generated_schedules}), 200
        
    except Exception as e:
        print(f"Algorithm Error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def parse_time_to_minutes(time_str):
    """Parse time string like '08:00 AM' to minutes from midnight"""
    parts = time_str.strip().split()
    time_part = parts[0]
    period = parts[1] if len(parts) > 1 else 'AM'
    
    hours, minutes = map(int, time_part.split(':'))
    if period == 'PM' and hours != 12:
        hours += 12
    elif period == 'AM' and hours == 12:
        hours = 0
    
    return hours * 60 + minutes

def get_time_range(slot):
    """Get start and end times from a slot like '08:00 AM - 09:30 AM'"""
    parts = slot.split(' - ')
    start = parse_time_to_minutes(parts[0])
    end = parse_time_to_minutes(parts[1])
    return start, end

def check_time_overlap(time1, time2):
    """Check if two time slots overlap"""
    try:
        start1, end1 = get_time_range(time1)
        start2, end2 = get_time_range(time2)
        
        # Check for overlap
        return start1 < end2 and start2 < end1
    except:
        return False

def check_day_overlap(day1, day2):
    """
    Check if two day patterns overlap.
    Handles both single days (S, M, T, W, R, A) and double day patterns (ST, MW, RA).
    Returns True if any day in day1 overlaps with any day in day2.
    """
    # Expand double day patterns to individual days
    def expand_days(day_pattern):
        if len(day_pattern) == 2:
            return set(day_pattern)  # 'ST' -> {'S', 'T'}
        return {day_pattern}  # 'S' -> {'S'}
    
    days1 = expand_days(day1)
    days2 = expand_days(day2)
    
    # Check if there's any intersection
    return bool(days1 & days2)

def check_instructor_lab_conflict(instructor_schedule, lab_day, lab_time):
    """
    Check if an instructor has a conflict with a proposed lab slot.
    
    Args:
        instructor_schedule: set of (day, time) tuples representing instructor's current schedule
        lab_day: the proposed lab day (single day like 'S' or double day like 'ST')
        lab_time: the proposed lab time slot (e.g., '08:00 AM - 11:10 AM')
    
    Returns:
        tuple: (has_conflict: bool, conflict_details: str or None)
    """
    for existing_day, existing_time in instructor_schedule:
        # Check if days overlap
        if check_day_overlap(lab_day, existing_day):
            # Check if times overlap
            if check_time_overlap(lab_time, existing_time):
                return True, f"Conflict with existing class on {existing_day} at {existing_time}"
    
    return False, None

def validate_instructor_availability_for_lab(instructor_name, instructor_schedule, lab_day, lab_time, all_scheduled_classes):
    """
    Comprehensive validation of instructor availability for a lab slot.
    
    Checks:
    1. Instructor doesn't have a theory class during the lab time
    2. Instructor doesn't have another lab at the same time
    3. Handles overlapping time slots (3-hour labs vs 1.5-hour theory)
    
    Args:
        instructor_name: Name of the instructor
        instructor_schedule: set of (day, time) tuples for this instructor
        lab_day: Proposed lab day
        lab_time: Proposed lab time slot
        all_scheduled_classes: List of all classes scheduled so far in this option
    
    Returns:
        tuple: (is_available: bool, conflict_message: str or None)
    """
    # Check 1 & 2: Check against instructor's current schedule (includes both theory and lab)
    has_conflict, conflict_details = check_instructor_lab_conflict(instructor_schedule, lab_day, lab_time)
    if has_conflict:
        return False, f"Instructor {instructor_name} has a conflict: {conflict_details}"
    
    # Check 3: Additional check against all scheduled classes for this instructor
    # This catches any edge cases where the schedule set might not be fully updated
    for cls in all_scheduled_classes:
        if cls.get('faculty') == instructor_name:
            cls_day = cls.get('days', '')
            cls_time = cls.get('time', '')
            
            if check_day_overlap(lab_day, cls_day) and check_time_overlap(lab_time, cls_time):
                cls_type = cls.get('type', 'theory')
                return False, f"Instructor {instructor_name} already has a {cls_type} class on {cls_day} at {cls_time}"
    
    return True, None

def seed_admin_users():
    """Seed default admin accounts if they don't exist"""
    default_admins = [
        {"username": "admin1", "password": "Admin@123"},
        {"username": "admin2", "password": "Admin@456"},
        {"username": "admin3", "password": "Admin@789"},
        {"username": "admin4", "password": "Admin@000"}
    ]
    
    seeded_count = 0
    for admin_data in default_admins:
        existing = AdminUser.query.filter_by(username=admin_data["username"]).first()
        if not existing:
            admin = AdminUser(username=admin_data["username"])
            admin.set_password(admin_data["password"])
            db.session.add(admin)
            seeded_count += 1
    
    if seeded_count > 0:
        db.session.commit()
    
    return seeded_count

@app.route("/api/init", methods=["POST"])
def init_db():
    db.create_all()
    seeded = seed_admin_users()
    return jsonify({
        "message": "Database created",
        "adminsSeeded": seeded
    }), 200

@app.route("/api/auth/login", methods=["POST"])
def login():
    """Admin login endpoint"""
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")
        
        print(f"Login attempt for username: {username}")
        print(f"Request origin: {request.headers.get('Origin')}")
        print(f"Request cookies before login: {request.cookies}")
        
        if not username or not password:
            print("Missing username or password")
            return jsonify({"error": "Username and password are required"}), 400
        
        admin = AdminUser.query.filter_by(username=username).first()
        
        if not admin:
            print(f"Admin not found: {username}")
            return jsonify({"error": "Invalid credentials"}), 401
        
        if not admin.check_password(password):
            print(f"Invalid password for: {username}")
            return jsonify({"error": "Invalid credentials"}), 401
        
        # Set session
        session.clear()  # Clear any existing session first
        session["admin_id"] = admin.id
        session["username"] = admin.username
        session.modified = True  # Ensure session is marked as modified
        session.permanent = True  # Make session permanent
        
        print(f"Login successful for: {username}")
        print(f"Session after login: {dict(session)}")
        print(f"Session ID: {session.sid if hasattr(session, 'sid') else 'N/A'}")
        
        response = jsonify({
            "message": "Login successful",
            "user": admin.to_dict()
        })
        
        print(f"Response headers will include session cookie")
        return response, 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    """Admin logout endpoint"""
    session.clear()
    return jsonify({"message": "Logout successful"}), 200

@app.route("/api/auth/check", methods=["GET"])
def check_auth():
    """Check if user is authenticated"""
    print(f"Auth check called. Session data: {dict(session)}")
    print(f"Session has admin_id: {'admin_id' in session}")
    
    if "admin_id" in session:
        admin = AdminUser.query.get(session["admin_id"])
        if admin:
            print(f"Auth check: User authenticated - {admin.username}")
            return jsonify({
                "authenticated": True,
                "user": admin.to_dict()
            }), 200
        else:
            print(f"Auth check: Admin ID in session but user not found")
    else:
        print("Auth check: No admin_id in session")
    
    return jsonify({"authenticated": False}), 200

@app.route("/api/auth/change-password", methods=["POST"])
def change_password():
    """Change admin password"""
    try:
        data = request.json
        username = data.get("username")
        current_password = data.get("currentPassword")
        new_password = data.get("newPassword")
        
        if not username or not current_password or not new_password:
            return jsonify({"error": "Username, current and new passwords are required"}), 400
        
        if len(new_password) < 6:
            return jsonify({"error": "New password must be at least 6 characters"}), 400
        
        admin = AdminUser.query.filter_by(username=username).first()
        
        if not admin:
            return jsonify({"error": "User not found"}), 404
        
        if not admin.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        admin.set_password(new_password)
        db.session.commit()
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/classes", methods=["GET"])
def get_classes():
    items = ClassItem.query.all()
    return jsonify([i.to_dict() for i in items]), 200

@app.route("/api/classes", methods=["POST"])
def add_class():
    data = request.json
    item = ClassItem(**data)
    db.session.add(item)
    db.session.commit()
    
    # Update instructor timetable
    update_instructor_timetable(item.faculty, item.days, item.time, item.courseCode, item.section, item.room)
    
    return jsonify(item.to_dict()), 201

def update_instructor_timetable(instructor_name, days, time_slot, course_code, section, room):
    """Update or create instructor timetable entry"""
    existing = InstructorTimetable.query.filter_by(
        instructor_name=instructor_name,
        days=days,
        time_slot=time_slot
    ).first()
    
    if existing:
        existing.course_code = course_code
        existing.section = section
        existing.room = room
        existing.is_available = False
    else:
        entry = InstructorTimetable(
            instructor_name=instructor_name,
            days=days,
            time_slot=time_slot,
            course_code=course_code,
            section=section,
            room=room,
            is_available=False
        )
        db.session.add(entry)
    
    db.session.commit()

@app.route("/api/classes/bulk", methods=["POST"])
def add_classes_bulk():
    data = request.json
    if not isinstance(data, list):
        return jsonify({"error": "Expected a list of classes"}), 400
    
    new_items = []
    for item_data in data:
        # Remove any client-side generated IDs
        if 'id' in item_data:
            del item_data['id']
        item = ClassItem(**item_data)
        db.session.add(item)
        new_items.append(item)
    
    db.session.commit()
    
    # Update instructor timetables
    for item in new_items:
        update_instructor_timetable(item.faculty, item.days, item.time, item.courseCode, item.section, item.room)
    
    return jsonify([i.to_dict() for i in new_items]), 201

@app.route("/api/classes/<int:id>", methods=["PUT"])
def update_class(id):
    item = ClassItem.query.get_or_404(id)
    data = request.json
    
    # Store old values for timetable cleanup
    old_faculty = item.faculty
    old_days = item.days
    old_time = item.time

    item.courseCode = data.get("courseCode", item.courseCode)
    item.section = data.get("section", item.section)
    item.faculty = data.get("faculty", item.faculty)
    item.room = data.get("room", item.room)
    item.time = data.get("time", item.time)
    item.days = data.get("days", item.days)
    item.maxCapacity = int(data.get("maxCapacity", item.maxCapacity))
    item.enrolled = int(data.get("enrolled", item.enrolled))

    db.session.commit()
    
    # Update instructor timetables
    # Free up old slot if instructor/time changed
    if old_faculty != item.faculty or old_days != item.days or old_time != item.time:
        free_instructor_slot(old_faculty, old_days, old_time)
    
    # Book new slot
    update_instructor_timetable(item.faculty, item.days, item.time, item.courseCode, item.section, item.room)
    
    return jsonify(item.to_dict()), 200

def free_instructor_slot(instructor_name, days, time_slot):
    """Free up an instructor's time slot"""
    entry = InstructorTimetable.query.filter_by(
        instructor_name=instructor_name,
        days=days,
        time_slot=time_slot
    ).first()
    
    if entry:
        # Check if any other class uses this slot
        other_class = ClassItem.query.filter_by(
            faculty=instructor_name,
            days=days,
            time=time_slot
        ).first()
        
        if not other_class:
            entry.is_available = True
            entry.course_code = None
            entry.section = None
            entry.room = None
            db.session.commit()

@app.route("/api/classes/<int:id>", methods=["DELETE"])
def delete_class(id):
    item = ClassItem.query.get_or_404(id)
    
    # Store values before deletion
    faculty = item.faculty
    days = item.days
    time = item.time
    
    db.session.delete(item)
    db.session.commit()
    
    # Free up instructor slot
    free_instructor_slot(faculty, days, time)
    
    return jsonify({"message": "Deleted"}), 200

@app.route("/api/instructor-availability/<instructor_name>", methods=["GET"])
def get_instructor_availability(instructor_name):
    """Get instructor's schedule and availability"""
    timetable = InstructorTimetable.query.filter_by(instructor_name=instructor_name).all()
    
    # Also get from current classes
    classes = ClassItem.query.filter_by(faculty=instructor_name).all()
    
    # Build availability map
    busy_slots = {}
    for cls in classes:
        key = f"{cls.days}_{cls.time}"
        busy_slots[key] = {
            "days": cls.days,
            "timeSlot": cls.time,
            "courseCode": cls.courseCode,
            "section": cls.section,
            "room": cls.room,
            "isAvailable": False
        }
    
    return jsonify({
        "instructorName": instructor_name,
        "busySlots": list(busy_slots.values())
    }), 200

@app.route("/api/check-instructor-availability", methods=["POST"])
def check_instructor_availability():
    """Check if instructor is available for a specific slot"""
    data = request.json
    instructor_name = data.get("instructorName")
    days = data.get("days")
    time_slot = data.get("timeSlot")
    exclude_class_id = data.get("excludeClassId")  # For editing existing class
    
    if not instructor_name or not days or not time_slot:
        return jsonify({"error": "Missing required parameters"}), 400
    
    # Check if instructor has a class at this time
    query = ClassItem.query.filter_by(
        faculty=instructor_name,
        days=days,
        time=time_slot
    )
    
    if exclude_class_id:
        query = query.filter(ClassItem.id != exclude_class_id)
    
    existing_class = query.first()
    
    if existing_class:
        return jsonify({
            "available": False,
            "message": f"Instructor is already teaching {existing_class.courseCode} at this time",
            "conflictingClass": existing_class.to_dict()
        }), 200
    
    return jsonify({
        "available": True,
        "message": "Instructor is available"
    }), 200

@app.route("/api/available-sections/<course_code>", methods=["GET"])
def get_available_sections(course_code):
    """Get available sections for a course"""
    # Get all existing sections for this course
    existing_classes = ClassItem.query.filter_by(courseCode=course_code).all()
    used_sections = [cls.section for cls in existing_classes]
    
    # Standard sections 01-10
    standard_sections = [f"{i:02d}" for i in range(1, 11)]
    available_sections = [sec for sec in standard_sections if sec not in used_sections]
    
    # Check if all standard sections are occupied
    all_occupied = len(available_sections) == 0
    
    return jsonify({
        "courseCode": course_code,
        "availableSections": available_sections,
        "usedSections": used_sections,
        "allStandardOccupied": all_occupied
    }), 200

# ============ INSTRUCTOR PREFERENCES API ============

@app.route("/api/instructor-preferences", methods=["GET"])
def get_instructor_preferences():
    """Get all instructor preferences/availability"""
    instructors = InstructorPreference.query.all()
    return jsonify([i.to_dict() for i in instructors]), 200

@app.route("/api/instructor-preferences/<int:id>", methods=["GET"])
def get_instructor_preference(id):
    """Get a single instructor preference by ID"""
    instructor = InstructorPreference.query.get_or_404(id)
    return jsonify(instructor.to_dict()), 200

@app.route("/api/instructor-preferences", methods=["POST"])
def add_instructor_preference():
    """Add a new instructor preference"""
    data = request.json
    
    # Check if initials already exist
    existing = InstructorPreference.query.filter_by(initials=data.get("initials")).first()
    if existing:
        return jsonify({"error": "Instructor with these initials already exists"}), 400
    
    instructor = InstructorPreference(
        initials=data.get("initials"),
        full_name=data.get("fullName"),
        preferable_courses=data.get("preferableCourses", ""),
        preferable_times=",".join(data.get("preferableTimes", [])) if isinstance(data.get("preferableTimes"), list) else data.get("preferableTimes", "")
    )
    db.session.add(instructor)
    db.session.commit()
    return jsonify(instructor.to_dict()), 201

@app.route("/api/instructor-preferences/<int:id>", methods=["PUT"])
def update_instructor_preference(id):
    """Update an instructor preference"""
    instructor = InstructorPreference.query.get_or_404(id)
    data = request.json
    
    instructor.initials = data.get("initials", instructor.initials)
    instructor.full_name = data.get("fullName", instructor.full_name)
    instructor.preferable_courses = data.get("preferableCourses", instructor.preferable_courses)
    
    # Handle preferableTimes as list or string
    times = data.get("preferableTimes")
    if times is not None:
        if isinstance(times, list):
            instructor.preferable_times = ",".join(times)
        else:
            instructor.preferable_times = times
    
    db.session.commit()
    return jsonify(instructor.to_dict()), 200

@app.route("/api/instructor-preferences/<int:id>", methods=["DELETE"])
def delete_instructor_preference(id):
    """Delete an instructor preference"""
    instructor = InstructorPreference.query.get_or_404(id)
    db.session.delete(instructor)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

def seed_instructor_preferences():
    """Seed default instructor preferences if they don't exist"""
    default_instructors = [
        {
            "initials": "RJP",
            "full_name": "Dr. Rezwanul Huq Rana",
            "preferable_courses": "CSE115, CSE215, CSE225",
            "preferable_times": "ST1,ST2,MW1,MW2"
        },
        {
            "initials": "HAR",
            "full_name": "Dr. Hasibul Alam Rahman",
            "preferable_courses": "MAT130, MAT250, MAT350",
            "preferable_times": "ST2,ST3,ST5,RA1,RA2,RA3,RA5,RA6"
        },
        {
            "initials": "MRH",
            "full_name": "Mohammad Rezwanul Huq",
            "preferable_courses": "CSE225, CSE327",
            "preferable_times": "MW1,MW2,MW4"
        },
        {
            "initials": "AFE",
            "full_name": "Md Adnan Arefeen",
            "preferable_courses": "CSE299, CSE327, CSE468",
            "preferable_times": "ST3,ST4,MW4,MW5"
        },
        {
            "initials": "ATA",
            "full_name": "Atia Afroz",
            "preferable_courses": "MAT250, MAT350",
            "preferable_times": "ST3,ST4,ST6,MW3,MW4"
        },
        {
            "initials": "MLE",
            "full_name": "Mirza Mohammad Lutfe Elahi",
            "preferable_courses": "CSE115",
            "preferable_times": "ST1"
        },
        {
            "initials": "SFR1",
            "full_name": "Shafin Rahman",
            "preferable_courses": "CSE299",
            "preferable_times": "ST1"
        }
    ]
    
    seeded_count = 0
    for inst_data in default_instructors:
        existing = InstructorPreference.query.filter_by(initials=inst_data["initials"]).first()
        if not existing:
            instructor = InstructorPreference(
                initials=inst_data["initials"],
                full_name=inst_data["full_name"],
                preferable_courses=inst_data["preferable_courses"],
                preferable_times=inst_data["preferable_times"]
            )
            db.session.add(instructor)
            seeded_count += 1
    
    if seeded_count > 0:
        db.session.commit()
    
    return seeded_count

if __name__ == "__main__":
    app.run(debug=True)
