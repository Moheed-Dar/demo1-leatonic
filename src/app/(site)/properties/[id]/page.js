"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin,
  Bed,
  Bath,
  ArrowLeft,
  Phone,
  Mail,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Home,
  CalendarDays,
  Eye,
  Check,
  CheckCircle2,
  Layers,
  ZoomIn,
  Ruler,
  Tag,
  ShieldCheck,
  Grid3x3,
  Image as ImageIcon,
  Crown,
  Heart,
} from "lucide-react";
import { getPropertyById } from "@/lib/api";
import LeadForm from "@/components/forms/LeadForm";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// BLUE SCHEME — matches Navbar / Hero / About / Properties page
// ==========================================
const INK = "#0A1A2F";
const PAPER = "#F3F6FB";
const ACCENT = "#1D4ED8";
const ACCENT_DK = "#1E3A8A";
const ACCENT_SOFT = "#DBEAFE";
const ACCENT_LT = "#93C5FD";
const LINE = "#DCE3EE";
const MUTED = "#56697E";
const CARD = "#FFFFFF";

// Background image — parallax
const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

// ============================================
// HTML DECODE HELPER
// ============================================
const decodeHtml = (html) => {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

// ============================================
// STATUS BADGE
// ============================================
const getStatusBadge = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "sold":
      return "bg-red-50 text-red-700 border-red-200";
    case "rented":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "reserved":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "under construction":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "off plan":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";
    case "new":
      return "bg-teal-50 text-teal-700 border-teal-200";
    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};
const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};
const statContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const statItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ============================================
// QUICK STAT CARD (reused)
// ============================================
const QuickStat = ({ icon: Icon, label, value, unit }) => (
  <motion.div
    variants={statItem}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className="flex items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-colors hover:border-[#1D4ED8]/40"
    style={{
      backgroundColor: CARD,
      border: `1px solid ${LINE}`,
      boxShadow: "0 8px 20px -12px rgba(10,26,47,0.10)",
    }}
  >
    <div
      className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
    >
      <Icon size={16} style={{ color: ACCENT_DK }} />
    </div>
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-[0.18em] font-semibold" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="text-lg sm:text-xl font-semibold leading-tight" style={{ color: INK }}>
        {value}
        {unit && (
          <span className="text-[10px] font-normal ml-0.5" style={{ color: MUTED }}>
            {unit}
          </span>
        )}
      </p>
    </div>
  </motion.div>
);

// ============================================
// SECTION CARD (reused — reveals on scroll)
// ============================================
const SectionCard = ({ children, delay = 0 }) => (
  <motion.div
    variants={reveal}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    transition={{ delay }}
    className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
    style={{
      backgroundColor: CARD,
      border: `1px solid ${LINE}`,
      boxShadow: "0 8px 20px -12px rgba(10,26,47,0.10)",
    }}
  >
    {children}
  </motion.div>
);

