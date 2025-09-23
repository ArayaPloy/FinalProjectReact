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
import PrivacyPolicy from "../pages/miniPage/PrivacyPolicy";
import ContactUs from "../pages/miniPage/ContactUs";
import SingleBlog from "../pages/blogs/singleBlog/SingleBlog";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../pages/admin/AdminLayout";
import AddPost from "../pages/admin/post/AddPost";
import ManagePost from "../pages/admin/post/ManagePosts";
import ManageUser from "../pages/admin/users/ManageUser";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import UpdatePosts from "../pages/admin/post/UpdatePosts";
import ErrorPage from "../components/ErrorPage";
import EditSchoolHistory from "../pages/admin/school-history/SchoolHistory";
import ManageClubsPosts from "../pages/admin/post/ManageClubsPosts";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/blogs",
        element: <Blogs/>
      },
      {
        path: "/blogs/:id",
        element:<SingleBlog /> ,
      },
      {
        path: "/about-us",
        element: <About/>
      },
      {
        path: "/vision-mission",
        element: <VisionMission/>
      },
      {
        path: "/school-board", // โครงสร้างสายงานโรงเรียน
        element: <SchoolBoard/>
      },
      {
        path: "/student-council", // สภานักเรียน
        element: <StudentCouncil/>
      },
      {
        path: "/student-schedule", // ตารางนักเรียน
        element: <StudentSchedule/>
      },
      {
        path: "/admissions", // การรับสมัครนักเรียน
        element: <Admissions/>
      },
      {
        path: "/ita", // ประเมินคุณธรรมโปร่งใส
        element: <Ita/>
      },
      {
        path: "/clubs", // ประเมินคุณธรรมโปร่งใส
        element: <AcademicClubs/>
      },
      {
        path: "/faculty-staff",
        element: <FacultyStaff/>
      },
      {
        path: "/all-students",
        element: <AllStudents/>
      },
      {
        path: "/home-visits",
        element: <HomeVisits/>
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy/>
      },
      {
        path: "/contact-us",
        element: <ContactUs/>
      },
      // login & registration
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: 'dashboard',
        element: <PrivateRoute><AdminLayout /></PrivateRoute>, // Use AdminLayout for admin routes
        children: [
          // Define admin routes here
          {
            path: '',
            element: <Dashboard/>,
          },
          {
            path: 'add-new-post',
            element: <AddPost/>,
          },
          {
            path: 'manage-items',
            element: <ManagePost/>,
          },
          {
            path: "update-items/:id",
            element: <UpdatePosts/>
          },
          {
            path: 'users',
            element: <ManageUser/>,
          },
          {
            path: 'manage-school-history',
            element: <EditSchoolHistory/>,
          },
          {
            path: 'manage-clubs',
            element: <ManageClubsPosts/>,
          }
          
        ],
      },

    ]
  },
]);

export default router;
