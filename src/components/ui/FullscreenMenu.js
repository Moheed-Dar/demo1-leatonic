"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  ShieldCheck,
  X,
  Home,
  Building2,
  BookOpen,
  Phone,
  Star,
  FileText,
  User,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// BLUE SCHEME — matches Navbar / Hero / About / Testimonials / Footer
// ============================================
const INK = "#0A1A2F";
const PAPER = "#F3F6FB";
const ACCENT = "#1D4ED8";
const ACCENT_DK = "#1E3A8A";
const ACCENT_SOFT = "#DBEAFE";
const ACCENT_LT = "#93C5FD";
const LINE = "#DCE3EE";
const MUTED = "#56697E";
const CARD = "#FFFFFF";

// ============================================
// NAV LINKS
// ============================================
const DEFAULT_NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "About", href: "/about", icon: User },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
];

const CMS_LINKS = [
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Services", href: "/services", icon: Star },
  { label: "Contact Us", href: "/contact", icon: Phone },
];

// Shared brand strings (single source of truth)
const BRAND_NAME = "BRAND NAME";
const BRAND_ROLE = "BRAND ROLE";
const BRAND_EMAIL = "brand@gmail.com";
const BRAND_SINCE = "BRAND SINCE";

// ============================================
// WORDMARK — text + glyph (replaces image-based polaroid frame)
// ============================================
const Wordmark = ({ onClick }) => (
  <Link
    href="/"
    onClick={onClick}
    className="group inline-flex items-center gap-2.5"
    aria-label={`${BRAND_NAME} — home`}
  >
    <span
      className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:rotate-[8deg]"
      style={{ backgroundColor: ACCENT }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    </span>
    <span
      className="text-[18px] font-semibold tracking-[-0.01em]"
      style={{ color: "#FFFFFF" }}
    >
      Estate
    </span>
  </Link>
);

// ============================================
// NAV LINK ROW — desktop, animated underline
// ============================================
const DesktopNavLink = ({ link, onClick }) => (
  <Link
    href={link.href}
    onClick={onClick}
    className="group relative inline-flex py-1.5 text-[14px] font-medium transition-colors hover:text-[#0A1A2F]"
    style={{ color: MUTED }}
  >
    <span className="relative inline-block">
      {link.label}
      <span
        className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full transition-all duration-300 group-hover:w-full"
        style={{ backgroundColor: ACCENT }}
      />
    </span>
  </Link>
);

// ============================================
// MOBILE NAV LINK — icon chip + label
// ============================================
const MobileNavLink = ({ link, onClick, index }) => {
  const Icon = link.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{
        delay: 0.1 + index * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        href={link.href}
        onClick={onClick}
        className="group flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#DBEAFE]/60"
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
          style={{
            backgroundColor: ACCENT_SOFT,
            border: `1px solid ${LINE}`,
            color: ACCENT_DK,
          }}
        >
          <Icon size={16} />
        </span>
        <span className="text-[14px] font-medium" style={{ color: INK }}>
          {link.label}
        </span>
        <ArrowRight
          size={14}
          className="ml-auto -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: ACCENT }}
        />
      </Link>
    </motion.div>
  );
};

export default function FullscreenMenu({ isOpen, onClose }) {
  const ringRef = useRef(null);
  const menuRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ---------- AUTH CHECK ----------
  useEffect(() => {
    setMounted(true);

    const checkAuthStatus = () => {
      try {
        const cookies = document.cookie.split(";");
        const authCookieNames = [
          "token",
          "auth_token",
          "session",
          "auth-session",
          "next-auth.session-token",
          "sb-access-token",
          "supabase-auth-token",
        ];

        const hasAuthCookie = cookies.some((cookie) => {
          const trimmedCookie = cookie.trim();
          return authCookieNames.some((name) =>
            trimmedCookie.startsWith(`${name}=`),
          );
        });

        if (hasAuthCookie) {
          setIsLoggedIn(true);
          return;
        }

        const localStorageKeys = [
          "token",
          "auth_token",
          "access_token",
          "user",
          "auth",
        ];

        const hasLocalToken = localStorageKeys.some((key) => {
          const value = localStorage.getItem(key);
          if (!value) return false;
          try {
            const parsed = JSON.parse(value);
            return parsed?.token || parsed?.access_token || parsed?.session;
          } catch {
            return value && value.length > 10;
          }
        });

        if (hasLocalToken) {
          setIsLoggedIn(true);
          return;
        }

        const sessionKeys = ["token", "auth_token", "access_token"];
        const hasSessionToken = sessionKeys.some((key) => {
          const value = sessionStorage.getItem(key);
          return value && value.length > 10;
        });

        if (hasSessionToken) {
          setIsLoggedIn(true);
          return;
        }

        setIsLoggedIn(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    if (isOpen) checkAuthStatus();
  }, [isOpen]);

  // Admin link dynamic config
  const adminLinkConfig = {
    href: isLoggedIn ? "/admin/dashboard" : "/admin/login",
    label: isLoggedIn ? "Dashboard" : "Admin",
    icon: isLoggedIn ? LayoutDashboard : ShieldCheck,
  };

  // Proper close handler
  const handleClose = () => {
    window.scrollTo({ top: 0, behavior: "instant" });
    onClose();
  };

  const handleLinkClick = (e) => {
    e.stopPropagation();
    handleClose();
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ---------- GSAP ring pulse (single subtle ring) ----------
  useEffect(() => {
    if (!isOpen || !ringRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ringRef.current, {
        scale: 1.15,
        opacity: 0.4,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });
    return () => ctx.revert();
  }, [isOpen]);

  // ---------- GSAP desktop slide-in ----------
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRef.current,
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
    });
    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  const AdminIcon = adminLinkConfig.icon;

  return (
    <>
      {/* ============ DESKTOP BACKDROP ============ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-998 hidden backdrop-blur-sm md:block"
        style={{ backgroundColor: `${INK}CC` }}
        onClick={handleClose}
      />

      {/* ============ DESKTOP MENU ============ */}
      <div
        ref={menuRef}
        className="fixed left-0 right-0 top-20 z-999 hidden justify-center px-4 md:flex lg:px-8"
      >
        <div
          className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
          style={{
            backgroundColor: PAPER,
            border: `1px solid ${LINE}`,
            boxShadow: `0 40px 80px -28px rgba(10,26,47,0.40)`,
          }}
        >
          {/* Subtle accent radial — single, quiet, top right */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 90% 10%, rgba(29,78,216,0.06) 0%, transparent 50%)`,
            }}
          />

          <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-2">
            {/* ============ LEFT: Hero image ============ */}
            <div className="relative h-44 p-3 lg:h-auto lg:min-h-72">
              <div
                className="group relative h-full w-full overflow-hidden rounded-xl"
                style={{
                  border: `1px solid ${LINE}`,
                }}
              >
                <Image
                  src="/banner/banner2.jpg"
                  alt={`${BRAND_NAME} preview`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 320px, 380px"
                />

                {/* Single neutral gradient for caption legibility */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, ${INK}10 0%, transparent 40%, ${INK}99 100%)`,
                  }}
                />

                {/* Subtle accent radial — quiet */}
                <div
                  ref={ringRef}
                  className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full"
                  style={{
                    backgroundColor: `${ACCENT}20`,
                    border: `1px solid ${ACCENT_LT}`,
                  }}
                />

                {/* Since badge — single quiet card */}
                <motion.div
                  className="absolute right-3 top-3 rounded-lg px-2.5 py-1.5"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <p
                    className="text-[9px] font-medium tracking-wide"
                    style={{ color: MUTED }}
                  >
                    Since
                  </p>
                  <p
                    className="text-[14px] font-semibold leading-none"
                    style={{ color: INK }}
                  >
                    {BRAND_SINCE}
                  </p>
                </motion.div>

                {/* Glass name plate */}
                <motion.div
                  className="absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2.5 backdrop-blur-md"
                  style={{
                    backgroundColor: `${INK}E6`,
                    border: `1px solid ${ACCENT}40`,
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: "#FFFFFF" }}
                  >
                    {BRAND_NAME}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className="h-px w-5"
                      style={{ backgroundColor: ACCENT_LT }}
                    />
                    <span
                      className="text-[10px] font-medium tracking-wide"
                      style={{ color: ACCENT_SOFT }}
                    >
                      {BRAND_ROLE}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ============ RIGHT: Navigation ============ */}
            <div className="relative p-5 lg:p-6">
              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <span
                  className="text-[12px] font-medium"
                  style={{ color: MUTED }}
                >
                  Menu
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Main pages */}
                <div>
                  <h4
                    className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: ACCENT_DK }}
                  >
                    Main
                  </h4>
                  <div className="flex flex-col gap-1">
                    {DEFAULT_NAV_LINKS.map((link, index) => (
                      <DesktopNavLink
                        key={index}
                        link={link}
                        onClick={handleLinkClick}
                      />
                    ))}
                  </div>
                </div>

                {/* Explore pages */}
                <div>
                  <h4
                    className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: ACCENT_DK }}
                  >
                    Explore
                  </h4>
                  <div className="flex flex-col gap-1">
                    {CMS_LINKS.map((link, index) => (
                      <DesktopNavLink
                        key={index}
                        link={link}
                        onClick={handleLinkClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ Bottom Section ============ */}
          <div
            className="relative flex items-center justify-between gap-3 p-4"
            style={{
              borderTop: `1px solid ${LINE}`,
              backgroundColor: CARD,
            }}
          >
            {/* Email */}
            <a
              href={`mailto:${BRAND_EMAIL}`}
              className="group flex items-center gap-2 transition-colors hover:text-[#0A1A2F]"
              style={{ color: MUTED }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: ACCENT_SOFT,
                  border: `1px solid ${LINE}`,
                }}
              >
                <Mail size={14} style={{ color: ACCENT_DK }} />
              </span>
              <span className="text-[12px] font-medium group-hover:underline sm:text-[13px]">
                {BRAND_EMAIL}
              </span>
            </a>

            <div className="flex items-center gap-2">
              {/* Admin / Dashboard */}
              <Link
                href={adminLinkConfig.href}
                onClick={handleLinkClick}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[#DBEAFE]"
                style={{
                  backgroundColor: ACCENT_SOFT,
                  border: `1px solid ${LINE}`,
                  color: ACCENT_DK,
                }}
              >
                <AdminIcon size={15} />
                <span>{adminLinkConfig.label}</span>
              </Link>

              {/* All Properties */}
              <Link
                href="/properties"
                onClick={handleLinkClick}
                className="rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors hover:bg-[#1E3A8A]"
                style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
              >
                All Properties
              </Link>

              {/* Close — fixed: white bg + LINE border + INK X icon,
                  hover -> ACCENT_SOFT bg + ACCENT_DK icon (visible on
                  white CARD section, consistent with blue scheme).
                  Uses Tailwind classes only so hover reliably overrides. */}
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE3EE] bg-white text-[#0A1A2F] transition-colors hover:border-[#1D4ED8]/40 hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MOBILE SIDEBAR ============ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-998 backdrop-blur-[2px] md:hidden"
              style={{ backgroundColor: `${INK}CC` }}
              onClick={handleClose}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 top-0 z-999 flex w-[88%] max-w-sm flex-col shadow-2xl md:hidden"
              style={{
                backgroundColor: PAPER,
                borderLeft: `1px solid ${LINE}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                onClick={handleClose}
                className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
                style={{
                  backgroundColor: INK,
                  color: "#FFFFFF",
                }}
                aria-label="Close menu"
              >
                <X size={18} />
              </motion.button>

              {/* ===== Top: brand strip + hero image ===== */}
              <div
                className="relative shrink-0 px-4 pt-4 pb-3"
                style={{ backgroundColor: INK }}
              >
                {/* Wordmark */}
                <div className="mb-3 flex items-center justify-between">
                  <Wordmark onClick={handleLinkClick} />
                </div>

                {/* Hero image card */}
                <div
                  className="relative h-32 w-full overflow-hidden rounded-xl"
                  style={{ border: `1px solid ${LINE}` }}
                >
                  <Image
                    src="/banner/banner2.jpg"
                    alt={BRAND_NAME}
                    fill
                    className="object-cover"
                    sizes="360px"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 30%, ${INK}E6 100%)`,
                    }}
                  />
                  {/* Name plate */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: "#FFFFFF" }}
                    >
                      {BRAND_NAME}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="h-px w-5"
                        style={{ backgroundColor: ACCENT_LT }}
                      />
                      <span
                        className="text-[10px] font-medium tracking-wide"
                        style={{ color: ACCENT_SOFT }}
                      >
                        {BRAND_ROLE}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Navigation ===== */}
              <div className="relative flex-1 overflow-y-auto px-4 py-4">
                {/* Main */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <h3
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: ACCENT_DK }}
                    >
                      Main pages
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {DEFAULT_NAV_LINKS.map((link, index) => (
                      <MobileNavLink
                        key={index}
                        link={link}
                        onClick={handleLinkClick}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                <div className="my-3 h-px" style={{ backgroundColor: LINE }} />

                {/* Explore */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <h3
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: ACCENT_DK }}
                    >
                      Explore
                    </h3>
                  </div>
                  <div className="flex flex-col gap-1">
                    {CMS_LINKS.map((link, index) => (
                      <MobileNavLink
                        key={index}
                        link={link}
                        onClick={handleLinkClick}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== Bottom Section ===== */}
              <div
                className="relative shrink-0 px-4 py-4"
                style={{
                  borderTop: `1px solid ${LINE}`,
                  backgroundColor: CARD,
                }}
              >
                {/* Email */}
                <a
                  href={`mailto:${BRAND_EMAIL}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mb-3 flex items-center justify-center gap-1.5 transition-colors hover:text-[#0A1A2F]"
                  style={{ color: MUTED }}
                >
                  <Mail size={12} style={{ color: ACCENT }} />
                  <span className="text-[11px] font-medium">{BRAND_EMAIL}</span>
                </a>

                <div className="flex flex-col gap-2">
                  {/* Admin / Dashboard */}
                  <Link
                    href={adminLinkConfig.href}
                    onClick={handleLinkClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-[#DBEAFE]"
                    style={{
                      backgroundColor: ACCENT_SOFT,
                      border: `1px solid ${LINE}`,
                      color: ACCENT_DK,
                    }}
                  >
                    <AdminIcon size={16} />
                    <span>
                      {isLoggedIn ? "Go to Dashboard" : "Admin Login"}
                    </span>
                  </Link>

                  {/* All Properties */}
                  <Link
                    href="/properties"
                    onClick={handleLinkClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors hover:bg-[#1E3A8A]"
                    style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                  >
                    <FileText size={16} />
                    <span>All Properties</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}