"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Home,
  Building2,
  Briefcase,
  PhoneCall,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactForm from "@/components/forms/ContactForm";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// BLUE SCHEME — property.js / service page / GuideForm se same
// (green/teal poori tarah hata diya). Light theme: PAPER bg,
// white cards, INK text, blue (ACCENT) accents.
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

// Faint muted (inactive/disabled text ke liye)
const MUTED_FAINT = "rgba(86,105,126,0.50)";

// Hero subtitle color — dark image area pe light text ke liye
// (service page / property.js ke rgba(219,234,254,0.75) jaisa)
const HERO_SUB = "rgba(219,234,254,0.75)";

// ============================================
// BACKGROUND IMAGE — service page / property.js se EXACT same
// (modern building, blue scheme ke saath match)
// ============================================
const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

// ============================================
// DATA
// ============================================
const FAQS = [
  {
    q: "How quickly do you respond to inquiries?",
    a: "We typically respond within 24 hours during business days. For urgent matters, please call us directly.",
  },
  {
    q: "Do you charge any consultation fee?",
    a: "No, our initial consultation is completely free. We believe in building trust first.",
  },
  {
    q: "Can I schedule a property visit?",
    a: "Absolutely! Just mention the property you're interested in and we'll arrange a visit at your convenience.",
  },
];

const SERVICES = [
  {
    icon: Home,
    title: "Buy Property",
    desc: "Find your dream home with expert guidance & local market knowledge.",
  },
  {
    icon: Building2,
    title: "Sell Property",
    desc: "Maximize your home's value with a proven marketing strategy.",
  },
  {
    icon: Briefcase,
    title: "Downsize with Confidence",
    desc: "Simplify your move with personalized planning & support.",
  },
  {
    icon: MessageSquare,
    title: "Relocate to Northern Virginia",
    desc: "Discover the right neighbourhood to match your lifestyle & goals.",
  },
];

const QUICK_LINKS = [
  { label: "Browse Properties", href: "/properties" },
  { label: "About Us", href: "/about" },
  { label: "Home", href: "/" },
];

// ============================================
// MAIN COMPONENT
// ============================================
export default function ContactPage() {
  const pageRef = useRef(null);
  const bgRef = useRef(null);

  // ---- GSAP: background parallax + hero entrance ----
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
          property.js / service page ka EXACT bg concept — same image,
          same 5 gradient layers, same dot pattern. Top pe dark INK fade
          (hero ka white text readable), bottom pe PAPER fade (neeche ke
          white cards + INK text readable). */}
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

        {/* LAYER 1 — TOP dark INK gradient (hero text readable) */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}CC 15%, ${INK}80 30%, ${INK}33 45%, transparent 60%)`,
          }}
        />

        {/* LAYER 2 — BOTTOM PAPER gradient (neeche ke cards readable) */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${PAPER}F2 0%, ${PAPER}CC 20%, transparent 50%)`,
          }}
        />

        {/* LAYER 3 — Blue radial glow (top right corner) */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 90% 8%, rgba(29,78,216,0.30) 0%, rgba(29,78,216,0.08) 25%, transparent 50%)`,
          }}
        />

        {/* LAYER 4 — Light blue radial */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 10% 35%, rgba(147,197,253,0.10) 0%, transparent 35%)`,
          }}
        />

        {/* LAYER 5 — Dot pattern (white dots) */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ===== HERO SECTION ===== (dark top zone pe — light/white text) */}
      <div className="relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb — light colors (dark image area pe readable) */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link
              href="/"
              className="hover:text-white transition-colors"
              style={{ color: "rgba(219,234,254,0.60)" }}
            >
              Home
            </Link>
            <span style={{ color: "rgba(219,234,254,0.30)" }}>/</span>
            <span style={{ color: "rgba(219,234,254,0.85)" }}>Contact</span>
          </div>

          <div className="max-w-2xl">
            {/* Hero label + line (gsap scaleX entrance) */}
            <div className="hero-line flex items-center gap-3 mb-4 origin-left">
              <div
                className="w-8 h-px"
                style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.25em]"
                style={{ color: ACCENT_LT }}
              >
                Get In Touch
              </span>
            </div>

            <h1
              className="hero-title text-3xl sm:text-4xl lg:text-[4.25rem] tracking-tight leading-[1.15] mb-4 font-bold"
              style={{ color: "#FFFFFF" }}
            >
              Contact Us
            </h1>

            <p
              className="hero-sub text-sm sm:text-[15px] leading-relaxed"
              style={{ color: HERO_SUB }}
            >
              Have a question about a property or need expert advice? Our
              dedicated team is ready to help you find your perfect investment.
            </p>
          </div>
        </div>
      </div>

      {/* ===== FORM + SIDEBAR ===== (light zone — white cards, INK text) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* LEFT – FORM */}
          <div className="lg:col-span-2">
            <div
              className="relative isolate rounded-2xl border overflow-hidden"
              style={{ backgroundColor: CARD, borderColor: LINE }}
            >
              {/* Blur layers — blue glows */}
              <div
                className="hidden md:block absolute top-0 left-0 w-48 h-48 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/2 pointer-events-none"
                style={{ backgroundColor: `${ACCENT}10` }}
              />
              <div
                className="hidden md:block absolute bottom-0 right-0 w-48 h-48 rounded-full blur-3xl translate-x-1/3 translate-y-1/2 pointer-events-none"
                style={{ backgroundColor: `${ACCENT_LT}10` }}
              />
              <div className="relative z-10 p-5 sm:p-7">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Why Contact Us */}
              <div
                className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden"
                style={{ backgroundColor: CARD, borderColor: LINE }}
              >
                <div
                  className="hidden md:block absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ backgroundColor: `${ACCENT}10` }}
                />
                <div className="relative z-10">
                  <h3 className="text-base mb-1 font-bold" style={{ color: INK }}>
                    Why Contact Us?
                  </h3>
                  <div
                    className="w-10 h-0.5 rounded-full mb-4"
                    style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)` }}
                  />
                  <div className="space-y-3">
                    {[
                      {
                        title: "Expert Guidance",
                        desc: "Personalized recommendations based on your budget & preferences.",
                      },
                      {
                        title: "A Clear Plan",
                        desc: "Tailored to your goals & timelines",
                      },
                      {
                        title: "Honest Advice",
                        desc: "Straightforward insights to help you make confident decisions.",
                      },
                      {
                        title: "Dedicated Support",
                        desc: "Guidance every step of the way, from start to finish.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
                        >
                          <CheckCircle2 size={11} style={{ color: ACCENT_DK }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: INK }}>
                            {item.title}
                          </p>
                          <p className="text-[11px] leading-snug mt-0.5" style={{ color: MUTED }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Our Services */}
              <div
                className="relative isolate rounded-2xl p-5 border overflow-hidden"
                style={{ backgroundColor: CARD, borderColor: LINE }}
              >
                <div
                  className="hidden md:block absolute top-0 left-0 w-28 h-28 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ backgroundColor: `${ACCENT}10` }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 size={13} style={{ color: ACCENT_DK }} />
                    <h4
                      className="text-[9px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: MUTED }}
                    >
                      Our Services
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {SERVICES.map((item, i) => (
                      <Link
                        key={i}
                        href="/services"
                        className="flex items-center gap-3 p-2 rounded-lg border transition-all"
                        style={{ backgroundColor: "transparent", borderColor: LINE }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = ACCENT_SOFT;
                          e.currentTarget.style.borderColor = `${ACCENT}25`;
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = LINE;
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: ACCENT_SOFT }}
                        >
                          <item.icon size={13} style={{ color: ACCENT_DK }} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: INK }}>
                            {item.title}
                          </p>
                          <p className="text-[11px] leading-snug" style={{ color: MUTED }}>
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MORE INFO SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${ACCENT}30, transparent)` }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: ACCENT }}
            >
              More Info
            </span>
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${ACCENT}30, transparent)` }}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: INK }}>
            Quick Access
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Emergency Contact */}
          <div
            className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden group transition-colors"
            style={{ backgroundColor: CARD, borderColor: `${ACCENT}20` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}30` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${ACCENT}20` }}
          >
            <div
              className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ backgroundColor: `${ACCENT}15` }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
                >
                  <PhoneCall size={15} style={{ color: ACCENT_DK }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: ACCENT }}>
                    Call Now
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>Urgent inquiries</p>
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
              >
                <Phone size={12} style={{ color: ACCENT_DK }} />
                <span className="text-xs font-semibold" style={{ color: ACCENT_DK }}>
                  (571) 210-1933
                </span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div
            className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden transition-colors"
            style={{ backgroundColor: CARD, borderColor: LINE }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}20` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE }}
          >
            <div
              className="hidden md:block absolute bottom-0 left-0 w-20 h-20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2 pointer-events-none"
              style={{ backgroundColor: `${ACCENT}10` }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} style={{ color: ACCENT_DK }} />
                <h4
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: MUTED }}
                >
                  Office Hours
                </h4>
              </div>
              <div className="space-y-2">
                {[
                  { day: "Mon - Fri", time: "9 AM - 7 PM", active: true },
                  { day: "Saturday", time: "10 AM - 5 PM", active: true },
                  { day: "Sunday", time: "Closed", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span
                      className="text-xs"
                      style={{ color: item.active ? MUTED : MUTED_FAINT }}
                    >
                      {item.day}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${item.active ? "border" : ""}`}
                      style={
                        item.active
                          ? { backgroundColor: ACCENT_SOFT, color: ACCENT_DK, borderColor: LINE }
                          : { backgroundColor: "#EFF3F8", color: MUTED, borderColor: LINE }
                      }
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className="relative isolate rounded-2xl p-5 border overflow-hidden transition-colors"
            style={{ backgroundColor: CARD, borderColor: LINE }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}20` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE }}
          >
            <div
              className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ backgroundColor: `${ACCENT}10` }}
            />
            <div className="relative z-10">
              <h4
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: MUTED }}
              >
                Quick Links
              </h4>
              <div className="space-y-1">
                {QUICK_LINKS.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center justify-between group py-1.5 px-2 -mx-2 rounded-lg transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = ACCENT_SOFT }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
                  >
                    <span
                      className="text-xs transition-colors"
                      style={{ color: MUTED }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = INK }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = MUTED }}
                    >
                      {link.label}
                    </span>
                    <ArrowRight
                      size={11}
                      className="transition-all"
                      style={{ color: MUTED_FAINT }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.transform = "translateX(2px)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = MUTED_FAINT; e.currentTarget.style.transform = "translateX(0)" }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Trusted Agency */}
          <div
            className="relative hidden md:block isolate rounded-2xl p-5 border overflow-hidden transition-colors"
            style={{ backgroundColor: CARD, borderColor: `${ACCENT}20` }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}30` }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${ACCENT}20` }}
          >
            <div
              className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3 pointer-events-none"
              style={{ backgroundColor: `${ACCENT}10` }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
                >
                  <ShieldCheck size={16} style={{ color: ACCENT_DK }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: ACCENT_DK }}>Trusted Agency</p>
                  <p className="text-[11px]" style={{ color: MUTED }}>Since 2020</p>
                </div>
              </div>
              <div className="space-y-2">
                {["Verified Listings", "Secure Deals", "Happy Clients"].map((tag, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: ACCENT_SOFT }}
                    >
                      <CheckCircle2 size={9} style={{ color: ACCENT_DK }} />
                    </div>
                    <span className="text-[11px]" style={{ color: MUTED }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FAQ SECTION ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${ACCENT}30, transparent)` }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: ACCENT }}
            >
              Common Questions
            </span>
            <div
              className="w-12 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${ACCENT}30, transparent)` }}
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: INK }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="relative isolate rounded-2xl p-6 border overflow-hidden transition-colors group"
              style={{ backgroundColor: CARD, borderColor: LINE }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ACCENT}20` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = LINE }}
            >
              <div
                className="hidden md:block absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ backgroundColor: `${ACCENT}10` }}
              />
              <div className="relative z-10">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
                >
                  <span className="font-bold text-sm" style={{ color: ACCENT_DK }}>{index + 1}</span>
                </div>
                <h3 className="text-base mb-2 leading-snug font-bold" style={{ color: INK }}>
                  {faq.q}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}