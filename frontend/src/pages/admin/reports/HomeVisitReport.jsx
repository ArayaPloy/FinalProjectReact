import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Search, Filter, Calendar, Users, Home, FileText,
    Download, Printer, ChevronLeft, ChevronRight,
    AlertCircle, CheckCircle, XCircle, Clock, MapPin, Phone,
    Mail, User, Building, Image as ImageIcon, X, Eye
} from 'lucide-react';
import { MdVisibility, MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import { getApiURL } from '../../../utils/apiConfig';
import { selectCurrentUser } from '../../../redux/features/auth/authSlice';

const HomeVisitReport = () => {
    const currentUser = useSelector(selectCurrentUser);
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
    const isTeacher = currentUser?.role === 'teacher';

    // State Management
    const [homeVisits, setHomeVisits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTeacher, setFilterTeacher] = useState('');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [viewingVisit, setViewingVisit] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [uniqueTeachersCount, setUniqueTeachersCount] = useState(0);

    // Export Modal State
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportMode, setExportMode] = useState('date');
    const [exportDateFrom, setExportDateFrom] = useState('');
    const [exportDateTo, setExportDateTo] = useState('');
    const [exportTeacherId, setExportTeacherId] = useState('');
    const [exportStudentSearch, setExportStudentSearch] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // Fetch home visits data
    const fetchHomeVisits = async () => {
        setIsLoading(true);
        try {
            const apiURL = getApiURL('/homevisits');
            const params = new URLSearchParams({
                page: currentPage,
                limit: itemsPerPage,
                ...(searchTerm && { search: searchTerm }),
                ...(filterTeacher && { teacherId: filterTeacher }),
                ...(filterDateFrom && { startDate: filterDateFrom }),
                ...(filterDateTo && { endDate: filterDateTo })
            });

            const response = await fetch(`${apiURL}?${params}`, {
                credentials: 'include'
            });

            // ตรวจสอบ 401 Unauthorized (Token หมดอายุหรือไม่มี)
            if (response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณาเข้าสู่ระบบใหม่',
                    text: 'Session หมดอายุแล้ว',
                    confirmButtonColor: '#3b82f6',
                    confirmButtonText: 'เข้าสู่ระบบ'
                }).then(() => {
                    window.location.href = '/login';
                });
                return;
            }

            const result = await response.json();

            if (result.success) {
                setHomeVisits(result.data);
                setTotalPages(result.pagination.totalPages);
                setTotalRecords(result.pagination.total);

                // นับจำนวนครูที่เคยเยี่ยมบ้าน (unique teachers)
                const uniqueTeachers = new Set();
                result.data.forEach(visit => {
                    if (visit.teacherId) {
                        uniqueTeachers.add(visit.teacherId);
                    }
                });
                setUniqueTeachersCount(uniqueTeachers.size);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error fetching home visits:', error);

            // ไม่แสดง alert ถ้าเป็น 401 (จัดการแล้วข้างบน)
            if (error.message !== '401') {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถโหลดข้อมูลการเยี่ยมบ้านได้',
                    confirmButtonColor: '#ef4444',
                    confirmButtonText: 'ตกลง'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch teachers for filter
    const fetchTeachers = async () => {
        try {
            const apiURL = getApiURL('/teachers/by-department');
            const response = await fetch(apiURL, {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                const allTeachers = Object.values(result.data).flat();
                setTeachers(allTeachers);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    useEffect(() => {
        fetchHomeVisits();
    }, [currentPage, itemsPerPage]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentPage === 1) {
                fetchHomeVisits();
            } else {
                setCurrentPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, filterTeacher, filterDateFrom, filterDateTo]);

    // View details
    const handleViewDetails = async (visitId) => {
        try {
            const apiURL = getApiURL(`/homevisits/${visitId}`);
            const response = await fetch(apiURL, {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                setViewingVisit(result.data);
                setIsViewModalOpen(true);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error fetching visit details:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถโหลดรายละเอียดการเยี่ยมบ้านได้',
                confirmButtonColor: '#ef4444',
                confirmButtonText: 'ตกลง'
            });
        }
    };

    // Delete visit (soft delete)
    const handleDelete = async (visitId, studentName) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            html: `คุณต้องการลบรายงานการเยี่ยมบ้าน<br/><strong>${studentName}</strong><br/>ใช่หรือไม่?`,
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
            const apiURL = getApiURL(`/homevisits/${visitId}`);
            const response = await fetch(apiURL, {
                method: 'DELETE',
                credentials: 'include'
            });

            const deleteResult = await response.json();

            if (deleteResult.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'ลบสำเร็จ!',
                    text: 'ลบรายงานการเยี่ยมบ้านเรียบร้อยแล้ว',
                    confirmButtonColor: '#10b981',
                    confirmButtonText: 'ตกลง'
                });
                fetchHomeVisits();
            } else {
                throw new Error(deleteResult.message);
            }
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

    // Build and open a PDF-ready print window for the given visits array
    const buildAndPrintPDF = (allVisits, subtitleLabel) => {
        if (!allVisits.length) {
            Swal.fire({ icon: 'warning', title: 'ไม่มีข้อมูล', text: 'ไม่พบข้อมูลการเยี่ยมบ้านตามเงื่อนไขที่เลือก', confirmButtonText: 'ตกลง' });
            return;
        }

        const sorted = [...allVisits].sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));
        const imgHost = `${window.location.protocol}//${window.location.hostname}:5000`;
        const imgUrl = (path) => {
            if (!path) return null;
            return path.startsWith('http') ? path : `${imgHost}${path}`;
        };
        const fmt = (d) => d ? new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
        const fmtTime = (visitDate, createdAt) => {
            if (!visitDate) return '-';
            const d = fmt(visitDate);
            if (!createdAt) return d;
            const t = new Date(createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
            return `${d} เวลา ${t} น.`;
        };
        const parseJ = (f) => {
            if (!f) return [];
            try {
                const p = typeof f === 'string' ? JSON.parse(f) : f;
                const arr = Array.isArray(p) ? p : [p];
                return arr.filter(i => i && typeof i === 'string' && i.trim() !== '');
            } catch { return typeof f === 'string' ? f.split(',').map(i => i.trim()).filter(Boolean) : []; }
        };
        const esc = (s) => String(s || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const val = (s) => `<span class="val">${esc(s)}</span>`;

        const cards = sorted.map((v, i) => {
            const teacher = v.teachers ? `${v.teachers.namePrefix || ''}${v.teachers.firstName || ''} ${v.teachers.lastName || ''}`.trim() : (v.teacherName || '-');
            const student = v.students ? `${v.students.namePrefix || ''}${v.students.firstName || ''} ${v.students.lastName || ''}`.trim() : (v.studentName || '-');
            const studentNo = v.students?.studentNumber || '-';
            const className = v.students?.homeroomClass?.className || '-';
            const address = v.students?.address || '-';
            const phone = v.students?.phoneNumber || '-';
            const emergency = v.students?.emergencyContact || '-';
            const parent = (v.parentFirstName || v.parentLastName) ? `${v.parentNamePrefix || ''}${v.parentFirstName || ''} ${v.parentLastName || ''}`.trim() : '-';
            const guardianName = (v.students?.guardianFirstName || v.students?.guardianLastName)
                ? `${v.students.guardianNamePrefix || ''}${v.students.guardianFirstName || ''} ${v.students.guardianLastName || ''}`.trim() : '-';
            const displayParent = parent !== '-' ? parent : guardianName;
            const relation = v.students?.guardianRelation || '-';
            const occupation = v.students?.guardianOccupation || '-';
            const income = v.students?.guardianMonthlyIncome || '-';
            const purpose = parseJ(v.visitPurpose).join('<br/>') || '-';
            const family = parseJ(v.familyStatus).join(', ') || '-';
            const houseType = v.students?.houseType || v.houseType || '-';
            const houseMaterial = v.students?.houseMaterial || v.houseMaterial || '-';
            const utilities = v.students?.utilities || v.utilities || '-';
            const studyArea = v.students?.studyArea || v.studyArea || '-';

            // images
            const allImages = [];
            const mainImg = imgUrl(v.imagePath);
            if (mainImg) allImages.push(mainImg);
            parseJ(v.imageGallery).forEach(p => { const u = imgUrl(p); if (u) allImages.push(u); });
            const imagesHtml = allImages.length
                ? `<div class="section-group">
                     <div class="section-title-bar">รูปภาพประกอบ</div>
                     <div class="images-grid">
                       ${allImages.map(u => `<div class="img-wrap"><img src="${u}" onerror="this.style.display='none'" /></div>`).join('')}
                     </div>
                   </div>`
                : '';

            const cell = (label, value, html = false) =>
                `<div class="cell"><div class="cell-label">${esc(label)}</div><div class="cell-value">${html ? value : esc(value)}</div></div>`;

            const repeatHeader = i > 0 ? `
  <div class="repeat-header">
    <h1>รายงานการเยี่ยมบ้านนักเรียน</h1>
    <p>${esc(subtitleLabel)} &nbsp;|  วันที่พิมพ์ ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;|  จำนวน ${sorted.length} รายการ</p>
  </div>` : '';

            return `
<div class="visit-card ${i > 0 ? 'page-break' : ''}">
  ${repeatHeader}
  <div class="card-header">
    <span>รายการที่ ${i + 1} — ${esc(student)}</span>
    <span class="card-date-right">${fmtTime(v.visitDate, v.createdAt)}</span>
  </div>

  <div class="section-group">
    <div class="section-title-bar">ข้อมูลพื้นฐาน</div>
    <div class="two-col">
      ${cell('ครูผู้เยี่ยม', teacher)}
      ${cell('รหัสนักเรียน', studentNo)}
      ${cell('ชื่อนักเรียน', student)}
      ${cell('ห้องเรียน', className)}
      ${cell('เบอร์โทร', phone)}
      ${cell('ผู้ติดต่อฉุกเฉิน', emergency)}
    </div>
    <div class="one-col">
      ${cell('ที่อยู่', address)}
    </div>
  </div>

  <div class="section-group">
    <div class="section-title-bar">ข้อมูลผู้ปกครองและครอบครัว</div>
    <div class="two-col">
      ${cell('ชื่อผู้ปกครอง', displayParent)}
      ${cell('ความสัมพันธ์', relation)}
      ${cell('อาชีพ', occupation)}
      ${cell('รายได้ต่อเดือน', income)}
      ${cell('สถานะครอบครัว', family)}
    </div>
  </div>

  <div class="section-group">
    <div class="section-title-bar">สภาพบ้าน</div>
    <div class="two-col">
      ${cell('ประเภทบ้าน', houseType)}
      ${cell('วัสดุก่อสร้าง', houseMaterial)}
      ${cell('สาธารณูปโภค', utilities)}
      ${cell('พื้นที่เรียน', studyArea)}
    </div>
  </div>

  <div class="section-group">
    <div class="section-title-bar">รายละเอียดการเยี่ยมบ้าน</div>
    <div class="one-col">
      ${cell('วัตถุประสงค์การเยี่ยม', purpose, true)}
      ${cell('พฤติกรรมนักเรียนที่บ้าน', v.studentBehaviorAtHome)}
      ${cell('ความร่วมมือของผู้ปกครอง', v.parentCooperation)}
      ${cell('ปัญหาที่พบ', v.problems)}
      ${cell('ข้อเสนอแนะ', v.recommendations)}
      ${cell('แผนติดตามผล', v.followUpPlan)}
      ${cell('สรุป', v.summary)}
      ${v.notes ? cell('หมายเหตุ', v.notes) : ''}
    </div>
  </div>

  ${imagesHtml}

  <div class="section-group signature-section">
    <div class="signature-row">
      <div class="sig-box">
        <div class="sig-line">ลงชื่อผู้ปกครอง .....................................</div>
        <div class="sig-name">( ${esc(displayParent)} )</div>
      </div>
      <div class="sig-box">
        <div class="sig-line">ลงชื่อครูผู้เยี่ยม .....................................</div>
        <div class="sig-name">( ${esc(teacher)} )</div>
      </div>
    </div>
  </div>
</div>`;
        }).join('');

        const html = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>รายงานการเยี่ยมบ้านนักเรียน</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sarabun', 'TH Sarabun New', Tahoma, sans-serif; font-size: 11pt; color: #111; background: #fff; padding: 8mm 12mm; }
  h1.report-title { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 3px; }
  p.report-sub { text-align: center; font-size: 9.5pt; color: #555; margin-bottom: 14px; }
  .visit-card { margin-bottom: 12px; }
  .card-header { display: flex; justify-content: space-between; align-items: center; background: #1e3a5f; color: #fff; padding: 6px 12px; font-weight: bold; font-size: 10.5pt; }
  .card-date-right { font-size: 9.5pt; font-weight: normal; }
  .section-group { margin-top: 6px; break-inside: avoid; page-break-inside: avoid; }
  .section-title-bar { background: #dbeafe; color: #1e3a5f; font-weight: bold; font-size: 9.5pt; padding: 3px 10px; border-left: 4px solid #1e3a5f; margin-bottom: 0; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid #d1d5db; border-top: none; }
  .one-col { display: grid; grid-template-columns: 1fr; gap: 0; border: 1px solid #d1d5db; border-top: none; }
  .cell { display: flex; flex-direction: column; padding: 4px 8px; border-bottom: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; font-size: 10pt; }
  .cell:nth-child(even) { border-right: none; }
  .one-col .cell { border-right: none; }
  .cell-label { font-weight: bold; color: #374151; font-size: 9pt; margin-bottom: 1px; }
  .cell-value { color: #111; }
  .images-grid { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px; border: 1px solid #d1d5db; border-top: none; }
  .img-wrap { width: 110px; height: 110px; overflow: hidden; border: 1px solid #ccc; border-radius: 4px; }
  .img-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .signature-section { margin-top: 24px; }
  .signature-row { display: flex; justify-content: space-around; padding: 8px 20px 4px; }
  .sig-box { text-align: center; width: 42%; }
  .sig-line { padding-bottom: 6px; margin-bottom: 4px; font-size: 10pt; letter-spacing: 0.5px; }
  .sig-name { font-size: 9.5pt; color: #374151; }
  .report-header { text-align: center; margin-bottom: 14px; }
  .repeat-header { display: none; }
  .page-break { page-break-before: always; }
  @media print {
    body { padding: 6mm 10mm; }
    .repeat-header { display: block; text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 10px; }
    .repeat-header h1 { font-size: 14pt; font-weight: bold; margin-bottom: 2px; }
    .repeat-header p { font-size: 8.5pt; color: #555; }
    .section-group { break-inside: avoid; page-break-inside: avoid; }
    .signature-section { break-inside: avoid; page-break-inside: avoid; }
    .page-break { break-before: page; }
    .images-grid { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="report-header">
  <h1 class="report-title">รายงานการเยี่ยมบ้านนักเรียน</h1>
  <p class="report-sub">${esc(subtitleLabel)} &nbsp;|&nbsp; วันที่พิมพ์ ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} &nbsp;|&nbsp; จำนวน ${sorted.length} รายการ</p>
</div>
${cards}
</body></html>`;

        const win = window.open('', '_blank');
        if (!win) { Swal.fire({ icon: 'error', title: 'ถูก Popup Blocked', text: 'กรุณาอนุญาต popup สำหรับเว็บไซต์นี้แล้วลองใหม่', confirmButtonText: 'ตกลง' }); return; }
        win.document.write(html);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 600);
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const apiURL = getApiURL('/homevisits');
            const params = new URLSearchParams({ page: 1, limit: 9999 });
            let subtitleLabel = 'ข้อมูลทั้งหมด';

            if (exportMode === 'date') {
                if (exportDateFrom) { params.set('startDate', exportDateFrom); }
                if (exportDateTo) { params.set('endDate', exportDateTo); }
                subtitleLabel = exportDateFrom || exportDateTo
                    ? `วันที่ ${exportDateFrom || '...'} ถึง ${exportDateTo || '...'}`
                    : 'ข้อมูลทั้งหมด';
            } else if (exportMode === 'teacher') {
                if (exportTeacherId) {
                    params.set('teacherId', exportTeacherId);
                    const t = teachers.find(t => String(t.id) === String(exportTeacherId));
                    subtitleLabel = t ? `ครู: ${t.namePrefix || ''}${t.name || ''}`.trim() : 'ตามครูผู้เยี่ยม';
                }
            } else if (exportMode === 'student') {
                if (exportStudentSearch) {
                    params.set('search', exportStudentSearch);
                    subtitleLabel = `นักเรียน: ${exportStudentSearch}`;
                }
            }

            const response = await fetch(`${apiURL}?${params}`, { credentials: 'include' });
            const result = await response.json();
            const visits = result.success ? result.data : homeVisits;
            setExportModalOpen(false);
            buildAndPrintPDF(visits, subtitleLabel);
        } catch (e) {
            setExportModalOpen(false);
            buildAndPrintPDF(homeVisits, 'ข้อมูลทั้งหมด');
        } finally {
            setIsExporting(false);
        }
    };

    // Parse JSON fields
    const parseJsonField = (field) => {
        if (!field) return []; // ตรวจสอบค่าว่าง
        try {
            const parsed = typeof field === 'string' ? JSON.parse(field) : field;
            const result = Array.isArray(parsed) ? parsed : [parsed]; // แปลงเป็น Array
            // กรอง Empty Strings ลบ whitespace
            return result.filter(item => item && typeof item === 'string' && item.trim() !== '');
        } catch {
            // If not valid JSON, treat as comma-separated plain text
            if (typeof field === 'string') {
                return field.split(',') // Split ด้วย comma
                    .map(item => item.trim()) // ลบ whitespace
                    .filter(item => item !== ''); //กรอง empty strings         
            }
            return [];
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format visit date + recorded time (createdAt)
    const formatVisitDateTime = (visitDate, createdAt) => {
        if (!visitDate) return '-';
        const date = new Date(visitDate);
        const formatted = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        if (!createdAt) return formatted;
        const timeStr = new Date(createdAt).toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Bangkok'
        });
        return `${formatted} ${timeStr}`;
    };

    // Open image modal
    const handleImageClick = (imagePath) => {
        // Convert relative path to full URL
        const fullImageUrl = imagePath.startsWith('http')
            ? imagePath
            : `${window.location.protocol}//${window.location.hostname}:5000${imagePath}`;
        setSelectedImage(fullImageUrl);
        setImageModalOpen(true);
    };

    // Get full image URL แปลง path เป็น URL
    // ก่อน: /uploads/homevisits/image.jpg (relative path)
    // หลัง: http://localhost:5000/uploads/homevisits/image.jpg (full URL)
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${window.location.protocol}//${window.location.hostname}:5000${imagePath}`;
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setFilterTeacher('');
        setFilterDateFrom('');
        setFilterDateTo('');
        setCurrentPage(1);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Home className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            รายงานการเยี่ยมบ้านนักเรียน
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600">
                        ระบบรายงานการเยี่ยมบ้านนักเรียนเพื่อส่งรายงานให้ สพท. และ สพฐ.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">รายการทั้งหมด</p>
                                <p className="text-2xl font-bold text-blue-900">{totalRecords}</p>
                            </div>
                            <div className="bg-blue-200 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-blue-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">รายการหน้าปัจจุบัน</p>
                                <p className="text-2xl font-bold text-green-900">{homeVisits.length}</p>
                            </div>
                            <div className="bg-green-200 p-3 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">หน้าทั้งหมด</p>
                                <p className="text-2xl font-bold text-purple-900">{totalPages}</p>
                            </div>
                            <div className="bg-purple-200 p-3 rounded-full">
                                <FileText className="w-6 h-6 text-purple-700" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 font-medium">จำนวนครูที่เยี่ยม</p>
                                <p className="text-2xl font-bold text-orange-900">{uniqueTeachersCount}</p>
                                {/* <p className="text-xs text-orange-600 mt-1">คน</p>*/}
                            </div>
                            <div className="bg-orange-200 p-3 rounded-full">
                                <Users className="w-6 h-6 text-orange-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 print:hidden">
                    <div className="space-y-4">
                        {/* Search and Teacher Filter */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="ค้นหาชื่อนักเรียน, ผู้ปกครอง..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Teacher Filter - admin only */}
                            {isAdmin ? (
                                <select
                                    value={filterTeacher}
                                    onChange={(e) => setFilterTeacher(e.target.value)}
                                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">ครูทุกคน</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.namePrefix} {teacher.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    แสดงเฉพาะนักเรียนในห้องของคุณ
                                </div>
                            )}
                        </div>

                        {/* Date Range Filter */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    วันที่เริ่มต้น
                                </label>
                                <input
                                    type="date"
                                    value={filterDateFrom}
                                    onChange={(e) => setFilterDateFrom(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    วันที่สิ้นสุด
                                </label>
                                <input
                                    type="date"
                                    value={filterDateTo}
                                    onChange={(e) => setFilterDateTo(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleResetFilters}
                                    className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                >
                                    ล้างตัวกรอง
                                </button>
                            </div>

                            <div className="flex items-end">
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
                                >
                                    <option value={10}>10 รายการ/หน้า</option>
                                    <option value={25}>25 รายการ/หน้า</option>
                                    <option value={50}>50 รายการ/หน้า</option>
                                    <option value={100}>100 รายการ/หน้า</option>
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setExportModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                                <Download className="w-4 h-4" />
                                ส่งออก PDF
                            </button>
                        </div>
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

                {/* Table View - Desktop */}
                {!isLoading && homeVisits.length > 0 && (
                    <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            วันที่เยี่ยม
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ครูผู้เยี่ยม
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            นักเรียน
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ชั้น
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ผู้ปกครอง
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            วัตถุประสงค์
                                        </th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            การดำเนินการ
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {homeVisits.map((visit) => (
                                        <tr key={visit.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {formatVisitDateTime(visit.visitDate, visit.createdAt)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 max-w-[8rem] truncate">
                                                {visit.teachers
                                                    ? `${visit.teachers.namePrefix || ''}${visit.teachers.firstName || ''} ${visit.teachers.lastName || ''}`.trim()
                                                    : visit.teacherName || '-'
                                                }
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {visit.students ?
                                                    `${visit.students.namePrefix || ''}${visit.students.firstName || ''} ${visit.students.lastName || ''}`.trim() :
                                                    visit.studentName || '-'
                                                }
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {visit.students?.homeroomClass?.className || visit.className || '-'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {visit.parentFirstName || visit.parentLastName ?
                                                    `${visit.parentNamePrefix || ''}${visit.parentFirstName || ''} ${visit.parentLastName || ''}`.trim() :
                                                    '-'
                                                }
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 max-w-[9rem] truncate">
                                                {parseJsonField(visit.visitPurpose).join(', ') || '-'}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(visit.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <MdVisibility className="w-4 h-4" />
                                                        <span>ดู</span>
                                                    </button>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={() => handleDelete(visit.id, visit.studentName)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                        >
                                                            <MdDelete className="w-4 h-4" />
                                                            <span>ลบ</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Card View - Mobile & Tablet */}
                {!isLoading && homeVisits.length > 0 && (
                    <div className="lg:hidden space-y-4">
                        {homeVisits.map((visit) => (
                            <div
                                key={visit.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                            >
                                <div className="p-4 space-y-3">
                                    {/* Date Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                            <Calendar className="w-4 h-4" />
                                            {formatVisitDateTime(visit.visitDate, visit.createdAt)}
                                        </div>
                                    </div>

                                    {/* Teacher */}
                                    <div className="flex items-start gap-2">
                                        <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">ครูผู้เยี่ยม</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {visit.teachers ?
                                                    `${visit.teachers.namePrefix || ''}${visit.teachers.firstName || ''} ${visit.teachers.lastName || ''}`.trim() :
                                                    visit.teacherName || '-'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Student */}
                                    <div className="flex items-start gap-2">
                                        <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">นักเรียน</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {visit.students ?
                                                    `${visit.students.namePrefix || ''}${visit.students.firstName || ''} ${visit.students.lastName || ''}`.trim() :
                                                    visit.studentName || '-'
                                                }
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {visit.students?.homeroomClass?.className || visit.className || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Parent */}
                                    <div className="flex items-start gap-2">
                                        <Home className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-gray-500">ผู้ปกครอง</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {visit.parentFirstName || visit.parentLastName ?
                                                    `${visit.parentNamePrefix || ''}${visit.parentFirstName || ''} ${visit.parentLastName || ''}`.trim() :
                                                    '-'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Purpose */}
                                    <div className="flex items-start gap-2">
                                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">วัตถุประสงค์</p>
                                            <p className="text-sm text-gray-900 line-clamp-2 break-words">
                                                {parseJsonField(visit.visitPurpose).join(', ') || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => handleViewDetails(visit.id)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                        >
                                            <MdVisibility className="w-4 h-4" />
                                            ดูรายละเอียด
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(visit.id, visit.studentName)}
                                                className="inline-flex items-center justify-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                                <span>ลบ</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && homeVisits.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            ไม่พบข้อมูลการเยี่ยมบ้าน
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm || filterTeacher || filterDateFrom || filterDateTo
                                ? 'ลองเปลี่ยนเงื่อนไขการค้นหา'
                                : 'ยังไม่มีข้อมูลการเยี่ยมบ้านในระบบ'}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && homeVisits.length > 0 && totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                        <div className="text-sm text-gray-600">
                            แสดง {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalRecords)} จาก {totalRecords} รายการ
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                ก่อนหน้า
                            </button>

                            {/* Page Numbers */}
                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ถัดไป
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* View Details Modal */}
                {isViewModalOpen && viewingVisit && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                    รายละเอียดการเยี่ยมบ้าน
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* 1. ข้อมูลพื้นฐาน */}
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        ข้อมูลพื้นฐาน
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">วันที่เยี่ยมบ้าน</p>
                                            <p className="text-base text-gray-900">{formatVisitDateTime(viewingVisit.visitDate, viewingVisit.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">ครูผู้เยี่ยม</p>
                                            <p className="text-base text-gray-900">
                                                {viewingVisit.teachers ?
                                                    `${viewingVisit.teachers.namePrefix || ''}${viewingVisit.teachers.firstName || ''} ${viewingVisit.teachers.lastName || ''}`.trim() :
                                                    viewingVisit.teacherName || '-'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">รหัสนักเรียน</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.studentNumber || viewingVisit.studentNumber || viewingVisit.studentIdNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">ชื่อนักเรียน</p>
                                            <p className="text-base text-gray-900">
                                                {viewingVisit.students ?
                                                    `${viewingVisit.students.namePrefix || ''}${viewingVisit.students.firstName || ''} ${viewingVisit.students.lastName || ''}`.trim() :
                                                    viewingVisit.studentName || '-'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">วันเกิด</p>
                                            <p className="text-base text-gray-900">{formatDate(viewingVisit.studentBirthDate)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600 font-medium">ชั้น</p>
                                            <p className="text-base text-gray-900">
                                                {viewingVisit.students?.homeroomClass?.className || viewingVisit.className || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. ข้อมูลผู้ปกครองและครอบครัว */}
                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        ข้อมูลผู้ปกครองและครอบครัว
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">ชื่อผู้ปกครอง</p>
                                            <p className="text-base text-gray-900">
                                                {viewingVisit.parentFirstName || viewingVisit.parentLastName ?
                                                    `${viewingVisit.parentNamePrefix || ''}${viewingVisit.parentFirstName || ''} ${viewingVisit.parentLastName || ''}`.trim() :
                                                    (viewingVisit.students?.guardianFirstName || viewingVisit.students?.guardianLastName ?
                                                        `${viewingVisit.students.guardianNamePrefix || ''}${viewingVisit.students.guardianFirstName || ''} ${viewingVisit.students.guardianLastName || ''}`.trim() :
                                                        '-'
                                                    )
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">ความสัมพันธ์</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.guardianRelation || viewingVisit.relationship || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">อาชีพ</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.guardianOccupation || viewingVisit.occupation || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">รายได้ต่อเดือน</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.guardianMonthlyIncome || viewingVisit.monthlyIncome || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">สถานะครอบครัว</p>
                                            <p className="text-base text-gray-900">
                                                {parseJsonField(viewingVisit.familyStatus).join(', ') || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600 font-medium">เบอร์โทรศัพท์</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.phoneNumber || viewingVisit.phoneNumber || '-'}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="text-sm text-green-600 font-medium">ผู้ติดต่อฉุกเฉิน</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.emergencyContact || viewingVisit.emergencyContact || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. ที่อยู่และสภาพบ้าน */}
                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                                        <Home className="w-5 h-5" />
                                        ที่อยู่และสภาพบ้าน
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <p className="text-sm text-purple-600 font-medium">ที่อยู่</p>
                                            <p className="text-base text-gray-900">{viewingVisit.students?.address || viewingVisit.mainAddress || '-'}</p>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">ประเภทบ้าน</p>
                                                <p className="text-base text-gray-900">
                                                    {viewingVisit.students?.houseType || viewingVisit.houseType || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">วัสดุที่ใช้สร้าง</p>
                                                <p className="text-base text-gray-900">
                                                    {viewingVisit.students?.houseMaterial || viewingVisit.houseMaterial || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">สาธารณูปโภค</p>
                                                <p className="text-base text-gray-900">
                                                    {viewingVisit.students?.utilities || viewingVisit.utilities || '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-600 font-medium">พื้นที่เรียน</p>
                                                <p className="text-base text-gray-900">
                                                    {viewingVisit.students?.studyArea || viewingVisit.studyArea || '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 4. รายละเอียดการเยี่ยม */}
                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        รายละเอียดการเยี่ยม
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">วัตถุประสงค์การเยี่ยม</p>
                                            <p className="text-base text-gray-900 break-words">
                                                {parseJsonField(viewingVisit.visitPurpose).join(', ') || '-'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">พฤติกรรมนักเรียนที่บ้าน</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.studentBehaviorAtHome || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">ความร่วมมือของผู้ปกครอง</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.parentCooperation || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">ปัญหาที่พบ</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.problems || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">ข้อเสนอแนะ</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.recommendations || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">แผนติดตามผล</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.followUpPlan || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-orange-600 font-medium">สรุป</p>
                                            <p className="text-base text-gray-900 break-words">{viewingVisit.summary || '-'}</p>
                                        </div>
                                        {viewingVisit.notes && (
                                            <div>
                                                <p className="text-sm text-orange-600 font-medium">หมายเหตุ</p>
                                                <p className="text-base text-gray-900 break-words">{viewingVisit.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 5. รูปภาพประกอบ */}
                                {(viewingVisit.imagePath || viewingVisit.imageGallery) && (
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5" />
                                            รูปภาพประกอบ
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {viewingVisit.imagePath && (
                                                <div
                                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                                                    onClick={() => handleImageClick(viewingVisit.imagePath)}
                                                >
                                                    <img
                                                        src={getFullImageUrl(viewingVisit.imagePath)}
                                                        alt="รูปภาพหลัก"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = '/default-avatar.jpg';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            )}
                                            {viewingVisit.imageGallery && parseJsonField(viewingVisit.imageGallery).map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                                                    onClick={() => handleImageClick(img)}
                                                >
                                                    <img
                                                        src={getFullImageUrl(img)}
                                                        alt={`รูปภาพ ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = '/default-avatar.jpg';
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Export PDF Modal */}
                {exportModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Download className="w-5 h-5 text-green-600" />
                                    ตัวเลือกส่งออก PDF
                                </h2>
                                <button onClick={() => setExportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                {/* Mode selector */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">เลือกประเภทการส่งออก</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {[['date', 'ตามวันที่'], ['teacher', 'ตามครูผู้เยี่ยม'], ['student', 'ตามนักเรียน']].map(([mode, label]) => (
                                            <button
                                                key={mode}
                                                onClick={() => setExportMode(mode)}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-colors ${exportMode === mode ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Date mode */}
                                {exportMode === 'date' && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
                                            <input type="date" value={exportDateFrom} onChange={e => setExportDateFrom(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                                            <input type="date" value={exportDateTo} onChange={e => setExportDateTo(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        </div>
                                        <p className="text-xs text-gray-500">หากไม่เลือกวันที่จะส่งออกข้อมูลทั้งหมด</p>
                                    </div>
                                )}

                                {/* Teacher mode */}
                                {exportMode === 'teacher' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">เลือกครูผู้เยี่ยม</label>
                                        <select value={exportTeacherId} onChange={e => setExportTeacherId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500">
                                            <option value="">ครูทุกคน</option>
                                            {teachers.map(t => (
                                                <option key={t.id} value={t.id}>{t.namePrefix} {t.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Student mode */}
                                {exportMode === 'student' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ค้นหาชื่อหรือรหัสนักเรียน</label>
                                        <input type="text" value={exportStudentSearch} onChange={e => setExportStudentSearch(e.target.value)}
                                            placeholder="พิมพ์ชื่อ หรือ รหัสนักเรียน..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                                        <p className="text-xs text-gray-500 mt-1">ค้นหาได้ทั้งชื่อ-นามสกุล และรหัสนักเรียน (ตัวเลข) — หากเว้นว่างจะส่งออกข้อมูลทั้งหมด</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
                                <button onClick={() => setExportModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                                    ยกเลิก
                                </button>
                                <button onClick={handleExportPDF} disabled={isExporting}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed">
                                    {isExporting ? <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Download className="w-4 h-4" />}
                                    {isExporting ? 'กำลังส่งออก...' : 'ส่งออก PDF'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Modal */}
                {imageModalOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]"
                        onClick={() => setImageModalOpen(false)}
                    >
                        <div className="relative max-w-6xl max-h-[90vh]">
                            <button
                                onClick={() => setImageModalOpen(false)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomeVisitReport;
