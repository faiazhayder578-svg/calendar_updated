import { useState } from 'react';
import { Building2, X, Check, AlertTriangle } from 'lucide-react';

const RoomSelector = ({
  selectedRoom,
  onSelectRoom,
  selectedDays,
  selectedTime,
  isDarkMode,
  existingClasses = [],
  editingClassId = null,
  isLabClass = false  // New prop to indicate if this is for a lab class
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Building structure: floors and rooms
  // NAC = North Academic Center, SAC = South Academic Center, LIB = Library Building
  // Each floor has 15 rooms, room numbers follow floor (e.g., 6th floor = 601-615)

  const generateRooms = (buildingCode, floor, count = 15) => {
    const rooms = [];
    for (let i = 1; i <= count; i++) {
      const roomNum = String(i).padStart(2, '0');
      rooms.push(`${buildingCode}${floor}${roomNum}`);
    }
    return rooms;
  };

  const buildings = {
    NAC: {
      name: 'North Academic Center',
      floors: {
        8: generateRooms('NAC', 8),
        7: generateRooms('NAC', 7),
        6: generateRooms('NAC', 6),
        5: generateRooms('NAC', 5),
        4: generateRooms('NAC', 4),
        3: generateRooms('NAC', 3),
        2: generateRooms('NAC', 2)
      }
    },
    SAC: {
      name: 'South Academic Center',
      floors: {
        8: generateRooms('SAC', 8),
        7: generateRooms('SAC', 7),
        6: generateRooms('SAC', 6),
        5: generateRooms('SAC', 5),
        4: generateRooms('SAC', 4),
        3: generateRooms('SAC', 3),
        2: generateRooms('SAC', 2)
      }
    },
    LIB: {
      name: 'Library Building',
      floors: {
        6: generateRooms('LIB', 6)
      }
    }
  };

  // Get occupied rooms for the selected time slot
  const getOccupiedRooms = () => {
    if (!selectedDays || !selectedTime) return new Set();

    const occupied = new Set();
    existingClasses.forEach(cls => {
      // Skip the class being edited
      if (editingClassId && cls.id === editingClassId) return;

      // Check if this class conflicts with selected time
      if (cls.days === selectedDays && cls.time === selectedTime) {
        occupied.add(cls.room);
      }
    });
    return occupied;
  };

  const occupiedRooms = getOccupiedRooms();

  const isRoomOccupied = (room) => occupiedRooms.has(room);

  // Check if room is allowed based on class type
  const isRoomAllowed = (room) => {
    const isLibRoom = room.startsWith('LIB');

    if (isLabClass) {
      // Lab classes can ONLY use LIB rooms
      return isLibRoom;
    } else {
      // Theory classes can NOT use LIB rooms
      return !isLibRoom;
    }
  };

  const handleRoomClick = (room) => {
    if (isRoomOccupied(room)) return;

    // Check room type restriction
    if (!isRoomAllowed(room)) {
      if (isLabClass) {
        setWarningMessage('Lab classes must be scheduled in the Library Building (LIB). Please select a room from LIB.');
      } else {
        setWarningMessage('Theory classes cannot be scheduled in the Library Building (LIB). Please select a room from NAC or SAC.');
      }
      setShowWarning(true);
      return;
    }

    onSelectRoom(room);
    setIsOpen(false);
  };

  const getRoomStyle = (room) => {
    const isSelected = selectedRoom === room;
    const isOccupied = isRoomOccupied(room);
    const isAllowed = isRoomAllowed(room);

    // Occupied rooms
    if (isOccupied) {
      return isDarkMode
        ? 'bg-red-900/50 border-red-700 text-red-400 cursor-not-allowed'
        : 'bg-red-100 border-red-300 text-red-600 cursor-not-allowed';
    }

    // Restricted rooms (wrong building type)
    if (!isAllowed) {
      return isDarkMode
        ? 'bg-slate-700/50 border-slate-600 text-slate-500 cursor-not-allowed opacity-50'
        : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-50';
    }

    // Selected room
    if (isSelected) {
      return isDarkMode
        ? 'bg-green-600 border-green-500 text-white ring-2 ring-green-400'
        : 'bg-green-500 border-green-600 text-white ring-2 ring-green-300';
    }

    // Available room
    return isDarkMode
      ? 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-800/50 cursor-pointer'
      : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100 cursor-pointer';
  };

  return (
    <div className="space-y-1.5">
      <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
        Room
      </label>

      {/* Selected Room Display / Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`w-full px-3 py-2 border rounded-lg text-left flex items-center gap-1 transition-all ${isDarkMode
            ? 'bg-slate-700 border-slate-600 text-white hover:border-slate-500'
            : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
          }`}
      >
        <Building2 className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">{selectedRoom || 'Select a room'}</span>
        <span className={`text-[9px] leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
          Click to open room selector
        </span>
      </button>

      {/* Room Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
            {/* Header */}
            <div className={`sticky top-0 px-6 py-4 border-b flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
              }`}>
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Select Room
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {selectedDays && selectedTime
                    ? `Showing availability for ${selectedDays} at ${selectedTime}`
                    : 'Select days and time to see room availability'}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legend */}
            <div className={`px-6 py-3 border-b flex flex-wrap items-center gap-4 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
              }`}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded border-2 ${isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-300'
                  }`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded border-2 ${isDarkMode ? 'bg-red-900/50 border-red-700' : 'bg-red-100 border-red-300'
                  }`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded border-2 ${isDarkMode ? 'bg-green-600 border-green-500' : 'bg-green-500 border-green-600'
                  }`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded border-2 opacity-50 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-300'
                  }`}></div>
                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isLabClass ? 'Theory Only (NAC/SAC)' : 'Lab Only (LIB)'}
                </span>
              </div>
              <div className={`ml-auto text-xs px-2 py-1 rounded ${isLabClass
                  ? isDarkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                  : isDarkMode ? 'bg-teal-900/30 text-teal-300' : 'bg-teal-100 text-teal-700'
                }`}>
                {isLabClass ? 'Lab Class - LIB rooms only' : 'Theory Class - NAC/SAC rooms only'}
              </div>
            </div>

            {/* Buildings Grid */}
            <div className="p-6 space-y-8">
              {Object.entries(buildings).map(([buildingCode, building]) => (
                <div key={buildingCode}>
                  <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                    <Building2 className="w-5 h-5" />
                    {building.name} ({buildingCode})
                  </h4>

                  <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'border-slate-700' : 'border-slate-200'
                    }`}>
                    {/* Floor Rows */}
                    {Object.entries(building.floors).sort((a, b) => Number(b[0]) - Number(a[0])).map(([floor, rooms]) => (
                      <div key={floor} className={`border-b last:border-b-0 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'
                        }`}>
                        {/* Floor Label */}
                        <div className={`px-3 py-2 font-semibold text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                          Floor {floor}
                        </div>

                        {/* Room Grid - 15 rooms in a responsive grid */}
                        <div
                          className={`p-2 gap-1 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(15, minmax(0, 1fr))'
                          }}
                        >
                          {rooms.map(room => (
                            <button
                              key={room}
                              type="button"
                              onClick={() => handleRoomClick(room)}
                              disabled={isRoomOccupied(room)}
                              title={room}
                              className={`p-2 text-center text-xs font-medium rounded border transition-all ${getRoomStyle(room)
                                }`}
                            >
                              <div className="flex flex-col items-center">
                                <span>{room.slice(-2)}</span>
                                {selectedRoom === room && (
                                  <Check className="w-3 h-3 mt-0.5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 px-6 py-4 border-t flex justify-between items-center ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
              }`}>
              <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedRoom ? (
                  <span>Selected: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedRoom}</strong></span>
                ) : (
                  <span>Click on an available room to select it</span>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={!selectedRoom}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedRoom
                      ? isDarkMode
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-slate-400 cursor-not-allowed text-slate-200'
                    }`}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Popup Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowWarning(false)}
          />
          <div className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'
                }`}>
                <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'
                  }`} />
              </div>
              <div className="flex-1">
                <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                  Room Restriction
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                  {warningMessage}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomSelector;
