import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
    Home, 
    Users, 
    FileText, 
    Calendar, 
    MapPin, 
    Phone, 
    Mail, 
    CheckCircle, 
    Upload,
    X,
    Eye,
    Save,
    RotateCcw,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useFetchTeachersByDepartmentQuery } from '../../redux/features/teachers/teachersApi';
import { getApiURL } from '../../utils/apiConfig';

const HomeVisits = () => {
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [userTeacherId, setUserTeacherId] = useState(null);
    const [isStudentAllowed, setIsStudentAllowed] = useState(true);
    
    // Form data state - ตรงกับ backend schema
    const [formData, setFormData] = useState({
        // IDs
        teacherId: null,
        studentId: null,
        
        // Basic Info - Student (auto-filled from database)
        studentNumber: '',
        studentFirstName: '',
        studentLastName: '',
        studentNamePrefix: '',
        className: '',
        studentBirthDate: '',
        genderName: '',
        
        // Teacher Info (auto-filled)
        teacherFirstName: '',
        teacherLastName: '',
        teacherNamePrefix: '',
        
        // Guardian Info (from student table, auto-filled)
        guardianFirstName: '',
        guardianLastName: '',
        guardianNamePrefix: '',
        guardianRelation: '',
        guardianOccupation: '',
        guardianMonthlyIncome: '',
        
        // Address & House (from student table, auto-filled)
        address: '',
        phoneNumber: '',
        emergencyContact: '',
        houseType: '',
        houseMaterial: '',
        utilities: '',
        studyArea: '',
        // Option to persist updated student data back to students table
        updateStudent: false,
        
        // Visit Info
        visitDate: new Date().toISOString().split('T')[0],
        
        // Parent Info (specific to this visit - may differ from guardian)
        parentNamePrefix: '',
        parentFirstName: '',
        parentLastName: '',
        familyStatus: '',
        
        // Visit Details
        visitPurpose: '',
        studentBehaviorAtHome: '',
        parentCooperation: '',
        problems: '',
        recommendations: '',
        followUpPlan: '',
        summary: '',
        notes: ''
    });

    // API hooks
    const { data: teachersByDepartment = {}, isLoading: teachersLoading } = useFetchTeachersByDepartmentQuery();

    // Fetch current user info to determine role and linked teacherId
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch(getApiURL('/auth/me'), { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    const u = data.user || {};
                    if (u.role) setUserRole(u.role);
                    // ใช้ teacherId โดยตรงจาก users table (users.teacherId = teachers.id)
                    if (u.teacherId) {
                        setUserTeacherId(u.teacherId);
                    } else {
                        // fallback: ดึงจาก teacher relation
                        const t = u.teacher;
                        if (Array.isArray(t) && t.length > 0) setUserTeacherId(t[0].id);
                        else if (t && t.id) setUserTeacherId(t.id);
                    }
                }
            } catch (err) {
                console.error('Error fetching current user:', err);
            }
        };
        fetchMe();
    }, []);

    // Ensure formData.teacherId is set for teacher users (lock the field)
    useEffect(() => {
        if (userRole && userRole.toLowerCase() === 'teacher' && userTeacherId) {
            setFormData(prev => ({ ...prev, teacherId: userTeacherId }));
        }
    }, [userRole, userTeacherId]);

    // Flatten teachers - updated for firstName/lastName
    const allTeachers = [];
    Object.keys(teachersByDepartment).forEach(department => {
        teachersByDepartment[department].forEach(teacher => {
            // API returns `name` (constructed) and `namePrefix`; prefer `name` when available
            const apiFull = teacher.name || teacher.fullName || '';
            allTeachers.push({
                id: teacher.id,
                namePrefix: teacher.namePrefix || '',
                firstName: teacher.firstName || '',
                lastName: teacher.lastName || '',
                fullName: apiFull || `${teacher.namePrefix || ''}${teacher.firstName || ''}${teacher.lastName ? ' ' + teacher.lastName : ''}`.trim(),
                department: department
            });
        });
    });
    allTeachers.sort((a, b) => a.fullName.localeCompare(b.fullName, 'th'));

    // Steps configuration
    const steps = [
        { icon: <Users className="w-6 h-6" />, title: 'ข้อมูลพื้นฐาน' },
        { icon: <Home className="w-6 h-6" />, title: 'ที่อยู่และสภาพบ้าน' },
        { icon: <FileText className="w-6 h-6" />, title: 'รายละเอียดการเยี่ยม' },
        { icon: <CheckCircle className="w-6 h-6" />, title: 'เสร็จสิ้น' }
    ];

    // Handle form input change
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Helper to toggle multi-choice fields stored as comma-separated strings
    const parseMulti = (value) => {
        if (!value && value !== 0) return [];
        if (Array.isArray(value)) return value.map(v => (v || '').toString().trim()).filter(Boolean);
        return value.toString().split(/,\s*/).map(v => v.trim()).filter(Boolean);
    };

    const toggleMultiChoice = (field, option) => {
        const current = parseMulti(formData[field]);
        let newValues;
        if (current.includes(option)) {
            newValues = current.filter(v => v !== option);
        } else {
            newValues = [...current, option];
        }
        handleInputChange(field, newValues.join(', '));
    };

    // Handle student number input - auto-fill student data
    const handleStudentNumberChange = async (studentNumber) => {
        handleInputChange('studentNumber', studentNumber);
        
        if (studentNumber && studentNumber.length === 5) {
            try {
                const response = await fetch(getApiURL(`/homevisits/student/${studentNumber}`), {
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        const student = result.data;

                        // If current user is a teacher, ensure they are homeroom teacher for this student
                        if (userRole && userRole.toLowerCase() === 'teacher') {
                            const htId = student.homeroomClass?.homeroomTeacherId || null;
                            if (!htId || userTeacherId !== htId) {
                                setIsStudentAllowed(false);
                                Swal.fire({
                                    icon: 'error',
                                    title: 'คุณไม่ได้รับอนุญาต',
                                    text: 'คุณไม่สามารถบันทึกการเยี่ยมบ้านสำหรับนักเรียนคนนี้ เนื่องจากไม่ใช่นักเรียนที่คุณเป็นครูประจำชั้น',
                                    confirmButtonColor: '#D97706',
                                    confirmButtonText: 'ตกลง'
                                });
                                return;
                            }
                            // allowed
                            setIsStudentAllowed(true);
                        }

                        // helper: parse a full name into prefix/first/last
                        const parseNameParts = (fullName) => {
                            const prefixes = ['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง', 'ด.ช.', 'ด.ญ.'];
                            if (!fullName || typeof fullName !== 'string') return { prefix: '', first: '', last: '' };
                            const parts = fullName.trim().split(/\s+/);
                            let prefix = '';
                            if (parts.length && prefixes.includes(parts[0])) {
                                prefix = parts.shift();
                            }
                            if (parts.length === 0) return { prefix, first: '', last: '' };
                            if (parts.length === 1) return { prefix, first: parts[0], last: '' };
                            return { prefix, first: parts[0], last: parts.slice(1).join(' ') };
                        };

                        // Parse guardian fallback if split fields are not present
                        let gPrefix = student.guardianNamePrefix || student.guardianPrefix || student.parentNamePrefix || '';
                        let gFirst = student.guardianFirstName || '';
                        let gLast = student.guardianLastName || '';
                        if (!gFirst && !gLast && student.guardianName) {
                            const parsed = parseNameParts(student.guardianName);
                            gPrefix = gPrefix || parsed.prefix;
                            gFirst = parsed.first;
                            gLast = parsed.last;
                        }

                        // Teacher full name fallback
                        let teacherFull = '';
                        if (student.homeroomClass?.homeroomTeacher) {
                            const ht = student.homeroomClass.homeroomTeacher;
                            teacherFull = ht.name || ht.fullName || `${ht.namePrefix || ''}${ht.firstName || ''}${ht.lastName ? ' ' + ht.lastName : ''}`.trim();
                        }

                        // Auto-fill student data
                        setFormData(prev => ({
                            ...prev,
                            studentId: student.id,
                            studentFirstName: student.firstName || '',
                            studentLastName: student.lastName || '',
                            studentNamePrefix: student.namePrefix || '',
                            studentBirthDate: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
                            className: student.homeroomClass?.className || '',
                            genderName: student.genders?.genderName || '',

                            // Guardian info (use split fields or parsed fallback)
                            guardianFirstName: gFirst || '',
                            guardianLastName: gLast || '',
                            guardianNamePrefix: gPrefix || '',
                            guardianRelation: student.guardianRelation || '',
                            guardianOccupation: '',
                            guardianMonthlyIncome: student.guardianMonthlyIncome || '',

                            // Parent info for this visit — pre-fill จาก guardian ถ้ามี
                            parentNamePrefix: gPrefix || '',
                            parentFirstName: gFirst || '',
                            parentLastName: gLast || '',

                            // Address & contact
                            address: student.address || '',
                            phoneNumber: student.phoneNumber || '',
                            emergencyContact: student.emergencyContact || '',

                            // House info (accept array from API or comma-separated string)
                            houseType: Array.isArray(student.houseType) ? student.houseType.join(', ') : (student.houseType || ''),
                            houseMaterial: Array.isArray(student.houseMaterial) ? student.houseMaterial.join(', ') : (student.houseMaterial || ''),
                            utilities: Array.isArray(student.utilities) ? student.utilities.join(', ') : (student.utilities || ''),
                            studyArea: Array.isArray(student.studyArea) ? student.studyArea.join(', ') : (student.studyArea || ''),

                            // Teacher info — ดึงจาก homeroomClass.homeroomTeacher (path ที่ถูกต้อง)
                            teacherId: student.homeroomClass?.homeroomTeacher?.id || null,
                            teacherFirstName: student.homeroomClass?.homeroomTeacher?.firstName || '',
                            teacherLastName: student.homeroomClass?.homeroomTeacher?.lastName || '',
                            teacherNamePrefix: student.homeroomClass?.homeroomTeacher?.namePrefix || '',
                            teacherFullName: teacherFull || ''
                        }));

                        Swal.fire({
                            icon: 'success',
                            title: 'พบข้อมูลนักเรียน',
                            text: `${student.namePrefix || ''} ${student.firstName} ${student.lastName}`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                } else if (response.status === 404) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'ไม่พบข้อมูล',
                        text: 'ไม่พบรหัสนักเรียนนี้ในระบบ',
                        confirmButtonColor: '#D97706',
                        confirmButtonText: 'ตกลง'
                    });
                }
            } catch (error) {
                console.error('Error fetching student:', error);
            }
        }
    };

    // Handle teacher selection with ID
    const handleTeacherChange = (teacherId) => {
        const teacher = allTeachers.find(t => t.id === parseInt(teacherId));
        if (teacher) {
            setFormData(prev => ({
                ...prev,
                teacherId: teacher.id,
                teacherFirstName: teacher.firstName || teacher.fullName || '',
                teacherLastName: teacher.lastName || '',
                teacherNamePrefix: teacher.namePrefix || '',
                teacherFullName: teacher.fullName || teacher.namePrefix && teacher.firstName ? `${teacher.namePrefix}${teacher.firstName}${teacher.lastName ? ' ' + teacher.lastName : ''}` : (teacher.fullName || '')
            }));
        }
    };

    // File upload handlers
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ไม่ถูกต้อง',
                    text: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF)',
                    confirmButtonColor: '#D97706',
                    confirmButtonText: 'ตกลง'
                });
                return false;
            }
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ใหญ่เกินไป',
                    text: 'ขนาดไฟล์ต้องไม่เกิน 2MB',
                    confirmButtonColor: '#D97706',
                    confirmButtonText: 'ตกลง'
                });
                return false;
            }
            return true;
        });

        if (fileList.length + validFiles.length > 5) {
            Swal.fire({
                icon: 'warning',
                title: 'เกินจำนวนที่กำหนด',
                text: 'อัปโหลดได้สูงสุด 5 ไฟล์',
                confirmButtonColor: '#D97706',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        const newFiles = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random()
        }));

        setFileList(prev => [...prev, ...newFiles]);
    };

    const handleFileRemove = (fileId) => {
        const file = fileList.find(f => f.id === fileId);
        if (file && file.preview) {
            URL.revokeObjectURL(file.preview);
        }
        setFileList(prev => prev.filter(f => f.id !== fileId));
    };

    // Validation
    const validateStep = (step) => {
        const requiredFields = {
            0: ['studentNumber', 'studentFirstName', 'studentLastName', 'visitDate', 'parentFirstName', 'parentLastName', 'studentId'],
            1: ['address'],
            2: ['visitPurpose', 'summary']
        };

        const fields = requiredFields[step] || [];
        const emptyFields = fields.filter(field => !formData[field] || formData[field].toString().trim() === '');

        if (emptyFields.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'โปรดระบุข้อมูลที่จำเป็นทั้งหมด',
                confirmButtonColor: '#D97706',
                confirmButtonText: 'ตกลง'
            });
            return false;
        }
        return true;
    };

    // Navigation
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Submit - updated for new schema
    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        // Explicit frontend check for required relation ids
        if (!formData.studentId) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบ',
                text: 'กรุณาระบุรหัสนักเรียนให้ถูกต้องก่อนบันทึก',
                confirmButtonColor: '#D97706',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        // Check if student has homeroom teacher assigned
        // Admin/Super_admin สามารถบันทึกได้โดยไม่ต้องมีครูประจำชั้น (teacherId จะเป็น null)
        const isAdminRole = userRole && (userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'super_admin');
        if (!formData.teacherId && !isAdminRole) {
            Swal.fire({
                icon: 'warning',
                title: 'ยังไม่มีครูประจำชั้น',
                text: 'นักเรียนคนนี้ยังไม่ได้กำหนดครูประจำชั้น กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดครูประจำชั้นก่อนบันทึกการเยี่ยมบ้าน',
                confirmButtonColor: '#D97706',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        // UI-level guard: if current user is a teacher but student is not allowed, block submit
        if (userRole && userRole.toLowerCase() === 'teacher' && !isStudentAllowed) {
            Swal.fire({
                icon: 'error',
                title: 'คุณไม่ได้รับอนุญาต',
                text: 'คุณไม่สามารถบันทึกการเยี่ยมบ้านสำหรับนักเรียนคนนี้',
                confirmButtonColor: '#D97706',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        try {
            setIsSubmitting(true);
            setUploadProgress(0);

            // Update the student record first (persist canonical student data)
            if (formData.studentId) {
                try {
                    const studentUpdate = {
                        address: formData.address,
                        phoneNumber: formData.phoneNumber,
                        emergencyContact: formData.emergencyContact,
                        houseType: formData.houseType,
                        houseMaterial: formData.houseMaterial,
                        utilities: formData.utilities,
                        studyArea: formData.studyArea,
                        guardianFirstName: formData.guardianFirstName,
                        guardianLastName: formData.guardianLastName,
                        guardianNamePrefix: formData.guardianNamePrefix,
                        guardianRelation: formData.guardianRelation,
                        guardianOccupation: formData.guardianOccupation,
                        guardianMonthlyIncome: formData.guardianMonthlyIncome
                    };

                    const patchResp = await fetch(getApiURL(`/students/${formData.studentId}`), {
                        method: 'PATCH',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                        },
                        body: JSON.stringify(studentUpdate)
                    });

                    if (!patchResp.ok) {
                        const err = await patchResp.json().catch(() => ({}));
                        throw new Error(err.message || `Failed to update student: HTTP ${patchResp.status}`);
                    }
                } catch (err) {
                    setIsSubmitting(false);
                    setUploadProgress(0);
                    Swal.fire({
                        icon: 'error',
                        title: 'ไม่สามารถอัปเดตข้อมูลนักเรียน',
                        text: err.message || 'เกิดข้อผิดพลาดระหว่างการอัปเดตข้อมูลนักเรียน',
                        confirmButtonColor: '#EF4444',
                        confirmButtonText: 'ตกลง'
                    });
                    return;
                }
            }

            const uploadFormData = new FormData();

            // Add only visit-specific data (not duplicate student data)
            const visitData = {
                teacherId: formData.teacherId,
                studentId: formData.studentId,
                visitDate: formData.visitDate,
                parentNamePrefix: formData.parentNamePrefix,
                parentFirstName: formData.parentFirstName,
                parentLastName: formData.parentLastName,
                familyStatus: formData.familyStatus,
                visitPurpose: formData.visitPurpose,
                studentBehaviorAtHome: formData.studentBehaviorAtHome,
                parentCooperation: formData.parentCooperation,
                problems: formData.problems,
                recommendations: formData.recommendations,
                followUpPlan: formData.followUpPlan,
                summary: formData.summary,
                notes: formData.notes
            };

            // Add non-null/non-empty values
            Object.entries(visitData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    uploadFormData.append(key, value);
                }
            });

            // Add files
            fileList.forEach((item) => {
                if (item.file) {
                    uploadFormData.append('images', item.file);
                }
            });

            // Add timestamps
            uploadFormData.append('createdAt', new Date().toISOString());
            uploadFormData.append('updatedAt', new Date().toISOString());

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch(getApiURL('/homevisits'), {
                method: 'POST',
                body: uploadFormData,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (response.ok && result.success) {
                setIsSubmitting(false);
                setShowSuccess(true);
                setCurrentStep(3);
                
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ!',
                    text: 'บันทึกข้อมูลการเยี่ยมบ้านเรียบร้อยแล้ว',
                    confirmButtonColor: '#D97706',
                    timer: 2000,
                    showConfirmButton: false
                });

                // ไม่มี auto-reset - ให้ผู้ใช้เลือกเองในหน้า success
            } else {
                throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
            }

        } catch (error) {
            setIsSubmitting(false);
            setUploadProgress(0);
            
            let errorMessage = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
            if (error.message.includes('HTTP 400')) {
                errorMessage = 'ข้อมูลที่ส่งไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่';
            } else if (error.message.includes('HTTP 401')) {
                errorMessage = 'กรุณาเข้าสู่ระบบใหม่';
            }

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: errorMessage,
                confirmButtonColor: '#EF4444',
                confirmButtonText: 'ตกลง'
            });
            console.error('Error submitting form:', error);
        }
    };

    const handleReset = () => {
        Swal.fire({
            title: 'ยืนยันการรีเซ็ต?',
            text: 'ข้อมูลทั้งหมดจะถูกล้าง',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, รีเซ็ต',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280'
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({
                    teacherId: null,
                    studentId: null,
                    studentNumber: '',
                    studentFirstName: '',
                    studentLastName: '',
                    studentNamePrefix: '',
                    className: '',
                    studentBirthDate: '',
                    genderName: '',
                    teacherFirstName: '',
                    teacherLastName: '',
                    teacherNamePrefix: '',
                    guardianFirstName: '',
                    guardianLastName: '',
                    guardianNamePrefix: '',
                    guardianRelation: '',
                    guardianOccupation: '',
                    guardianMonthlyIncome: '',
                    address: '',
                    phoneNumber: '',
                    emergencyContact: '',
                    houseType: '',
                    houseMaterial: '',
                    utilities: '',
                    studyArea: '',
                    visitDate: new Date().toISOString().split('T')[0],
                    parentNamePrefix: '',
                    parentFirstName: '',
                    parentLastName: '',
                    familyStatus: '',
                    visitPurpose: '',
                    studentBehaviorAtHome: '',
                    parentCooperation: '',
                    problems: '',
                    recommendations: '',
                    followUpPlan: '',
                    summary: '',
                    notes: '',
                    updateStudent: false
                });
                setFileList([]);
                setCurrentStep(0);
                Swal.fire({
                    icon: 'success',
                    title: 'รีเซ็ตสำเร็จ',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    // Render form sections
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-6 h-6 text-amber-600" />
                            ข้อมูลพื้นฐาน
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Student Number - with Auto-fill */}
                            <div className="col-span-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-person-badge text-amber-600"></i>
                                    รหัสนักเรียน <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.studentNumber}
                                    onChange={(e) => handleStudentNumberChange(e.target.value)}
                                    placeholder="เช่น 10001, 10018, 10100"
                                    maxLength="5"
                                    className="w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-amber-600 mt-1 font-medium">
                                    💡 ระบบจะดึงข้อมูลนักเรียนอัตโนมัติเมื่อกรอกรหัสนักเรียนครบ 5 หลัก
                                </p>
                            </div>

                            {/* Auto-filled Student Info - Read-only Display */}
                            {formData.studentId && (
                                <div className="col-span-full p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                                    <p className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        ข้อมูลนักเรียน (จากระบบ)
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-600">ชื่อ-นามสกุล:</span>
                                            <span className="ml-2 font-medium text-gray-800">
                                                {(() => {
                                                    const prefix = formData.studentNamePrefix || '';
                                                    const firstName = formData.studentFirstName || '';
                                                    const lastName = formData.studentLastName || '';
                                                    // prefix ติดชิดชื่อ ไม่มีเว้นวรรค เช่น นายเกรียงศักดิ์ ยะสุนทร
                                                    const fullName = `${prefix}${firstName}${lastName ? ' ' + lastName : ''}`.trim();
                                                    return fullName || '-';
                                                })()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">ห้องเรียน:</span>
                                            <span className="ml-2 font-medium text-gray-800">{formData.className || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">วันเกิด:</span>
                                            <span className="ml-2 font-medium text-gray-800">
                                                {formData.studentBirthDate ? new Date(formData.studentBirthDate).toLocaleDateString('th-TH') : <span className="text-amber-600">ยังไม่ระบุ</span>}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">ครูประจำชั้น:</span>
                                            <span className="ml-2 font-medium text-gray-800">
                                                {formData.teacherFullName || `${formData.teacherNamePrefix || ''}${formData.teacherFirstName || ''}${formData.teacherLastName ? ' ' + formData.teacherLastName : ''}`.trim() || <span className="text-amber-600">ยังไม่ระบุ</span>}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">ชื่อผู้ปกครอง:</span>
                                            <span className="ml-2 font-medium text-gray-800">
                                                {(() => {
                                                    const pfx = formData.guardianNamePrefix || '';
                                                        const first = formData.guardianFirstName || '';
                                                        const last = formData.guardianLastName || '';
                                                        const fullGuardian = `${pfx ? pfx + ' ' : ''}${first}${last ? ' ' + last : ''}`.trim();
                                                        return fullGuardian || <span className="text-amber-600">ยังไม่ระบุ</span>;
                                                })()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">เบอร์ติดต่อผู้ปกครอง:</span>
                                            <span className="ml-2 font-medium text-gray-800">{formData.phoneNumber || '-'}</span>
                                        </div>
                                    </div>
                                    {!formData.teacherId && (userRole.toLowerCase() !== 'admin' && userRole.toLowerCase() !== 'super_admin') && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-xs text-red-700 flex items-center gap-1">
                                                <i className="bi bi-exclamation-circle-fill"></i>
                                                <strong>ไม่มีครูประจำชั้น:</strong> นักเรียนคนนี้ยังไม่ได้กำหนดครูประจำชั้น กรุณาติดต่อผู้ดูแลระบบเพื่อกำหนดครูประจำชั้นก่อนบันทึกการเยี่ยมบ้าน
                                            </p>
                                        </div>
                                    )}
                                    {!formData.teacherId && (userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'super_admin') && (
                                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-xs text-blue-700 flex items-center gap-1">
                                                <i className="bi bi-info-circle-fill"></i>
                                                <strong>หมายเหตุ (แอดมิน):</strong> นักเรียนไม่มีครูประจำชั้น ระบบจะบันทึกชื่อแอดมินเป็นผู้บันทึกแทน
                                            </p>
                                        </div>
                                    )}
                                    {formData.teacherId && (!formData.studentBirthDate || !formData.guardianFirstName) && (
                                        <p className="text-xs text-amber-600 mt-3 flex items-center gap-1">
                                            <i className="bi bi-exclamation-triangle"></i>
                                            บางข้อมูลยังไม่ครบ — กรุณากรอกในฟอร์มด้านล่างและบันทึก ระบบจะอัปเดตข้อมูลนักเรียนให้อัตโนมัติ
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Visit Date */}
                            <div className="col-span-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-amber-600" />
                                    วันที่เยี่ยม <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.visitDate}
                                    onChange={(e) => handleInputChange('visitDate', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ครูที่เยี่ยม: ครูประจำชั้นของนักเรียนจะถูกบันทึกโดยอัตโนมัติ
                                </p>
                            </div>

                            {/* Visiting Teacher (readonly for teacher role, selectable for admin/staff) */}
                            <div className="col-span-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    ครูผู้เยี่ยม
                                </label>
                                {userRole && userRole.toLowerCase() === 'teacher' ? (
                                    <input
                                        type="text"
                                        value={formData.teacherFullName || (() => {
                                            const t = allTeachers.find(x => x.id === userTeacherId);
                                            return t ? t.fullName : '';
                                        })()}
                                        readOnly
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-700"
                                    />
                                ) : (
                                    <select
                                        value={formData.teacherId || ''}
                                        onChange={(e) => handleTeacherChange(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">-- เลือกครูผู้เยี่ยม --</option>
                                        {allTeachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.fullName}</option>
                                        ))}
                                    </select>
                                )}
                                <p className="text-xs text-gray-500 mt-1">* หากเป็นครูระบบจะบันทึกชื่อครูที่เยี่ยมโดยอัตโนมัติ</p>
                            </div>

                            {/* Parent Name Prefix */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    คำนำหน้าชื่อผู้ปกครอง
                                </label>
                                <select
                                    value={formData.parentNamePrefix}
                                    onChange={(e) => handleInputChange('parentNamePrefix', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                >
                                    <option value="">-- เลือก --</option>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </select>
                            </div>

                            {/* Parent First Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    ชื่อผู้ปกครอง <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.parentFirstName}
                                    onChange={(e) => handleInputChange('parentFirstName', e.target.value)}
                                    placeholder="ชื่อ"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Parent Last Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    นามสกุลผู้ปกครอง <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.parentLastName}
                                    onChange={(e) => handleInputChange('parentLastName', e.target.value)}
                                    placeholder="นามสกุล"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ผู้ปกครองที่มาพบในครั้งนี้ อาจแตกต่างจากผู้ปกครองหลักในระบบ
                                </p>
                            </div>
                            {/* Guardian Relation */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    ความสัมพันธ์กับผู้ปกครอง
                                </label>
                                <select
                                    value={formData.guardianRelation || ''}
                                    onChange={(e) => handleInputChange('guardianRelation', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                >
                                    <option value="">-- เลือก --</option>
                                    <option value="บิดา">บิดา</option>
                                    <option value="มารดา">มารดา</option>
                                    <option value="ปู่">ปู่</option>
                                    <option value="ย่า">ย่า</option>
                                    <option value="ตา">ตา</option>
                                    <option value="ยาย">ยาย</option>
                                    <option value="ลุง">ลุง</option>
                                    <option value="ป้า">ป้า</option>
                                    <option value="ญาติ">ญาติ</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
                                </select>
                            </div>

                            {/* Guardian Occupation */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    อาชีพผู้ปกครอง
                                </label>
                                <input
                                    type="text"
                                    value={formData.guardianOccupation}
                                    onChange={(e) => handleInputChange('guardianOccupation', e.target.value)}
                                    placeholder="อาชีพ"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                            </div>

                            {/* Guardian Monthly Income (select ranges) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    รายได้ต่อเดือนของผู้ปกครอง
                                </label>
                                <select
                                    value={formData.guardianMonthlyIncome}
                                    onChange={(e) => handleInputChange('guardianMonthlyIncome', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                >
                                    <option value="">-- เลือกช่วงรายได้ --</option>
                                    <option value="<10000">ต่ำกว่า 10,000</option>
                                    <option value="10000-20000">10,000 - 20,000</option>
                                    <option value="21000-30000">21,000 - 30,000</option>
                                    <option value="31000-40000">31,000 - 40,000</option>
                                    <option value=">=41000">41,000 ขึ้นไป</option>
                                </select>
                            </div>

                            {/* Family Status - Checkbox Group */}
                            <div className="col-span-full">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    สถานภาพครอบครัว
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        'บิดามารดาอยู่ด้วยกัน',
                                        'บิดามารดาแยกกันอยู่',
                                        'บิดาเสียชีวิตแล้ว',
                                        'มารดาเสียชีวิตแล้ว',
                                        'อยู่กับญาติ',
                                        'อื่นๆ'
                                    ].map((item) => (
                                        <label
                                            key={item}
                                            className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.familyStatus?.includes(item) || false}
                                                onChange={(e) => {
                                                    const currentValues = formData.familyStatus 
                                                        ? formData.familyStatus.split(', ').filter(v => v.trim() !== '') 
                                                        : [];
                                                    let newValues;
                                                    if (e.target.checked) {
                                                        newValues = [...currentValues, item];
                                                    } else {
                                                        newValues = currentValues.filter(v => v !== item);
                                                    }
                                                    handleInputChange('familyStatus', newValues.join(', '));
                                                }}
                                                className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700 flex-1">{item}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.familyStatus?.includes('อื่นๆ') && (
                                    <input
                                        type="text"
                                        placeholder="โปรดระบุ..."
                                        className="mt-3 w-full px-4 py-2 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                                        onChange={(e) => handleInputChange('familyStatusOther', e.target.value)}
                                    />
                                )}
                            
                            </div>


                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Home className="w-6 h-6 text-amber-600" />
                            ที่อยู่และสภาพบ้าน 
                        </h3>

                        <div className="space-y-4">
                            {/* Address - Read-only display from student data */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    ที่อยู่ 
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none text-gray-700 focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* House Type - multi-select */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <Home className="w-4 h-4 text-amber-600" />
                                        ประเภทบ้าน
                                    </label>
                                    {[
                                        'บ้านเดี่ยว',
                                        'บ้านแถว/ทาวน์เฮาส์',
                                        'อาศัยกับญาติ',
                                        'บ้านเช่า',
                                        'ห้องเช่า',
                                        'กระท่อม',
                                        'อื่นๆ'
                                    ].map((opt) => (
                                        <label key={opt} className="flex items-center gap-3 p-2">
                                            <input
                                                type="checkbox"
                                                checked={parseMulti(formData.houseType).includes(opt)}
                                                onChange={() => toggleMultiChoice('houseType', opt)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* House Material - multi-select */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-bricks text-amber-600"></i>
                                        วัสดุก่อสร้าง
                                    </label>
                                    {[
                                        'คอนกรีต/อิฐ',
                                        'ไม้',
                                        'ไม้ผสมคอนกรีต',
                                        'สังกะสี/วัสดุชั่วคราว',
                                        'อื่นๆ'
                                    ].map((opt) => (
                                        <label key={opt} className="flex items-center gap-3 p-2">
                                            <input
                                                type="checkbox"
                                                checked={parseMulti(formData.houseMaterial).includes(opt)}
                                                onChange={() => toggleMultiChoice('houseMaterial', opt)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Utilities - multi-select */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-lightning text-amber-600"></i>
                                        สาธารณูปโภค
                                    </label>
                                    {[
                                        'ไฟฟ้า',
                                        'ประปา',
                                        'ห้องน้ำในบ้าน',
                                        'อินเทอร์เน็ต',
                                        'การขนส่งสะดวก',
                                        'อื่นๆ'
                                    ].map((opt) => (
                                        <label key={opt} className="flex items-center gap-3 p-2">
                                            <input
                                                type="checkbox"
                                                checked={parseMulti(formData.utilities).includes(opt)}
                                                onChange={() => toggleMultiChoice('utilities', opt)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* Study Area - multi-select */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-book text-amber-600"></i>
                                        พื้นที่เรียน
                                    </label>
                                    {[
                                        'มีโต๊ะอ่านหนังสือ',
                                        'ไม่มีพื้นที่เฉพาะ',
                                        'ใช้พื้นที่ส่วนรวม',
                                        'มีแสงสว่างเพียงพอ',
                                        'มีสิ่งรบกวนเยอะ',
                                        'อื่นๆ'
                                    ].map((opt) => (
                                        <label key={opt} className="flex items-center gap-3 p-2">
                                            <input
                                                type="checkbox"
                                                checked={parseMulti(formData.studyArea).includes(opt)}
                                                onChange={() => toggleMultiChoice('studyArea', opt)}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 text-amber-600" />
                                        เบอร์ติดต่อผู้ปกครอง
                                    </label>
                                    <input
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-telephone-forward text-amber-600"></i>
                                        เบอร์ติดต่อฉุกเฉิน
                                    </label>
                                    <input
                                        value={formData.emergencyContact}
                                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <input
                                        type="checkbox"
                                        checked={formData.updateStudent}
                                        onChange={(e) => handleInputChange('updateStudent', e.target.checked)}
                                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                    />
                                    <span className="ml-2 text-sm">อัปเดตข้อมูลนักเรียนด้วย (บันทึกที่อยู่/บ้าน/เบอร์ติดต่อ)</span>
                                </label>
                            </div>

                            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-700">
                                    <i className="bi bi-info-circle mr-2"></i>
                                    <strong>หมายเหตุ:</strong> การแก้ไขข้อมูลที่อยู่/สภาพบ้านในแบบฟอร์มนี้จะเขียนทับข้อมูลนักเรียน
                                    หากเลือก "อัปเดตข้อมูลนักเรียนด้วย" (แนะนำให้ตรวจสอบความถูกต้องก่อนบันทึก)
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-amber-600" />
                            รายละเอียดการเยี่ยม
                        </h3>

                        <div className="space-y-4">
                            {/* Visit Purpose - Checkbox Group */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <i className="bi bi-bullseye text-amber-600"></i>
                                    วัตถุประสงค์การเยี่ยม <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { value: 'ติดตามพฤติกรรมนักเรียน'},
                                        { value: 'ติดตามผลการเรียนและการบ้าน'},
                                        { value: 'สร้างความสัมพันธ์กับผู้ปกครอง'},
                                        { value: 'แก้ไขปัญหาของนักเรียน'},
                                        { value: 'ให้คำแนะนำ'},
                                        { value: 'อื่นๆ', desc: 'ระบุวัตถุประสงค์อื่น' }
                                    ].map((item) => (
                                        <label
                                            key={item.value}
                                            className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.visitPurpose?.includes(item.value) || false}
                                                onChange={(e) => {
                                                    const currentValues = formData.visitPurpose
                                                        ? formData.visitPurpose.split(', ').filter(v => v.trim() !== '')
                                                        : [];
                                                    let newValues;
                                                    if (e.target.checked) {
                                                        newValues = [...currentValues, item.value];
                                                    } else {
                                                        newValues = currentValues.filter(v => v !== item.value);
                                                    }
                                                    handleInputChange('visitPurpose', newValues.join(', '));
                                                }}
                                                className="mt-1 w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                                                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {formData.visitPurpose?.includes('อื่นๆ') && (
                                    <textarea
                                        placeholder="โปรดระบุวัตถุประสงค์อื่นๆ..."
                                        rows="2"
                                        className="mt-3 w-full px-4 py-3 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 resize-none"
                                        onChange={(e) => handleInputChange('visitPurposeOther', e.target.value)}
                                    />
                                )}
                                {(!formData.visitPurpose || formData.visitPurpose === '') && (
                                    <p className="text-xs text-red-500 mt-2">* กรุณาเลือกอย่างน้อย 1 วัตถุประสงค์</p>
                                )}
                            </div>

                            {/* Student Behavior At Home */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-emoji-smile text-amber-600"></i>
                                    พฤติกรรมนักเรียนที่บ้าน
                                </label>
                                <textarea
                                    value={formData.studentBehaviorAtHome}
                                    onChange={(e) => handleInputChange('studentBehaviorAtHome', e.target.value)}
                                    placeholder="อธิบายพฤติกรรมของนักเรียนที่บ้าน&#10;• ความเชื่อฟังผู้ปกครอง&#10;• การช่วยงานบ้าน&#10;• ความรับผิดชอบ&#10;• การใช้เวลาว่าง"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ระบุพฤติกรรมที่สังเกตได้จากการพูดคุยกับผู้ปกครองและนักเรียน
                                </p>
                            </div>

                            {/* Parent Cooperation */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-hand-thumbs-up text-amber-600"></i>
                                    ความร่วมมือของผู้ปกครอง
                                </label>
                                <textarea
                                    value={formData.parentCooperation}
                                    onChange={(e) => handleInputChange('parentCooperation', e.target.value)}
                                    placeholder="เช่น การให้ความสนใจเรื่องการเรียน&#10;• การติดตามการบ้าน&#10;• ความเข้าใจและยอมรับปัญหาของลูก&#10;• ความพร้อมในการให้ความช่วยเหลือ"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ระบุทัศนคติและความพร้อมของผู้ปกครองในการร่วมมือพัฒนานักเรียน
                                </p>
                            </div>

                            {/* Problems */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-exclamation-triangle text-amber-600"></i>
                                    ปัญหาที่พบ
                                </label>
                                <textarea
                                    value={formData.problems}
                                    onChange={(e) => handleInputChange('problems', e.target.value)}
                                    placeholder="เช่น ปัญหาด้านการเรียน&#10;• ปัญหาด้านครอบครัว&#10;• ปัญหาด้านสิ่งแวดล้อม&#10;• ปัญหาด้านสุขภาพ"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ถ้าไม่พบปัญหา สามารถเว้นว่างไว้ได้
                                </p>
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-chat-left-text text-amber-600"></i>
                                    สรุปผลการเยี่ยม <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => handleInputChange('summary', e.target.value)}
                                    placeholder="สรุปผลการเยี่ยมบ้านโดยรวม&#10;• สภาพครอบครัวและบรรยากาศในบ้าน&#10;• ความสัมพันธ์ของนักเรียนกับครอบครัว&#10;• สภาพแวดล้อมที่เอื้อต่อการเรียน&#10;• ประโยชน์ที่ได้รับจากการเยี่ยมบ้าน&#10;"
                                    rows="5"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 สรุปภาพรวมการเยี่ยมบ้านครั้งนี้อย่างครบถ้วน
                                </p>
                            </div>

                            {/* Recommendations */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-lightbulb text-amber-600"></i>
                                    ข้อเสนอแนะ
                                </label>
                                <textarea
                                    value={formData.recommendations}
                                    onChange={(e) => handleInputChange('recommendations', e.target.value)}
                                    placeholder="เช่น คำแนะนำด้านการเรียน&#10;• คำแนะนำด้านพฤติกรรม&#10;• การพัฒนาทักษะต่างๆ&#10;• การดูแลสุขภาพ&#10;• แนวทางการแก้ไขปัญหา"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ให้คำแนะนำที่เป็นประโยชน์และสามารถนำไปปฏิบัติได้จริง
                                </p>
                            </div>

                            {/* Follow Up Plan */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-arrow-repeat text-amber-600"></i>
                                    แผนการติดตามผล
                                </label>
                                <textarea
                                    value={formData.followUpPlan}
                                    onChange={(e) => handleInputChange('followUpPlan', e.target.value)}
                                    placeholder="แผนการติดตามและช่วยเหลือนักเรียนต่อไป&#10;• กำหนดการติดตามครั้งถัดไป&#10;• วิธีการติดตาม (โทรศัพท์, เยี่ยมบ้าน, ประชุมผู้ปกครอง)&#10;• เป้าหมายที่ต้องการให้นักเรียนบรรลุ&#10;"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 วางแผนการติดตามผลอย่างเป็นรูปธรรมและต่อเนื่อง
                                </p>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-sticky text-amber-600"></i>
                                    หมายเหตุเพิ่มเติม
                                </label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="บันทึกเพิ่มเติม&#10;• ข้อสังเกตพิเศษ&#10;• ข้อมูลที่ควรทราบ&#10;"
                                    rows="3"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 ข้อมูลเสริมที่อาจมีประโยชน์ในการดูแลนักเรียน
                                </p>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Upload className="w-4 h-4 text-amber-600" />
                                    อัปโหลดรูปภาพ (สูงสุด 5 ไฟล์)
                                </label>
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-amber-500 transition-all bg-gray-50">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="file-upload"
                                        disabled={fileList.length >= 5}
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className={`cursor-pointer flex flex-col items-center gap-2 ${fileList.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="p-4 bg-white rounded-full border-2 border-gray-200">
                                            <Upload className="w-8 h-8 text-amber-600" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            รองรับ JPG, PNG, GIF (สูงสุด 2MB/ไฟล์, {5 - fileList.length} ไฟล์ที่เหลือ)
                                        </p>
                                    </label>
                                </div>

                                {/* File List */}
                                {fileList.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-bold text-gray-700 mb-3">
                                            รูปภาพที่เลือก ({fileList.length}/5)
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            {fileList.map((item) => (
                                                <div key={item.id} className="relative group">
                                                    <img
                                                        src={item.preview}
                                                        alt="Preview"
                                                        className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setPreviewImage(item.preview)}
                                                            className="bg-white p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                                            type="button"
                                                        >
                                                            <Eye className="w-5 h-5 text-gray-700" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleFileRemove(item.id)}
                                                            className="bg-red-500 p-2 rounded-lg hover:bg-red-600 transition-colors"
                                                            type="button"
                                                        >
                                                            <X className="w-5 h-5 text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Upload Progress */}
                            {isSubmitting && (
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <i className="bi bi-cloud-upload text-blue-600 text-xl animate-pulse"></i>
                                        <span className="text-sm font-bold text-blue-700">
                                            กำลังอัปโหลด... {uploadProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="text-center py-12 px-4">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            บันทึกข้อมูลสำเร็จ!
                        </h3>
                        <p className="text-gray-600 mb-8">
                            ข้อมูลการเยี่ยมบ้านถูกบันทึกเรียบร้อยแล้ว
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                            <button
                                onClick={() => {
                                    setCurrentStep(0);
                                    setShowSuccess(false);
                                    setFormData({
                                        teacherId: null,
                                        studentId: null,
                                        studentNumber: '',
                                        studentFirstName: '',
                                        studentLastName: '',
                                        studentNamePrefix: '',
                                        className: '',
                                        studentBirthDate: '',
                                        genderName: '',
                                        teacherFirstName: '',
                                        teacherLastName: '',
                                        teacherNamePrefix: '',
                                        guardianFirstName: '',
                                        guardianLastName: '',
                                        guardianNamePrefix: '',
                                        guardianRelation: '',
                                        guardianOccupation: '',
                                        guardianMonthlyIncome: '',
                                        address: '',
                                        phoneNumber: '',
                                        emergencyContact: '',
                                        houseType: '',
                                        houseMaterial: '',
                                        utilities: '',
                                        studyArea: '',
                                        visitDate: new Date().toISOString().split('T')[0],
                                        parentNamePrefix: '',
                                        parentFirstName: '',
                                        parentLastName: '',
                                        familyStatus: '',
                                        visitPurpose: '',
                                        studentBehaviorAtHome: '',
                                        parentCooperation: '',
                                        problems: '',
                                        recommendations: '',
                                        followUpPlan: '',
                                        summary: '',
                                        notes: '',
                                        updateStudent: false
                                    });
                                    setFileList([]);
                                }}
                                className="w-full sm:w-auto bg-amber-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <i className="bi bi-plus-circle"></i>
                                <span>บันทึกรายการใหม่</span>
                            </button>
                            
                            <button
                                onClick={() => navigate('/dashboard/home-visit-report')}
                                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <i className="bi bi-eye"></i>
                                <span>ดูรายงานการเยี่ยมบ้าน</span>
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                                <Home className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">
                                    แบบบันทึกการเยี่ยมบ้านนักเรียน
                                </h1>
                                <p className="text-amber-100 mt-1 flex items-center gap-2">
                                    <i className="bi bi-building"></i>
                                    โรงเรียนท่าบ่อพิทยาคม
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Alert */}
                {showSuccess && (
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-bold text-green-700">บันทึกสำเร็จ!</p>
                                <p className="text-sm text-green-600">ข้อมูลการเยี่ยมบ้านถูกบันทึกเรียบร้อยแล้ว</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Steps Indicator */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={index}>
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                            index <= currentStep
                                                ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg scale-110'
                                                : 'bg-gray-200 text-gray-400'
                                        }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <p
                                        className={`mt-2 text-sm font-bold text-center ${
                                            index <= currentStep ? 'text-amber-600' : 'text-gray-400'
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className={`flex-1 h-1 mx-2 transition-all rounded-full ${
                                            index < currentStep ? 'bg-gradient-to-r from-amber-600 to-amber-700' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                {currentStep < 3 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            {currentStep > 0 && (
                                <button
                                    onClick={handlePrev}
                                    className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    ย้อนกลับ
                                </button>
                            )}

                            {currentStep === 0 && (
                                <button
                                    onClick={handleReset}
                                    className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    รีเซ็ต
                                </button>
                            )}

                            <div className="ml-auto">
                                {currentStep < 2 ? (
                                    <button
                                        onClick={handleNext}
                                        className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                                    >
                                        ถัดไป
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-5 h-5" />
                                        {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6 text-center">
                    <p className="text-gray-700 font-semibold mb-2">
                        โรงเรียนท่าบ่อพิทยาคม | ระบบบันทึกข้อมูลการเยี่ยมบ้านนักเรียน
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
                        <span className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-600" />
                            084-930-4710
                        </span>
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-amber-600" />
                            thabopittayakom@gmail.com
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-600" />
                            อำเภอท่าบ่อ จังหวัดหนองคาย
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        สร้างเมื่อ: {new Date().toLocaleString('th-TH')} | 
                        รองรับการอัปโหลดไฟล์: JPG, PNG, GIF (สูงสุด 2MB/ไฟล์)
                    </p>
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg z-10"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-auto rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeVisits;
