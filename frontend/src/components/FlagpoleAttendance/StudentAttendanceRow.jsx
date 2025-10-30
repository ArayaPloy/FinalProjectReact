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
        <div className={`grid grid-cols-12 gap-4 px-5 py-4 border-2 rounded-xl transition-all items-center hover:shadow-md ${isUnchecked
                ? 'bg-orange-50 border-orange-300 hover:border-orange-400'
                : 'bg-white border-gray-200 hover:border-amber-300'
            }`}>
            <div className="col-span-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center">
                    <span className="font-bold text-amber-700">{studentNumber}</span>
                </div>
            </div>

            <div className="col-span-5 md:col-span-4">
                <div className="flex items-center gap-3">
                    <div className={`${genderIcon.bgColor} rounded-lg px-3 py-2 flex items-center justify-center`}>
                        <i className={`bi ${genderIcon.icon} ${genderIcon.color} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-800 text-base">
                            {student.namePrefix} {student.fullName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            <i className="bi bi-credit-card-2-front mr-1"></i>
                            รหัส: {student.studentNumber}
                        </p>
                        {isUnchecked && (
                            <div className="flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-xs text-orange-700 font-bold">ยังไม่ได้เช็คชื่อ</span>
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
                            className={`px-4 py-2.5 rounded-xl text-white text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${isSelected
                                    ? style.bg + ' ring-4 ring-offset-2 ring-amber-300 scale-110'
                                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
                                }`}
                        >
                            {isSelected && <i className={`bi ${style.icon} text-base`}></i>}
                            {status.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentAttendanceRow;