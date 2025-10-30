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
    minDate,
    maxDate,
    // Academic Year & Semester props
    selectedAcademicYear,
    setSelectedAcademicYear,
    selectedSemester,
    setSelectedSemester,
    academicYears,
    availableSemesters,
    isLoadingYears,
}) => {
    return (
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
            {/* Academic Year & Semester Selection */}
            {academicYears && academicYears.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Academic Year */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <i className="bi bi-calendar-event text-amber-600"></i>
                            ปีการศึกษา
                        </label>
                        <select
                            value={selectedAcademicYear}
                            onChange={(e) => {
                                setSelectedAcademicYear(e.target.value);
                                setSelectedSemester(''); // Reset semester when year changes
                            }}
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                            disabled={isLoadingYears}
                        >
                            <option value="">-- เลือกปีการศึกษา --</option>
                            {academicYears.map((year) => (
                                <option key={year.id} value={year.id}>
                                    ปีการศึกษา {parseInt(year.year)}
                                    {year.isCurrent && ' (ปัจจุบัน)'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Semester */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <i className="bi bi-calendar3 text-amber-600"></i>
                            ภาคเรียน
                        </label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold"
                            disabled={!selectedAcademicYear || availableSemesters.length === 0}
                        >
                            <option value="">-- เลือกภาคเรียน --</option>
                            {availableSemesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                    ภาคเรียนที่ {semester.semesterNumber}
                                    {semester.isCurrent && ' (ปัจจุบัน)'}
                                    {' '}
                                    ({new Date(semester.startDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                                    {' - '}
                                    {new Date(semester.endDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Original Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Picker */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-calendar-event text-amber-600"></i>
                        วันที่
                        {minDate && maxDate && (
                            <span className="text-xs text-gray-500 font-normal ml-1">
                                (จำกัดตามภาคเรียน)
                            </span>
                        )}
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={minDate}
                        max={maxDate}
                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    />
                    {minDate && maxDate && (
                        <p className="text-xs text-gray-500 mt-1">
                            ช่วง: {new Date(minDate).toLocaleDateString('th-TH')} - {new Date(maxDate).toLocaleDateString('th-TH')}
                        </p>
                    )}
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