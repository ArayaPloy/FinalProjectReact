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
        <div className={`grid grid-cols-12 gap-3 px-4 py-3 border rounded-lg transition-all items-center ${isUnchecked
                ? 'bg-orange-50 border-orange-200 hover:bg-orange-100'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}>
            <div className="col-span-1 font-semibold text-gray-700">
                {studentNumber}
            </div>

            <div className="col-span-5 md:col-span-4">
                <div className="flex items-center gap-2">
                    {/* <div className={`${genderIcon.bgColor} rounded-full px-2.5 py-2 flex items-center justify-center`}>
                        <i className={`bi ${genderIcon.icon} ${genderIcon.color} text-sm`}></i>
                    </div> */}
                    <div className="flex-1">
                        <p className="font-semibold text-gray-800 p-0 m-0">
                            <i className={`bi ${genderIcon.icon} ${genderIcon.color} text-lg mr-2`}></i>
                            {student.namePrefix} {student.fullName}
                        </p>
                        {isUnchecked && (
                            <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-orange-600" />
                                <span className="text-xs text-orange-700 font-semibold">ยังไม่ได้เช็คชื่อ</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="col-span-6 md:col-span-7 flex flex-wrap gap-2">
                {statuses.map((status) => {
                    const style = getStatusStyle(status.name);
                    const isSelected = selectedStatus === status.id;

                    return (
                        <button
                            key={status.id}
                            onClick={() => onStatusChange(student.id, status.id)}
                            title={isSelected ? 'คลิกอีกครั้งเพื่อยกเลิก' : `เลือก ${status.name}`}
                            className={`px-3 py-2 rounded-lg text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 ${isSelected
                                    ? style.bg + ' ring-2 ring-offset-1 ring-blue-400 scale-105'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        >
                            {isSelected && <i className={`bi ${style.icon}`}></i>}
                            {status.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentAttendanceRow;