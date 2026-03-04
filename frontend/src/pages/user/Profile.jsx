import { useState, useEffect } from 'react';
import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useUploadProfileImageMutation, useUpdateTeacherProfileMutation } from '../../redux/features/users/usersApi';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/features/auth/authSlice';
import { User, Mail, Phone, Calendar, Shield, Lock, Upload, Save, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const getApiURL = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
};

const getBaseURL = () => {
  // สำหรับ static files (รูปภาพ) ใช้ URL โดยไม่มี /api
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return apiUrl.replace('/api', '');
};

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profileData, isLoading, refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadProfileImageMutation();
  const [updateTeacherProfile, { isLoading: isUpdatingTeacher }] = useUpdateTeacherProfileMutation();

  // State สำหรับ form ข้อมูลโปรไฟล์
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    education: '',
    major: '',
    biography: '',
    specializations: ''
  });

  // State สำหรับ form รหัสผ่าน
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [emailError, setEmailError] = useState('');

  // เมื่อโหลดข้อมูล ให้ set ค่าเริ่มต้นใน form (รวม biography/specializations ของครู)
  useEffect(() => {
    if (profileData?.data) {
      const tp = profileData.data.teacher_profile;
      setFormData({
        username: profileData.data.username || '',
        email: profileData.data.email || '',
        phone: profileData.data.phone || '',
        education: tp?.education || '',
        major: tp?.major || '',
        biography: tp?.biography || '',
        specializations: tp?.specializations || ''
      });
    }
  }, [profileData]);

  // ========================================
  // 🔹 Email Validation Function
  // ========================================
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ========================================
  // 🔹 จัดการเปลี่ยนแปลงข้อมูลโปรไฟล์
  // ========================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time Email Validation
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('รูปแบบอีเมลไม่ถูกต้อง');
      } else {
        setEmailError('');
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  // ========================================
  // 🔹 บันทึกข้อมูลโปรไฟล์
  // ========================================
  const handleSaveProfile = async () => {
    // Email Validation
    if (!validateEmail(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'อีเมลไม่ถูกต้อง',
        text: 'กรุณากรอกอีเมลให้ถูกต้อง',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    // Confirm Dialog ถ้า Username เปลี่ยน
    if (formData.username !== profileData?.data?.username) {
      const result = await Swal.fire({
        title: 'ยืนยันการเปลี่ยนชื่อผู้ใช้?',
        html: `เปลี่ยนจาก <strong>"${profileData.data.username}"</strong> เป็น <strong>"${formData.username}"</strong>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      });
      
      if (!result.isConfirmed) return;
    }

    try {
      const result = await updateProfile(formData).unwrap();
      
      // อัปเดต Redux state
      dispatch(updateUser({
        username: result.data.username,
        email: result.data.email,
        phone: result.data.phone
      }));

      // ถ้าเป็นครู ให้อัปเดตข้อมูลครูด้วย (ยกเว้น username)
      if (profile?.teacher_profile) {
        await updateTeacherProfile({
          phoneNumber: formData.phone,
          email: formData.email,
          education: formData.education,
          major: formData.major,
          biography: formData.biography,
          specializations: formData.specializations
        }).unwrap();
      }
      
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: result.message || 'อัปเดตข้อมูลโปรไฟล์สำเร็จ',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ตกลง'
      });
      
      setIsEditMode(false);
      refetch(); // Refresh ข้อมูล
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // ========================================
  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกข้อมูลให้ครบ',
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณายืนยันรหัสผ่านใหม่ให้ตรงกัน',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'รหัสผ่านสั้นเกินไป',
        text: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    try {
      const result = await changePassword(passwordData).unwrap();
      
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: result.message || 'เปลี่ยนรหัสผ่านสำเร็จ',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ตกลง'
      });
      
      // ล้างข้อมูล form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.data?.message || 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  // ========================================
  // 🔹 อัปโหลดรูปโปรไฟล์
  // ========================================
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // ตรวจสอบขนาดไฟล์ (2MB)
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'warning',
          title: 'ไฟล์ใหญ่เกินไป',
          text: 'กรุณาเลือกรูปที่มีขนาดไม่เกิน 2MB',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'warning',
          title: 'ประเภทไฟล์ไม่ถูกต้อง',
          text: 'กรุณาเลือกไฟล์ JPG, PNG หรือ WebP เท่านั้น',
          confirmButtonColor: '#f59e0b',
          confirmButtonText: 'ตกลง'
        });
        return;
      }

      setSelectedImage(file);
      
      // สร้าง preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append('profileImage', selectedImage);

    try {
      const result = await uploadImage(formData).unwrap();
      
      // อัปเดต Redux state ด้วยรูปใหม่
      dispatch(updateUser({
        profileImage: result.data.profileImage
      }));
      
      // Refetch ก่อนแล้วค่อย clear preview
      await refetch(); // รอให้โหลดข้อมูลใหม่เสร็จก่อน
      
      // ตั้ง imagePreview เป็น URL ใหม่พร้อม timestamp เพื่อป้องกัน cache
      const newImageUrl = `${getBaseURL()}${result.data.profileImage}?t=${Date.now()}`;
      setImagePreview(newImageUrl);
      
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ!',
        text: result.message || 'อัปโหลดรูปโปรไฟล์สำเร็จ',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'ตกลง'
      });
      
      // Clear เฉพาะ selected file เพื่อไม่ให้แสดงปุ่ม Upload อีก
      setSelectedImage(null);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error?.data?.message || 'ไม่สามารถอัปโหลดรูปได้',
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    if (profileData?.data) {
      const tp = profileData.data.teacher_profile;
      setFormData({
        username: profileData.data.username || '',
        email: profileData.data.email || '',
        phone: profileData.data.phone || '',
        education: tp?.education || '',
        major: tp?.major || '',
        biography: tp?.biography || '',
        specializations: tp?.specializations || ''
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const profile = profileData?.data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">โปรไฟล์ของฉัน</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ========================================
            🔹 ซ้าย: รูปโปรไฟล์
            ======================================== */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col items-center">
              <img
                src={
                  imagePreview || 
                  (profile?.profileImage && profile.profileImage !== '/default-avatar.jpg'
                    ? `${getBaseURL()}${profile.profileImage}?t=${Date.now()}` 
                    : '/default-avatar.jpg')
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-100"
                onError={(e) => { e.target.onerror = null; e.target.src = '/default-avatar.jpg'; }}
              />
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile?.username}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Shield className="w-4 h-4 mr-1" />
                <span>{profile?.userroles?.roleName || 'User'}</span>
              </div>

              {/* Upload รูปใหม่ */}
              <input
                type="file"
                id="profileImageInput"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
              
              <label
                htmlFor="profileImageInput"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer flex items-center justify-center mb-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                เลือกรูปใหม่
              </label>

              {selectedImage && (
                <div className="w-full space-y-2">
                  <button
                    onClick={handleUploadImage}
                    disabled={isUploading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {isUploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}

              <div className="w-full mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>สมัครเมื่อ: {new Date(profile?.createdAt).toLocaleDateString('th-TH')}</span>
                </div>
                {profile?.lastLogin && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>เข้าสู่ระบบล่าสุด: {new Date(profile?.lastLogin).toLocaleString('th-TH')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================
            🔹 ขวา: ข้อมูลและฟอร์ม
            ======================================== */}
        <div className="md:col-span-2 space-y-6">
          {/* ข้อมูลส่วนตัว */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">ข้อมูลส่วนตัว</h2>
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  แก้ไข
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isUpdating || isUpdatingTeacher}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    {(isUpdating || isUpdatingTeacher) ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  placeholder="ไม่ระบุ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              {/* วุฒิการศึกษา - แสดงเฉพาะครู */}
              {profile?.teacher_profile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    วุฒิการศึกษา
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    placeholder="เช่น ปริญญาตรี, ปริญญาโท"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* สาขาวิชา - แสดงเฉพาะครู */}
              {profile?.teacher_profile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สาขาวิชา
                  </label>
                  <input
                    type="text"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    placeholder="เช่น วิทยาศาสตร์ทั่วไป, คณิตศาสตร์"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              )}

              {/* ประวัติย่อ - แสดงเฉพาะครู */}
              {profile?.teacher_profile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประวัติย่อ
                  </label>
                  <textarea
                    name="biography"
                    value={formData.biography}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    placeholder="ประวัติการทำงาน, การศึกษา ฯลฯ"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                  />
                </div>
              )}

              {/* ความเชี่ยวชาญ - แสดงเฉพาะครู */}
              {profile?.teacher_profile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ความเชี่ยวชาญ
                  </label>
                  <textarea
                    name="specializations"
                    value={formData.specializations}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    placeholder="วิชาที่ถนัด, ความเชี่ยวชาญพิเศษ"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* เปลี่ยนรหัสผ่าน */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              <Lock className="w-5 h-5 inline mr-2" />
              เปลี่ยนรหัสผ่าน
            </h2>

            <div className="space-y-4">
              {/* รหัสผ่านปัจจุบัน */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่านปัจจุบัน
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* รหัสผ่านใหม่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ยืนยันรหัสผ่านใหม่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50"
              >
                {isChangingPassword ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'เปลี่ยนรหัสผ่าน'}
              </button>

              <p className="text-sm text-gray-500 mt-2">
                * รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร
              </p>
            </div>
          </div>

          {/* แสดงข้อมูล Teacher (ถ้ามี) - Read Only */}
          {profile?.teacher_profile && (
            <div className="bg-blue-50 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                🎓 ข้อมูลครูผู้สอน
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                <div>
                  <p className="text-xs text-blue-500 font-medium">ชื่อ-นามสกุล</p>
                  <p className="font-semibold">
                    {profile.teacher_profile.fullName ||
                      `${profile.teacher_profile.namePrefix || ''}${profile.teacher_profile.firstName || ''} ${profile.teacher_profile.lastName || ''}`.trim() ||
                      'ไม่ระบุ'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium">ตำแหน่ง</p>
                  <p>{profile.teacher_profile.position || 'ไม่ระบุ'}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium">วิทยฐานะ</p>
                  <p>{profile.teacher_profile.level || 'ไม่ระบุ'}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-medium">แผนก/กลุ่มสาระ</p>
                  <p>{profile.teacher_profile.department || 'ไม่ระบุ'}</p>
                </div>
              </div>

              {/* ห้องเรียนที่รับผิดชอบ (homeroom) */}
              {profile.teacher_profile.homeroom_class ? (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">🏫 ครูประจำชั้น</p>
                  <div className="bg-white rounded-lg p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                    <div>
                      <p className="text-xs text-blue-400 font-medium">ห้อง</p>
                      <p className="font-bold text-blue-700 text-base">{profile.teacher_profile.homeroom_class.className}</p>
                    </div>
                    {profile.teacher_profile.homeroom_class.room && (
                      <div>
                        <p className="text-xs text-blue-400 font-medium">ห้องที่</p>
                        <p>{profile.teacher_profile.homeroom_class.room}</p>
                      </div>
                    )}
                    {(profile.teacher_profile.homeroom_class.floor || profile.teacher_profile.homeroom_class.building) && (
                      <div>
                        <p className="text-xs text-blue-400 font-medium">ที่ตั้ง</p>
                        <p>
                          {[
                            profile.teacher_profile.homeroom_class.building,
                            profile.teacher_profile.homeroom_class.floor ? `ชั้น ${profile.teacher_profile.homeroom_class.floor}` : null
                          ].filter(Boolean).join(' ')}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-blue-400 font-medium">จำนวนนักเรียน</p>
                      <p>
                        <span className="font-semibold text-blue-700">{profile.teacher_profile.homeroom_class.studentCount}</span>
                        {profile.teacher_profile.homeroom_class.maxStudents
                          ? ` / ${profile.teacher_profile.homeroom_class.maxStudents} คน`
                          : ' คน'}
                      </p>
                    </div>
                    {profile.teacher_profile.homeroom_class.academicYear && (
                      <div>
                        <p className="text-xs text-blue-400 font-medium">ปีการศึกษา</p>
                        <p className="flex items-center gap-1">
                          {profile.teacher_profile.homeroom_class.academicYear.year}
                          {profile.teacher_profile.homeroom_class.academicYear.isCurrent && (
                            <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full font-medium">ปัจจุบัน</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-gray-400 italic">ยังไม่ได้รับมอบหมายห้องเรียนประจำ</p>
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3 italic">
                * ชื่อ, ตำแหน่ง, วิทยฐานะ, แผนก, ครูประจำชั้น — แก้ไขโดยผู้ดูแลระบบเท่านั้น
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
