// Time/Day Encoding Logic
// Pattern: Days + Time Slot Number
// ST + 08:00-09:30 -> ST1
// MW + 09:40-11:10 -> MW2
// RA + 11:20-12:50 -> RA3
// etc.

const timeSlotMap = {
  '08:00 AM - 09:30 AM': '1',
  '09:40 AM - 11:10 AM': '2',
  '11:20 AM - 12:50 PM': '3',
  '01:00 PM - 02:30 PM': '4',
  '02:40 PM - 04:10 PM': '5',
  '04:20 PM - 05:50 PM': '6',
  // Lab time slots (3-hour)
  '08:00 AM - 11:10 AM': 'L1',
  '09:40 AM - 12:50 PM': 'L2',
  '11:20 AM - 02:30 PM': 'L3',
  '12:50 PM - 04:10 PM': 'L4',
  '02:40 PM - 05:50 PM': 'L5'
};

// Reverse map for decoding
const reverseTimeSlotMap = Object.fromEntries(
  Object.entries(timeSlotMap).map(([k, v]) => [v, k])
);

/**
 * Encode days and time into a short code
 * @param {string} days - Day pattern (ST, MW, RA, S, M, T, W, R, A)
 * @param {string} time - Time slot string
 * @returns {string} Encoded string (e.g., "ST1", "MW2", "RA3")
 */
export function encodeSchedule(days, time) {
  const slotNumber = timeSlotMap[time] || '?';
  return `${days}${slotNumber}`;
}

/**
 * Decode a schedule code back to days and time
 * @param {string} code - Encoded schedule (e.g., "ST1")
 * @returns {object} { days, time } or null if invalid
 */
export function decodeSchedule(code) {
  if (!code || code.length < 2) return null;
  
  // Check for lab slots (e.g., "SL1", "ML2")
  const labMatch = code.match(/^([SMTWRA]+)(L\d)$/);
  if (labMatch) {
    const days = labMatch[1];
    const slotCode = labMatch[2];
    const time = reverseTimeSlotMap[slotCode];
    return time ? { days, time } : null;
  }
  
  // Standard slots (e.g., "ST1", "MW2")
  const match = code.match(/^([SMTWRA]+)(\d)$/);
  if (match) {
    const days = match[1];
    const slotCode = match[2];
    const time = reverseTimeSlotMap[slotCode];
    return time ? { days, time } : null;
  }
  
  return null;
}

/**
 * Get the slot number from a time string
 * @param {string} time - Time slot string
 * @returns {string} Slot number or '?'
 */
export function getSlotNumber(time) {
  return timeSlotMap[time] || '?';
}

/**
 * Get instructor initials from full name
 * @param {string} name - Full instructor name
 * @returns {string} Initials (e.g., "Dr. John Smith" -> "DJS")
 */
export function getInstructorInitials(name) {
  if (!name) return '';
  
  // Remove common prefixes
  const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
  
  // Get initials from remaining words
  const words = cleanName.split(/\s+/).filter(w => w.length > 0);
  const initials = words.map(w => w[0].toUpperCase()).join('');
  
  // Include prefix initial if present
  const prefixMatch = name.match(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)/i);
  if (prefixMatch) {
    return prefixMatch[1][0].toUpperCase() + initials;
  }
  
  return initials;
}

/**
 * Check if a class matches a search query (including encoded values)
 * @param {object} cls - Class object
 * @param {string} query - Search query
 * @returns {boolean} Whether the class matches
 */
export function matchesSearch(cls, query) {
  if (!query) return true;
  
  const q = query.toLowerCase().trim();
  
  // Direct field matches
  if (cls.courseCode?.toLowerCase().includes(q)) return true;
  if (cls.faculty?.toLowerCase().includes(q)) return true;
  if (cls.room?.toLowerCase().includes(q)) return true;
  if (cls.section?.toLowerCase().includes(q)) return true;
  
  // Days match (ST, MW, RA, S, M, T, W, R, A)
  if (cls.days?.toLowerCase() === q) return true;
  if (cls.days?.toLowerCase().includes(q)) return true;
  
  // Time match
  if (cls.time?.toLowerCase().includes(q)) return true;
  
  // Encoded schedule match (e.g., "ST1", "MW2")
  const encoded = encodeSchedule(cls.days, cls.time).toLowerCase();
  if (encoded.includes(q)) return true;
  
  // Also match just the slot number (e.g., "1", "2")
  const slotNum = getSlotNumber(cls.time);
  if (slotNum === q) return true;
  
  // Instructor initials match
  const initials = getInstructorInitials(cls.faculty).toLowerCase();
  if (initials.includes(q)) return true;
  
  return false;
}

export default {
  encodeSchedule,
  decodeSchedule,
  getSlotNumber,
  getInstructorInitials,
  matchesSearch
};
