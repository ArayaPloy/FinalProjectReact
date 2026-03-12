import Swal from 'sweetalert2';

// Toast notification (แสดงมุมขวาบน)
export const showToast = (icon, title, timer = 3000) => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    return Toast.fire({ icon, title });
};

// Success alert
export const showSuccess = (title, text = '', timer = null) => {
    return Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonColor: '#3B82F6',
        timer,
        showConfirmButton: !timer,
    });
};

// Error alert
export const showError = (title, text = '') => {
    return Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonColor: '#EF4444',
    });
};

// Warning alert
export const showWarning = (title, text = '') => {
    return Swal.fire({
        icon: 'warning',
        title,
        text,
        confirmButtonColor: '#F59E0B',
    });
};

// Info alert
export const showInfo = (title, text = '') => {
    return Swal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonColor: '#3B82F6',
    });
};

// Loading alert
export const showLoading = (title = 'กำลังโหลด...', text = 'กรุณารอสักครู่') => {
    return Swal.fire({
        title,
        html: text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

// Confirmation alert
export const showConfirm = (title, text = '', confirmButtonText = 'ยืนยัน', cancelButtonText = 'ยกเลิก') => {
    return Swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor: '#3B82F6',
        cancelButtonColor: '#6B7280',
        reverseButtons: true,
    });
};

// Delete confirmation
export const showDeleteConfirm = (itemName = 'รายการนี้') => {
    return Swal.fire({
        title: 'ยืนยันการลบ',
        html: `คุณต้องการลบ <strong>${itemName}</strong> หรือไม่?<br><small class="text-red-600">การดำเนินการนี้ไม่สามารถย้อนกลับได้</small>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ลบเลย',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        reverseButtons: true,
    });
};

// Custom HTML alert
export const showCustom = (options) => {
    return Swal.fire({
        confirmButtonColor: '#3B82F6',
        ...options,
    });
};

// Close any open alert
export const closeAlert = () => {
    Swal.close();
};

// Permission denied alert (403 Forbidden)
export const showPermissionError = (action = 'ดำเนินการนี้') => {
    return Swal.fire({
        icon: 'warning',
        title: 'ไม่มีสิทธิ์ดำเนินการ',
        html: `<p>คุณไม่มีสิทธิ์<strong>${action}</strong></p><p class="text-sm text-gray-500 mt-2">เฉพาะบัญชีที่มีสิทธิ์เท่านั้นที่สามารถดำเนินการนี้ได้<br>หากต้องการความช่วยเหลือ กรุณาติดต่อผู้ดูแลระบบ</p>`,
        confirmButtonColor: '#D97706',
        confirmButtonText: 'ตกลง',
    });
};

// Smart API error handler – detects 403 permission errors automatically
export const showApiError = (error, fallbackMessage = 'ไม่สามารถดำเนินการได้', action = 'ดำเนินการนี้') => {
    const status = error?.status ?? error?.data?.statusCode;
    if (status === 403) {
        return showPermissionError(action);
    }
    return Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.data?.message || error?.message || fallbackMessage,
        confirmButtonColor: '#EF4444',
        confirmButtonText: 'ตกลง',
    });
};

export default {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showConfirm,
    showDeleteConfirm,
    showCustom,
    closeAlert,
    showPermissionError,
    showApiError,
};