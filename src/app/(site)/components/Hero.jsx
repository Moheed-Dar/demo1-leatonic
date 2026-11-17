"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// BLUE SCHEME — matches the rest of the site
// ============================================
const INK = "#0A1A2F";
const PAPER = "#F3F6FB";
const ACCENT = "#1D4ED8";
const ACCENT_DK = "#1E3A8A";
const ACCENT_SOFT = "#DBEAFE";
const LINE = "#DCE3EE";
const MUTED = "#56697E";
const CARD = "#FFFFFF";

// ============================================
// RICH HOVER LABEL
// ============================================
const TemplateLabel = ({ children, title, description, position = "top" }) => {
  let posClass = "";
  if (position === "top") {
    posClass =
      "top-0 left-1/2 -translate-x-1/2 -translate-y-2 group-hover/tl:-translate-y-full";
  } else if (position === "bottom") {
    posClass =
      "bottom-0 left-1/2 -translate-x-1/2 translate-y-2 group-hover/tl:translate-y-full";
  } else if (position === "left") {
    posClass =
      "top-1/2 right-full -translate-y-1/2 translate-x-2 group-hover/tl:-translate-y-1/2 group-hover/tl:translate-x-0 mr-3";
  } else if (position === "right") {
    posClass =
      "top-1/2 left-full -translate-y-1/2 -translate-x-2 group-hover/tl:-translate-y-1/2 group-hover/tl:translate-x-0 ml-3";
  }

  return (
    <div className="group/tl relative">
      {children}
      <div
        className={`pointer-events-none absolute z-50 ${posClass} opacity-0 transition-all duration-300 group-hover/tl:opacity-100`}
      >
        <div className="w-60 rounded-xl bg-black/95 p-3 shadow-2xl backdrop-blur-md">
          <div
            className="text-[10px] font-semibold tracking-wide"
            style={{ color: "#93C5FD" }}
          >
            {title}
          </div>
          <div className="mt-1 text-[10px] leading-snug text-white/75">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// ============================================
// HERO BACKGROUND IMAGES — full-bleed cinematic
// Real-estate exteriors / interiors, wide aspect
// ============================================
const heroImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2400&auto=format&fit=crop",
];

// ============================================
// SPLIT-TEXT HEADLINE
// Splits a string into word spans for staggered reveal
// ============================================
const HEADLINE_LINE_1 = "A home worth";
const HEADLINE_LINE_2 = "coming home to";

// ============================================
// STATUS HELPERS
// ============================================
const getStatusDotColor = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-500";
    case "sold":
      return "bg-rose-400";
    case "rented":
      return "bg-amber-400";
    case "pending":
      return "bg-yellow-400";
    case "new":
      return "bg-sky-500";
    default:
      return "bg-emerald-500";
  }
};

const getStatusText = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "Available";
    case "sold":
      return "Sold";
    case "rented":
      return "Rented";
    case "new":
      return "New";
    default:
      return status || "Available";
  }
};

