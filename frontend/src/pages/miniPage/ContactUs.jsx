import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useFetchSchoolInfoQuery, useUpdateSchoolInfoMutation } from '../../redux/features/about/aboutApi';
import { selectCurrentUser } from '../../redux/features/auth/authSlice';

const DEFAULT_CONTACT = {
  location: '270 หมู่ 9 ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย 43110',
  phone: '081 975 5413',
  officeHoursOpen: '08:00',
  officeHoursClose: '16:30',
  email: 'thabopittayakom@gmail.com',
  facebookUrl: 'https://share.google/tQKd27N8IIYcNqQT1',
  facebookName: 'ประชาสัมพันธ์โรงเรียนท่าบ่อพิทยาคม',
};

const ContactUs = () => {
  const user = useSelector(selectCurrentUser);
  const currentUserRole = typeof user?.role === 'object'
    ? user?.role?.roleName || user?.role?.name || 'user'
    : user?.role || 'user';
  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'super_admin';

  const { data: schoolInfo, isLoading } = useFetchSchoolInfoQuery();
  const [updateSchoolInfo, { isLoading: isSaving }] = useUpdateSchoolInfoMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    if (schoolInfo) {
      setForm({
        location: schoolInfo.location || DEFAULT_CONTACT.location,
        phone: schoolInfo.phone || DEFAULT_CONTACT.phone,
        officeHoursOpen: schoolInfo.officeHoursOpen || DEFAULT_CONTACT.officeHoursOpen,
        officeHoursClose: schoolInfo.officeHoursClose || DEFAULT_CONTACT.officeHoursClose,
        email: schoolInfo.email || DEFAULT_CONTACT.email,
        facebookUrl: schoolInfo.facebookUrl || DEFAULT_CONTACT.facebookUrl,
        facebookName: schoolInfo.facebookName || DEFAULT_CONTACT.facebookName,
      });
    }
  }, [schoolInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!isAdmin) {
      Swal.fire({ icon: 'warning', title: 'ไม่มีสิทธิ์', text: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขข้อมูลนี้ได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
      setIsEditing(false);
      return;
    }
    try {
      await updateSchoolInfo({ ...schoolInfo, ...form }).unwrap();
      setIsEditing(false);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'ข้อมูลติดต่อถูกอัปเดตแล้ว', timer: 2000, showConfirmButton: false });
    } catch (err) {
      const status = err?.status;
      if (status === 401) {
        Swal.fire({ icon: 'error', title: 'หมดเวลาเข้าสู่ระบบ', text: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
      } else if (status === 403) {
        Swal.fire({ icon: 'error', title: 'ไม่มีสิทธิ์', text: 'เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถแก้ไขข้อมูลนี้ได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
      } else {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถบันทึกข้อมูลได้', confirmButtonText: 'ตกลง', confirmButtonColor: '#d97706' });
      }
    }
  };

  const handleCancel = () => {
    if (schoolInfo) {
      setForm({
        location: schoolInfo.location || DEFAULT_CONTACT.location,
        phone: schoolInfo.phone || DEFAULT_CONTACT.phone,
        officeHoursOpen: schoolInfo.officeHoursOpen || DEFAULT_CONTACT.officeHoursOpen,
        officeHoursClose: schoolInfo.officeHoursClose || DEFAULT_CONTACT.officeHoursClose,
        email: schoolInfo.email || DEFAULT_CONTACT.email,
        facebookUrl: schoolInfo.facebookUrl || DEFAULT_CONTACT.facebookUrl,
        facebookName: schoolInfo.facebookName || DEFAULT_CONTACT.facebookName,
      });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    } else {
      metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) event.preventDefault();
    }, { passive: false });
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) event.preventDefault();
      lastTouchEnd = now;
    }, false);
  }, []);

  return (
    <section className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <img src={schoolInfo?.heroImage || '/thabo_school.jpg'} alt="ติดต่อเรา" className="w-full h-[400px] object-cover" />
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">ติดต่อเรา</h1>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
            {schoolInfo?.name || 'โรงเรียนท่าบ่อพิทยาคม'}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">เราพร้อมตอบคำถามและให้ข้อมูลเพิ่มเติม</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 border-t-4 border-amber-500">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-800">ข้อมูลติดต่อ</h2>
              {isAdmin && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 text-sm font-medium text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  แก้ไข
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="text-gray-400 text-sm">กำลงโหลด...</div>
            ) : isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ที่อยู่</label>
                  <textarea name="location" value={form.location} onChange={handleChange} rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">โทรศัพท์</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">วันทำการปกติ (จันทร์-ศุกร์) เวลาเปิด-ปิด</label>
                  <div className="flex items-center gap-2">
                    <input type="time" name="officeHoursOpen" value={form.officeHoursOpen} onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                    <span className="text-gray-500 text-sm">ถึง</span>
                    <input type="time" name="officeHoursClose" value={form.officeHoursClose} onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมล</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ลิงก์ Facebook</label>
                  <input type="url" name="facebookUrl" value={form.facebookUrl} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อแสดงบน Facebook</label>
                  <input type="text" name="facebookName" value={form.facebookName} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={handleSave} disabled={isSaving}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:bg-gray-400">
                    {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                  <button onClick={handleCancel}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors">
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">ที่อยู่:</span> {form.location}
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">โทรศัพท์:</span>
                  <a href={`tel:${form.phone.replace(/-/g, '')}`} className="text-amber-700 hover:underline ml-1">{form.phone}</a>
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">วันทำการปกติ (จันทร์-ศุกร์):</span>
                  <span className="ml-1">{form.officeHoursOpen?.replace(':', '.')} น. - {form.officeHoursClose?.replace(':', '.')} น.</span>
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">อีเมล:</span>
                  <a href={`mailto:${form.email}`} className="text-amber-700 hover:underline ml-1">{form.email}</a>
                </p>
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">Facebook:</span>{' '}
                  <a href={form.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-words">
                    {form.facebookName}
                  </a>
                </p>
                <div className="mt-6 sm:mt-8">
                  <a href={`mailto:${form.email}`}
                    className="inline-flex items-center justify-center w-full bg-amber-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    ส่งอีเมลถึงโรงเรียน
                  </a>
                </div>
              </div>
            )}
          </div>
          <div></div>
        </div>

        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 sm:mb-6">แผนที่โรงเรียน</h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7593.664875771616!2d102.574993!3d17.893287!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDUzJzM1LjgiTiAxMDLCsDM0JzMwLjAiRQ!5e0!3m2!1sen!2sus!4v1742529432229!5m2!1sen!2sus"
              width="100%" height="350" className="sm:h-[400px] md:h-[450px]"
              style={{ border: 0 }} allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="แผนที่โรงเรียนท่าบ่อพิทยาคม">
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
