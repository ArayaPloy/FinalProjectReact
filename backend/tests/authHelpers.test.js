const { isTeacherHomeroomMatch } = require('../src/routes/homevisits.route').authHelpers;

describe('isTeacherHomeroomMatch', () => {
    test('returns false when role is missing', () => {
        expect(isTeacherHomeroomMatch(null, 1, 1)).toBe(false);
    });

    test('returns false when role is not teacher', () => {
        expect(isTeacherHomeroomMatch('admin', 1, 1)).toBe(false);
        expect(isTeacherHomeroomMatch('staff', 1, 1)).toBe(false);
    });

    test('returns false when teacher ids are missing', () => {
        expect(isTeacherHomeroomMatch('teacher', null, 1)).toBe(false);
        expect(isTeacherHomeroomMatch('teacher', 1, null)).toBe(false);
    });

    test('returns true when teacher ids match', () => {
        expect(isTeacherHomeroomMatch('teacher', 5, 5)).toBe(true);
        expect(isTeacherHomeroomMatch('Teacher', '7', 7)).toBe(true);
    });

    test('returns false when teacher ids do not match', () => {
        expect(isTeacherHomeroomMatch('teacher', 3, 4)).toBe(false);
    });
});
