"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// BLUE SCHEME — matches Hero / About
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
// BACKGROUND IMAGE — full-bleed parallax
// ============================================
const BG_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2400&auto=format&fit=crop";

// ============================================
// RICH HOVER LABEL — fixed, self-contained
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
            style={{ color: ACCENT_LT }}
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
// TESTIMONIALS
// ============================================
const testimonials = [
  {
    id: 1,
    name: "Erin",
    role: "Sold in Hillcrest",
    text: "As a military family with multiple moves behind us, we were nervous about helping my mother sell her house. Our agent was wonderful and went above and beyond. Compared to previous realtors we worked with, they truly stood out. I will recommend them every time someone is looking for a realtor.",
  },
  {
    id: 2,
    name: "Glenn",
    role: "Bought in Maplewood",
    text: "Friendly, helpful, and made the home buying process a charm! Couldn't have asked for a smoother experience from start to finish.",
  },
  {
    id: 3,
    name: "Laurie",
    role: "Sold & bought",
    text: "Worked patiently with us as we searched for, and found, a great home in neighborhoods with very few listings — and at a good price too. Then turned around and sold our existing home in a couple of days. Excellent knowledge of all things real estate.",
  },
  {
    id: 4,
    name: "Josh & Meghan",
    role: "First home",
    text: "When buying your first home, this is the realtor best suited for the job. Gets to know clients and picks homes that suit you best. Flexible with time for viewings, knowledgeable about the process, and genuinely cares. You'd be mistaken not to use them for your home buying needs!",
  },
  {
    id: 5,
    name: "Nicole",
    role: "Repeat client",
    text: "I've had the pleasure of working with this agent for a few years and am consistently impressed by their dedication to clients. They excel at providing a seamless experience for both sellers and buyers, ensuring every transaction is smooth and stress-free. Highly recommend!",
  },
  {
    id: 6,
    name: "Noah",
    role: "First home",
    text: "Helped me buy my first home and I'm so happy with everything! Patient despite me being picky and not having clear requirements. Made the whole looking and buying process painless and as comfortable as possible. Highly recommend to anyone navigating the real estate market.",
  },
  {
    id: 7,
    name: "Dave",
    role: "Bought in Riverside",
    text: "Simply the best. Super patient, knowledgeable, proactive, and always reachable for questions, showings, offers, and more. We are very picky and didn't know if we'd find the right place, but they hung in there for the journey with us. Thanks for everything!",
  },
  {
    id: 8,
    name: "Cathy",
    role: "Remote sale",
    text: "Went above and beyond. I was selling a property located five hours from my current location, which had its challenges. Helped me manage the logistics of selling remotely. Friendly, informative, knowledgeable, and compassionate throughout. Highly recommend their services!",
  },
  {
    id: 9,
    name: "Kathryn",
    role: "Bought in Bayview",
    text: "Wonderful from start to finish. Kept me well informed about the real estate market and then found me the place I wanted to be. Friendly, patient, and helped me decide what I wanted in my new home. I'll never move again! Kudos!",
  },
  {
    id: 10,
    name: "Daniel",
    role: "Bought in Old Town",
    text: "Amazing since day one. Treated me like I was their best client from the beginning. Good humor and patience make the process of finding a home much more enjoyable. Highly recommended!",
  },
  {
    id: 11,
    name: "Kirby",
    role: "Off-market buyer",
    text: "An amazing realtor with all the modern tools to support buyers in finding off-market homes and sellers in promoting their homes to a wide audience. Professional, tech-savvy, and results-driven.",
  },
  {
    id: 12,
    name: "Sandip",
    role: "Sold above asking",
    text: "There for you when you need guidance and support. Prompt and responsive on email and text, will call or meet in person if needed. Great listener with empathy and strong industry connections. Sold my house above asking with a bidding war. They care and it shows.",
  },
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({
    x: direction > 0 ? "-60%" : "60%",
    opacity: 0,
    scale: 0.96,
  }),
};

