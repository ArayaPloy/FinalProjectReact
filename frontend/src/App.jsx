import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AuthProvider from "./components/AuthProvider";
import 'antd/dist/reset.css';
import { Outlet } from "react-router-dom";
// น้ำหนักปกติ (400) และตัวหนา (700)
import '@fontsource/kanit/400.css';
import '@fontsource/kanit/700.css';

// หลายขนาดน้ำหนัก
import '@fontsource/kanit/300.css';  // Light
import '@fontsource/kanit/400.css';  // Regular
import '@fontsource/kanit/500.css';  // Medium
import '@fontsource/kanit/700.css';  // Bold

function App() {
  return (
    <AuthProvider>
      <div className="bg-bgPrimary min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer className="mt-auto" />
      </div>
    </AuthProvider>
  );
}

export default App;
