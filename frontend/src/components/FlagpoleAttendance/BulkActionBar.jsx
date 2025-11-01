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
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b-2 border-amber-200 p-4 md:p-5">
                {/* Mobile: Vertical Stack, Tablet+: Horizontal */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-3">
                    {/* Header - Full Width on Mobile */}
                    <div className="flex items-center gap-2 text-amber-800 font-bold sm:border-r-2 sm:border-amber-300 sm:pr-4 pb-2 sm:pb-0 border-b-2 sm:border-b-0 border-amber-200">
                        <i className="bi bi-lightning-charge-fill text-amber-600 text-lg md:text-xl"></i>
                        <span className="text-sm md:text-base">ตั้งค่าด่วน (ทั้งหมด)</span>
                    </div>
                    
                    {/* Status Buttons - Grid on Mobile, Flex on Tablet+ */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 md:gap-3">
                        {statuses.map((status) => {
                            const style = getStatusStyle(status.name);
                            return (
                                <button
                                    key={status.id}
                                    onClick={() => onBulkChange(status.id)}
                                    disabled={disabled}
                                    className={`px-4 md:px-5 py-3 md:py-2.5 rounded-lg md:rounded-xl text-white font-bold text-sm md:text-base transition-all shadow-md hover:shadow-lg active:scale-95 md:hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100 flex items-center justify-center gap-2 touch-manipulation min-h-[48px] md:min-h-0 ${style.bg}`}
                                >
                                    <i className={`bi ${style.icon} text-base md:text-lg flex-shrink-0`}></i>
                                    <span className="truncate">{status.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkActionBar;