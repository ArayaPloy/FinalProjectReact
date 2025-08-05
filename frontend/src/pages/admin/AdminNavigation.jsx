import React from "react";
import { NavLink } from "react-router-dom";
import AdminImg from "../../assets/admin.png";
import { useLogoutUserMutation } from "../../redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";

const AdminNavigation = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // ยืนยันการออกจากระบบ
    const confirmLogout = window.confirm("คุณแน่ใจหรือไม่ที่ต้องการออกจากระบบ?");
    
    if (!confirmLogout) return; // ถ้าผู้ใช้ยกเลิก ไม่ทำอะไรต่อ
    
    try {
      await logoutUser().unwrap();
      dispatch(logout());
    } catch (err) {
      console.error("ออกจากระบบไม่สำเร็จ:", err);
    }
  };

  return (
    <div className="h-full flex flex-col justify-between px-6 shadow-sm">
      {/* ข้อมูลผู้ดูแลและเมนูนำทาง */}
      <div>
        {/* ข้อมูลผู้ดูแล */}
        <div className="flex items-center gap-4 mb-8">
          <img src={AdminImg} alt="Admin" className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold text-lg">ผู้ดูแลระบบ</p>
            <p className="text-sm text-gray-600">ยินดีต้อนรับ!</p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* เมนูนำทาง */}
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>📊</span>
              <span>แดชบอร์ด</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-new-post"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>📝</span>
              <span>เพิ่มบทความใหม่</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/manage-items"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>🛠️</span>
              <span>จัดการบทความ</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span>👥</span>
              <span>ผู้ใช้งาน</span>
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ปุ่มออกจากระบบ */}
      <div>
        <hr className="border-gray-200 mb-6" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🚪</span>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNavigation;