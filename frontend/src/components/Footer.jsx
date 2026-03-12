import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaEnvelope } from "react-icons/fa";
import { useFetchSchoolInfoQuery } from "../redux/features/about/aboutApi";

const Footer = () => {
  const { data: schoolInfo } = useFetchSchoolInfoQuery();

  const location = schoolInfo?.location || '270 หมู่ 9 ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย 43110';
  const phone = schoolInfo?.phone || '081 975 5413';
  const email = schoolInfo?.email || 'thabopittayakom@gmail.com';
  const officeOpen = (schoolInfo?.officeHoursOpen || '08:00').replace(':', '.');
  const officeClose = (schoolInfo?.officeHoursClose || '16:30').replace(':', '.');

  return (
    <footer className="bg-amber-900 text-amber-100 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About School */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-amber-200">โรงเรียนท่าบ่อพิทยาคม</h3>
            <p className="mb-4">
              โรงเรียนท่าบ่อพิทยาคม มุ่งมั่นพัฒนาผู้เรียนให้มีความรู้คู่คุณธรรม
              เพื่อก้าวสู่สังคมแห่งการเรียนรู้
            </p>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-200">ลิงก์ด่วน</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white">
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white">
                  ประวัติโรงเรียน
                </Link>
              </li>
              <li>
                <Link to="/academic-info" className="hover:text-white">
                  วิชาการ/หลักสูตร
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white">
                  ข่าวสาร/กิจกรรม
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-white">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-amber-200">ข้อมูลติดต่อ</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>{location}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="h-4 w-4 flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <FaClock className="h-4 w-4 flex-shrink-0" />
                <span>จันทร์-ศุกร์: {officeOpen} น. - {officeClose} น.</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="h-4 w-4 flex-shrink-0" />
                <span>{email}</span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Copyright */}
        <div className="border-t border-amber-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} โรงเรียนท่าบ่อพิทยาคม. สงวนลิขสิทธิ์.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;