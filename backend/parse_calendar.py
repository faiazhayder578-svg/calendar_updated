import PyPDF2
import re
import json
from datetime import datetime

def parse_pdf_calendar(pdf_path):
    """Extract academic calendar events from PDF"""
    
    print(f"\n{'='*60}")
    print(f"Parsing PDF: {pdf_path}")
    print(f"{'='*60}\n")
    
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"Total pages: {len(pdf_reader.pages)}\n")
        
        # Extract text from all pages
        full_text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            full_text += page_text + "\n"
            print(f"Page {i+1} extracted ({len(page_text)} characters)")
        
    # Parse events from text
    events = parse_events_from_text(full_text)
    
    return events, full_text

def parse_events_from_text(text):
    """Parse events from extracted text"""
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
    
    print(f"\n{'='*60}")
    print(f"PARSING EVENTS FROM TEXT")
    print(f"{'='*60}\n")
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line or len(line) < 5:
            continue
        
        found_date = None
        title = line
        day_of_week = None
        
        # Pattern 1: "6-Sep-25 Saturday" format (MAIN FORMAT IN THIS PDF)
        match1 = re.search(r'(\d{1,2})-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d{2})\s+(\w+)\s+(.+)', line, re.IGNORECASE)
        if match1:
            day = match1.group(1).zfill(2)
            month = month_abbr_map[match1.group(2).lower()]
            year = f"20{match1.group(3)}"  # Convert 25 to 2025
            day_of_week = match1.group(4)
            title = match1.group(5).strip()
            found_date = f"{year}-{month}-{day}"
        
        # Pattern 2: "15 January 2025" or "1 February 2025"
        if not found_date:
            match2 = re.search(r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})', line, re.IGNORECASE)
            if match2:
                day = match2.group(1).zfill(2)
                month = month_map[match2.group(2).lower()]
                year = match2.group(3)
                found_date = f"{year}-{month}-{day}"
                title = line.replace(match2.group(0), '').strip()
        
        # Pattern 3: "January 15, 2025" or "February 1, 2025"
        if not found_date:
            match3 = re.search(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})', line, re.IGNORECASE)
            if match3:
                month = month_map[match3.group(1).lower()]
                day = match3.group(2).zfill(2)
                year = match3.group(3)
                found_date = f"{year}-{month}-{day}"
                title = line.replace(match3.group(0), '').strip()
        
        # Pattern 4: "15/01/2025" or "15-01-2025"
        if not found_date:
            match4 = re.search(r'(\d{1,2})[\\/](\d{1,2})[\\/](\d{4})', line)
            if match4:
                day = match4.group(1).zfill(2)
                month = match4.group(2).zfill(2)
                year = match4.group(3)
                found_date = f"{year}-{month}-{day}"
                title = line.replace(match4.group(0), '').strip()
        
        if found_date and title:
            # Clean up title
            title = re.sub(r'\s+', ' ', title)  # Normalize whitespace
            title = title.strip()
            
            if title and len(title) > 2 and len(title) < 300:
                # Categorize event
                event_type = categorize_event(title)
                
                event = {
                    'date': found_date,
                    'title': title,
                    'type': event_type,
                    'dayOfWeek': day_of_week if day_of_week else ''
                }
                events.append(event)
                print(f"✓ {found_date} ({day_of_week or 'N/A'}) - {title[:60]}... [{event_type}]")
    
    return events

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

if __name__ == "__main__":
    pdf_path = "uploads/NSU_academic_calendar_1766343785.pdf"
    
    try:
        events, full_text = parse_pdf_calendar(pdf_path)
        
        print(f"\n{'='*60}")
        print(f"EXTRACTION SUMMARY")
        print(f"{'='*60}")
        print(f"Total events found: {len(events)}")
        
        # Save to JSON file
        output_file = "extracted_events.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(events, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Events saved to: {output_file}")
        
        # Also print JSON to console
        print(f"\n{'='*60}")
        print(f"JSON OUTPUT")
        print(f"{'='*60}\n")
        print(json.dumps(events, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"\nError: {e}")
        import traceback
        traceback.print_exc()
