// ============================================
// src/components/common/DatePicker.jsx
// ============================================
import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange, label = 'วันที่', disabled = false }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {label}
                </label>
            )}
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
        </div>
    );
};

export default DatePicker;

