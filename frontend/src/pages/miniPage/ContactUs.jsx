import React, { useEffect } from 'react';

const ContactUs = () => {
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

  return (
    <section className="bg-gray-50 text-gray-800" style={{ minWidth: '320px' }}>
      {/* ส่วนหัวข้อหลัก */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90 z-10" />
        <img
          src="/src/assets/images/thabo_school.jpg"
          alt="ติดต่อเรา"
          className="w-full h-[400px] object-cover"
        />
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            ติดต่อเรา
          </h1>
          <h2 className="mb-6 text-3xl font-semibold tracking-tight text-amber-300">
            โรงเรียนท่าบ่อพิทยาคม
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/90">
            เราพร้อมตอบคำถามและให้ข้อมูลเพิ่มเติม
          </p>
        </div>
      </div>

      {/* ส่วนข้อมูลติดต่อและแบบฟอร์ม */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {/* ข้อมูลติดต่อ */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-6 sm:p-8 border-t-4 border-amber-500">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 sm:mb-6">
              ข้อมูลติดต่อ
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">ที่อยู่:</span> 270 หมู่ 9 ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย 43110
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">โทรศัพท์:</span>
                <a href="tel:084-930-4710" className="text-amber-700 hover:underline ml-1">
                  084-930-4710
                </a>
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">อีเมล:</span>
                <a href="mailto:thabopittayakom@gmail.com" className="text-amber-700 hover:underline ml-1">
                  thabopittayakom@gmail.com
                </a>
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                <span className="font-semibold">Facebook:</span>{" "}
                <a
                  href="https://www.facebook.com/thabopit2559/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-words"
                >
                  ประชาสัมพันธ์โรงเรียนท่าบ่อพิทยาคม
                </a>
              </p>

              {/* ปุ่มส่งอีเมล */}
              <div className="mt-6 sm:mt-8">
                <a
                  href="mailto:thabopittayakom@gmail.com"
                  className="inline-flex items-center justify-center w-full bg-amber-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  ส่งอีเมลถึงโรงเรียน
                </a>
              </div>
            </div>
          </div>

          {/* พื้นที่ว่างสำหรับสมดุล */}
          <div></div>
        </div>

        {/* แผนที่ */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-4 sm:mb-6">
            แผนที่โรงเรียน
          </h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7593.664875771616!2d102.574993!3d17.893287!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDUzJzM1LjgiTiAxMDLCsDM0JzMwLjAiRQ!5e0!3m2!1sen!2sus!4v1742529432229!5m2!1sen!2sus"
              width="100%"
              height="350"
              className="sm:h-[400px] md:h-[450px]"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="แผนที่โรงเรียนท่าบ่อพิทยาคม"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;