// ============================================
// COUNT-UP HOOK — animates a number when in view
// ============================================
const useCountUp = (target, inView, duration = 1600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let start;
    const targetNum = parseFloat(target);

    const tick = (t) => {
      if (start === undefined) start = t;
      const progress = Math.min((t - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(targetNum * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(targetNum);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return value;
};

// ============================================
// STATS — number + suffix parsed for count-up
// ============================================
const STATS = [
  { raw: "500", suffix: "+", label: "Active listings" },
  { raw: "12", suffix: "+", label: "Years in the market" },
  { raw: "4.9", suffix: "", label: "Average client rating", decimals: 1 },
];

// ============================================
// MAGNETIC BUTTON — pulls toward cursor
// ============================================
const MagneticButton = ({ children, ...props }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.4);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

export default function HeroSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const totalImages = heroImages.length;

  // Mouse parallax for floating cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const cardY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const card2X = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const card2Y = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Stats in-view trigger
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  // ---------- FETCH PROPERTIES ----------
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        const res = await axios.get(
          "/api/properties/get-all?page=1&limit=2&sortBy=isFeatured&sortOrder=desc"
        );
        const data = res.data?.data || [];
        setProperties(data.slice(0, 2));
      } catch {
        setProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // ---------- IMAGE ROTATION ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalImages]);

  // ---------- GSAP SCROLL PARALLAX on background ----------
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background moves slower than scroll → parallax depth
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

      // Content drifts up slightly and fades as you scroll past
      gsap.to(contentRef.current, {
        yPercent: -8,
        opacity: 0.4,
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

  // ---------- MOUSE PARALLAX ----------
  const handleMouseMove = useCallback((e) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(relX * 24);
    mouseY.set(relY * 24);
  }, [mouseX, mouseY]);

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ---------- HEADLINE WORD SPLIT ----------
  const words1 = HEADLINE_LINE_1.split(" ");
  const words2 = HEADLINE_LINE_2.split(" ");

  const headlineContainer = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK, color: PAPER }}
    >
      {/* ============ BACKGROUND IMAGE LAYER ============ */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ height: "120%", top: "-10%" }}
      >
        {/* Ken Burns slider — each image zooms + pans while visible */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.0 }}
            animate={{
              opacity: 1,
              scale: 1.12,
              x: "2%",
              y: "-1%",
            }}
            exit={{ opacity: 0, scale: 1.0, transition: { duration: 1.2 } }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 6, ease: "linear" },
              x: { duration: 6, ease: "linear" },
              y: { duration: 6, ease: "linear" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentImageIndex]}
              alt={`Property ${currentImageIndex + 1}`}
              fill
              unoptimized
              priority={currentImageIndex === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic gradients — single neutral tone shift, no hue gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(10,26,47,0.55) 0%, rgba(10,26,47,0.35) 40%, rgba(10,26,47,0.85) 100%)`,
          }}
        />
        {/* Left-side darkening for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, rgba(10,26,47,0.85) 0%, rgba(10,26,47,0.4) 45%, transparent 70%)`,
          }}
        />
      </div>

      {/* ============ CONTENT ============ */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-32 pb-16 md:pt-40 lg:pt-48 lg:pb-24"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* ===== LEFT : TEXT ===== */}
          <div className="flex flex-col">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <TemplateLabel
                title="Eyebrow"
                description="Quiet context line above the headline. One accent dot, sentence case, fading in on load."
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ACCENT_SOFT }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span
                    className="text-[13px] font-medium tracking-wide"
                    style={{ color: "#DBEAFE" }}
                  >
                    Curated property listings
                  </span>
                </div>
              </TemplateLabel>
            </motion.div>

            {/* Headline — split-word reveal */}
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="visible"
              className="mt-5 text-[40px] font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-[60px]"
            >
              {/* Line 1 */}
              <span className="block" style={{ color: "#FFFFFF" }}>
                {words1.map((word, i) => (
                  <span
                    key={`l1-${i}`}
                    className="inline-block overflow-hidden align-top mr-[0.22em]"
                  >
                    <motion.span variants={wordVariant} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              {/* Line 2 — accent */}
              <span className="block" style={{ color: "#93C5FD" }}>
                {words2.map((word, i) => (
                  <span
                    key={`l2-${i}`}
                    className="inline-block overflow-hidden align-top mr-[0.22em]"
                  >
                    <motion.span variants={wordVariant} className="inline-block">
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            </motion.h1>

            {/* Supporting copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
            >
              <TemplateLabel
                title="Supporting copy"
                description="One or two plain sentences under the headline. Left aligned, weight 400. Fades in after the headline resolves."
              >
                <p
                  className="mt-6 max-w-md text-[16px] font-normal leading-[1.65]"
                  style={{ color: "rgba(243,246,251,0.78)" }}
                >
                  Handpicked homes in neighborhoods worth knowing. Tour any
                  listing this week — a walkthrough, no pressure.
                </p>
              </TemplateLabel>
            </motion.div>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: "easeOut" }}
            >
              <div className="mt-8 flex flex-wrap items-center gap-5 sm:gap-7">
                <TemplateLabel
                  title="Primary CTA"
                  description="Magnetic primary call-to-action. Solid ink fill, accent arrow chip, pulls subtly toward the cursor on hover."
                >
                  <MagneticButton>
                    <Link
                      href="/properties"
                      className="group inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-2"
                      style={{ backgroundColor: "#FFFFFF", color: INK }}
                    >
                      <span className="text-[14px] font-semibold">
                        Browse listings
                      </span>
                      <span
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                      >
                        <ArrowRight size={16} strokeWidth={2} />
                      </span>
                    </Link>
                  </MagneticButton>
                </TemplateLabel>

                <TemplateLabel
                  title="Secondary CTA"
                  description="Lower-commitment alternative. Quiet text link with an underline that shifts color on hover."
                >
                  <Link
                    href="https://calendar.app.google/zf9eeGFTRRb44AKU6"
                    className="group inline-flex items-center gap-1.5 border-b pb-1 text-[13px] font-medium transition-colors"
                    style={{
                      color: "#DBEAFE",
                      borderColor: "rgba(219,234,254,0.4)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#FFFFFF";
                      e.currentTarget.style.borderColor = "#FFFFFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "#DBEAFE";
                      e.currentTarget.style.borderColor = "rgba(219,234,254,0.4)";
                    }}
                  >
                    Book a walkthrough
                    <ArrowRight
                      size={13}
                      strokeWidth={2}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </TemplateLabel>
              </div>
            </motion.div>
          </div>

          {/* ===== RIGHT : SLIDER INDEX + FEATURED CARDS ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative hidden lg:block"
          >
            {/* Slider index — top right, vertical */}
            <TemplateLabel
              title="Hero slider"
              description="Full-bleed background image rotates every 5s with a slow Ken Burns zoom-pan. Vertical index counter on the right marks the active slide."
              position="left"
            >
              <div className="absolute -top-2 right-0 flex flex-col gap-2.5">
                {heroImages.map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="text-[11px] font-medium tabular-nums"
                      style={{
                        color: i === currentImageIndex ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="h-px transition-all duration-500"
                      style={{
                        width: i === currentImageIndex ? "32px" : "16px",
                        backgroundColor:
                          i === currentImageIndex ? "#93C5FD" : "rgba(255,255,255,0.25)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </TemplateLabel>

            {/* Floating featured property card — real API data, mouse-parallax */}
            {!propertiesLoading && properties[0] && (
              <motion.div
                style={{ x: cardX, y: cardY }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
                className="absolute right-6 top-20 z-10 w-60"
              >
                <TemplateLabel
                  title="Featured property"
                  description="A real listing from the properties API, with mouse-parallax drift. Save (heart) toggles local state."
                  position="bottom"
                >
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="overflow-hidden rounded-2xl"
                    style={{
                      backgroundColor: CARD,
                      border: `1px solid ${LINE}`,
                      boxShadow: `0 30px 60px -20px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <Link
                      href={`/properties/${properties[0]._id}`}
                      className="block"
                    >
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={
                            getSafeImg(properties[0].thumbnail) ||
                            getSafeImg(properties[0].images?.[0]) ||
                            PLACEHOLDER
                          }
                          alt={properties[0].title || "Property"}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="240px"
                        />
                        {/* Save toggle */}
                        <button
                          type="button"
                          onClick={(e) => toggleLike(properties[0]._id, e)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-colors"
                          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                          aria-label="Save property"
                        >
                          <Heart
                            size={13}
                            className={
                              likedIds.has(properties[0]._id)
                                ? "fill-current"
                                : ""
                            }
                            style={{
                              color: likedIds.has(properties[0]._id)
                                ? ACCENT
                                : INK,
                            }}
                          />
                        </button>
                        {/* Status pill */}
                        <div className="absolute bottom-2 left-2">
                          <span
                            className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[9px] font-medium backdrop-blur-md"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.9)",
                              color: INK,
                            }}
                          >
                            <span
                              className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotColor(
                                properties[0].status
                              )}`}
                            />
                            {getStatusText(properties[0].status)}
                          </span>
                        </div>
                      </div>
                      <div className="p-3.5">
                        <span
                          className="block truncate text-[13px] font-semibold"
                          style={{ color: INK }}
                        >
                          {properties[0].title || "Untitled property"}
                        </span>
                        <span
                          className="mt-1 flex items-center gap-1 text-[11px]"
                          style={{ color: MUTED }}
                        >
                          <MapPin size={11} style={{ color: ACCENT }} />
                          <span className="truncate">
                            {properties[0].location ||
                              properties[0].city ||
                              "Location"}
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </TemplateLabel>
              </motion.div>
            )}

            {/* Second floating card — price snapshot, deeper parallax */}
            {!propertiesLoading && properties[1] && (
              <motion.div
                style={{ x: card2X, y: card2Y }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.4, ease: "easeOut" }}
                className="absolute -bottom-6 left-0 z-10 w-48"
              >
                <TemplateLabel
                  title="Featured property"
                  description="A second real listing with a deeper parallax factor, so the two cards drift at different rates as the cursor moves."
                  position="top"
                >
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="overflow-hidden rounded-xl"
                    style={{
                      backgroundColor: CARD,
                      border: `1px solid ${LINE}`,
                      boxShadow: `0 30px 60px -20px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <Link
                      href={`/properties/${properties[1]._id}`}
                      className="block"
                    >
                      <div className="relative h-24 w-full overflow-hidden">
                        <Image
                          src={
                            getSafeImg(properties[1].thumbnail) ||
                            getSafeImg(properties[1].images?.[0]) ||
                            PLACEHOLDER
                          }
                          alt={properties[1].title || "Property"}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                      <div className="p-3">
                        <span
                          className="block truncate text-[12px] font-semibold"
                          style={{ color: INK }}
                        >
                          {properties[1].title || "Untitled property"}
                        </span>
                        <span
                          className="mt-1 flex items-center gap-1 text-[10px]"
                          style={{ color: MUTED }}
                        >
                          <MapPin size={10} style={{ color: ACCENT }} />
                          <span className="truncate">
                            {properties[1].location ||
                              properties[1].city ||
                              "Location"}
                          </span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </TemplateLabel>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* ============ STATS STRIP — count-up on enter ============ */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-20 border-t pt-8 sm:mt-24"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <TemplateLabel
            title="Trust stats"
            description="Three credibility numbers as a full-width strip. Each count-ups from zero when the strip scrolls into view. Tabular figures keep digits aligned."
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0">
              {STATS.map((s, i) => (
                <StatItem key={i} stat={s} inView={statsInView} index={i} />
              ))}
            </div>
          </TemplateLabel>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-[10px] font-medium tracking-wide"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Scroll
          </span>
          <div className="flex h-8 w-5 items-start justify-center rounded-full p-1" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
            <motion.span
              className="h-1.5 w-1 rounded-full"
              style={{ backgroundColor: "#93C5FD" }}
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// STAT ITEM — count-up display
// ============================================
const StatItem = ({ stat, inView, index }) => {
  const current = useCountUp(parseFloat(stat.raw), inView, 1400 + index * 150);
  const decimals = stat.decimals || 0;
  const display = current.toFixed(decimals);

  return (
    <div
      className={`flex flex-col ${
        index > 0 ? "sm:border-l sm:pl-8" : ""
      } ${index < STATS.length - 1 ? "sm:pr-8" : ""}`}
      style={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      <span
        className="text-[34px] font-semibold leading-none tabular-nums sm:text-[40px]"
        style={{ color: "#FFFFFF" }}
      >
        {display}
        <span style={{ color: "#93C5FD" }}>{stat.suffix}</span>
      </span>
      <span
        className="mt-2.5 text-[12px] font-medium"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        {stat.label}
      </span>
    </div>
  );
};