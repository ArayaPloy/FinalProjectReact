import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';
import {
    useFetchTeachersByDepartmentQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
    useFetchDepartmentsQuery
} from '../../../redux/features/teachers/teachersApi';
import Swal from 'sweetalert2';
import { Edit2, Trash2, Plus, X, Upload, Search, Eye, UserPlus } from 'lucide-react';
import { getApiURL, getBackendURL } from '../../../utils/apiConfig';

const ManageTeacher = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = ['admin', 'super_admin'].includes((currentUser?.role || '').toLowerCase());

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [viewingTeacher, setViewingTeacher] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        namePrefix: '',
        fullName: '',
        departmentId: '',
        genderId: '',
        dob: '',
        nationality: 'ไทย',
        position: '',
        level: '',
        phoneNumber: '',
        email: '',
        address: '',
        education: '',
        major: '',
        biography: '',
        specializations: '',
        imagePath: ''
    });

    // Image upload states
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // RTK Query hooks
    const { data: teachersByDepartment = {}, isLoading, refetch } = useFetchTeachersByDepartmentQuery();
    const { data: departments = [], isLoading: isDeptLoading } = useFetchDepartmentsQuery();
    const [createTeacher, { isLoading: isCreating }] = useCreateTeacherMutation();
    const [updateTeacher, { isLoading: isUpdating }] = useUpdateTeacherMutation();
    const [deleteTeacher] = useDeleteTeacherMutation();

    // Convert teachers by department to flat array
    const teachers = Object.values(teachersByDepartment).flat();

    // Filter teachers
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch =
            teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.namePrefix?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = !filterDepartment || teacher.department === filterDepartment;

        return matchesSearch && matchesDept;
    });

    // Reset form
    const resetForm = () => {
        setFormData({
            namePrefix: '',
            fullName: '',
            departmentId: '',
            genderId: '',
            dob: '',
            nationality: 'ไทย',
            position: '',
            level: '',
            phoneNumber: '',
            email: '',
            address: '',
            education: '',
            major: '',
            biography: '',
            specializations: '',
            imagePath: ''
        });
        setSelectedFile(null);
        setImagePreview('');
        setEditingTeacher(null);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle file select
    const handleFileSelect = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            Swal.fire({
                icon: 'warning',
                title: 'ไฟล์ไม่ถูกต้อง',
                text: 'กรุณาเลือกไฟล์รูปภาพ (JPEG, PNG, WEBP)',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: 'warning',
                title: 'ไฟล์ใหญ่เกินไป',
                text: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Upload image
    const handleImageUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', selectedFile);
            
            // ส่ง path รูปเก่าไปด้วย เพื่อให้ backend ลบรูปเก่า
            if (formData.imagePath && !formData.imagePath.includes('default-avatar')) {
                formDataUpload.append('oldImagePath', formData.imagePath);
            }

            const uploadURL = getApiURL('/upload/teacher-image'); // เปลี่ยนเป็น endpoint สำหรับรูปครู

            const response = await fetch(uploadURL, {
                method: 'POST',
                body: formDataUpload,
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    imagePath: data.imageUrl
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'อัปโหลดรูปภาพสำเร็จ',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                throw new Error(data.message || 'อัปโหลดไม่สำเร็จ');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถอัปโหลดรูปภาพได้',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
        } finally {
            setIsUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview('');
        setFormData(prev => ({
            ...prev,
            imagePath: ''
        }));
    };

    // Open modal for create/edit
    const openModal = (teacher = null) => {
        if (teacher) {
            console.log('🔍 Opening modal for teacher:', teacher);
            setEditingTeacher(teacher);
            setFormData({
                namePrefix: teacher.namePrefix || '',
                fullName: teacher.name || '',
                departmentId: getDepartmentIdByName(teacher.department) || '',
                genderId: teacher.gender === 'ชาย' ? '1' : '2',
                dob: teacher.dob ? new Date(teacher.dob).toISOString().split('T')[0] : '',
                nationality: teacher.nationality || 'ไทย',
                position: teacher.position || '',
                level: teacher.level || '',
                phoneNumber: teacher.phone || '',
                email: teacher.email || '',
                address: teacher.address || '',
                education: teacher.education || '',
                major: teacher.major || '',
                biography: teacher.biography || '',
                specializations: teacher.specializations || '',
                imagePath: teacher.image || ''
            });
            setImagePreview(teacher.image || '');
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    // Get department ID by name
    const getDepartmentIdByName = (deptName) => {
        const dept = departments.find(d => d.name === deptName);
        return dept ? dept.id.toString() : '';
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // Handle submit เพิ่มการเช็คก่อน Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.departmentId || !formData.genderId) {
            Swal.fire({
                icon: 'warning',
                title: 'ข้อมูลไม่ครบ',
                text: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
            return;
        }

        let uploadedImagePath = formData.imagePath; // เก็บ path รูปปัจจุบัน

        // ถ้ามีรูปใหม่ ให้อัปโหลดก่อน (ไม่ว่าจะเป็นโหมดเพิ่มหรือแก้ไข)
        if (selectedFile) {
            Swal.fire({
                icon: 'info',
                title: 'กำลังอัปโหลดรูปภาพ...',
                text: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            try {
                const formDataUpload = new FormData();
                formDataUpload.append('image', selectedFile);
                
                // ถ้าเป็นโหมดแก้ไข ส่ง path รูปเก่าไปด้วย
                if (editingTeacher && formData.imagePath && !formData.imagePath.includes('default-avatar')) {
                    formDataUpload.append('oldImagePath', formData.imagePath);
                }
                
                const uploadURL = getApiURL('/upload/teacher-image');
                const response = await fetch(uploadURL, {
                    method: 'POST',
                    body: formDataUpload,
                });
                const data = await response.json();

                if (data.success) {
                    uploadedImagePath = data.imageUrl; // เก็บ path รูปอัปเดตใหม่
                    setFormData(prev => ({
                        ...prev,
                        imagePath: data.imageUrl
                    }));
                } else {
                    throw new Error(data.message || 'อัปโหลดไม่สำเร็จ');
                }
            } catch (error) {
                console.error('Upload error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                });
                return;
            }
        }

        Swal.fire({
            title: 'กำลังบันทึก...',
            html: 'กรุณารอสักครู่',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const teacherData = {
                namePrefix: formData.namePrefix,
                fullName: formData.fullName,
                departmentId: parseInt(formData.departmentId),
                genderId: parseInt(formData.genderId),
                dob: formData.dob || null,
                nationality: formData.nationality || 'ไทย',
                position: formData.position || '',
                level: formData.level || '',
                phoneNumber: formData.phoneNumber || '',
                email: formData.email || '',
                address: formData.address || '',
                education: formData.education || '',
                major: formData.major || '',
                biography: formData.biography || '',
                specializations: formData.specializations || '',
                imagePath: uploadedImagePath || 'default-avatar.jpg' // ใช้ path ที่อัปโหลดแล้ว
            };

            console.log('📤 Sending teacher data:', JSON.stringify(teacherData, null, 2));
            console.log('🆔 Teacher ID:', editingTeacher?.id);

            if (editingTeacher) {
                const result = await updateTeacher({
                    id: editingTeacher.id,
                    data: teacherData
                }).unwrap();

                console.log('✅ Update result:', result);

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'แก้ไขข้อมูลบุคลากรสำเร็จ',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'ตกลง'
                });
            } else {
                const result = await createTeacher(teacherData).unwrap();

                console.log('✅ Create result:', result);

                Swal.fire({
                    icon: 'success',
                    title: 'สำเร็จ!',
                    text: 'เพิ่มบุคลากรสำเร็จ',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'ตกลง'
                });
            }

            closeModal();
            refetch();
        } catch (error) {
            console.error('❌ Error:', error);
            console.error('❌ Error data:', JSON.stringify(error.data, null, 2));
            console.error('❌ Error message:', error.message);
            console.error('❌ Full error object:', JSON.stringify(error, null, 2));

            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: error.data?.message || error.message || 'ไม่สามารถบันทึกข้อมูลได้',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    // Handle delete
    const handleDelete = async (teacher) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `คุณต้องการลบข้อมูลของ<br/><strong>${teacher.name}</strong><br/>ใช่หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ใช่, ลบข้อมูล',
            cancelButtonText: 'ยกเลิก',
            reverseButtons: true
        });

        if (!result.isConfirmed) return;

        try {
            await deleteTeacher(teacher.id).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'ลบสำเร็จ!',
                text: 'ลบข้อมูลบุคลากรเรียบร้อยแล้ว',
                confirmButtonColor: '#10b981',
                confirmButtonText: 'ตกลง'
            });

            refetch();
        } catch (error) {
            console.error('Delete error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถลบข้อมูลได้',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    // View teacher details
    const handleViewDetails = (teacher) => {
        setViewingTeacher(teacher);
        setIsViewModalOpen(true);
    };

    // Get image src
    const getImageSrc = (imagePath) => {
        if (!imagePath || imagePath === '' || imagePath === '-') {
            return '/default-avatar.jpg';
        }
        if (imagePath.startsWith('http')) return imagePath;
        // Uploaded files (in backend /uploads/) need backend URL prefix
        if (imagePath.includes('/uploads/') || imagePath.startsWith('uploads/')) {
            return `${getBackendURL()}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
        }
        // Static assets (e.g. /images/) are served by the frontend
        return imagePath;
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        จัดการข้อมูลบุคลากร
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        เพิ่ม แก้ไข และจัดการข้อมูลครูและบุคลากรในโรงเรียน
                    </p>
                </div>

                {/* Filters and Actions */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อ, ตำแหน่ง, อีเมล..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Department Filter */}
                            <select
                                value={filterDepartment}
                                onChange={(e) => setFilterDepartment(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white cursor-pointer"
                            >
                                <option value="">ทุกหน่วยงาน</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Add Button - admin only */}
                        {isAdmin && (
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm shadow-sm"
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="whitespace-nowrap">เพิ่มบุคลากร</span>
                        </button>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-gray-600">
                        แสดง {filteredTeachers.length} จาก {teachers.length} รายการ
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
                        </div>
                    </div>
                )}

                {/* Teachers Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredTeachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gray-100">
                                    <img
                                        src={getImageSrc(teacher.image)}
                                        alt={teacher.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/default-avatar.jpg';
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
                                        {teacher.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {teacher.position}
                                        {teacher.level && ` ${teacher.level}`}
                                    </p>

                                    {teacher.department && (
                                        <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-3">
                                            {teacher.department}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleViewDetails(teacher)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>ดู</span>
                                        </button>
                                        {isAdmin && (
                                        <>
                                        <button
                                            onClick={() => openModal(teacher)}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>แก้ไข</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(teacher)}
                                            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredTeachers.length === 0 && (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ไม่พบข้อมูลบุคลากร
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || filterDepartment
                                ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                                : 'เริ่มต้นโดยการเพิ่มบุคลากรคนแรก'}
                        </p>
                        {!searchTerm && !filterDepartment && isAdmin && (
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                เพิ่มบุคลากร
                            </button>
                        )}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {editingTeacher ? 'แก้ไขข้อมูลบุคลากร' : 'เพิ่มบุคลากรใหม่'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Image Upload */}
                                    <div className="lg:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            รูปภาพบุคลากร
                                        </label>

                                        <div className="space-y-3">
                                            {/* Preview */}
                                            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                                                <img
                                                    src={imagePreview || formData.imagePath || 'default-avatar.jpg'}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'default-avatar.jpg';
                                                    }}
                                                />
                                                {(selectedFile || (formData.imagePath && formData.imagePath !== 'default-avatar.jpg')) && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* File Input */}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                                onChange={handleFileSelect}
                                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                            />

                                            {/* Upload Button */}
                                            {selectedFile && (
                                                <button
                                                    type="button"
                                                    onClick={handleImageUpload}
                                                    disabled={isUploading}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isUploading ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                            กำลังอัปโหลด...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-4 h-4" />
                                                            อัปโหลดรูปภาพ
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                            <p className="text-xs text-gray-500 text-center">
                                                รองรับ: JPEG, PNG, WEBP (สูงสุด 5MB)
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Column - Form Fields */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Basic Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                ข้อมูลพื้นฐาน
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        คำนำหน้า <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="namePrefix"
                                                        value={formData.namePrefix}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    >
                                                        <option value="">เลือกคำนำหน้า</option>
                                                        <option value="นาย">นาย</option>
                                                        <option value="นาง">นาง</option>
                                                        <option value="นางสาว">นางสาว</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ชื่อ-นามสกุล <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="ระบุชื่อ-นามสกุล"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        หน่วยงาน <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="departmentId"
                                                        value={formData.departmentId}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    >
                                                        <option value="">เลือกหน่วยงาน</option>
                                                        {departments.map((dept) => (
                                                            <option key={dept.id} value={dept.id}>
                                                                {dept.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        เพศ <span className="text-red-500">*</span>
                                                    </label>
                                                    <select
                                                        name="genderId"
                                                        value={formData.genderId}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    >
                                                        <option value="">เลือกเพศ</option>
                                                        <option value="1">ชาย</option>
                                                        <option value="2">หญิง</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        วันเกิด
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="dob"
                                                        value={formData.dob}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        สัญชาติ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nationality"
                                                        value={formData.nationality}
                                                        onChange={handleInputChange}
                                                        placeholder="ระบุสัญชาติ"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Position Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                ข้อมูลตำแหน่ง
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ตำแหน่ง
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="position"
                                                        value={formData.position}
                                                        onChange={handleInputChange}
                                                        placeholder="เช่น ครู, ผู้อำนวยการ"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        วิทยฐานะ
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="level"
                                                        value={formData.level}
                                                        onChange={handleInputChange}
                                                        placeholder="เช่น คศ.1, คศ.2"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                ข้อมูลติดต่อ
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        เบอร์โทรศัพท์
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleInputChange}
                                                        placeholder="0812345678"
                                                        maxLength="10"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        อีเมล
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="example@email.com"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ที่อยู่
                                                    </label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        rows="2"
                                                        placeholder="ระบุที่อยู่"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Education Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                ข้อมูลการศึกษา
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        วุฒิการศึกษา
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="education"
                                                        value={formData.education}
                                                        onChange={handleInputChange}
                                                        placeholder="เช่น ปริญญาตรี, ปริญญาโท"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        สาขาวิชา
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="major"
                                                        value={formData.major}
                                                        onChange={handleInputChange}
                                                        placeholder="ระบุสาขาวิชา"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        ความเชี่ยวชาญ
                                                    </label>
                                                    <textarea
                                                        name="specializations"
                                                        value={formData.specializations}
                                                        onChange={handleInputChange}
                                                        rows="2"
                                                        placeholder="ระบุความเชี่ยวชาญ"
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Biography */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                                ประวัติ
                                            </h3>
                                            <textarea
                                                name="biography"
                                                value={formData.biography}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="ระบุประวัติโดยย่อ"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isCreating || isUpdating}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isCreating || isUpdating ? 'กำลังบันทึก...' : editingTeacher ? 'บันทึกการแก้ไข' : 'เพิ่มบุคลากร'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* View Details Modal */}
                {isViewModalOpen && viewingTeacher && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    ข้อมูลบุคลากร
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Image */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={getImageSrc(viewingTeacher.image)}
                                            alt={viewingTeacher.name}
                                            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-avatar.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {viewingTeacher.name}
                                            </h3>
                                            {viewingTeacher.position && (
                                                <p className="text-gray-600">
                                                    {viewingTeacher.position}
                                                    {viewingTeacher.level && ` ${viewingTeacher.level}`}
                                                </p>
                                            )}
                                            {viewingTeacher.department && (
                                                <p className="text-sm text-indigo-600 mt-1">
                                                    {viewingTeacher.department}
                                                </p>
                                            )}
                                        </div>

                                        {viewingTeacher.email && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">อีเมล</p>
                                                <p className="text-gray-600">{viewingTeacher.email}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.phone && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">เบอร์โทร</p>
                                                <p className="text-gray-600">{viewingTeacher.phone}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.address && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">ที่อยู่</p>
                                                <p className="text-gray-600">{viewingTeacher.address}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.education && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">วุฒิการศึกษา</p>
                                                <p className="text-gray-600">{viewingTeacher.education}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.major && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">สาขาวิชา</p>
                                                <p className="text-gray-600">{viewingTeacher.major}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.specializations && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">ความเชี่ยวชาญ</p>
                                                <p className="text-gray-600">{viewingTeacher.specializations}</p>
                                            </div>
                                        )}

                                        {viewingTeacher.biography && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">ประวัติ</p>
                                                <p className="text-gray-600 leading-relaxed">{viewingTeacher.biography}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                                    {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setIsViewModalOpen(false);
                                            openModal(viewingTeacher);
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        แก้ไขข้อมูล
                                    </button>
                                    )}
                                    <button
                                        onClick={() => setIsViewModalOpen(false)}
                                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTeacher;
