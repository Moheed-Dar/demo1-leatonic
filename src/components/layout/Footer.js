"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Phone,
  Mail,
  Send,
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { subscribe } from "@/lib/subscribers/api";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// BLUE SCHEME — matches Hero / About / Navbar / Testimonials
// ============================================
const INK = "#0A1A2F";
const PAPER = "#F3F6FB";
const ACCENT = "#1D4ED8";
const ACCENT_DK = "#1E3A8A";
const ACCENT_SOFT = "#DBEAFE";
const ACCENT_LT = "#93C5FD";
const LINE = "rgba(255,255,255,0.12)";
const MUTED = "rgba(219,234,254,0.60)";
const CARD = "#FFFFFF";

// ============================================
// BACKGROUND IMAGE — parallax
// ============================================
const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

// ============================================
// RICH HOVER LABEL — adjusted so tooltips don't overlap siblings
// Tooltip now sits fully outside the hovered element via consistent
// translate behavior; container is inline-block so it doesn't stretch.
// ============================================
const TemplateLabel = ({
  children,
  title,
  description,
  position = "top",
  align = "center",
}) => {
  // Build the position class string from parts so we never get a half-valid class.
  let posClass = "";
  if (position === "top") {
    posClass =
      "bottom-full left-1/2 -translate-x-1/2 mb-2 group-hover/tl:-translate-y-1";
  } else if (position === "bottom") {
    posClass =
      "top-full left-1/2 -translate-x-1/2 mt-2 group-hover/tl:translate-y-1";
  } else if (position === "left") {
    posClass =
      "top-1/2 right-full -translate-y-1/2 mr-2 group-hover/tl:-translate-x-1";
  } else if (position === "right") {
    posClass =
      "top-1/2 left-full -translate-y-1/2 ml-2 group-hover/tl:translate-x-1";
  }

  // Horizontal alignment for top/bottom tooltips when needed
  let alignClass = "";
  if (align === "start") alignClass = "left-0 -translate-x-0";
  if (align === "end") alignClass = "right-0 -translate-x-0";

  return (
    <div className="group/tl relative inline-flex">
      {children}
      <div
        className={`pointer-events-none absolute z-60 ${posClass} ${
          (position === "top" || position === "bottom") && align !== "center"
            ? alignClass
            : ""
        } opacity-0 transition-all duration-300 group-hover/tl:opacity-100`}
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
// WORDMARK — text + glyph (no placeholder image)
// ============================================
const Wordmark = ({ onClick }) => (
  <Link
    href="/"
    onClick={onClick}
    className="group inline-flex items-center gap-2.5"
    aria-label="Estate — home"
  >
    <span
      className="flex h-8 w-8 items-center justify-center rounded-md transition-transform duration-300 group-hover:rotate-[8deg]"
      style={{ backgroundColor: ACCENT }}
    >
      <svg
        width="16"
        height="16"
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
      className="text-[20px] font-semibold tracking-[-0.01em]"
      style={{ color: "#FFFFFF" }}
    >
      Estate
    </span>
  </Link>
);

// ============================================
// SOCIAL ICONS
// ============================================
const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ============================================
// FOOTER LINK GROUPS
// ============================================
const footerLinks = {
  company: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Properties", href: "/properties" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Blog", href: "/blogs" },
    { name: "Listings", href: "/properties" }
   
  ],
};

// ============================================
// STAGGER VARIANTS
// ============================================
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Footer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear();

  const footerRef = useRef(null);
  const bgRef = useRef(null);
  const ctaRef = useRef(null);
  const gridRef = useRef(null);
  const newsletterRef = useRef(null);

  // ---------- SCROLL TO TOP VISIBILITY ----------
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ---------- GSAP SCROLL PARALLAX ----------
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background drifts slower than scroll → depth
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // CTA banner reveal
      gsap.from(ctaRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Grid reveal
      gsap.from(gridRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Newsletter reveal
      gsap.from(newsletterRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: newsletterRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setSubscribeMsg({ type: "error", text: "Please enter your name" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubscribeMsg({
        type: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    setSubscribing(true);
    const res = await subscribe({ name: name.trim(), email: email.trim() });

    if (res.success) {
      setSubscribeMsg({
        type: "success",
        text: res.message || "Successfully subscribed to our newsletter!",
      });
      setName("");
      setEmail("");
      setTimeout(() => setSubscribeMsg(null), 6000);
    } else {
      setSubscribeMsg({
        type: "error",
        text: res.message || "Something went wrong. Please try again.",
      });
    }

    setSubscribing(false);
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: INK, color: PAPER }}
    >
      {/* ============ BACKGROUND IMAGE LAYER ============ */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 will-change-transform"
        style={{ height: "120%", top: "-10%" }}
      >
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark navy overlay so content stays legible */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}F2 50%, ${INK}FA 100%)`,
          }}
        />
        {/* Subtle accent radial — single, quiet, top right */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 85% 5%, rgba(29,78,216,0.14) 0%, transparent 45%)`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== SECTION 1: CTA BANNER ===== */}
        <div ref={ctaRef} className="mt-12 sm:mt-16">
          <TemplateLabel
            title="Call-to-Action Banner"
            description="Promotional banner above the footer. Editorial split — heading left, CTAs right. Hidden on mobile."
            align="start"
          >
            <div
              className="relative mb-16 hidden overflow-hidden rounded-3xl md:block"
              style={{
                border: `1px solid ${LINE}`,
                background: `linear-gradient(135deg, rgba(29,78,216,0.12) 0%, rgba(10,26,47,0.40) 60%, rgba(30,58,138,0.20) 100%)`,
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            >
              <div className="relative flex flex-col items-center justify-between gap-6 px-6 py-10 sm:px-10 lg:flex-row lg:px-16 sm:py-14 lg:py-16">
                <div className="max-w-2xl text-center lg:text-left">
                  {/* Eyebrow */}
                  <div className="mb-4 flex items-center gap-2">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: ACCENT_LT }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: ACCENT_LT }}
                    >
                      Let&apos;s start your journey
                    </span>
                  </div>

                  {/* Headline — two-color split, no inline highlight box */}
                  <h3
                    className="text-[28px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[44px]"
                    style={{ color: "#FFFFFF" }}
                  >
                    Ready to find your{" "}
                    <span style={{ color: ACCENT_LT }}>next chapter?</span>
                  </h3>

                  <p
                    className="mt-4 max-w-md text-[14px] leading-[1.6] mx-auto lg:mx-0"
                    style={{ color: "rgba(219,234,254,0.70)" }}
                  >
                    Whether you&apos;re downsizing, upgrading, or investing —
                    we&apos;re here to guide you every step of the way.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                  <TemplateLabel
                    title="Primary CTA"
                    description="Main action button. Solid white fill, accent arrow chip, lift on hover."
                    position="bottom"
                  >
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-3 rounded-full py-3 pl-5 pr-2 text-[13px] font-semibold transition-transform duration-200 hover:-translate-y-0.5"
                      style={{ backgroundColor: "#FFFFFF", color: INK }}
                    >
                      Book a consultation
                      <span
                        className="flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5"
                        style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                      >
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </span>
                    </Link>
                  </TemplateLabel>

                  <Link
                    href="/properties"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold transition-colors duration-200 hover:bg-white/10"
                    style={{
                      border: `1px solid ${LINE}`,
                      color: "#FFFFFF",
                    }}
                  >
                    Browse properties
                  </Link>
                </div>
              </div>
            </div>
          </TemplateLabel>
        </div>

        {/* ===== SECTION 2: MAIN FOOTER GRID ===== */}
        <div
          ref={gridRef}
          className="mb-12 grid grid-cols-1 gap-12 pt-8 lg:grid-cols-12 lg:gap-8 md:pt-0"
        >
          {/* ============ LEFT: BRAND COLUMN ============ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col lg:col-span-6"
          >
            {/* Wordmark */}
            <motion.div variants={itemVariants} className="mb-6">
              <TemplateLabel
                title="Brand wordmark"
                description="Text wordmark + accent glyph tile. Replaces the old placeholder image logo with a clean, scale-proof mark."
                align="start"
              >
                <Wordmark />
              </TemplateLabel>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants} className="mb-8">
              <TemplateLabel
                title="Brand description"
                description="Short company description, 2-3 sentences. Left aligned, weight 400, muted."
                align="start"
              >
                <p
                  className="max-w-md text-[14px] leading-[1.65] sm:text-[15px]"
                  style={{ color: MUTED }}
                >
                  Helping clients embrace their next chapter with thoughtful
                  guidance, local knowledge, and a real estate experience built
                  on trust, kindness, and genuine connection.
                </p>
              </TemplateLabel>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={itemVariants} className="mb-8">
              <TemplateLabel
                title="Contact information"
                description="Phone, email, and service area. Each row is a clickable link. Icon chip + label + value."
                align="start"
              >
                <div className="flex flex-col gap-3">
                  {/* Phone */}
                  <a
                    href="tel:+15550001234"
                    className="group flex items-center gap-3 text-[14px] font-medium transition-colors hover:text-white"
                    style={{ color: "rgba(219,234,254,0.85)" }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: "rgba(29,78,216,0.20)",
                        color: ACCENT_LT,
                      }}
                    >
                      <Phone size={15} />
                    </span>
                    <span className="border-b border-transparent transition-colors group-hover:border-white/40">
                      (555) 000-1234
                    </span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:hello@yourbrand.com"
                    className="group flex items-center gap-3 text-[14px] font-medium transition-colors hover:text-white"
                    style={{ color: "rgba(219,234,254,0.85)" }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: "rgba(29,78,216,0.20)",
                        color: ACCENT_LT,
                      }}
                    >
                      <Mail size={15} />
                    </span>
                    <span className="border-b border-transparent transition-colors group-hover:border-white/40">
                      hello@yourbrand.com
                    </span>
                  </a>

                  {/* Address */}
                  <div
                    className="flex items-center gap-3 text-[14px] font-medium"
                    style={{ color: "rgba(219,234,254,0.85)" }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: "rgba(29,78,216,0.20)",
                        color: ACCENT_LT,
                      }}
                    >
                      <MapPin size={15} />
                    </span>
                    <span>Your City, State</span>
                  </div>
                </div>
              </TemplateLabel>
            </motion.div>

            {/* Social */}
            <motion.div variants={itemVariants}>
              <TemplateLabel
                title="Social links"
                description="External social profiles. Replace '#' with your real profile URLs."
                align="start"
              >
                <div>
                  <p
                    className="mb-3 text-[12px] font-medium"
                    style={{ color: MUTED }}
                  >
                    Follow along
                  </p>
                  <div className="flex items-center gap-2.5">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors hover:bg-white/10"
                        style={{
                          borderColor: LINE,
                          color: "rgba(219,234,254,0.85)",
                        }}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </TemplateLabel>
            </motion.div>
          </motion.div>

          {/* ============ RIGHT: LINKS COLUMNS ============ */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 lg:col-span-6">
            {/* Company */}
            <TemplateLabel
              title="Navigation — Company"
              description="Primary site navigation. 4-6 items. Animated underline on hover."
              align="start"
            >
              <div>
                <h4
                  className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#FFFFFF" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ACCENT_LT }}
                  />
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group relative inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:text-white"
                        style={{ color: MUTED }}
                      >
                        <ArrowUpRight
                          size={12}
                          className="-rotate-45 opacity-0 transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100"
                          style={{ color: ACCENT_LT }}
                        />
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </TemplateLabel>

            {/* Resources */}
            <TemplateLabel
              title="Navigation — Resources"
              description="Secondary navigation. Blog, guides, reports."
              align="start"
            >
              <div>
                <h4
                  className="mb-5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "#FFFFFF" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: ACCENT_DK }}
                  />
                  Resources
                </h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group relative inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:text-white"
                        style={{ color: MUTED }}
                      >
                        <ArrowUpRight
                          size={12}
                          className="-rotate-45 opacity-0 transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100"
                          style={{ color: ACCENT_LT }}
                        />
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {/* Quick question callout */}
                <TemplateLabel
                  title="Quick contact prompt"
                  description="Small callout encouraging users to reach out."
                  position="bottom"
                  align="start"
                >
                  <div
                    className="mt-6 rounded-xl p-4"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <p
                      className="mb-1 text-[11px] font-semibold"
                      style={{ color: ACCENT_LT }}
                    >
                      Quick question?
                    </p>
                    <p
                      className="mb-3 text-[13px]"
                      style={{ color: "rgba(219,234,254,0.75)" }}
                    >
                      Let&apos;s talk about your real estate goals.
                    </p>
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-1.5 text-[12px] font-semibold transition-all duration-300 hover:gap-2.5"
                      style={{ color: ACCENT_LT }}
                    >
                      Reach out
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </TemplateLabel>
              </div>
            </TemplateLabel>
          </div>
        </div>

        {/* ===== SECTION 3: NEWSLETTER ===== */}
        <div ref={newsletterRef}>
          <TemplateLabel
            title="Newsletter signup"
            description="Email subscription form. Collects name + email, posts to your API. Success / error feedback inline."
            align="start"
          >
            <div
              className="relative mb-12 overflow-hidden rounded-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${LINE}`,
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 h-px w-full"
                style={{
                  background: `linear-gradient(to right, transparent, ${ACCENT_LT}, transparent)`,
                }}
              />

              <div className="relative flex flex-col items-start gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center md:px-12 sm:py-8">
                {/* Copy */}
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Send size={15} style={{ color: ACCENT_LT }} />
                    <p
                      className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: ACCENT_LT }}
                    >
                      Newsletter
                    </p>
                  </div>
                  <h4
                    className="mb-1 text-[18px] font-semibold sm:text-[20px]"
                    style={{ color: "#FFFFFF" }}
                  >
                    Stay updated with market insights
                  </h4>
                  <p
                    className="text-[13px] sm:text-[14px]"
                    style={{ color: MUTED }}
                  >
                    Get market insights, new listings, and tips delivered monthly.
                  </p>
                </div>

                {/* Form */}
                <div className="w-full md:w-auto md:min-w-440px">
                  <form onSubmit={handleSubscribe} className="space-y-2.5">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={subscribing}
                        required
                        minLength={2}
                        maxLength={100}
                        className="flex-1 rounded-full py-3 px-5 text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 sm:w-44"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: `1px solid ${LINE}`,
                          color: "#FFFFFF",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = ACCENT_LT;
                          e.currentTarget.style.boxShadow = `0 0 0 3px rgba(147,197,253,0.20)`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = LINE;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />

                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={subscribing}
                        required
                        maxLength={200}
                        className="flex-1 rounded-full py-3 px-5 text-sm transition-all duration-300 focus:outline-none disabled:opacity-50 sm:w-52"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.06)",
                          border: `1px solid ${LINE}`,
                          color: "#FFFFFF",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = ACCENT_LT;
                          e.currentTarget.style.boxShadow = `0 0 0 3px rgba(147,197,253,0.20)`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = LINE;
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />

                      <button
                        type="submit"
                        disabled={subscribing}
                        className="shrink-0 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13px] font-semibold transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                        style={{
                          backgroundColor: ACCENT,
                          color: "#FFFFFF",
                          boxShadow: `0 8px 24px rgba(29,78,216,0.40)`,
                        }}
                        aria-label="Subscribe"
                      >
                        {subscribing ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            Subscribe
                            <ArrowUpRight size={14} />
                          </>
                        )}
                      </button>
                    </div>

                    {subscribeMsg && (
                      <div
                        className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium"
                        style={{
                          backgroundColor:
                            subscribeMsg.type === "success"
                              ? "rgba(29,78,216,0.15)"
                              : "rgba(239, 68, 68, 0.12)",
                          border: `1px solid ${
                            subscribeMsg.type === "success"
                              ? "rgba(29,78,216,0.40)"
                              : "rgba(239, 68, 68, 0.30)"
                          }`,
                          color:
                            subscribeMsg.type === "success"
                              ? ACCENT_LT
                              : "#fca5a5",
                        }}
                      >
                        {subscribeMsg.type === "success" ? (
                          <CheckCircle2 size={13} className="shrink-0" />
                        ) : (
                          <AlertCircle size={13} className="shrink-0" />
                        )}
                        {subscribeMsg.text}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </TemplateLabel>
        </div>

        {/* ===== SECTION 4: DISCLAIMER ===== */}
        <div className="flex max-w-5xl flex-col items-center justify-center gap-6 px-4 pb-8 pt-8 text-center">
          <TemplateLabel
            title="Legal disclaimer"
            description="Required legal text for real estate sites — IDX disclosure, MLS participation, equal housing notice."
            position="top"
            align="center"
          >
            <p
              className="max-w-4xl text-center text-[11px] leading-[1.7] sm:text-xs"
              style={{ color: "rgba(219,234,254,0.55)" }}
            >
              &copy; {currentYear} Your Brand Name. All rights reserved. The data
              relating to real estate for sale on this website appears in part
              through the MLS Internet Data Exchange (IDX) program, a voluntary
              cooperative exchange of property listing data between licensed real
              estate brokerage firms in which Your Brand Name participates, and is
              provided by the MLS through a licensing agreement.
              <br />
              Listings held by brokerage firms other than Your Brand Name are
              marked with the IDX icon and include the listing broker name.
              Information is provided for the personal, non-commercial use of
              consumers and may not be used for any purpose other than identifying
              properties of interest. Property information is deemed reliable but
              not guaranteed and should be independently verified. Listings may
              change or be withdrawn without notice and may include errors,
              omissions, or status updates. Equal Housing Opportunity.
            </p>
          </TemplateLabel>
        </div>

        {/* ===== SECTION 5: COPYRIGHT ===== */}
        <div
          className="flex flex-col items-center pt-6 pb-4"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <TemplateLabel
            title="Copyright notice"
            description="Year + brand name + 'All rights reserved'. 'Leatonic' link credits the template developer."
            position="top"
            align="center"
          >
            <p
              className="text-center text-xs transition-colors sm:text-sm"
              style={{ color: "rgba(219,234,254,0.50)" }}
            >
              &copy; {currentYear}{" "}
              <span style={{ color: "#FFFFFF" }}>Your Brand Name</span>. All
              rights reserved. Built by{" "}
              <a
                href="https://leatonic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors duration-300 hover:underline"
                style={{ color: ACCENT_LT }}
              >
                Leatonic
              </a>
              .
            </p>
          </TemplateLabel>
        </div>
      </div>

      {/* ===== SCROLL TO TOP ===== */}
      <TemplateLabel
        title="Scroll to top"
        description="Floating button (bottom-right). Appears after 300px scroll. Smooth-scrolls to top."
        position="left"
      >
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
          style={{
            backgroundColor: ACCENT,
            color: "#FFFFFF",
            boxShadow: `0 8px 24px rgba(29,78,216,0.50)`,
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} strokeWidth={2.5} />
        </button>
      </TemplateLabel>
    </footer>
  );
}