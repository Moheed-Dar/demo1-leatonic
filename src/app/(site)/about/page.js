"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// BLUE SCHEME — matches Hero
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
// BACKGROUND IMAGE — full-bleed parallax header
// ============================================
const BG_IMAGE =
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2400&auto=format&fit=crop";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    alt: "Modern property exterior",
    meta: "Maple Street · 4 bed",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    alt: "Luxury home architecture",
    meta: "River Road · 5 bed",
  },
  {
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1200&auto=format&fit=crop",
    alt: "Modern villa design",
    meta: "Hilltop Lane · 3 bed",
  },
  {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    alt: "Premium residence",
    meta: "Bay Court · 6 bed",
  },
];

const PORTRAIT_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop";

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
// SOCIAL ICON - LinkedIn
// ============================================
const LinkedInIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ============================================
// FLOATING STATS BADGES — over portrait
// ============================================
const FLOATING_STATS = [
  { value: "12+", label: "Years", className: "left-[-4%] top-[18%]" },
  { value: "4.9", label: "Rating", className: "right-[-5%] top-[44%]" },
  { value: "98%", label: "Repeat", className: "left-[-3%] bottom-[18%]" },
];

// ============================================
// 3D TILT CARD — for gallery
// ============================================
const TiltCard = ({ img, index }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(sx, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative aspect-4/3 overflow-hidden rounded-2xl"
        style={{
          border: `1px solid ${LINE}`,
          boxShadow: `0 12px 30px -16px rgba(10,26,47,0.18)`,
        }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 25vw"
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(180deg, transparent 50%, ${INK}CC 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="text-[12px] font-medium" style={{ color: "#FFFFFF" }}>
            {img.meta}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
          >
            <ArrowUpRight size={13} />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default function About() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const portraitRef = useRef(null);
  const portraitWrapRef = useRef(null);
  const headingRef = useRef(null);
  const bioRef = useRef(null);

  // Mouse parallax springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const statX1 = useSpring(mx, { stiffness: 60, damping: 18 });
  const statY1 = useSpring(my, { stiffness: 60, damping: 18 });
  const statX2 = useSpring(mx, { stiffness: 45, damping: 20 });
  const statY2 = useSpring(my, { stiffness: 45, damping: 20 });
  const statX3 = useSpring(mx, { stiffness: 75, damping: 15 });
  const statY3 = useSpring(my, { stiffness: 75, damping: 15 });
  const statPos = [statX1, statX2, statX3];
  const statPosY = [statY1, statY2, statY3];

  const socialLinks = [{ icon: LinkedInIcon, href: "#", label: "LinkedIn" }];

  // ---------- GSAP SCROLL PARALLAX ----------
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(portraitRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: portraitWrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

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

      gsap.from(bioRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ---------- MOUSE PARALLAX ----------
  const handleMouseMove = (e) => {
    const el = portraitWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(relX * 30);
    my.set(relY * 30);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ============ FULL-BLEED PARALLAX HEADER ============ */}
      <div className="relative h-[55vh] min-h-440px w-full overflow-hidden sm:h-[60vh]">
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{ height: "130%", top: "-15%" }}
        >
          <Image
            src={BG_IMAGE}
            alt="Property"
            fill
            unoptimized
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}66 0%, ${INK}33 40%, ${PAPER} 100%)`,
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-5 flex items-center gap-2"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT_LT }}
            />
            <span
              className="text-[13px] font-medium"
              style={{ color: "#DBEAFE" }}
            >
              About the consultant
            </span>
          </motion.div>

          <div ref={headingRef}>
            <h2
              className="mx-auto max-w-4xl text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[56px]"
              style={{ color: "#FFFFFF" }}
            >
              Real estate consulting that{" "}
              <span style={{ color: ACCENT_LT }}>
                puts the numbers in your hands
              </span>{" "}
              before the decision.
            </h2>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div
          ref={bioRef}
          className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-24 lg:py-24"
        >
          {/* ===== LEFT : PORTRAIT + FLOATING STATS ===== */}
          <motion.div
            ref={portraitWrapRef}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative order-1 lg:order-1"
          >
            <TemplateLabel
              title="Portrait"
              description="Portrait with GSAP scrub parallax — moves up as you scroll past. Floating stat badges drift with mouse movement at three different rates for depth."
              position="right"
            >
              <div className="relative">
                <div ref={portraitRef} className="will-change-transform">
                  <div
                    className="relative aspect-3/4 overflow-hidden rounded-2xl"
                    style={{
                      border: `1px solid ${LINE}`,
                      boxShadow: `0 40px 80px -28px rgba(10,26,47,0.30)`,
                    }}
                  >
                    <Image
                      src={PORTRAIT_IMAGE}
                      alt="Your Name, real estate consultant"
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 1024px) 90vw, 40vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 55%, ${INK}B3 100%)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p
                        className="text-[20px] font-semibold leading-tight sm:text-[22px]"
                        style={{ color: "#FFFFFF" }}
                      >
                        Your Name
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className="h-px w-6"
                          style={{ backgroundColor: ACCENT_SOFT }}
                        />
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: "#DBEAFE" }}
                        >
                          Real estate consultant
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats badges — mouse parallax at different rates */}
                {FLOATING_STATS.map((stat, i) => (
                  <motion.div
                    key={i}
                    style={{ x: statPos[i], y: statPosY[i] }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                    className={`absolute ${stat.className} z-10`}
                  >
                    <div
                      className="rounded-xl p-3.5"
                      style={{
                        backgroundColor: CARD,
                        border: `1px solid ${LINE}`,
                        boxShadow: `0 20px 40px -16px rgba(10,26,47,0.25)`,
                      }}
                    >
                      <p
                        className="text-[20px] font-semibold tabular-nums leading-none"
                        style={{ color: INK }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="mt-1 text-[10px] font-medium"
                        style={{ color: MUTED }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TemplateLabel>
          </motion.div>

          {/* ===== RIGHT : BIO ===== */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="order-2 lg:order-2"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <h3
                className="text-[24px] font-semibold leading-tight tracking-[-0.01em] sm:text-[28px] lg:text-[32px]"
                style={{ color: INK }}
              >
                Hi, I&apos;m <span style={{ color: ACCENT }}>Your Name</span>
              </h3>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div
                className="space-y-5 text-[15px] font-normal leading-[1.65] sm:text-base sm:leading-[1.7]"
                style={{ color: MUTED }}
              >
                <p>
                  I provide real estate consulting tailored to your situation.
                  My approach combines data-driven market analysis with
                  proprietary methods, so every transaction is prepared
                  thoroughly and aligned with your goals.
                </p>

                <blockquote
                  className="border-l-2 py-1 pl-5"
                  style={{ borderColor: ACCENT, color: INK }}
                >
                  <p className="text-[17px] font-medium leading-snug sm:text-[19px]">
                    Real estate isn&apos;t just about properties — it&apos;s
                    about people making informed decisions with confidence.
                  </p>
                </blockquote>

                <p>
                  My approach goes beyond traditional methods. By leaning on
                  data and clear constraints, I give clients a competitive edge
                  — whether you&apos;re buying your first home or selling a
                  long-held property.
                </p>

                <p>
                  I work with both sellers and buyers. For sellers, I position
                  your property to attract the right buyers and maximize value.
                  For buyers, I help you navigate the market with confidence,
                  identifying opportunities that fit your goals and budget.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6">
              <p className="text-[14px] font-medium" style={{ color: ACCENT_DK }}>
                Let&apos;s work together.
              </p>
              <p className="text-[13px]" style={{ color: MUTED }}>
                Your Name
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:hello@yourbrand.com"
                    className="group inline-flex items-center gap-3 text-[14px] font-medium"
                    style={{ color: INK }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_DK }}
                    >
                      <Mail size={15} />
                    </span>
                    <span className="border-b border-transparent transition-colors group-hover:border-[#0A1A2F]">
                      hello@yourbrand.com
                    </span>
                  </a>

                  <a
                    href="tel:+15550001234"
                    className="group inline-flex items-center gap-3 text-[14px] font-medium"
                    style={{ color: INK }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_DK }}
                    >
                      <Phone size={15} />
                    </span>
                    <span className="border-b border-transparent transition-colors group-hover:border-[#0A1A2F]">
                      (555) 000-1234
                    </span>
                  </a>

                  <div
                    className="inline-flex items-center gap-3 text-[14px] font-medium"
                    style={{ color: INK }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: ACCENT_SOFT, color: ACCENT_DK }}
                    >
                      <MapPin size={15} />
                    </span>
                    <span>123 Main Street, City, ST 00000</span>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[12px] font-medium" style={{ color: MUTED }}>
                    Connect
                  </p>
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-[#DBEAFE]"
                        style={{ borderColor: LINE, color: INK, backgroundColor: CARD }}
                        aria-label={social.label}
                      >
                        <social.icon size={17} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ============ GALLERY — 3D TILT CARDS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="border-t pt-12 pb-20 sm:pt-16 lg:pb-28"
          style={{ borderColor: LINE }}
        >
          <div className="mb-6 flex items-baseline justify-between">
            <h3
              className="text-[20px] font-semibold tracking-[-0.01em] sm:text-[22px]"
              style={{ color: INK }}
            >
              Recent work
            </h3>
            <Link
              href="/properties"
              className="group inline-flex items-center gap-1 text-[13px] font-medium"
              style={{ color: ACCENT_DK }}
            >
              See all listings
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
            {galleryImages.map((img, index) => (
              <TiltCard key={index} img={img} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}