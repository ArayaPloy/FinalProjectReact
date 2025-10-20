import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Blogs from "../pages/blogs/Blogs";
import About from "../pages/miniPage/About";
import VisionMission from "../pages/miniPage/VisionMission";
import SchoolBoard from "../pages/miniPage/SchoolBoard";
import StudentCouncil from "../pages/miniPage/StudentCouncil";
import StudentSchedule from "../pages/miniPage/StudentSchedule";
import Admissions from "../pages/miniPage/Admissions";
import Ita from "../pages/miniPage/Ita";
import AcademicClubs from "../pages/miniPage/AcademicClubs";
import FacultyStaff from "../pages/miniPage/FacultyStaff";
import HomeVisits from "../pages/miniPage/HomeVisits";
import AllStudents from "../pages/miniPage/AllStudents";
import FlagpoleAttendance from "../pages/miniPage/FlagpoleAttendance";
import BehaviorScore from "../pages/miniPage/BehaviorScore";
import PrivacyPolicy from "../pages/miniPage/PrivacyPolicy";
import ContactUs from "../pages/miniPage/ContactUs";
import SingleBlog from "../pages/blogs/singleBlog/SingleBlog";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import AddPost from "../pages/admin/post/AddPost";
import ManagePost from "../pages/admin/post/ManagePosts";
import ManageUser from "../pages/admin/users/ManageUser";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import UpdatePosts from "../pages/admin/post/UpdatePosts";
import ErrorPage from "../components/ErrorPage";
import EditSchoolHistory from "../pages/admin/school-history/SchoolHistory";
import ManageClubsPosts from "../pages/admin/post/ManageClubsPosts";
import PrivateRoute from "./PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/", // home page
        element: <Home />
      },
      {
        path: "/blogs", // blog page
        element: <Blogs />
      },
      {
        path: "/blogs/:id", // blog details
        element: <SingleBlog />,
      },
      {
        path: "/about-us", // เกี่ยวกับเรา
        element: <About />
      },
      {
        path: "/vision-mission", // วิสัยทัศน์และพันธกิจ
        element: <VisionMission />
      },
      {
        path: "/school-board", // โครงสร้างสายงานโรงเรียน
        element: <SchoolBoard />
      },
      {
        path: "/student-council", // สภานักเรียน
        element: <StudentCouncil />
      },
      {
        path: "/student-schedule", // ตารางนักเรียน
        element: <StudentSchedule />
      },
      {
        path: "/admissions", // การรับสมัครนักเรียน
        element: <Admissions />
      },
      {
        path: "/ita", // ประเมินคุณธรรมโปร่งใส
        element: <Ita />
      },
      {
        path: "/clubs", // ชุมนุมวิชาการ
        element: <AcademicClubs />
      },
      {
        path: "/faculty-staff", // คณะครูและบุคลากร
        element: <FacultyStaff />
      },
      {
        path: "/all-students", // นักเรียนทั้งหมด
        element: <AllStudents />
      },
      {
        path: "/flagpoleattendance", // เช็คชื่อเข้าแถว
        element: (
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
            <FlagpoleAttendance />
          </ProtectedRoute>
        )
      },
      {
        path: "/behaviorscore", // บันทึกคะแนนความประพฤติ
        element: (
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
            <BehaviorScore />
          </ProtectedRoute>
        )
      },
      {
        path: "/home-visits", // เยี่ยมบ้านนักเรียน
        element: (
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
            <HomeVisits />
          </ProtectedRoute>
        )
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />
      },
      {
        path: "/contact-us", // ติดต่อเรา
        element: <ContactUs />
      },
      // login & registration
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        )
      },
      {
        path: "/register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        )
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'super_admin', 'teacher']}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '',
            element: <Dashboard />,
          },
          {
            path: 'add-new-post',
            element: <AddPost />,
          },
          {
            path: 'manage-items',
            element: <ManagePost />,
          },
          {
            path: "update-items/:id",
            element: <UpdatePosts />
          },
          {
            path: 'users',
            element: <ManageUser />,
          },
          {
            path: 'manage-school-history',
            element: <EditSchoolHistory />,
          },
          {
            path: 'manage-clubs',
            element: <ManageClubsPosts />,
          }

        ],
      },

    ]
  },
]);

export default router;
