import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  students: [],
  statuses: [],
  classList: [],
  attendanceRecords: {},
  loading: false,
  error: null
};

const flagpoleAttendanceSlice = createSlice({
  name: 'flagpoleAttendance',
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setStatuses: (state, action) => {
      state.statuses = action.payload;
    },
    setClassList: (state, action) => {
      state.classList = action.payload;
    },
    setAttendanceRecords: (state, action) => {
      state.attendanceRecords = action.payload;
    },
    updateAttendanceRecord: (state, action) => {
      const { studentId, statusId } = action.payload;
      state.attendanceRecords[studentId] = statusId;
    },
    setBulkAttendance: (state, action) => {
      const { statusId, studentIds } = action.payload;
      studentIds.forEach(id => {
        state.attendanceRecords[id] = statusId;
      });
    }
  }
});

export const {
  setStudents,
  setStatuses,
  setClassList,
  setAttendanceRecords,
  updateAttendanceRecord,
  setBulkAttendance
} = flagpoleAttendanceSlice.actions;

export default flagpoleAttendanceSlice.reducer;