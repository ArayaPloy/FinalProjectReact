// ============================================
// utils/apiConfig.js
// จัดการ API URLs สำหรับทั้ง Development และ Production
// ============================================

/**
 * API Base URL จาก environment variable
 * - Development: http://localhost:5000/api
 * - Production: https://your-domain.com/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * ดึง Backend URL (ไม่รวม /api)
 * ใช้สำหรับ static files, uploads, etc.
 */
export const getBackendURL = () => {
  // ตัด /api ออกจาก URL
  return API_BASE_URL.replace('/api', '');
};

/**
 * สร้าง URL สำหรับ API endpoints
 * @param {string} endpoint - endpoint path เช่น '/upload/image'
 * @returns {string} Full API URL
 */
export const getApiURL = (endpoint) => {
  // ลบ slash ซ้ำ (ถ้ามี)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * สร้าง URL สำหรับ static files (รูปภาพ, ไฟล์, etc.)
 * @param {string} path - path ของไฟล์ เช่น '/uploads/blogs/image.jpg'
 * @returns {string} Full URL
 */
export const getStaticURL = (path) => {
  const backendURL = getBackendURL();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${backendURL}${cleanPath}`;
};

/**
 * ตรวจสอบว่า URL เป็น absolute URL หรือไม่
 * @param {string} url 
 * @returns {boolean}
 */
export const isAbsoluteURL = (url) => {
  return /^https?:\/\//i.test(url);
};

/**
 * แปลง relative URL เป็น absolute URL
 * @param {string} url - URL ที่อาจเป็น relative หรือ absolute
 * @returns {string} Absolute URL
 */
export const toAbsoluteURL = (url) => {
  if (!url) return '';
  if (isAbsoluteURL(url)) return url;
  return getStaticURL(url);
};

// Export environment info สำหรับ debugging
export const ENV_INFO = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiBaseURL: API_BASE_URL,
  backendURL: getBackendURL(),
};

// Log ตอน development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', ENV_INFO);
}
