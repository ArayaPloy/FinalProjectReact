import React from 'react';
import { Calendar, Users, Search } from 'lucide-react';

const AttendanceFilters = ({
    selectedDate,
    setSelectedDate,
    selectedClass,
    setSelectedClass,
    classList,
    searchQuery,
    setSearchQuery,
}) => {
    return (
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Picker */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-calendar-event text-amber-600"></i>
                        วันที่
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                </div>

                {/* Class Select */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-people-fill text-amber-600"></i>
                        ห้องเรียน
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                    >
                        <option value="">-- เลือกห้อง --</option>
                        {classList.map((cls) => (
                            <option key={cls} value={cls}>
                                {cls}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search Box */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-search text-amber-600"></i>
                        ค้นหานักเรียน
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ชื่อ, รหัส, เลขที่..."
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceFilters;