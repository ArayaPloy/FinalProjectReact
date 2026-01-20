import React, { useState } from 'react';
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

const HomeVisits = () => {
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    
    // Form data state - ตรงกับ backend schema
    const [formData, setFormData] = useState({
        // IDs
        teacherId: null,
        studentId: null,
        
        // Basic Info
        studentIdNumber: '',
        studentName: '',
        className: '',
        teacherName: '',
        visitDate: new Date().toISOString().split('T')[0],
        studentBirthDate: '',
        
        // Parent Info
        parentName: '',
        relationship: '',
        occupation: '',
        monthlyIncome: '',
        familyStatus: '',
        phoneNumber: '',
        emergencyContact: '',
        
        // Address & House
        mainAddress: '',
        houseType: '',
        houseOwnership: '',
        houseCondition: '',
        houseMaterial: '',
        utilities: '',
        environmentCondition: '',
        studyArea: '',
        
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

    // Flatten teachers
    const allTeachers = [];
    Object.keys(teachersByDepartment).forEach(department => {
        teachersByDepartment[department].forEach(teacher => {
            allTeachers.push({
                id: teacher.id,
                name: `${teacher.namePrefix || ''} ${teacher.name}`.trim(),
                department: department
            });
        });
    });
    allTeachers.sort((a, b) => a.name.localeCompare(b.name, 'th'));

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

    // Handle teacher selection with ID
    const handleTeacherChange = (teacherName) => {
        const teacher = allTeachers.find(t => t.name === teacherName);
        setFormData(prev => ({
            ...prev,
            teacherName: teacherName,
            teacherId: teacher ? teacher.id : null
        }));
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
                    confirmButtonColor: '#D97706'
                });
                return false;
            }
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไฟล์ใหญ่เกินไป',
                    text: 'ขนาดไฟล์ต้องไม่เกิน 2MB',
                    confirmButtonColor: '#D97706'
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
                confirmButtonColor: '#D97706'
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
            0: ['studentIdNumber', 'studentName', 'className', 'teacherName', 'visitDate', 'studentBirthDate', 'parentName', 'relationship', 'occupation'],
            1: ['mainAddress'],
            2: ['visitPurpose', 'summary']
        };

        const fields = requiredFields[step] || [];
        const emptyFields = fields.filter(field => !formData[field] || formData[field].toString().trim() === '');

        if (emptyFields.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                text: 'โปรดระบุข้อมูลที่จำเป็นทั้งหมด',
                confirmButtonColor: '#D97706'
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

    // Submit - เหมือน backend เดิม
    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        try {
            setIsSubmitting(true);
            setUploadProgress(0);

            const uploadFormData = new FormData();

            // Add all form data
            Object.entries(formData).forEach(([key, value]) => {
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

            const response = await fetch('http://localhost:5000/api/homevisits', {
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
                    timer: 2000
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
                confirmButtonColor: '#EF4444'
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
                    studentIdNumber: '',
                    studentName: '',
                    className: '',
                    teacherName: '',
                    visitDate: new Date().toISOString().split('T')[0],
                    studentBirthDate: '',
                    parentName: '',
                    relationship: '',
                    occupation: '',
                    monthlyIncome: '',
                    familyStatus: '',
                    phoneNumber: '',
                    emergencyContact: '',
                    mainAddress: '',
                    houseType: '',
                    houseOwnership: '',
                    houseCondition: '',
                    houseMaterial: '',
                    utilities: '',
                    environmentCondition: '',
                    studyArea: '',
                    visitPurpose: '',
                    studentBehaviorAtHome: '',
                    parentCooperation: '',
                    problems: '',
                    recommendations: '',
                    followUpPlan: '',
                    summary: '',
                    notes: ''
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
                            {/* Student Number */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-person-badge text-amber-600"></i>
                                    รหัสนักเรียน <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.studentIdNumber}
                                    onChange={(e) => handleInputChange('studentIdNumber', e.target.value)}
                                    placeholder="เช่น 10001, 10018, 10100"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Student Name (ชื่อ-นามสกุล พร้อมคำนำหน้า) */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-person text-amber-600"></i>
                                    ชื่อ-นามสกุล (พร้อมคำนำหน้า) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.studentName}
                                    onChange={(e) => handleInputChange('studentName', e.target.value)}
                                    placeholder="เช่น เด็กชาย สมชาย ใจดี, นางสาว สมหญิง ใจงาม"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    📝 กรอกชื่อเต็มพร้อมคำนำหน้า เช่น "เด็กชาย สมชาย ใจดี" หรือ "นางสาว สมหญิง รักดี"
                                </p>
                            </div>

                            {/* Class */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-door-open text-amber-600"></i>
                                    ห้องเรียน <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.className}
                                    onChange={(e) => handleInputChange('className', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    required
                                >
                                    <option value="">-- เลือกห้องเรียน --</option>
                                    {['ม.1/1', 'ม.1/2', 'ม.1/3', 'ม.2/1', 'ม.2/2', 'ม.2/3', 'ม.3/1', 'ม.3/2', 'ม.3/3', 'ม.4/1', 'ม.4/2', 'ม.5/1', 'ม.5/2', 'ม.6/1', 'ม.6/2'].map(cls => (
                                        <option key={cls} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Teacher */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-person-workspace text-amber-600"></i>
                                    ครูที่ปรึกษา <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.teacherName}
                                    onChange={(e) => handleTeacherChange(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    required
                                    disabled={teachersLoading}
                                >
                                    <option value="">-- เลือกครูที่ปรึกษา --</option>
                                    {allTeachers.map(teacher => (
                                        <option key={teacher.id} value={teacher.name}>
                                            {teacher.name} ({teacher.department})
                                        </option>
                                    ))}
                                </select>
                                {formData.teacherId && (
                                    <p className="text-xs text-green-600 mt-1">
                                        ✓ เลือกครูแล้ว (ID: {formData.teacherId})
                                    </p>
                                )}
                            </div>

                            {/* Visit Date */}
                            <div>
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
                            </div>

                            {/* Student Birth Date */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 text-amber-600" />
                                    วันเกิดนักเรียน <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.studentBirthDate}
                                    onChange={(e) => handleInputChange('studentBirthDate', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Parent Name */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    ชื่อผู้ปกครอง <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.parentName}
                                    onChange={(e) => handleInputChange('parentName', e.target.value)}
                                    placeholder="กรอกชื่อผู้ปกครอง"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Relationship */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-people text-amber-600"></i>
                                    ความสัมพันธ์ <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.relationship}
                                    onChange={(e) => handleInputChange('relationship', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    required
                                >
                                    <option value="">-- เลือกความสัมพันธ์ --</option>
                                    <option value="บิดา">บิดา</option>
                                    <option value="มารดา">มารดา</option>
                                    <option value="ปู่">ปู่</option>
                                    <option value="ย่า">ย่า</option>
                                    <option value="ตา">ตา</option>
                                    <option value="ยาย">ยาย</option>
                                    <option value="พี่">พี่</option>
                                    <option value="น้อง">น้อง</option>
                                    <option value="ลุง">ลุง</option>
                                    <option value="ป้า">ป้า</option>
                                    <option value="น้า">น้า</option>
                                    <option value="อา">อา</option>
                                    <option value="อื่นๆ">อื่นๆ</option>
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

                            {/* Occupation */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-briefcase text-amber-600"></i>
                                    อาชีพผู้ปกครอง <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.occupation}
                                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                                    placeholder="เช่น เกษตรกร, ค้าขาย, รับราชการ, พนักงานบริษัท"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Monthly Income */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-cash-coin text-amber-600"></i>
                                    รายได้ต่อเดือน
                                </label>
                                <select
                                    value={formData.monthlyIncome}
                                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                >
                                    <option value="">-- เลือกช่วงรายได้ --</option>
                                    <option value="ต่ำกว่า 10,000 บาท">ต่ำกว่า 10,000 บาท</option>
                                    <option value="10,000 - 20,000 บาท">10,000 - 20,000 บาท</option>
                                    <option value="20,001 - 30,000 บาท">20,001 - 30,000 บาท</option>
                                    <option value="30,001 - 50,000 บาท">30,001 - 50,000 บาท</option>
                                    <option value="50,001 - 100,000 บาท">50,001 - 100,000 บาท</option>
                                    <option value="มากกว่า 100,000 บาท">มากกว่า 100,000 บาท</option>
                                </select>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 text-amber-600" />
                                    เบอร์โทรศัพท์
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            handleInputChange('phoneNumber', value);
                                        }
                                    }}
                                    placeholder="เช่น 0812345678 (10 หลัก)"
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">💡 กรอกตัวเลข 10 หลัก ไม่ต้องใส่ขีด (-)</p>
                            </div>

                            {/* Emergency Contact */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <i className="bi bi-telephone-plus text-amber-600"></i>
                                    เบอร์ฉุกเฉิน
                                </label>
                                <input
                                    type="tel"
                                    value={formData.emergencyContact}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            handleInputChange('emergencyContact', value);
                                        }
                                    }}
                                    placeholder="เช่น 0987654321 (10 หลัก)"
                                    maxLength="10"
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">💡 กรอกตัวเลข 10 หลัก ไม่ต้องใส่ขีด (-)</p>
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
                            {/* Address */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    ที่อยู่ <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.mainAddress}
                                    onChange={(e) => handleInputChange('mainAddress', e.target.value)}
                                    placeholder="กรอกที่อยู่ที่สามารถติดต่อได้"
                                    rows="4"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* House Type */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <Home className="w-4 h-4 text-amber-600" />
                                        ประเภทบ้าน
                                    </label>
                                    <select
                                        value={formData.houseType}
                                        onChange={(e) => handleInputChange('houseType', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">-- เลือก --</option>
                                        <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                                        <option value="แฟลต/อพาร์ทเม้นท์">แฟลต/อพาร์ทเม้นท์</option>
                                        <option value="ห้องเช่า">ห้องเช่า</option>
                                        <option value="ทาวน์เฮาส์">ทาวน์เฮาส์</option>
                                        <option value="อื่นๆ">อื่นๆ</option>
                                    </select>
                                </div>

                                {/* House Ownership */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-key text-amber-600"></i>
                                        กรรมสิทธิ์
                                    </label>
                                    <select
                                        value={formData.houseOwnership}
                                        onChange={(e) => handleInputChange('houseOwnership', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">-- เลือก --</option>
                                        <option value="เป็นเจ้าของ">เป็นเจ้าของ</option>
                                        <option value="เช่า">เช่า</option>
                                        <option value="อาศัย">อาศัย</option>
                                        <option value="ผ่อนชำระ">ผ่อนชำระ</option>
                                    </select>
                                </div>

                                {/* House Condition */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-house-check text-amber-600"></i>
                                        สภาพบ้าน
                                    </label>
                                    <select
                                        value={formData.houseCondition}
                                        onChange={(e) => handleInputChange('houseCondition', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
                                    >
                                        <option value="">-- เลือก --</option>
                                        <option value="ดีมาก">ดีมาก</option>
                                        <option value="ดี">ดี</option>
                                        <option value="ปานกลาง">ปานกลาง</option>
                                        <option value="ควรปรับปรุง">ควรปรับปรุง</option>
                                    </select>
                                </div>
                            </div>

                            {/* House Material - Checkbox Group */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <i className="bi bi-bricks text-amber-600"></i>
                                    วัสดุก่อสร้าง
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        'คอนกรีต',
                                        'ไม้',
                                        'สังกะสี',
                                        'ไผ่',
                                        'ผสม',
                                        'อื่นๆ'
                                    ].map((item) => (
                                        <label
                                            key={item}
                                            className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.houseMaterial?.includes(item) || false}
                                                onChange={(e) => {
                                                    const currentValues = formData.houseMaterial
                                                        ? formData.houseMaterial.split(', ').filter(v => v.trim() !== '')
                                                        : [];
                                                    let newValues;
                                                    if (e.target.checked) {
                                                        newValues = [...currentValues, item];
                                                    } else {
                                                        newValues = currentValues.filter(v => v !== item);
                                                    }
                                                    handleInputChange('houseMaterial', newValues.join(', '));
                                                }}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                                {formData.houseMaterial?.includes('อื่นๆ') && (
                                    <input
                                        type="text"
                                        placeholder="โปรดระบุวัสดุอื่นๆ..."
                                        className="mt-2 w-full px-4 py-2 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                                        onChange={(e) => handleInputChange('houseMaterialOther', e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Utilities - Checkbox Group */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                    <i className="bi bi-lightning-charge text-amber-600"></i>
                                    สาธารณูปโภค
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[
                                        'ไฟฟ้า',
                                        'ประปา',
                                        'โทรศัพท์',
                                        'อินเทอร์เน็ต',
                                        'ก๊าซ',
                                        'ทีวี'
                                    ].map((item) => (
                                        <label
                                            key={item}
                                            className="flex items-center gap-2 p-2 border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.utilities?.includes(item) || false}
                                                onChange={(e) => {
                                                    const currentValues = formData.utilities
                                                        ? formData.utilities.split(', ').filter(v => v.trim() !== '')
                                                        : [];
                                                    let newValues;
                                                    if (e.target.checked) {
                                                        newValues = [...currentValues, item];
                                                    } else {
                                                        newValues = currentValues.filter(v => v !== item);
                                                    }
                                                    handleInputChange('utilities', newValues.join(', '));
                                                }}
                                                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-2 focus:ring-amber-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Environment Condition */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                                        <i className="bi bi-tree text-amber-600"></i>
                                        สภาพแวดล้อม
                                    </label>
                                    <textarea
                                        value={formData.environmentCondition}
                                        onChange={(e) => handleInputChange('environmentCondition', e.target.value)}
                                        placeholder="เช่น เงียบสงบ, อยู่ติดริมโขง, อยู่ใกล้ถนนใหญ่"
                                        rows="2"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
                                    />
                                </div>

                                {/* Study Area - Radio Group */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                        <i className="bi bi-book text-amber-600"></i>
                                        พื้นที่สำหรับเรียน
                                    </label>
                                    <div className="space-y-2">
                                        {[
                                            { value: 'มีโต๊ะเรียนส่วนตัว', desc: 'มีพื้นที่เรียนเฉพาะตัว' },
                                            { value: 'ใช้โต๊ะร่วมกับครอบครัว', desc: 'แชร์พื้นที่กับคนในบ้าน' },
                                            { value: 'ไม่มีโต๊ะเรียน', desc: 'ไม่มีพื้นที่เฉพาะ' },
                                            { value: 'อื่นๆ', desc: 'ระบุเพิ่มเติม' }
                                        ].map((item) => (
                                            <label
                                                key={item.value}
                                                className="flex items-start gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer"
                                            >
                                                <input
                                                    type="radio"
                                                    name="studyArea"
                                                    value={item.value}
                                                    checked={formData.studyArea === item.value}
                                                    onChange={(e) => handleInputChange('studyArea', e.target.value)}
                                                    className="mt-1 w-5 h-5 text-amber-600 border-gray-300 focus:ring-2 focus:ring-amber-500"
                                                />
                                                <div className="flex-1">
                                                    <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {formData.studyArea === 'อื่นๆ' && (
                                        <input
                                            type="text"
                                            placeholder="โปรดระบุพื้นที่เรียนอื่นๆ..."
                                            className="mt-2 w-full px-4 py-2 border-2 border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                                            onChange={(e) => handleInputChange('studyAreaOther', e.target.value)}
                                        />
                                    )}
                                </div>
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
                                        studentIdNumber: '',
                                        studentName: '',
                                        className: '',
                                        teacherName: '',
                                        visitDate: new Date().toISOString().split('T')[0],
                                        studentBirthDate: '',
                                        parentName: '',
                                        relationship: '',
                                        occupation: '',
                                        monthlyIncome: '',
                                        familyStatus: '',
                                        phoneNumber: '',
                                        emergencyContact: '',
                                        mainAddress: '',
                                        houseType: '',
                                        houseOwnership: '',
                                        houseCondition: '',
                                        houseMaterial: '',
                                        utilities: '',
                                        environmentCondition: '',
                                        studyArea: '',
                                        visitPurpose: '',
                                        studentBehaviorAtHome: '',
                                        parentCooperation: '',
                                        problems: '',
                                        recommendations: '',
                                        followUpPlan: '',
                                        summary: '',
                                        notes: ''
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