// ============================================
// SECTION HEADING (reused)
// ============================================
const SectionHeading = ({ title }) => (
  <>
    <h3 className="text-lg sm:text-xl mb-1 font-semibold" style={{ color: INK }}>
      {title}
    </h3>
    <div className="w-12 h-1 rounded-full mb-4 sm:mb-5" style={{ backgroundColor: ACCENT }} />
  </>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function PropertyDetailPage() {
  const { id } = useParams();
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // ============================================
  // FETCH
  // ============================================
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await getPropertyById(id);
        setProperty(res?.data || res);
      } catch (err) {
        setError("Property not found or removed");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  // ============================================
  // GSAP BACKGROUND PARALLAX
  // ============================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // ============================================
  // SAFE IMAGES
  // ============================================
  const rawImages = property?.images || [];
  const images = rawImages.map((img) => getSafeImage(img)).filter(Boolean);
  const mainImage = getSafeImage(property?.thumbnail) || images[0] || PLACEHOLDER_IMG;

  // ============================================
  // IMAGE NAVIGATION
  // ============================================
  const nextImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length <= 1) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "Escape") setShowLightbox(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLightbox, images.length]);

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: PAPER }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <motion.div
              className="w-14 h-14 border-2 rounded-full"
              style={{ borderColor: `${ACCENT}20`, borderTopColor: ACCENT }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Building2 size={16} style={{ color: ACCENT_DK }} />
            </motion.div>
          </div>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: MUTED }}>
            Loading property...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error || !property) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: PAPER }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
        >
          <X size={32} style={{ color: ACCENT_DK }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-semibold"
          style={{ color: INK }}
        >
          Property Not Found
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-sm text-center max-w-sm"
          style={{ color: MUTED }}
        >
          {error}
        </motion.p>
        <Link
          href="/properties"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-transform hover:scale-105"
          style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}`, color: ACCENT_DK }}
        >
          <ArrowLeft size={16} /> Browse Properties
        </Link>
      </div>
    );
  }

  const currentDisplayImage = images.length > 0 ? images[activeImage] || mainImage : mainImage;
  const hasSingleImage = images.length <= 1;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      ref={sectionRef}
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ============ BACKGROUND IMAGE + PARALLAX + TOP GRADIENT ============ */}
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 will-change-transform pointer-events-none"
        style={{ height: "130%", top: "-15%" }}
      >
        <Image src={BG_IMAGE} alt="" fill unoptimized className="object-cover" sizes="100vw" />

        {/* TOP GRADIENT — dark navy → fades into PAPER */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}CC 15%, ${INK}80 30%, ${INK}33 45%, transparent 60%)`,
          }}
        />

        {/* BOTTOM FADE into PAPER */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${PAPER}F2 0%, ${PAPER}CC 20%, transparent 50%)`,
          }}
        />

        {/* Accent radial — top right */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 90% 8%, rgba(29,78,216,0.30) 0%, rgba(29,78,216,0.08) 25%, transparent 50%)`,
          }}
        />

        {/* Subtle accent radial — mid left */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 10% 35%, rgba(147,197,253,0.10) 0%, transparent 35%)`,
          }}
        />

        {/* Quiet dot pattern — white dots on dark top */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ===== HERO GALLERY ===== */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 pt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb + Badges */}
          <motion.div
            variants={heroItem}
            className="flex flex-wrap items-center justify-between gap-3 mb-6"
          >
            <div className="flex items-center gap-2 text-sm min-w-0">
              <Link
                href="/properties"
                className="transition-colors shrink-0 hover:text-[#93C5FD]"
                style={{ color: "rgba(219,234,254,0.75)" }}
              >
                Properties
              </Link>
              <ChevronRight size={14} style={{ color: ACCENT_LT }} className="shrink-0" />
              <span className="font-medium truncate" style={{ color: "#FFFFFF" }}>
                {property.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {property.isFeatured && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full"
                  style={{ backgroundColor: ACCENT, color: "#FFFFFF", border: `1px solid ${ACCENT_DK}` }}
                >
                  <Crown size={10} style={{ fill: "#FFFFFF", color: "#FFFFFF" }} />
                  Featured
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full border ${getStatusBadge(property.status)}`}
              >
                <ShieldCheck size={10} />
                {property.status}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-full"
                style={{ backgroundColor: CARD, color: INK, border: `1px solid ${LINE}` }}
              >
                <Tag size={10} style={{ color: ACCENT_DK }} />
                {property.priceType}
              </span>
            </div>
          </motion.div>

          {/* Title & Price */}
          <motion.div variants={heroItem} className="mb-6 sm:mb-7">
            <div className="flex items-center gap-3 mb-3">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT_LT }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                className="text-[11px] font-medium inline-flex items-center gap-2"
                style={{ color: ACCENT_SOFT }}
              >
                <Building2 size={13} style={{ color: ACCENT_LT }} />
                Exclusive listing
              </span>
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-5xl tracking-tight leading-[1.15] mb-4 font-semibold"
              style={{ color: "#FFFFFF" }}
            >
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
              <div>
                <p
                  className="text-2xl sm:text-4xl lg:text-[2.75rem] leading-none"
                  style={{
                    background: `linear-gradient(to right, ${ACCENT_LT}, ${ACCENT})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
                </p>
                {property.priceType === "rent" && (
                  <p className="text-xs mt-1" style={{ color: "rgba(219,234,254,0.6)" }}>per month</p>
                )}
              </div>
              <div className="h-10 w-px hidden sm:block" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={15} style={{ color: ACCENT_LT }} className="shrink-0" />
                <span className="text-sm font-medium truncate" style={{ color: "rgba(219,234,254,0.85)" }}>
                  {property.location || property.city}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ===== IMAGE GALLERY ===== */}
          <motion.div variants={heroItem}>
            {hasSingleImage ? (
              <div className="max-w-4xl mx-auto">
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div
                    className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-zoom-in"
                    style={{
                      backgroundColor: LINE,
                      boxShadow: `0 25px 50px -12px rgba(10,26,47,0.30), inset 0 0 0 1px ${LINE}`,
                    }}
                    onClick={() => setShowLightbox(true)}
                  >
                    <Image
                      src={currentDisplayImage}
                      alt={property.title || "Property"}
                      fill
                      loading="eager"
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
                      <ImageIcon size={11} className="text-white" />
                      <span className="text-white text-[11px] sm:text-xs font-semibold">1 Photo</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-3">
                {/* Main Image */}
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-8 relative group"
                >
                  <div
                    className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-zoom-in"
                    style={{
                      backgroundColor: LINE,
                      boxShadow: `0 25px 50px -12px rgba(10,26,47,0.30), inset 0 0 0 1px ${ACCENT}40`,
                    }}
                    onClick={() => setShowLightbox(true)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={currentDisplayImage}
                          alt={property.title || "Property"}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ring-1 ring-white/20">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2.5 py-1.5 sm:px-3 bg-black/70 rounded-full flex items-center gap-1.5 ring-1 ring-white/10">
                      <Grid3x3 size={11} style={{ color: ACCENT_LT }} />
                      <span className="text-white text-[11px] sm:text-xs font-semibold">
                        {activeImage + 1} / {images.length}
                      </span>
                    </div>
                    {/* Nav arrows */}
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:left-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/85 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:right-3 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/85 hover:scale-105 transition-all shadow-lg ring-1 ring-white/20"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>

                {/* Side Thumbnails */}
                <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-1.5 sm:gap-2">
                  {images.slice(0, 4).map((img, index) => {
                    const safeImg = getSafeImage(img);
                    if (!safeImg) return null;
                    const isSeeMore = images.length > 4 && index === 3;
                    const isActive = activeImage === index;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          if (isSeeMore) { setActiveImage(3); setShowLightbox(true); }
                          else setActiveImage(index);
                        }}
                        className={`relative rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 aspect-square ${
                          isActive && !isSeeMore ? "ring-2 shadow-lg" : "opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          boxShadow: `inset 0 0 0 1px ${LINE}`,
                          ...(isActive && !isSeeMore
                            ? { boxShadow: `0 4px 12px ${ACCENT}40, inset 0 0 0 2px ${ACCENT}` }
                            : {}),
                        }}
                      >
                        <Image
                          src={safeImg}
                          alt={`Property image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                        />
                        <AnimatePresence>
                          {isActive && !isSeeMore && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg z-10 border border-white"
                              style={{ backgroundColor: ACCENT, boxShadow: `0 2px 8px ${ACCENT}80` }}
                            >
                              <Check size={10} strokeWidth={3} className="text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {isSeeMore && (
                          <div className="absolute inset-0 bg-black/75 flex items-center justify-center flex-col gap-0.5 sm:gap-1 z-10">
                            <Grid3x3 size={14} className="text-white" />
                            <span className="text-white text-[10px] sm:text-xs font-bold">
                              +{images.length - 3} More
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Meta */}
            {property.propertyCode && (
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2 text-[11px] sm:text-xs"
                style={{ color: MUTED }}
              >
                <span
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full font-semibold"
                  style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_DK, border: `1px solid ${LINE}` }}
                >
                  <Building2 size={11} />
                  {property.propertyCode}
                </span>
                {property.viewsCount > 0 && (
                  <span className="flex items-center gap-1" style={{ color: MUTED }}>
                    <Eye size={11} /> {property.viewsCount} views
                  </span>
                )}
                {property.createdAt && (
                  <span className="flex items-center gap-1" style={{ color: MUTED }}>
                    <CalendarDays size={11} />
                    {new Date(property.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              variants={statContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
            >
              {property.bedrooms > 0 && <QuickStat icon={Bed} label="Beds" value={property.bedrooms} />}
              {property.bathrooms > 0 && <QuickStat icon={Bath} label="Baths" value={property.bathrooms} />}
              {(property.areaSize || property.area) > 0 && (
                <QuickStat icon={Ruler} label="Area" value={property.areaSize || property.area} unit={property.areaUnit || "sqft"} />
              )}
              {property.propertyType && (
                <QuickStat icon={Home} label="Type" value={property.propertyType} />
              )}
            </motion.div>

            {/* Description */}
            {property.description && (
              <SectionCard>
                <SectionHeading title="Description" />
                <div
                  className="text-sm sm:text-[15px] leading-[1.9] max-h-72 sm:max-h-80 overflow-y-auto pr-2 overflow-hidden wrap-break-word
                             [&_p]:my-2 [&_div]:my-2
                             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
                             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
                             [&_li]:ml-2 [&_li]:my-1
                             [&_h1]:text-base [&_h1]:font-bold [&_h1]:my-2 [&_h1]:text-[#0A1A2F]
                             [&_h2]:text-sm [&_h2]:font-bold [&_h2]:my-2 [&_h2]:text-[#0A1A2F]
                             [&_blockquote]:border-l-4 [&_blockquote]:border-[#1D4ED8] [&_blockquote]:pl-4 [&_blockquote]:italic"
                  style={{ color: MUTED }}
                  dangerouslySetInnerHTML={{ __html: decodeHtml(property.description) || "No description available." }}
                />
              </SectionCard>
            )}

            {/* Features */}
            {(property.features?.length > 0 || property.amenities?.length > 0) && (
              <SectionCard delay={0.05}>
                <SectionHeading title="Features & Amenities" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {[...(property.features || []), ...(property.amenities || [])].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                      className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors hover:bg-[#DBEAFE]/60"
                      style={{ color: MUTED, backgroundColor: `${INK}05`, border: `1px solid ${LINE}` }}
                    >
                      <div
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: ACCENT_SOFT }}
                      >
                        <CheckCircle2 size={10} style={{ color: ACCENT_DK }} />
                      </div>
                      <span className="capitalize truncate">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Address */}
            {property.address && (
              <SectionCard delay={0.05}>
                <SectionHeading title="Address" />
                <div
                  className="flex items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-3 sm:p-4"
                  style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: CARD }}
                  >
                    <MapPin size={13} style={{ color: ACCENT_DK }} />
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed wrap-break-word" style={{ color: MUTED }}>
                    {property.address}
                  </p>
                </div>
              </SectionCard>
            )}
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
              {/* Price + CTA Card */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 16px 40px -25px rgba(10,26,47,0.20)",
                }}
              >
                {/* Price Header */}
                <div
                  className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5"
                  style={{
                    background: `linear-gradient(to right, ${ACCENT_SOFT}, ${ACCENT}08, transparent)`,
                    borderBottom: `1px solid ${LINE}`,
                  }}
                >
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] font-semibold mb-1" style={{ color: ACCENT_DK }}>
                    Asking Price
                  </p>
                  <p
                    className="text-xl sm:text-2xl lg:text-3xl leading-none"
                    style={{
                      background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_DK})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {property.currency === "PKR" ? "Rs" : "$"} {Number(property.price)?.toLocaleString()}
                  </p>
                  <p className="text-[11px] sm:text-xs mt-1.5 capitalize tracking-wide" style={{ color: MUTED }}>
                    {property.priceType} &bull; {property.propertyType}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLeadForm(true)}
                    className="w-full flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 text-sm cursor-pointer font-semibold rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DK})`,
                      color: "#FFFFFF",
                      boxShadow: `0 8px 20px ${ACCENT}30`,
                    }}
                  >
                    <Heart size={16} /> I&apos;m Interested
                  </motion.button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${property.contact?.phone || ""}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors hover:bg-[#DBEAFE] hover:text-[#1E3A8A] hover:border-[#1D4ED8]/40"
                      style={{ border: `1px solid ${LINE}`, color: MUTED, backgroundColor: CARD }}
                    >
                      <Phone size={12} /> Call
                    </a>
                    <a
                      href={`mailto:${property.contact?.email || ""}`}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition-colors hover:bg-[#DBEAFE] hover:text-[#1E3A8A] hover:border-[#1D4ED8]/40"
                      style={{ border: `1px solid ${LINE}`, color: MUTED, backgroundColor: CARD }}
                    >
                      <Mail size={12} /> Email
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Agent */}
              {property.addedBy && (
                <motion.div
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.05 }}
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                    boxShadow: "0 8px 20px -12px rgba(10,26,47,0.10)",
                  }}
                >
                  <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] mb-2.5 sm:mb-3" style={{ color: MUTED }}>
                    Listed By
                  </h4>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: ACCENT_SOFT,
                        border: `2px solid ${LINE}`,
                      }}
                    >
                      {property.addedBy?.avatar ? (
                        <img src={property.addedBy.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={18} style={{ color: ACCENT_DK }} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: INK }}>
                        {property.addedBy?.name || "Agent"}
                      </p>
                      <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                        Property Agent
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Details */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${LINE}`,
                  boxShadow: "0 8px 20px -12px rgba(10,26,47,0.10)",
                }}
              >
                <h4 className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] mb-2.5 sm:mb-3" style={{ color: MUTED }}>
                  Property Details
                </h4>
                <div className="space-y-0">
                  {property.floors && (
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: MUTED }}>
                        <Layers size={11} /> Floors
                      </span>
                      <span className="font-semibold" style={{ color: INK }}>{property.floors}</span>
                    </div>
                  )}
                  {property.kitchens && (
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <span style={{ color: MUTED }}>Kitchens</span>
                      <span className="font-semibold" style={{ color: INK }}>{property.kitchens}</span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5" style={{ borderBottom: `1px solid ${LINE}` }}>
                      <span style={{ color: MUTED }}>Year Built</span>
                      <span className="font-semibold" style={{ color: INK }}>{property.yearBuilt}</span>
                    </div>
                  )}
                  {property.leadsCount > 0 && (
                    <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
                      <span style={{ color: MUTED }}>Interested Buyers</span>
                      <span className="font-semibold" style={{ color: ACCENT_DK }}>{property.leadsCount}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Verified */}
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.15 }}
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4"
                style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
                  >
                    <ShieldCheck size={13} style={{ color: ACCENT_DK }} />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold" style={{ color: ACCENT_DK }}>
                      Verified Listing
                    </p>
                    <p className="text-[10px] sm:text-[11px]" style={{ color: MUTED }}>
                      Verified by our team
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LEAD FORM ===== */}
      <LeadForm
        propertyId={property._id}
        propertyTitle={property.title}
        propertyCode={property.propertyCode}
        propertyPrice={property.price}
        propertyCurrency={property.currency}
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        trigger={null}
        onSuccess={(data) => console.log("Lead created:", data)}
      />

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setShowLightbox(false)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10 ring-1 ring-white/20"
            >
              <X size={18} />
            </motion.button>
            <div
              className="relative w-full h-full flex items-center justify-center px-3 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative max-w-5xl max-h-[75vh] sm:max-h-[80vh] w-full aspect-video"
                >
                  <Image
                    src={currentDisplayImage}
                    alt={property.title || "Property"}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    unoptimized
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lightbox Nav Arrows */}
              {!hasSingleImage && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors ring-1 ring-white/20"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}