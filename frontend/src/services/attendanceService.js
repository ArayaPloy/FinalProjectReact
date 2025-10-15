// ============================================
// services/attendanceService.js
// ============================================
import api from './api';

export const attendanceService = {
  // Get attendance statuses
  getStatuses: async () => {
    try {
      const response = await api.get('/attendance/statuses');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดสถานะได้');
    }
  },

  // Get class list
  getClasses: async () => {
    try {
      const response = await api.get('/students/classes');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดรายชื่อห้องเรียนได้');
    }
  },

  // Get students by class
  getStudents: async (className) => {
    try {
      const response = await api.get('/students', {
        params: { class: className },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดรายชื่อนักเรียนได้');
    }
  },

  // Get flagpole attendance
  getFlagpoleAttendance: async (date, className) => {
    try {
      const response = await api.get('/flagpole-attendance', {
        params: { date, class: className },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลเช็คชื่อได้');
    }
  },

  // Bulk create attendance
  bulkCreateAttendance: async (data) => {
    try {
      const response = await api.post('/flagpole-attendance/bulk', data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้');
    }
  },

  // Sync missing to Google Sheet
  syncMissingToSheet: async () => {
    try {
      const response = await api.post('/flagpole-attendance/sync-missing');
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถ sync ข้อมูลได้');
    }
  },

  // Get attendance statistics
  getStatistics: async (startDate, endDate, className) => {
    try {
      const response = await api.get('/flagpole-attendance/statistics', {
        params: { startDate, endDate, class: className },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถโหลดสถิติได้');
    }
  },

  // Fetch from Google Sheet
  fetchFromGoogleSheet: async (sheetName = 'FlagpoleAttendance') => {
    try {
      const response = await api.get('/google-sheet/fetch', {
        params: { sheetName },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลจาก Google Sheet ได้');
    }
  },

  // Import students from Google Sheet
  importStudentsFromSheet: async (sheetName = 'Students') => {
    try {
      const response = await api.post('/google-sheet/import-students', { sheetName });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'ไม่สามารถนำเข้านักเรียนได้');
    }
  },
};