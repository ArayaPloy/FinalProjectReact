import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * 🛡️ Error Boundary Component
 * 
 * จับ JavaScript errors ที่เกิดขึ้นใน component tree ลูกทั้งหมด
 * ป้องกันไม่ให้ app crash ทั้งหมด และแสดง fallback UI 
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0
        };
    }

    /**
     * Static method ที่ถูกเรียกเมื่อมี error เกิดขึ้น
     * ใช้สำหรับ update state เพื่อแสดง fallback UI
     */
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    /**
     * Lifecycle method ที่ถูกเรียกหลังจาก component ลูก throw error
     * ใช้สำหรับ log error details
     */
    componentDidCatch(error, errorInfo) {
        // 📊 Log error สำหรับ debugging
        console.error('🚨 ErrorBoundary caught an error:', error);
        console.error('📍 Error location:', errorInfo.componentStack);

        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1
        }));

        // 💡 Optional: ส่ง error ไปยัง error tracking service
        // เช่น Sentry, LogRocket, etc.
        // if (window.Sentry) {
        //   window.Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
        // }
    }

    /**
     * รีเซ็ต error state และพยายาม render component อีกครั้ง
     */
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    /**
     * Navigate กลับไปหน้าหลัก (Dashboard)
     */
    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        const { hasError, error, errorInfo, errorCount } = this.state;
        const { children, fallback } = this.props;

        // ถ้ามี error เกิดขึ้น แสดง fallback UI
        if (hasError) {
            // ใช้ custom fallback ถ้ามี
            if (fallback) {
                return typeof fallback === 'function'
                    ? fallback(error, this.handleReset)
                    : fallback;
            }

            // Default fallback UI - Mobile Optimized
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full">
                        {/* Error Card */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-red-200">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 sm:px-8 py-6 sm:py-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                        <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                                            เกิดข้อผิดพลาด
                                        </h1>
                                        <p className="text-red-100 text-sm sm:text-base">
                                            ระบบพบปัญหาในการแสดงผล
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
                                {/* User-friendly Message */}
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 sm:p-5">
                                    <div className="flex items-start gap-3">
                                        <i className="bi bi-exclamation-triangle-fill text-orange-600 text-xl flex-shrink-0 mt-0.5"></i>
                                        <div className="flex-1">
                                            <p className="text-gray-800 font-semibold mb-2">ขออภัยในความไม่สะดวก</p>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                เกิดข้อผิดพลาดบางอย่างที่ทำให้หน้านี้แสดงผลไม่ได้ กรุณาลองรีเฟรชหน้าเว็บ
                                                หรือกลับไปหน้าหลัก หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Error Details - Collapsible */}
                                {process.env.NODE_ENV === 'development' && error && (
                                    <details className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                                        <summary className="cursor-pointer font-semibold text-gray-800 flex items-center gap-2 select-none">
                                            <i className="bi bi-code-slash text-gray-600"></i>
                                            <span>รายละเอียดสำหรับ Developer</span>
                                            <span className="text-xs text-gray-500 ml-auto">(คลิกเพื่อดู)</span>
                                        </summary>
                                        <div className="mt-4 space-y-3">
                                            {/* Error Message */}
                                            <div>
                                                <p className="text-xs font-bold text-gray-600 mb-1">Error Message:</p>
                                                <pre className="bg-red-100 text-red-800 p-3 rounded-lg text-xs overflow-x-auto">
                                                    {error.toString()}
                                                </pre>
                                            </div>

                                            {/* Component Stack */}
                                            {errorInfo && (
                                                <div>
                                                    <p className="text-xs font-bold text-gray-600 mb-1">Component Stack:</p>
                                                    <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg text-xs overflow-x-auto max-h-48 overflow-y-auto">
                                                        {errorInfo.componentStack}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Error Count */}
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <i className="bi bi-arrow-repeat"></i>
                                                <span>Error occurred <span className="font-bold text-red-600">{errorCount}</span> time(s)</span>
                                            </div>
                                        </div>
                                    </details>
                                )}

                                {/* Action Buttons */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Retry Button */}
                                    <button
                                        onClick={this.handleReset}
                                        className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white px-6 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 touch-manipulation"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        <span>ลองใหม่อีกครั้ง</span>
                                    </button>

                                    {/* Home Button */}
                                    <button
                                        onClick={this.handleGoHome}
                                        className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white px-6 py-3.5 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 touch-manipulation"
                                    >
                                        <Home className="w-5 h-5" />
                                        <span>กลับหน้าหลัก</span>
                                    </button>
                                </div>

                                {/* Help Text */}
                                <div className="text-center text-sm text-gray-500 pt-2">
                                    <p>หากปัญหายังคงอยู่ กรุณาติดต่อ: <span className="font-semibold text-amber-600">admin@school.ac.th</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center mt-6 text-sm text-gray-600">
                            <p>Error ID: <span className="font-mono text-xs bg-white px-2 py-1 rounded">{Date.now()}</span></p>
                        </div>
                    </div>
                </div>
            );
        }

        // ถ้าไม่มี error ให้ render children ตามปกติ
        return children;
    }
}

export default ErrorBoundary;
