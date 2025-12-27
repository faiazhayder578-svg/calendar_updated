import React, { useState } from 'react';
import { X, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, closeModal, onChangePassword, isDarkMode }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    closeModal();
  };

  // Reusable password input with toggle
  const PasswordInput = ({ value, onChange, showPassword, onToggle, label, hint, disabled }) => (
    <div>
      <label className={`text-xs font-semibold uppercase tracking-wide block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 pr-12 rounded-lg border text-sm transition-all duration-200 ${isDarkMode
              ? 'bg-slate-700 border-slate-600 text-white'
              : 'bg-white border-slate-200 text-slate-800'
            } focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent`}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggle}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${isDarkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-600'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" strokeWidth={1.75} />
          ) : (
            <Eye className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>
      </div>
      {hint && (
        <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {hint}
        </p>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur effect */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-backdrop-enter" onClick={handleClose} />
      {/* Modal container with animation */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-modal-enter transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 text-white shadow-slate-900/50' : 'bg-white text-slate-800 shadow-slate-200'
        }`}>
        {/* Header with clear title and close button */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'
          }`}>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5" strokeWidth={1.75} />
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>
          <button
            onClick={handleClose}
            className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDarkMode
                ? 'hover:bg-slate-700 text-slate-400 hover:text-white focus:ring-slate-500'
                : 'hover:bg-slate-100 text-slate-400 hover:text-slate-900 focus:ring-slate-400'
              }`}
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
              <CheckCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.75} />
              <span className="text-sm">Password changed successfully</span>
            </div>
          )}

          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            showPassword={showCurrentPassword}
            onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
            label="Current Password"
            disabled={loading || success}
          />

          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
            label="New Password"
            hint="Minimum 6 characters"
            disabled={loading || success}
          />

          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            label="Confirm New Password"
            disabled={loading || success}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400'
                }`}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${loading || success
                  ? 'bg-slate-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-slate-600 hover:bg-slate-500 text-white focus:ring-slate-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-white focus:ring-slate-500'
                }`}
              disabled={loading || success}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
