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
        <div className="space-y-4 md:space-y-5">
            {/* Academic Year & Semester Selection - Mobile Optimized */}
            {academicYears && academicYears.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {/* Academic Year */}
                    <div>
                        <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                            <i className="bi bi-calendar-event text-amber-600 text-base md:text-base"></i>
                            <span>ปีการศึกษา</span>
                        </label>
                        <select
                            value={selectedAcademicYear}
                            onChange={(e) => {
                                setSelectedAcademicYear(e.target.value);
                                setSelectedSemester(''); // Reset semester when year changes
                            }}
                            className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
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
                        <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                            <i className="bi bi-calendar3 text-amber-600 text-base md:text-base"></i>
                            <span>ภาคเรียน</span>
                        </label>
                        <select
                            value={selectedSemester}
                            onChange={(e) => setSelectedSemester(e.target.value)}
                            className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
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

            {/* Main Filters - Mobile First Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {/* Date Picker - Full Width on Mobile */}
                <div className="sm:col-span-2 lg:col-span-1">
                    <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-calendar-event text-amber-600 text-base md:text-base"></i>
                        <span>วันที่</span>
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
                        className="w-full px-4 py-3 md:py-3.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                    />
                    {minDate && maxDate && (
                        <p className="text-xs md:text-xs text-gray-500 mt-1.5">
                            📅 ช่วง: {new Date(minDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - {new Date(maxDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                    )}
                </div>

                {/* Class Select */}
                <div>
                    <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-people-fill text-amber-600 text-base md:text-base"></i>
                        <span>ห้องเรียน</span>
                    </label>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 md:py-2.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all font-semibold touch-manipulation"
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
                    <label className="flex items-center gap-2 text-sm md:text-sm font-bold text-gray-700 mb-2">
                        <i className="bi bi-search text-amber-600 text-base md:text-base"></i>
                        <span>ค้นหานักเรียน</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ชื่อหรือรหัสนักเรียน"
                            className="w-full px-4 py-3 md:py-3.5 text-base md:text-base border-2 border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all touch-manipulation"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                title="ล้างการค้นหา"
                            >
                                <i className="bi bi-x-circle-fill text-lg"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceFilters;