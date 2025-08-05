import React from 'react';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault(); // ป้องกันการรีโหลดหน้าเว็บ

    // ดึงค่าจากฟอร์ม
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;

    // สร้างลิงก์ mailto
    const subject = `ข้อความจาก ${name}`;
    const body = `ชื่อ: ${name}%0D%0Aอีเมล: ${email}%0D%0Aข้อความ: ${message}`;
    const mailtoLink = `mailto:thabopittayakom@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // เปิดโปรแกรมอีเมล
    window.location.href = mailtoLink;
  };

  return (
    <section className="bg-gray-50 text-gray-800 container mx-auto p-8">
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
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* ข้อมูลติดต่อ */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">
              ข้อมูลติดต่อ
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-semibold">ที่อยู่:</span> 270 หมู่ 9 ตำบลกองนาง อำเภอท่าบ่อ จังหวัดหนองคาย 43110
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">โทรศัพท์:</span> 084-930-4710
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">อีเมล:</span> thabopittayakom@gmail.com
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Facebook:</span>{" "}
                <a
                  href="https://www.facebook.com/thabopit2559/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  ประชาสัมพันธ์โรงเรียนท่าบ่อพิทยาคม 
                </a>
              </p>
            </div>
          </div>

          {/* แบบฟอร์มติดต่อ */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-amber-500">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">
              ส่งข้อความถึงเรา
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="กรุณากรอกชื่อ-นามสกุล"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  อีเมล
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="กรุณากรอกอีเมล"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  ข้อความ
                </label>
                <textarea
                  name="message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  rows="5"
                  placeholder="กรุณากรอกข้อความ"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                ส่งข้อความ
              </button>
            </form>
          </div>
        </div>

        {/* แผนที่ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-amber-800 mb-6">
            แผนที่โรงเรียน
          </h2>
          <div className="overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d7593.664875771616!2d102.574993!3d17.893287!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDUzJzM1LjgiTiAxMDLCsDM0JzMwLjAiRQ!5e0!3m2!1sen!2sus!4v1742529432229!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;