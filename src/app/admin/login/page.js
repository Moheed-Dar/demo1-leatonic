import Link from "next/link";
import LoginForm from "@/app/admin/login/LoginForm";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Login",
  description: "Login to admin panel",
};

export default function AdminLoginPage() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-[#0A1A2F] overflow-hidden">
      {/* Background Grid - using Light Blue (ACCENT_LT #93C5FD) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(147,197,253,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ===== LOGO WATERMARK ===== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <img
          src="/logo-watermark.png"
          alt="Logo Watermark"
          width={400}
          height={400}
          style={{ width: "auto", height: "auto" }}
          className="w-125 h-125 sm:w-150 sm:h-150 object-contain opacity-[0.3]"
        />
      </div>

      {/* Top Glow - Blue (ACCENT #1D4ED8) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-75 bg-[#1D4ED8]/15 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Bottom Glow - Light Blue (ACCENT_LT #93C5FD) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-62.5 bg-[#93C5FD]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Back to Home */}
      <Link
        href="/"
        className="fixed top-5 left-5 z-50 flex items-center gap-2 text-[#93C5FD]/60 hover:text-[#93C5FD] text-sm font-medium transition-all bg-[#93C5FD]/5 hover:bg-[#93C5FD]/10 px-4 py-2.5 rounded-xl border border-[#93C5FD]/15 hover:border-[#93C5FD]/30"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-105 mx-4">
        <LoginForm />
      </div>
    </div>
  );
}