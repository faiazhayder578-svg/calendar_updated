import React, { useState } from 'react';
import { X, Calculator, TrendingUp, Plus, Trash2 } from 'lucide-react';

const GradeCalculator = ({ isOpen, closeModal, selectedClass, isDarkMode }) => {
  const [assignments, setAssignments] = useState([
    { id: 1, name: 'Midterm', weight: 30, score: 0 },
    { id: 2, name: 'Final', weight: 40, score: 0 },
    { id: 3, name: 'Assignments', weight: 20, score: 0 },
    { id: 4, name: 'Quizzes', weight: 10, score: 0 }
  ]);

  const [targetGrade, setTargetGrade] = useState(90);

  const addAssignment = () => {
    setAssignments([...assignments, {
      id: Date.now(),
      name: `Assignment ${assignments.length + 1}`,
      weight: 0,
      score: 0
    }]);
  };

  const removeAssignment = (id) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const updateAssignment = (id, field, value) => {
    setAssignments(assignments.map(a =>
      a.id === id ? { ...a, [field]: parseFloat(value) || 0 } : a
    ));
  };

  const calculateCurrentGrade = () => {
    const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);
    if (totalWeight === 0) return 0;
    const weightedScore = assignments.reduce((sum, a) => sum + (a.score * a.weight / 100), 0);
    return ((weightedScore / totalWeight) * 100).toFixed(2);
  };

  const calculateRequiredScore = () => {
    const completed = assignments.filter(a => a.score > 0);
    const remaining = assignments.filter(a => a.score === 0);
    
    if (remaining.length === 0) return null;
    
    const completedWeight = completed.reduce((sum, a) => sum + (a.score * a.weight / 100), 0);
    const remainingWeight = remaining.reduce((sum, a) => sum + a.weight, 0);
    
    if (remainingWeight === 0) return null;
    
    const required = ((targetGrade - completedWeight) / remainingWeight) * 100;
    return required.toFixed(2);
  };

  const getGradeLetter = (score) => {
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 60) return 'D';
    return 'F';
  };

  if (!isOpen || !selectedClass) return null;

  const currentGrade = calculateCurrentGrade();
  const requiredScore = calculateRequiredScore();
  const totalWeight = assignments.reduce((sum, a) => sum + a.weight, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className={`px-6 py-4 border-b flex justify-between items-center ${
            isDarkMode ? 'border-slate-700 bg-gradient-to-r from-indigo-900/30 to-purple-900/30' : 'border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50'
          }`}>
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Grade Calculator
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {selectedClass.courseCode} - {selectedClass.faculty}
                </p>
              </div>
            </div>
            <button onClick={closeModal} className={`${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {/* Current Grade Display */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-slate-700/30' : 'bg-indigo-50'}`}>
                <p className={`text-sm mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Current Grade</p>
                <p className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {currentGrade}%
                </p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">
                  {getGradeLetter(currentGrade)}
                </p>
              </div>
              
              <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700/30' : 'bg-purple-50'}`}>
                <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Target Grade</p>
                <input
                  type="number"
                  value={targetGrade}
                  onChange={(e) => setTargetGrade(parseFloat(e.target.value) || 0)}
                  className={`w-full text-4xl font-bold text-center rounded-lg p-2 mb-2 ${
                    isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-900'
                  }`}
                />
                {requiredScore !== null && (
                  <p className={`text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    Need {requiredScore}% on remaining
                  </p>
                )}
              </div>
            </div>

            {/* Assignments List */}
            <div className="space-y-3 mb-4">
              {assignments.map(assignment => (
                <div key={assignment.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      value={assignment.name}
                      onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                      className={`col-span-5 px-3 py-2 rounded-lg ${
                        isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                      }`}
                      placeholder="Assignment name"
                    />
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={assignment.weight}
                        onChange={(e) => updateAssignment(assignment.id, 'weight', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                        }`}
                        placeholder="Weight %"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={assignment.score}
                        onChange={(e) => updateAssignment(assignment.id, 'score', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700 text-white' : 'bg-white'
                        }`}
                        placeholder="Score %"
                      />
                    </div>
                    <button
                      onClick={() => removeAssignment(assignment.id)}
                      className="col-span-1 p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addAssignment}
              className={`w-full py-3 rounded-lg border-2 border-dashed font-medium transition-all mb-4 ${
                isDarkMode ? 'border-slate-600 text-slate-400 hover:bg-slate-700/30' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}>
              <Plus className="w-5 h-5 inline mr-2" />
              Add Assignment
            </button>

            {/* Weight Warning */}
            {totalWeight !== 100 && (
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                  ⚠️ Total weight is {totalWeight}%. Should be 100% for accurate calculation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;
