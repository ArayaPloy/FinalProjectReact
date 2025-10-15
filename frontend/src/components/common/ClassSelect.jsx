// ============================================
// src/components/common/ClassSelect.jsx
// ============================================
import React from 'react';
import { Users } from 'lucide-react';

const ClassSelect = ({
    value,
    onChange,
    options = [],
    label = 'ห้องเรียน',
    disabled = false,
    placeholder = '-- เลือกห้อง --'
}) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all appearance-none bg-white"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ClassSelect;