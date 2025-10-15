import React from 'react';

const StudentAttendanceRow = ({ student, statuses, selectedStatus, onStatusChange }) => {
    const getStatusColor = (statusName) => {
        const colors = {
            มา: 'bg-green-500 hover:bg-green-600',
            สาย: 'bg-yellow-500 hover:bg-yellow-600',
            ลา: 'bg-blue-500 hover:bg-blue-600',
            ขาด: 'bg-red-500 hover:bg-red-600',
        };
        return colors[statusName] || 'bg-gray-500 hover:bg-gray-600';
    };

    return (
        <div className="grid grid-cols-12 gap-2 px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors items-center">
            <div className="col-span-1 font-semibold text-gray-700">
                {student.studentNumber}
            </div>

            <div className="col-span-5 md:col-span-4">
                <p className="font-medium text-gray-800">{student.fullName}</p>
                <p className="text-xs text-gray-500">{student.studentId}</p>
            </div>

            <div className="col-span-6 md:col-span-7 flex flex-wrap gap-2">
                {statuses.map((status) => (
                    <button
                        key={status.id}
                        onClick={() => onStatusChange(student.id, status.id)}
                        className={`px-3 py-1.5 rounded text-white text-sm font-semibold transition-all ${selectedStatus === status.id
                                ? getStatusColor(status.name) + ' ring-2 ring-offset-2 ring-blue-300'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                    >
                        {status.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StudentAttendanceRow;