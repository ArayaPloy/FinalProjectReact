import React from 'react';
import { Zap } from 'lucide-react';

const BulkActionBar = ({ statuses, onBulkChange, disabled }) => {
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

    return (
        <div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-gray-700 font-semibold border-r border-gray-300 pr-4">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span>ตั้งค่าด่วน</span>
                </div>
                {statuses.map((status) => {
                    const style = getStatusStyle(status.name);
                    return (
                        <button
                            key={status.id}
                            onClick={() => onBulkChange(status.id)}
                            disabled={disabled}
                            className={`px-4 py-2 rounded-lg text-white font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${style.bg}`}
                        >
                            <i className={`bi ${style.icon}`}></i>
                            {status.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BulkActionBar;