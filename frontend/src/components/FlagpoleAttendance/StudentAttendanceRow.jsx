import React from 'react';
import { AlertCircle } from 'lucide-react';

const StudentAttendanceRow = ({ student, statuses, selectedStatus, onStatusChange, studentNumber }) => {
    const getStatusStyle = (statusName) => {
        const styles = {
            "มา": {
                bg: 'bg-green-500 hover:bg-green-600',
                icon: 'bi-check-circle-fill'
            },
            "สาย": {
                bg: 'bg-yellow-500 hover:bg-yellow-600',
                icon: 'bi-clock-fill'
            },
            "ลาป่วย": {
                bg: 'bg-blue-500 hover:bg-blue-600',
                icon: 'bi-heart-pulse-fill'
            },
            "ลากิจ": {
                bg: 'bg-purple-500 hover:bg-purple-600',
                icon: 'bi-file-text-fill'
            },
            "ขาด": {
                bg: 'bg-red-500 hover:bg-red-600',
                icon: 'bi-x-circle-fill'
            },
        };
        return styles[statusName] || { bg: 'bg-gray-500 hover:bg-gray-600', icon: 'bi-question-circle-fill' };
    };

    // ฟังก์ชันกำหนดสีและไอคอนตาม gender
    const getGenderIcon = (namePrefix) => {
        const malePrefix = ['เด็กชาย', 'นาย'];
        const femalePrefix = ['เด็กหญิง', 'นางสาว', 'นาง'];

        if (malePrefix.includes(namePrefix)) {
            return {
                icon: 'bi-person-fill',
                color: 'text-blue-500',
                bgColor: 'bg-blue-100'
            };
        } else if (femalePrefix.includes(namePrefix)) {
            return {
                icon: 'bi-person-fill',
                color: 'text-pink-500',
                bgColor: 'bg-pink-100'
            };
        }

        // Default (กรณีไม่ตรงเงื่อนไข)
        return {
            icon: 'bi-person-fill',
            color: 'text-gray-500',
            bgColor: 'bg-gray-100'
        };
    };

    const isUnchecked = selectedStatus === null || selectedStatus === undefined;
    const genderIcon = getGenderIcon(student.namePrefix);

    return (
        /* Mobile First: Vertical Card Layout, Tablet+: Horizontal Grid */
        <div className={`flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-5 py-4 md:py-4 border-2 rounded-lg md:rounded-xl transition-all hover:shadow-md ${isUnchecked
                ? 'bg-orange-50 border-orange-300 hover:border-orange-400'
                : 'bg-white border-gray-200 hover:border-amber-300'
            }`}>
            
            {/* Mobile: Horizontal Student Info, Desktop: Grid Layout */}
            <div className="flex items-start md:contents gap-3 md:gap-0">
                {/* Student Number - Top Aligned */}
                <div className="flex-shrink-0 md:col-span-1 md:flex md:items-start md:pt-1">
                    <div className="w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-amber-700 text-sm md:text-base">{studentNumber}</span>
                    </div>
                </div>

                {/* Student Info - Flexible Width */}
                <div className="flex-1 md:col-span-11 md:col-start-2 md:grid md:grid-cols-11 md:gap-4 md:items-start">
                    {/* Name & ID Section */}
                    <div className="md:col-span-4">
                        <div className="flex items-start gap-2.5 md:gap-3">
                            {/* Gender Icon - Top Aligned */}
                            <div className={`${genderIcon.bgColor} rounded-lg px-2.5 py-2 md:px-3 md:py-2 flex items-center justify-center flex-shrink-0`}>
                                <i className={`bi ${genderIcon.icon} ${genderIcon.color} text-lg md:text-xl`}></i>
                            </div>
                            
                            {/* Student Details */}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-800 text-base md:text-base leading-tight mb-0.5">
                                    {student.namePrefix} {student.fullName}
                                </p>
                                <p className="text-xs md:text-xs text-gray-500">
                                    รหัส: {student.studentNumber}
                                </p>
                                {isUnchecked && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <AlertCircle className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 text-orange-600 flex-shrink-0" />
                                        <span className="text-xs md:text-xs text-orange-700 font-bold">ยังไม่ได้เช็คชื่อ</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Buttons - Full Width on Mobile */}
                    <div className="md:col-span-7 mt-3 md:mt-0">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-2">
                            {statuses.map((status) => {
                                const style = getStatusStyle(status.name);
                                const isSelected = selectedStatus === status.id;

                                return (
                                    <button
                                        key={status.id}
                                        onClick={() => onStatusChange(student.id, status.id)}
                                        title={isSelected ? 'คลิกอีกครั้งเพื่อยกเลิก' : `เลือก ${status.name}`}
                                        className={`px-3 md:px-4 py-3 md:py-2.5 rounded-lg md:rounded-xl text-white text-sm md:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 touch-manipulation min-h-[48px] md:min-h-0 ${
                                            isSelected
                                                ? style.bg + ' ring-4 ring-offset-2 ring-amber-300 md:scale-110'
                                                : 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 md:hover:scale-105'
                                        }`}
                                    >
                                        {isSelected && <i className={`bi ${style.icon} text-base md:text-base flex-shrink-0`}></i>}
                                        <span className="truncate">{status.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceRow;