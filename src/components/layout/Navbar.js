"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import FullscreenMenu from "@/components/ui/FullscreenMenu";
import { CONTACT_INFO } from "@/lib/constants";

// ============================================
// BLUE SCHEME — matches Hero / About / Testimonials
// Navbar is transparent over the dark hero at top,
// fills with INK surface once you scroll.
// ============================================
const INK = "#0A1A2F";
const PAPER = "#F3F6FB";
const ACCENT = "#1D4ED8";
const ACCENT_SOFT = "#DBEAFE";
const LINE = "rgba(255,255,255,0.14)";

// ============================================
// WORDMARK — text + simple mark, no placeholder image
// ============================================
const Wordmark = ({ onClick }) => (
  <Link
    href="/"
    onClick={onClick}
    className="group inline-flex items-center gap-2.5"
    aria-label="Estate — home"
  >
    {/* Simple glyph — a house-roof mark in one solid color */}
    <span
      className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
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
      className="text-[18px] font-semibold tracking-[-0.01em] transition-colors"
      style={{ color: "#FFFFFF" }}
    >
      Leatoinc
    </span>
  </Link>
);

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-999 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? `${INK}E6` : "transparent",
          borderBottom: scrolled ? `1px solid ${LINE}` : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          {/* ===== LEFT : WORDMARK ===== */}
          <Wordmark onClick={() => setIsMenuOpen(false)} />

          {/* ===== RIGHT ===== */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Phone — desktop only */}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="hidden md:inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-[#93C5FD]"
              style={{ color: "#DBEAFE" }}
            >
              <Phone size={15} style={{ color: ACCENT_SOFT }} />
              <span className="tabular-nums tracking-wide">
                {CONTACT_INFO.phone}
              </span>
            </a>

            {/* Hairline divider — desktop only */}
            <span
              className="hidden md:block h-5 w-px"
              style={{ backgroundColor: LINE }}
            />

            {/* Let's Talk — desktop only */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: scrolled ? `${ACCENT}1A` : "rgba(29,78,216,0.18)",
                border: `1px solid ${scrolled ? `${ACCENT}40` : "rgba(147,197,253,0.35)"}`,
                color: "#DBEAFE",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT_SOFT }} />
              Book a call
            </Link>

            {/* Menu button — always visible */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex cursor-pointer  items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: isMenuOpen ? "#FFFFFF" : "rgba(255,255,255,0.10)",
                border: `1px solid ${isMenuOpen ? "#FFFFFF" : LINE}`,
                color: "#FFFFFF",
              }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="hidden  sm:inline">
                {isMenuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
        </nav>
      </header>

      <FullscreenMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}