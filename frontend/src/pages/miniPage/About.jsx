// pages/About.jsx - แก้ไข syntax และ structure
import React, { useEffect } from 'react';
import { useFetchCompleteHistoryQuery } from '../../redux/features/about/aboutApi';
import { motion } from 'framer-motion';
import moment from 'moment';
import { formatDate } from '../../utils/dateFormater';

const About = () => {
  // Set viewport meta tag to prevent zooming issues on mobile
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

    // Prevent zoom on double-tap for iOS
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }, []);

  const { data: historyData, error, isLoading, refetch } = useFetchCompleteHistoryQuery();

  // Debug logging
  useEffect(() => {
    console.log('🔍 About component - API state:', {
      isLoading,
      error: error?.message || error,
      hasData: !!historyData,
      data: historyData
    });
  }, [historyData, error, isLoading]);

  // ใช้ข้อมูลจาก API โดยตรง
  const apiData = historyData?.data || historyData;
  const schoolInfo = apiData?.schoolInfo;
  const timelineEvents = apiData?.timeline || [];

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4" style={{ minWidth: '320px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 sm:h-32 w-24 sm:w-32 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-gray-600">กำลังโหลดข้อมูลประวัติโรงเรียน...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4" style={{ minWidth: '320px' }}>
        <div className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">ไม่สามารถโหลดข้อมูลประวัติโรงเรียนได้</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-amber-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!schoolInfo) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4" style={{ minWidth: '320px' }}>
        <div className="text-center bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-gray-500 text-4xl sm:text-6xl mb-4">📄</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูล</h2>
          <p className="text-gray-600 mb-4 text-sm sm:text-base">ยังไม่มีข้อมูลประวัติโรงเรียนในระบบ</p>
          <button
            onClick={refetch}
            className="bg-amber-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm sm:text-base"
          >
            รีเฟรช
          </button>
        </div>
      </div>
    );
  }

  // ข้อมูลการ์ดแสดงข้อมูลโรงเรียน
  const schoolInfoCards = [
    {
      icon: "🏫",
      title: "ชื่อสถานศึกษา",
      description: schoolInfo?.name || "ไม่ระบุ",
    },
    {
      icon: "📍",
      title: "ที่ตั้ง",
      description: schoolInfo?.location || "ไม่ระบุ",
    },
    {
      icon: "📅",
      title: "ก่อตั้งเมื่อ",
      description: schoolInfo?.foundedDate || "ไม่ระบุ",
    },
    {
      icon: "👔",
      title: "ผู้อำนวยการคนปัจจุบัน",
      description: schoolInfo?.currentDirector || "ไม่ระบุ",
    },
    {
      icon: "🎓",
      title: "ระดับการศึกษา",
      description: schoolInfo?.education_level || "ไม่ระบุ",
    },
    {
      icon: "🏆",
      title: "สังกัด",
      description: schoolInfo?.department || "ไม่ระบุ",
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
      {/* ส่วนภาพปกและหัวข้อหลัก */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <img
          src={schoolInfo?.heroImage || "/thabo_school.jpg"}
          alt="ประวัติโรงเรียน"
          className="w-full h-[400px] object-cover"
          onError={(e) => {
            e.target.src = "/thabo_school.jpg";
          }}
        />
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            ประวัติความเป็นมา
          </h1>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
            {schoolInfo?.name || "โรงเรียน"}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            ก้าวเดินอย่างมั่นคงสู่ความเป็นเลิศทางการศึกษา
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* ข้อมูลโรงเรียนโดยย่อ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-12 sm:mb-16"
        >
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 border-t-4 border-amber-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-4 sm:mb-6 text-center">
              {schoolInfo?.name || "โรงเรียน"}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3 sm:space-y-4">
              {schoolInfo?.description ? (
                schoolInfo.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 sm:mb-4 text-sm sm:text-base">{paragraph}</p>
                ))
              ) : (
                <p className="mb-3 sm:mb-4 text-center text-gray-500 text-sm sm:text-base">ไม่มีข้อมูลคำอธิบาย</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ข้อมูลโรงเรียน */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-8 sm:mb-10 text-center">
            ข้อมูลโรงเรียน
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {schoolInfoCards.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-4xl">{info.icon}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-amber-800 ml-3 sm:ml-4">{info.title}</h3>
                </div>
                <p className="text-gray-700 text-sm sm:text-base">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ไทม์ไลน์ประวัติโรงเรียน */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 sm:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-8 sm:mb-10 text-center">
            ประวัติความเป็นมาตามลำดับเวลา
          </h2>

          {timelineEvents && timelineEvents.length > 0 ? (
            <div className="relative">
              {/* เส้นไทม์ไลน์ */}
              <div className="absolute left-6 sm:left-1/2 sm:transform sm:-translate-x-1/2 h-full w-0.5 sm:w-1 bg-amber-200"></div>

              {/* เหตุการณ์ในไทม์ไลน์ */}
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative mb-8 sm:mb-12 ${index % 2 === 0
                      ? 'sm:ml-auto sm:pl-8 md:pl-16 sm:pr-0'
                      : 'sm:mr-auto sm:pr-8 md:pr-16 sm:pl-0'
                    } sm:w-1/2 pl-16`}
                >
                  {/* จุดบนเส้นไทม์ไลน์ */}
                  <div className={`absolute left-6 sm:left-auto ${index % 2 === 0 ? 'sm:right-0' : 'sm:left-0'
                    } transform -translate-x-1/2 sm:translate-x-1/2 -translate-y-1/2 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-amber-500 border-2 sm:border-4 border-white shadow-md flex items-center justify-center text-white font-bold z-10 text-xs sm:text-sm`}>
                    {index + 1}
                  </div>

                  {/* กล่องเนื้อหา */}
                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border-t-4 border-amber-500 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      {event.year && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                          {event.year}
                        </span>
                      )}
                      {event.date && (
                        <span className="text-gray-600 text-xs sm:text-sm flex items-center">
                          <span className="text-amber-500 mr-1">📅</span>
                          {formatDate(event.date)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-800 mb-2">{event.title}</h3>
                    <p className="text-gray-700 text-sm sm:text-base">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📜</div>
              <p className="text-gray-500 text-base sm:text-lg">ยังไม่มีข้อมูลไทม์ไลน์</p>
            </div>
          )}
        </motion.div>

        {/* ส่วนผู้บริหาร */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-6 sm:mb-8 text-center">
            ผู้บริหารโรงเรียน
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="relative w-48 h-46 mx-auto mb-4 overflow-hidden rounded-full border-4 border-amber-500 shadow-lg">
                <img
                  src={schoolInfo?.director_image || "/images/teachers/admin1.jpg"}
                  alt="ผู้อำนวยการโรงเรียน"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/images/teachers/admin1.jpg";
                  }}
                />
              </div>
              <h3 className="text-xl font-bold text-amber-800">
                {schoolInfo?.currentDirector || "ไม่ระบุ"}
              </h3>
              <p className="text-amber-600">
                ผู้อำนวยการ{schoolInfo?.name || "โรงเรียน"}
              </p>
            </div>

            <div className="max-w-xl">
              <blockquote className="italic text-gray-700 border-l-4 border-amber-500 pl-4 py-2 text-sm sm:text-base">
                {schoolInfo?.director_quote || "ยังไม่มีข้อความจากผู้อำนวยการ"}
              </blockquote>
              <p className="my-4 sm:my-5 text-gray-700 text-sm sm:text-base">
                ภายใต้การนำของผู้อำนวยการ{schoolInfo?.currentDirector || "คนปัจจุบัน"} โรงเรียน{schoolInfo?.name || "แห่งนี้"}ได้พัฒนาอย่างต่อเนื่อง
                ทั้งด้านวิชาการ กิจกรรมพัฒนาผู้เรียน และสภาพแวดล้อมทางกายภาพ เพื่อให้นักเรียนได้เรียนรู้
                อย่างมีความสุขและเต็มตามศักยภาพ
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-amber-700 to-amber-500 rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 text-white text-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">สนใจสมัครเรียนหรือเยี่ยมชมโรงเรียน?</h2>
          <p className="mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            หากท่านสนใจสมัครเรียนหรือต้องการข้อมูลเพิ่มเติมเกี่ยวกับ{schoolInfo?.name || "โรงเรียนแห่งนี้"}
            สามารถติดต่อเราได้ที่ฝ่ายวิชาการหรือสำนักงานโรงเรียน
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <a
              href="/contact-us"
              className="bg-white text-amber-700 hover:bg-gray-100 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base"
            >
              ติดต่อเรา
            </a>
            <a
              href="/admissions"
              className="bg-transparent hover:bg-white/10 border-2 border-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base"
            >
              ข้อมูลการรับสมัคร
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;