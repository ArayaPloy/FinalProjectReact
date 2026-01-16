import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AdminImg from "../../assets/admin.png";
import { useLogoutUserMutation } from "../../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import Swal from "sweetalert2";
import { Menu, X } from "lucide-react";

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ออกจากระบบ?",
      text: "คุณแน่ใจหรือไม่ที่ต้องการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await logoutUser().unwrap();
      dispatch(logout());
      
      Swal.fire({
        title: "ออกจากระบบสำเร็จ!",
        text: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("ออกจากระบบไม่สำเร็จ:", err);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถออกจากระบบได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตรวจสอบ",
      });
    }
  };

  return (
    <div className="h-full flex flex-col justify-between shadow-sm bg-white">
      {/* Header with Toggle Button (Mobile) */}
      <div>
        {/* Mobile Header - Admin Info + Hamburger */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 md:py-6 border-b md:border-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <img src={AdminImg} alt="Admin" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
            <div className="leading-tight">
              <p className="font-semibold text-base sm:text-lg leading-none mb-1 mt-3">ผู้ดูแลระบบ</p>
              <p className="text-xs sm:text-sm text-gray-600 leading-none">ยินดีต้อนรับ!</p>
            </div>
          </div>
          
          {/* Hamburger Menu Button - Show on Mobile Only */}
          <button
            onClick={toggleMenu}
            className="md:hidden min-h-[48px] min-w-[48px] flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 flex-shrink-0" />
            ) : (
              <Menu className="w-6 h-6 flex-shrink-0" />
            )}
          </button>
        </div>

        <hr className="hidden md:block border-gray-200 mb-6" />

        {/* เมนูนำทาง - Collapsible on Mobile, Always Visible on Desktop */}
        <ul className={`
          space-y-2 sm:space-y-3 md:space-y-4 
          px-4 sm:px-6 
          md:block
          ${isMenuOpen ? 'block py-4' : 'hidden'}
        `}>
          <li>
            <NavLink
              to="/dashboard"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📊</span>
              <span className="text-sm sm:text-base">แดชบอร์ด</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-new-post"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📝</span>
              <span className="text-sm sm:text-base">เพิ่มบทความ</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-school-history"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">🏫</span>
              <span className="text-sm sm:text-base">จัดการประวัติโรงเรียน</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-items"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📄</span>
              <span className="text-sm sm:text-base">จัดการบทความ</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-clubs"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">🎯</span>
              <span className="text-sm sm:text-base">จัดการชุมนุมวิชาการ</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-teachers"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">👨‍🏫</span>
              <span className="text-sm sm:text-base">จัดการบุคลากร</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-schedule"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📅</span>
              <span className="text-sm sm:text-base">จัดการตารางเรียน</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-academic-years"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📆</span>
              <span className="text-sm sm:text-base">จัดการปีการศึกษา</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/flagpole-attendance-report"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">📋</span>
              <span className="text-sm sm:text-base">รายงานเช็คชื่อเข้าแถว</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/behavior-score-report"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">⭐</span>
              <span className="text-sm sm:text-base">รายงานคะแนนความประพฤติ</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/home-visit-report"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">🏠</span>
              <span className="text-sm sm:text-base">รายงานการเยี่ยมบ้านนักเรียน</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              onClick={closeMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 min-h-[48px] rounded-lg transition-colors touch-manipulation ${isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg sm:text-xl flex-shrink-0">👥</span>
              <span className="text-sm sm:text-base">จัดการผู้ใช้</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ปุ่มออกจากระบบ - Collapsible on Mobile */}
      <div className={`
        md:block
        ${isMenuOpen ? 'block' : 'hidden'}
      `}>
        <hr className="border-gray-200 my-4 md:mb-6" />
        <div className="px-4 sm:px-6 pb-4 md:pb-0">
          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="w-full flex items-center justify-center md:justify-start gap-3 p-3 min-h-[48px] rounded-lg text-red-600 hover:bg-red-50 transition-colors font-semibold touch-manipulation"
          >
            <span className="text-lg sm:text-xl flex-shrink-0">🚪</span>
            <span className="text-sm sm:text-base">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigation;