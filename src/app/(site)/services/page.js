"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  BarChart3,
  Target,
  Check,
  ArrowRight,
  Users,
  TrendingUp,
  Home,
  Search,
  Star,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import GuideForm from "@/components/forms/GuideForm";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// BLUE SCHEME — property.js se same (green/teal hata diya)
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

// Hero subtitle color — dark image area pe light text ke liye
// (property.js ke rgba(219,234,254,0.75) jaisa)
const HERO_SUB = "rgba(219,234,254,0.75)";

// ============================================
// BACKGROUND IMAGE — property.js se same
// (modern building, blue scheme ke saath match)
// ============================================
const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

// ============================================
// SERVICES DATA — offered services ki list
// ============================================
const services = [
  {
    icon: ShieldCheck,
    title: "Buyer Representation",
    description:
      "Personalized guidance throughout your home-buying journey. We help you find the right property, evaluate opportunities, negotiate confidently, and navigate every step through closing.",
    features: [
      "Property search & selection guidance",
      "Market analysis & property evaluation",
    ],
  },
  {
    icon: BarChart3,
    title: "Home Valuations",
    description:
      "Know what your home is worth with a comprehensive market evaluation. We provide honest advice and local market expertise so you can plan your next move with confidence.",
    features: [
      "Accurate comparative market analysis",
      "Current local market insights & trends",
      "Pricing strategies for today's market",
      "No-obligation consultation",
    ],
  },
];

// ============================================
// STATS DATA — credibility numbers
// ============================================
const stats = [
  { icon: Home, value: "500+", label: "Properties Sold", sub: "Across all price ranges" },
  { icon: Users, value: "300+", label: "Happy Clients", sub: "Trusted by families" },
  { icon: TrendingUp, value: "$2B+", label: "Total Volume", sub: "In closed sales" },
  { icon: Star, value: "4.9/5", label: "Client Rating", sub: "Based on 300+ reviews" },
];

// ============================================
// PROCESS STEPS — 4 step working flow
// ============================================
const processSteps = [
  {
    num: "01",
    title: "Consultation",
    description:
      "We start by understanding your goals, timeline, and budget in a personalized discovery session.",
    icon: Search,
  },
  {
    num: "02",
    title: "Strategy",
    description:
      "We craft a tailored plan — whether buying, selling, or both — aligned with your objectives and the local market.",
    icon: Target,
  },
  {
    num: "03",
    title: "Execution",
    description:
      "From property tours and inspections to marketing and negotiations, we handle the heavy lifting.",
    icon: BarChart3,
  },
  {
    num: "04",
    title: "Close & Beyond",
    description:
      "We guide you to a smooth closing day and stay connected for everything that comes after.",
    icon: ShieldCheck,
  },
];

// ============================================
// GUIDES DATA — free downloadable PDFs
// ============================================
const guides = [
  {
    type: "buyer",
    title: "Buyer's Guide",
    description:
      "Everything you need to know before purchasing your dream property. A step-by-step roadmap for first-time and experienced buyers.",
    contents: [
      "Complete buying process explained",
      "Financing options & mortgage tips",
      "Property inspection checklist",
      "Common mistakes to avoid",
      "Navex platform now offers Seller's Guide section integration",
    ],
    icon: Home,
  },
  {
    type: "seller",
    title: "Seller's Guide",
    description:
      "Maximize your property's value with our proven selling strategies. Learn how to attract the right buyers and close at the best price.",
    contents: [
      "How to price your property right",
      "Home staging & preparation tips",
      "Marketing strategies that sell",
      "Negotiation tactics for sellers",
      "Legal requirements simplified",
    ],
    icon: TrendingUp,
  },
];

// ============================================
// ANIMATION VARIANTS — framer motion ke liye
// ============================================
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ============================================
// MAIN PAGE
// ============================================
export default function ServicesPage() {
  const pageRef = useRef(null);
  const bgRef = useRef(null);
  const servicesRef = useRef(null);
  const guidesRef = useRef(null);
  const statsRef = useRef(null);
  const processRef = useRef(null);

  // ---- GSAP Animations (parallax + scroll reveals) ----
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax — scroll pe bg halka sa neeche shift hota hai
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 22,
          ease: "none",
          scrollTrigger: {
            trigger: pageRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Hero entrance animations
      gsap.fromTo(
        ".hero-line",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
      );
      gsap.fromTo(
        ".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      // Stats reveal — scroll pe ek ek kar ke aate hain
      if (statsRef.current) {
        gsap.fromTo(
          ".stat-item",
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Process steps — left/right se slide in
      if (processRef.current) {
        gsap.fromTo(
          ".process-step",
          { opacity: 0, x: (i) => (i % 2 === 0 ? -40 : 40) },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: processRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* ===== BACKGROUND IMAGE + PARALLAX =====
          property.js ka EXACT bg concept — same gradients, same radials,
          same dot pattern. Top pe dark INK fade (hero readable),
          bottom pe PAPER fade (neeche ke cards light bg pe readable) */}
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 will-change-transform pointer-events-none"
        style={{ height: "130%", top: "-15%" }}
      >
        <Image
          src={BG_IMAGE}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="100vw"
        />

        {/* LAYER 1 — TOP dark gradient (property.js se EXACT)
            top se strong dark INK, neeche transparent — hero text readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}CC 15%, ${INK}80 30%, ${INK}33 45%, transparent 60%)`,
          }}
        />

        {/* LAYER 2 — BOTTOM PAPER gradient (property.js se EXACT)
            bottom se light PAPER fade — neeche ke sections/cards readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${PAPER}F2 0%, ${PAPER}CC 20%, transparent 50%)`,
          }}
        />

        {/* LAYER 3 — Blue radial glow (top right corner — property.js se same) */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 90% 8%, rgba(29,78,216,0.30) 0%, rgba(29,78,216,0.08) 25%, transparent 50%)`,
          }}
        />

        {/* LAYER 4 — Light blue radial (property.js se same) */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 10% 35%, rgba(147,197,253,0.10) 0%, transparent 35%)`,
          }}
        />

        {/* LAYER 5 — Dot pattern (property.js se same, white dots) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ===== HERO ===== (top dark zone pe — white text) */}
      <section className="relative z-10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="hero-line flex items-center justify-center gap-3 mb-6 origin-center"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: ACCENT_LT }}
              >
                What We Offer
              </span>
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to left, ${ACCENT}, transparent)` }}
              />
            </motion.div>

            <motion.h1
              className="hero-title text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] mb-6 font-bold"
              style={{ color: "#FFFFFF" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Our <span style={{ color: ACCENT_LT }}>Services</span>
            </motion.h1>

            <motion.p
              className="hero-sub text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
              style={{ color: HERO_SUB }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              Comprehensive real estate solutions tailored to your needs. From finding your
              dream home to maximizing your investment returns.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== (light zone pe — white cards, dark text) */}
      <section ref={servicesRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="service-card group relative rounded-2xl p-7 sm:p-8 overflow-hidden transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)]"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  {/* Hover glow — blue corner glow */}
                  <div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <div
                    className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      border: `1px solid ${LINE}`,
                      backgroundColor: ACCENT_SOFT,
                    }}
                  >
                    <Icon size={24} style={{ color: ACCENT_DK }} />
                  </div>

                  <h3
                    className="relative text-xl mb-3 leading-tight font-semibold"
                    style={{ color: INK }}
                  >
                    {service.title}
                  </h3>

                  <p
                    className="relative text-sm leading-relaxed mb-6"
                    style={{ color: MUTED }}
                  >
                    {service.description}
                  </p>

                  <ul className="relative space-y-2.5">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm"
                        style={{ color: MUTED }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            border: `1px solid ${LINE}`,
                            backgroundColor: ACCENT_SOFT,
                          }}
                        >
                          <Check size={10} style={{ color: ACCENT_DK }} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="relative mt-7 pt-5"
                    style={{ borderTop: `1px solid ${LINE}` }}
                  >
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group/link"
                      style={{ color: ACCENT }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT_DK)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = ACCENT)}
                    >
                      Learn More
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section ref={statsRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2
              className="text-3xl sm:text-4xl tracking-tight leading-[1.1] mb-4 font-bold"
              style={{ color: INK }}
            >
              Trusted by <span style={{ color: ACCENT }}>Hundreds of Families</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: MUTED }}>
              Numbers that reflect our commitment to delivering exceptional real estate
              experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  whileHover={{ y: -4 }}
                  className="stat-item group relative rounded-2xl p-5 sm:p-6 text-center transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.30)]"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      border: `1px solid ${LINE}`,
                      backgroundColor: ACCENT_SOFT,
                    }}
                  >
                    <Icon size={20} style={{ color: ACCENT_DK }} />
                  </div>
                  <p
                    className="text-3xl sm:text-4xl font-bold mb-1 leading-none"
                    style={{
                      background: `linear-gradient(to right, ${ACCENT_LT}, ${ACCENT})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm font-semibold mb-1" style={{ color: INK }}>
                    {stat.label}
                  </p>
                  <p className="text-[11px]" style={{ color: MUTED }}>
                    {stat.sub}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PROCESS SECTION ===== */}
      <section ref={processRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: ACCENT }}
              >
                How We Work
              </span>
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to left, ${ACCENT}, transparent)` }}
              />
            </div>
            <h2
              className="text-3xl sm:text-4xl tracking-tight leading-[1.1] mb-4 font-bold"
              style={{ color: INK }}
            >
              Our <span style={{ color: ACCENT }}>Process</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: MUTED }}>
              A proven 4-step approach that turns uncertainty into clarity — and goals into keys.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  className="process-step group relative rounded-2xl p-6 sm:p-7 transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.30)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -5 }}
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  {/* Bada number watermark — background me step number */}
                  <div
                    className="absolute -top-2 -right-2 text-7xl font-bold opacity-[0.08] pointer-events-none select-none"
                    style={{ color: ACCENT }}
                  >
                    {step.num}
                  </div>

                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110"
                    style={{
                      border: `1px solid ${LINE}`,
                      backgroundColor: ACCENT_SOFT,
                    }}
                  >
                    <Icon size={20} style={{ color: ACCENT_DK }} />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-md"
                      style={{
                        border: `1px solid ${LINE}`,
                        backgroundColor: ACCENT_SOFT,
                        color: ACCENT_DK,
                      }}
                    >
                      Step {step.num}
                    </span>
                  </div>

                  <h3
                    className="relative text-lg mb-2 font-semibold"
                    style={{ color: INK }}
                  >
                    {step.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed" style={{ color: MUTED }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== GUIDES DOWNLOAD SECTION ===== */}
      <section ref={guidesRef} className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: ACCENT }}
              >
                Free Resources
              </span>
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to left, ${ACCENT}, transparent)` }}
              />
            </div>
            <h2
              className="text-3xl sm:text-4xl tracking-tight leading-[1.1] mb-4 font-bold"
              style={{ color: INK }}
            >
              Download Our <span style={{ color: ACCENT }}>Free Guides</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: MUTED }}>
              Comprehensive resources to help you make informed real estate decisions. Download
              instantly after filling a quick form.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {guides.map((guide) => {
              const GuideIcon = guide.icon;
              return (
                <motion.div
                  key={guide.type}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="guide-card group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)]"
                  style={{
                    backgroundColor: CARD,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none"
                    style={{ backgroundColor: ACCENT }}
                  />

                  <div className="relative p-7 sm:p-8">
                    <div className="flex items-start justify-between mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                          border: `1px solid ${LINE}`,
                          backgroundColor: ACCENT_SOFT,
                        }}
                      >
                        <GuideIcon size={22} style={{ color: ACCENT_DK }} />
                      </div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{
                          border: `1px solid ${LINE}`,
                          backgroundColor: ACCENT_SOFT,
                          color: ACCENT_DK,
                        }}
                      >
                        Free PDF
                      </span>
                    </div>

                    <h3 className="text-xl mb-2 font-semibold" style={{ color: INK }}>
                      {guide.title}
                    </h3>

                    <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED }}>
                      {guide.description}
                    </p>

                    <ul className="space-y-2 mb-7">
                      {guide.contents.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs"
                          style={{ color: MUTED }}
                        >
                          <div
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ backgroundColor: ACCENT }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <GuideForm guideType={guide.type} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mt-10"
          >
            <div
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                backgroundColor: ACCENT_SOFT,
                border: `1px solid ${LINE}`,
              }}
            >
              <ShieldCheck size={14} style={{ color: ACCENT_DK }} />
              <span className="text-xs" style={{ color: MUTED }}>
                Your information is secure. We never share your data.
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}