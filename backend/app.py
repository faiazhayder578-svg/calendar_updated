from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
import time
import json
import PyPDF2
import re

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///scheduler.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# File upload configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy(app)

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

@app.route("/api/generate-schedule", methods=["POST"])
def generate_schedule():
    import random
    
    try:
        data = request.json
        # No API key needed anymore
        # data format: { "instructors": [...] }
        # If frontend sends prompt/apiKey, we ignore them and look for raw instructor data 
        # But wait, the frontend currently sends a text prompt. We should update frontend to send structured data.
        # OR we can parse the structured data if we update the frontend first. 
        # Let's assume we will update the frontend to send strict JSON of instructors.
        
        instructors = data.get('instructors', [])
        
        # If we are transitioning, we might receive the old payload. 
        # Let's support the new payload structure: { instructors: [...] }
        
        if not instructors:
            return jsonify({"error": "No instructor data provided"}), 400

        # Resources
        rooms = ['NAC501', 'NAC502', 'LIB603', 'ENG204', 'SCI305']
        time_slots = [
            '08:00 AM - 09:30 AM',
            '09:40 AM - 11:10 AM',
            '11:20 AM - 12:50 PM',
            '01:00 PM - 02:30 PM',
            '02:40 PM - 04:10 PM'
        ]
        days = ['ST', 'MW', 'RA']
        
        generated_schedules = []
        
        # Generate 3 different options
        for option_num in range(1, 4):
            schedule_classes = []
            used_slots = set() # (day, time, room)
            
            # Shuffle instructors to get different results each time
            current_instructors = instructors.copy()
            random.shuffle(current_instructors)
            
            success = True
            
            for inst in current_instructors:
                assigned = False
                name = inst.get('name', 'Unknown')
                course = inst.get('courseCode', 'Unknown')
                pref_days = inst.get('preferredDays', [])
                pref_times = inst.get('availableTimes', [])
                pref_room = inst.get('roomPreference', '')
                
                # Try preferred slots first
                possible_slots = []
                
                # 1. Preferred Day + Preferred Time
                for d in (pref_days if pref_days else days):
                    for t in (pref_times if pref_times else time_slots):
                        possible_slots.append((d, t, 10)) # Priority 10 (High)
                
                # 2. Preferred Day + Any Time (if specific times not requested)
                if pref_days and not pref_times:
                    for d in pref_days:
                        for t in time_slots:
                            possible_slots.append((d, t, 5))
                            
                # 3. Any Day + Preferred Time
                if not pref_days and pref_times:
                    for d in days:
                        for t in pref_times:
                            possible_slots.append((d, t, 5))
                            
                # 4. Fallback: All slots
                for d in days:
                    for t in time_slots:
                        possible_slots.append((d, t, 1)) # Priority 1 (Low)
                
                # Sort by priority (descending)
                possible_slots.sort(key=lambda x: x[2], reverse=True)
                
                # Try to find a room for these slots
                for day_val, time_val, _ in possible_slots:
                    if assigned: break
                    
                    # Determine room list order (pref first, then random)
                    current_rooms = rooms.copy()
                    if pref_room and pref_room in rooms:
                        current_rooms.remove(pref_room)
                        current_rooms.insert(0, pref_room)
                    else:
                        random.shuffle(current_rooms)
                        
                    for r in current_rooms:
                        # Check collision
                        if (day_val, time_val, r) not in used_slots:
                            # Assign!
                            used_slots.add((day_val, time_val, r))
                            schedule_classes.append({
                                "courseCode": course,
                                "section": f"{option_num:02d}", # Dummy section
                                "faculty": name,
                                "days": day_val,
                                "time": time_val,
                                "room": r,
                                "rationale": f"Matched {day_val} {time_val}" + (" (Preferred)" if (day_val in pref_days and time_val in pref_times) else "")
                            })
                            assigned = True
                            break
                            
                if not assigned:
                    # Could not schedule this instructor
                    # For now, we skip or add a "Conflict" placeholder?
                    # Let's add with "TBD" room
                    schedule_classes.append({
                        "courseCode": course,
                        "section": "XX",
                        "faculty": name + " (CONFLICT)",
                        "days": "TBD",
                        "time": "TBD",
                        "room": "TBD",
                        "rationale": "Could not find collision-free slot"
                    })
            
            generated_schedules.append({
                "option": option_num,
                "classes": schedule_classes
            })
            
        return jsonify({"schedules": generated_schedules}), 200
        
    except Exception as e:
        print(f"Algorithm Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/init", methods=["POST"])
def init_db():
    db.create_all()
    return jsonify({"message": "Database created"}), 200

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
    return jsonify(item.to_dict()), 201

@app.route("/api/classes/<int:id>", methods=["PUT"])
def update_class(id):
    item = ClassItem.query.get_or_404(id)
    data = request.json

    item.courseCode = data.get("courseCode", item.courseCode)
    item.section = data.get("section", item.section)
    item.faculty = data.get("faculty", item.faculty)
    item.room = data.get("room", item.room)
    item.time = data.get("time", item.time)
    item.days = data.get("days", item.days)
    item.maxCapacity = int(data.get("maxCapacity", item.maxCapacity))
    item.enrolled = int(data.get("enrolled", item.enrolled))

    db.session.commit()
    return jsonify(item.to_dict()), 200

@app.route("/api/classes/<int:id>", methods=["DELETE"])
def delete_class(id):
    item = ClassItem.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
