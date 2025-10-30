import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoBack = () => {
    // ถ้ามีหน้าก่อนหน้าให้กลับไป ถ้าไม่มีให้ไปหน้าแรก
    if (window.history.length > 1 && location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
	<h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
	<div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
		Page is Not Found
	</div>
	<div className="mt-5">
      <button
        onClick={handleGoBack}
        className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring"
      >
        <span
          className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
          กลับหน้าเดิม
        </span>
      </button>
    </div>
</main>
  )
}

export default ErrorPage