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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b-2 border-amber-200 p-5">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-800 font-bold border-r-2 border-amber-300 pr-4">
                        <i className="bi bi-lightning-charge-fill text-amber-600 text-xl"></i>
                        <span>ตั้งค่าด่วน (ทั้งหมด)</span>
                    </div>
                    {statuses.map((status) => {
                        const style = getStatusStyle(status.name);
                        return (
                            <button
                                key={status.id}
                                onClick={() => onBulkChange(status.id)}
                                disabled={disabled}
                                className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 ${style.bg}`}
                            >
                                <i className={`bi ${style.icon} text-lg`}></i>
                                {status.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BulkActionBar;