// ============================================
// SHARED TESTIMONIAL CARD — new editorial layout
// ============================================
const TestimonialCard = ({ t, index = 0, total = 1 }) => {
  // Stagger the star fill
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl p-6 sm:p-7 transition-all duration-300"
        style={{
          backgroundColor: CARD,
          border: `1px solid ${LINE}`,
          boxShadow: `0 8px 30px -16px rgba(10,26,47,0.10)`,
        }}
      >
        {/* Decorative quote glyph — accent, low opacity */}
        <Quote
          size={total === 1 ? 64 : 48}
          style={{ color: ACCENT_SOFT }}
          className="absolute right-4 top-4 opacity-60"
        />

        {/* Star rating — accent, staggered fill */}
        <div className="relative mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2 + i * 0.05, duration: 0.3 }}
            >
              <Star size={13} fill={ACCENT} strokeWidth={0} style={{ color: ACCENT }} />
            </motion.span>
          ))}
        </div>

        {/* Quote text */}
        <p
          className="relative z-10 flex-1 text-[14px] font-normal leading-[1.65] sm:text-[15px]"
          style={{
            color: MUTED,
            display: "-webkit-box",
            WebkitLineClamp: total === 1 ? 10 : 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {t.text}
        </p>

        {/* Hairline divider */}
        <div
          className="my-5 h-px w-full"
          style={{
            background: `linear-gradient(to right, ${LINE}, transparent)`,
          }}
        />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
            style={{
              backgroundColor: ACCENT_SOFT,
              color: ACCENT_DK,
              border: `1px solid ${LINE}`,
            }}
          >
            {t.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h4
              className="truncate text-[14px] font-semibold"
              style={{ color: INK }}
            >
              {t.name}
            </h4>
            <p
              className="truncate text-[11px] font-medium"
              style={{ color: ACCENT_DK }}
            >
              {t.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// REUSABLE NAV BUTTON
// ============================================
const NavButton = ({ onClick, disabled, icon, label }) => (
  <TemplateLabel
    title="Navigation"
    description="Previous / next button. Manually advances the carousel. Auto-rotate restarts after manual interaction."
  >
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#0A1A2F] hover:text-white hover:border-[#0A1A2F] sm:h-11 sm:w-11"
      style={{
        backgroundColor: CARD,
        borderColor: LINE,
        color: INK,
      }}
      aria-label={label}
    >
      {icon}
    </button>
  </TemplateLabel>
);

// ============================================
// PROGRESS COUNTER — fixed h-[3px]
// ============================================
const ProgressCounter = ({ current, total }) => (
  <TemplateLabel
    title="Progress"
    description="Current position vs total (e.g. 03 / 12). Tabular figures keep the digits aligned as they change."
  >
    <div className="flex items-center gap-3 sm:gap-4">
      <span
        className="text-[15px] font-semibold tabular-nums sm:text-base"
        style={{ color: INK }}
      >
        {String(current).padStart(2, "0")}
      </span>
      <div
        className="h-0.75 w-24 overflow-hidden rounded-full sm:w-36 md:w-48"
        style={{ backgroundColor: LINE }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: ACCENT }}
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span
        className="text-[15px] font-semibold tabular-nums sm:text-base"
        style={{ color: MUTED }}
      >
        {String(total).padStart(2, "0")}
      </span>
    </div>
  </TemplateLabel>
);

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const headingRef = useRef(null);
  const mobileIntervalRef = useRef(null);
  const desktopIntervalRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mobile: 1 card at a time
  const [mobileIndex, setMobileIndex] = useState(0);
  const [mobileDirection, setMobileDirection] = useState(1);
  const [mobileAnimating, setMobileAnimating] = useState(false);
  const mobileTotal = testimonials.length;

  // Desktop (md+): 3 cards per page
  const cardsPerPage = 3;
  const desktopTotalPages = Math.ceil(testimonials.length / cardsPerPage);
  const [desktopPage, setDesktopPage] = useState(0);
  const [desktopDirection, setDesktopDirection] = useState(1);
  const [desktopAnimating, setDesktopAnimating] = useState(false);

  const desktopTestimonials = testimonials.slice(
    desktopPage * cardsPerPage,
    desktopPage * cardsPerPage + cardsPerPage
  );

  // ---------- GSAP SCROLL PARALLAX ----------
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background drifts slower than scroll
      gsap.to(bgRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Headline reveal
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---------- MOBILE AUTO ROTATE ----------
  const resetMobileRotate = useCallback(() => {
    if (mobileIntervalRef.current) clearInterval(mobileIntervalRef.current);
    mobileIntervalRef.current = setInterval(() => {
      setMobileDirection(1);
      setMobileIndex((prev) => (prev + 1) % mobileTotal);
    }, 6000);
  }, [mobileTotal]);

  const mobilePaginate = useCallback(
    (dir) => {
      if (mobileAnimating) return;
      setMobileDirection(dir);
      setMobileIndex((prev) => (prev + dir + mobileTotal) % mobileTotal);
      resetMobileRotate();
    },
    [mobileAnimating, mobileTotal, resetMobileRotate]
  );

  // ---------- DESKTOP AUTO ROTATE ----------
  const resetDesktopRotate = useCallback(() => {
    if (desktopIntervalRef.current) clearInterval(desktopIntervalRef.current);
    desktopIntervalRef.current = setInterval(() => {
      setDesktopDirection(1);
      setDesktopPage((prev) => (prev + 1) % desktopTotalPages);
    }, 7000);
  }, [desktopTotalPages]);

  const desktopPaginate = useCallback(
    (dir) => {
      if (desktopAnimating) return;
      setDesktopDirection(dir);
      setDesktopPage(
        (prev) => (prev + dir + desktopTotalPages) % desktopTotalPages
      );
      resetDesktopRotate();
    },
    [desktopAnimating, desktopTotalPages, resetDesktopRotate]
  );

  // ---------- VISIBILITY OBSERVER ----------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    resetMobileRotate();
    resetDesktopRotate();
    return () => {
      if (mobileIntervalRef.current) clearInterval(mobileIntervalRef.current);
      if (desktopIntervalRef.current) clearInterval(desktopIntervalRef.current);
    };
  }, [isVisible, resetMobileRotate, resetDesktopRotate]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 sm:py-28 lg:py-32"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ============ ANIMATED BG IMAGE WITH PARALLAX ============ */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ height: "130%", top: "-15%" }}
      >
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        {/* Tinted overlay — keeps the section readable on top of image */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${PAPER}F2 0%, ${PAPER}E6 50%, ${PAPER}F2 100%)`,
          }}
        />
        {/* Subtle accent radial — single, quiet, top right */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 85% 15%, rgba(29,78,216,0.08) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        {/* ===== HEADER — left aligned, controls inline on desktop ===== */}
        <div
          className={`mb-12 flex flex-col gap-8 transition-all duration-700 ease-out sm:mb-16 md:flex-row md:items-end md:justify-between ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="max-w-xl">
            {/* Eyebrow */}
            <TemplateLabel
              title="Eyebrow"
              description="Quiet context label above the headline. Sentence case with one accent dot."
            >
              <div className="mb-5 flex items-center gap-2">
                <motion.span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <span
                  className="text-[13px] font-medium"
                  style={{ color: MUTED }}
                >
                  Client stories
                </span>
              </div>
            </TemplateLabel>

            {/* Headline */}
            <div ref={headingRef}>
              <TemplateLabel
                title="Section headline"
                description="Two-line headline, weight 600. One phrase carries the accent color. GSAP reveals it on scroll-into-view."
              >
                <h2
                  className="text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-[42px]"
                  style={{ color: INK }}
                >
                  What clients say{" "}
                  <span style={{ color: ACCENT }}>after the move</span>
                </h2>
              </TemplateLabel>
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-lg text-[15px] font-normal leading-[1.6]"
              style={{ color: MUTED }}
            >
              Nothing matters more than helping clients feel supported,
              informed, and confident throughout their move. A few of their
              experiences, in their own words.
            </motion.p>
          </div>

          {/* Desktop nav — inline with header */}
          <div className="hidden md:block">
            <div className="flex items-center gap-5">
              <NavButton
                onClick={() => desktopPaginate(-1)}
                disabled={desktopAnimating}
                icon={<ChevronLeft size={18} />}
                label="Previous"
              />
              <ProgressCounter
                current={desktopPage + 1}
                total={desktopTotalPages}
              />
              <NavButton
                onClick={() => desktopPaginate(1)}
                disabled={desktopAnimating}
                icon={<ChevronRight size={18} />}
                label="Next"
              />
            </div>
          </div>
        </div>

        {/* ===== MOBILE CAROUSEL: 1 CARD ===== */}
        <div className="block md:hidden">
          <div className="relative mx-auto max-w-md">
            <TemplateLabel
              title="Mobile carousel"
              description="Single-card slider for small screens. Auto-rotates every 6s, manual nav with arrows. Shows the full review text."
            >
              {/* FIXED: min-h-[420px] (was min-h-420px — invalid Tailwind) */}
              <div className="relative min-h-420px overflow-hidden">
                <AnimatePresence
                  initial={false}
                  custom={mobileDirection}
                  mode="popLayout"
                >
                  <motion.div
                    key={testimonials[mobileIndex].id}
                    custom={mobileDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationStart={() => setMobileAnimating(true)}
                    onAnimationComplete={() => setMobileAnimating(false)}
                    className="w-full"
                  >
                    <TestimonialCard t={testimonials[mobileIndex]} total={1} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </TemplateLabel>

            {/* Mobile nav — centered below */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <NavButton
                onClick={() => mobilePaginate(-1)}
                disabled={mobileAnimating}
                icon={<ChevronLeft size={18} />}
                label="Previous"
              />
              <ProgressCounter current={mobileIndex + 1} total={mobileTotal} />
              <NavButton
                onClick={() => mobilePaginate(1)}
                disabled={mobileAnimating}
                icon={<ChevronRight size={18} />}
                label="Next"
              />
            </div>
          </div>
        </div>

        {/* ===== DESKTOP CAROUSEL: 3 CARDS ===== */}
        <div className="hidden md:block">
          <TemplateLabel
            title="Desktop grid"
            description="3-card grid that paginates. Auto-rotates every 7s across multiple pages. Cards show condensed text with a line clamp."
          >
            {/* FIXED: min-h-[340px] (was min-h-340px — invalid Tailwind) */}
            <div className="relative min-h-340px overflow-hidden">
              <AnimatePresence
                initial={false}
                custom={desktopDirection}
                mode="popLayout"
              >
                <motion.div
                  key={desktopPage}
                  custom={desktopDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationStart={() => setDesktopAnimating(true)}
                  onAnimationComplete={() => setDesktopAnimating(false)}
                  className="w-full"
                >
                  <div className="grid grid-cols-3 gap-5 lg:gap-7">
                    {desktopTestimonials.map((t, i) => (
                      <TestimonialCard key={t.id} t={t} index={i} total={3} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </TemplateLabel>
        </div>
      </div>
    </section>
  );
}