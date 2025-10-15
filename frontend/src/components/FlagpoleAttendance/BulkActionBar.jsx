import React from 'react';
import { CheckCircle } from 'lucide-react';

const BulkActionBar = ({ statuses, onBulkChange, disabled }) => {
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
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
                <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    ตั้งสถานะทั้งหมด:
                </span>
                {statuses.map((status) => (
                    <button
                        key={status.id}
                        onClick={() => onBulkChange(status.id)}
                        disabled={disabled}
                        className={`px-4 py-2 rounded text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getStatusColor(
                            status.name
                        )}`}
                    >
                        {status.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BulkActionBar;