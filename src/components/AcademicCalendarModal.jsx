import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, FileText, Plus, Trash2, File } from 'lucide-react';

const AcademicCalendarModal = ({ isOpen, closeModal, academicEvents, setAcademicEvents, isDarkMode, addNotification, goToCalendar }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: '',
    endDate: '',
    type: 'holiday',
    description: ''
  });
  const [isParsing, setIsParsing] = useState(false);

  // Load PDF.js when component mounts
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        console.log('PDF.js loaded successfully');
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      };
      script.onerror = () => {
        console.error('Failed to load PDF.js');
      };
      document.head.appendChild(script);
    }
  }, []);

  const [customTypeInput, setCustomTypeInput] = useState('');

  // ... (existing useEffect) ...

  const eventTypes = [
    { value: 'holiday', label: 'Holiday', color: 'red' },
    { value: 'exam', label: 'Final Exam', color: 'purple' },
    { value: 'advising', label: 'Advising', color: 'blue' },
    { value: 'evaluation', label: 'Faculty Evaluation', color: 'orange' },
    { value: 'registration', label: 'Registration', color: 'green' },
    { value: 'break', label: 'Break/Recess', color: 'yellow' },
    { value: 'custom', label: 'Custom Type...', color: 'gray' }
  ];

  // ... (existing eventKeywords and categorizeEvent) ...

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate) {
      addNotification('Please fill title and start date', 'error');
      return;
    }

    let finalType = newEvent.type;
    if (newEvent.type === 'custom') {
      if (!customTypeInput.trim()) {
        addNotification('Please specify the custom event type name', 'error');
        return;
      }
      finalType = customTypeInput.trim();
    }

    const event = {
      ...newEvent,
      id: Date.now(),
      endDate: newEvent.endDate || newEvent.startDate,
      type: finalType
    };

    setAcademicEvents([...academicEvents, event]);
    addNotification('Event added successfully!', 'success');

    setNewEvent({
      title: '',
      startDate: '',
      endDate: '',
      type: 'holiday',
      description: ''
    });
    setCustomTypeInput('');

    // Navigate to calendar view
    if (goToCalendar) {
      goToCalendar();
      closeModal();
    }
  };

  // ... (existing handleDeleteEvent, handleImportCSV, parsePDFText, handlePDFUpload, exportToCSV) ...

  // ... (inside return, manual add section) ...

  <div>
    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
      Event Type
    </label>
    <select
      value={newEvent.type}
      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
        ? 'bg-slate-800 border-slate-600 text-white'
        : 'bg-white border-slate-300'
        }`}
    >
      {eventTypes.map(type => (
        <option key={type.value} value={type.value}>{type.label}</option>
      ))}
    </select>

    {newEvent.type === 'custom' && (
      <input
        type="text"
        value={customTypeInput}
        onChange={(e) => setCustomTypeInput(e.target.value)}
        placeholder="Enter type name (e.g. Sports)"
        className={`w-full mt-2 px-3 py-2 border rounded-lg animate-in fade-in slide-in-from-top-1 ${isDarkMode
          ? 'bg-slate-800 border-slate-600 text-white'
          : 'bg-white border-slate-300'
          }`}
      />
    )}
  </div>

  const handleDeleteEvent = (eventId) => {
    setAcademicEvents(academicEvents.filter(e => e.id !== eventId));
    addNotification('Event deleted', 'info');
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n');
        const events = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          const cleaned = parts.map(p => p.replace(/^["']|["']$/g, '').trim());

          const [title, startDate, endDate, type, description] = cleaned;

          if (title && startDate) {
            events.push({
              id: Date.now() + i,
              title,
              startDate,
              endDate: endDate || startDate,
              type: type || 'other',
              description: description || ''
            });
          }
        }

        if (events.length > 0) {
          setAcademicEvents([...academicEvents, ...events]);
          addNotification(`Imported ${events.length} events from CSV!`, 'success');
        } else {
          addNotification('No valid events found in CSV', 'error');
        }
      } catch (error) {
        addNotification('Error parsing CSV file', 'error');
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const parsePDFText = (text) => {
    const events = [];
    const lines = text.split('\n');

    const monthMap = {
      'january': '01', 'february': '02', 'march': '03', 'april': '04',
      'may': '05', 'june': '06', 'july': '07', 'august': '08',
      'september': '09', 'october': '10', 'november': '11', 'december': '12'
    };

    let currentYear = new Date().getFullYear();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.length < 5) continue;

      let foundDate = null;
      let title = line;

      const match1 = line.match(/(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
      if (match1) {
        const day = match1[1].padStart(2, '0');
        const month = monthMap[match1[2].toLowerCase()];
        const year = match1[3];
        foundDate = `${year}-${month}-${day}`;
        currentYear = parseInt(year);
        title = line.replace(match1[0], '').trim();
      }

      if (!foundDate) {
        const match2 = line.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/i);
        if (match2) {
          const month = monthMap[match2[1].toLowerCase()];
          const day = match2[2].padStart(2, '0');
          const year = match2[3];
          foundDate = `${year}-${month}-${day}`;
          currentYear = parseInt(year);
          title = line.replace(match2[0], '').trim();
        }
      }

      if (!foundDate) {
        const match3 = line.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
        if (match3) {
          const day = match3[1].padStart(2, '0');
          const month = match3[2].padStart(2, '0');
          const year = match3[3];
          foundDate = `${year}-${month}-${day}`;
          title = line.replace(match3[0], '').trim();
        }
      }

      if (foundDate && title) {
        title = title.replace(/[:\-–—]/g, ' ').replace(/^\W+|\W+$/g, '').trim();

        if (title.length > 3 && title.length < 200) {
          let endDate = foundDate;

          const nextFewLines = lines.slice(i, i + 3).join(' ');
          const rangeMatch = nextFewLines.match(/(?:to|through|until)\s+(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?/i);
          if (rangeMatch) {
            const day = rangeMatch[1].padStart(2, '0');
            const month = monthMap[rangeMatch[2].toLowerCase()];
            const year = rangeMatch[3] || currentYear;
            endDate = `${year}-${month}-${day}`;
          }

          const type = categorizeEvent(title);

          events.push({
            id: Date.now() + Math.random(),
            title,
            startDate: foundDate,
            endDate,
            type,
            description: ''
          });
        }
      }
    }

    return events;
  };

  const handlePDFUpload = async (e) => {
    console.log('handlePDFUpload called', e.target.files);
    const file = e.target.files?.[0];

    if (!file) {
      console.log('No file selected');
      addNotification('No file selected', 'error');
      return;
    }

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      addNotification('Please upload a PDF file', 'error');
      e.target.value = '';
      return;
    }

    setIsParsing(true);
    addNotification('Parsing PDF... This may take a moment', 'info');

    try {
      let attempts = 0;
      while (!window.pdfjsLib && attempts < 50) {
        console.log('Waiting for PDF.js to load...', attempts);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      const pdfjsLib = window.pdfjsLib;

      if (!pdfjsLib) {
        throw new Error('PDF.js library failed to load. Please refresh the page and try again, or use CSV import instead.');
      }

      console.log('PDF.js library is ready');
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      console.log('Reading file...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('File read successfully, size:', arrayBuffer.byteLength, 'bytes');

      console.log('Loading PDF document...');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded successfully, pages:', pdf.numPages);

      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Extracting page ${i}/${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
        console.log(`Page ${i} extracted, text length:`, pageText.length);
      }

      console.log('Total text extracted, length:', fullText.length);

      // Upload PDF to backend for storage and automatic parsing
      console.log('Uploading PDF to backend...');
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('http://localhost:5000/api/upload-calendar', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('PDF uploaded to backend:', result);

        if (result.eventsExtracted && result.eventsExtracted > 0 && result.events) {
          console.log(`Backend extracted ${result.eventsExtracted} events`);

          const backendEvents = result.events.map(event => ({
            id: Date.now() + Math.random(),
            title: event.title,
            startDate: event.date,
            endDate: event.date,
            type: event.type,
            description: event.dayOfWeek ? `Day: ${event.dayOfWeek}` : ''
          }));

          setAcademicEvents([...academicEvents, ...backendEvents]);
          addNotification(`✅ NSU Academic Calendar uploaded! ${result.eventsExtracted} events added.`, 'success');

          if (goToCalendar) {
            goToCalendar();
            closeModal();
          }
        } else {
          addNotification('PDF uploaded but no events were extracted.', 'info');
        }
      } else {
        const errorData = await uploadResponse.json();
        addNotification(`Upload failed: ${errorData.error || 'Server error'}`, 'error');
      }


    } catch (error) {
      console.error('PDF parsing error:', error);
      console.error('Error stack:', error.stack);
      addNotification(`Error: ${error.message}`, 'error');
    } finally {
      setIsParsing(false);
      e.target.value = '';
    }
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Start Date', 'End Date', 'Type', 'Description'];
    const rows = academicEvents.map(event => [
      event.title,
      event.startDate,
      event.endDate,
      event.type,
      event.description || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic-calendar-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addNotification('Calendar exported!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter" onClick={closeModal} />
      {/* Modal container with animation */}
      <div className={`relative rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modal-enter ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white shadow-slate-200'
        }`}>
        {/* Header with clear title and close button */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
          }`}>
          <div className="flex items-center gap-3">
            <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`} strokeWidth={1.75} />
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Academic Calendar Management
            </h2>
          </div>
          <button
            onClick={closeModal}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode 
              ? 'hover:bg-slate-700 text-slate-400 hover:text-white focus:ring-slate-500' 
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900 focus:ring-slate-400'
              }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Import/Export
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* PDF Upload - FIXED */}
              <label
                htmlFor="pdf-upload-input"
                className={`relative px-4 py-3 border-2 border-dashed rounded-lg text-center transition-colors ${isParsing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${isDarkMode
                    ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                onClick={(e) => {
                  console.log('Label clicked');
                  if (isParsing) {
                    e.preventDefault();
                  }
                }}
              >
                <input
                  id="pdf-upload-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    console.log('PDF onChange event fired');
                    console.log('Files:', e.target.files);
                    console.log('Files length:', e.target.files?.length);
                    if (e.target.files && e.target.files.length > 0) {
                      handlePDFUpload(e);
                    } else {
                      console.log('No files in event');
                    }
                  }}
                  disabled={isParsing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ cursor: isParsing ? 'not-allowed' : 'pointer' }}
                />
                <File className={`w-5 h-5 mx-auto mb-1 ${isParsing ? 'animate-pulse' : ''} pointer-events-none`} />
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} pointer-events-none`}>
                  {isParsing ? 'Parsing...' : 'Upload PDF'}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} pointer-events-none`}>
                  NSU Calendar
                </div>
              </label>

              {/* CSV Import - FIXED */}
              <label
                htmlFor="csv-upload-input"
                className={`relative px-4 py-3 border-2 border-dashed rounded-lg text-center transition-colors cursor-pointer ${isDarkMode
                  ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-100'
                  }`}
                onClick={() => console.log('CSV label clicked')}
              >
                <input
                  id="csv-upload-input"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    console.log('CSV file input onChange triggered', e.target.files);
                    handleImportCSV(e);
                  }}
                  onClick={(e) => {
                    console.log('CSV Input clicked');
                    e.stopPropagation();
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                />
                <Upload className="w-5 h-5 mx-auto mb-1 pointer-events-none" />
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} pointer-events-none`}>
                  Import CSV
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} pointer-events-none`}>
                  Backup File
                </div>
              </label>

              {/* Export CSV */}
              <button
                onClick={exportToCSV}
                disabled={academicEvents.length === 0}
                className={`px-4 py-3 border-2 rounded-lg transition-colors ${academicEvents.length === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : isDarkMode
                    ? 'border-slate-600 hover:bg-slate-700'
                    : 'border-slate-300 hover:bg-slate-100'
                  }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Export CSV
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  Download
                </div>
              </button>
            </div>

            <div className={`mt-3 p-3 rounded text-xs ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
              <strong>📄 PDF Upload:</strong> Upload NSU academic calendar PDF - events will be automatically extracted and categorized by color!<br />
              <strong>📊 CSV Format:</strong> Title, Start Date (YYYY-MM-DD), End Date, Type, Description
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-6 ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'
            }`}>
            <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              Add Event Manually
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Spring Break, Final Exams Begin"
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={newEvent.startDate}
                  onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  End Date (optional)
                </label>
                <input
                  type="date"
                  value={newEvent.endDate}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300'
                    }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Event Type
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300'
                    }`}
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {newEvent.type === 'custom' && (
                  <input
                    type="text"
                    value={customTypeInput}
                    onChange={(e) => setCustomTypeInput(e.target.value)}
                    placeholder="Enter type name (e.g. Sports)"
                    className={`w-full mt-2 px-3 py-2 border rounded-lg animate-in fade-in slide-in-from-top-1 ${isDarkMode
                      ? 'bg-slate-800 border-slate-600 text-white'
                      : 'bg-white border-slate-300'
                      }`}
                  />
                )}
              </div>

              <div className="col-span-2">
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Description (optional)
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Additional details..."
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                    ? 'bg-slate-800 border-slate-600 text-white'
                    : 'bg-white border-slate-300'
                    }`}
                />
              </div>
            </div>

            <button
              onClick={handleAddEvent}
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          <div>
            <h3 className={`text-sm font-semibold mb-3 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              All Events ({academicEvents.length})
            </h3>

            {academicEvents.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                No events yet. Upload PDF, import CSV, or add manually.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {academicEvents.map(event => {
                  const eventType = eventTypes.find(t => t.value === event.type);
                  return (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border flex items-start justify-between ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'
                        }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full bg-${eventType?.color || 'gray'}-500`}></div>
                          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {event.title}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded bg-${eventType?.color || 'gray'}-100 text-${eventType?.color || 'gray'}-700`}>
                            {eventType?.label || 'Other'}
                          </span>
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          {event.startDate} {event.endDate && event.endDate !== event.startDate && `→ ${event.endDate}`}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className={`p-1.5 rounded transition-colors ${isDarkMode ? 'hover:bg-slate-600 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className={`px-6 py-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
          }`}>
          <button
            onClick={closeModal}
            className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600 focus:ring-slate-500'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-400'
              }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
export default AcademicCalendarModal;