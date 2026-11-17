"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Phone,
  Mail,
  BookOpen,
  CheckCircle2,
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import { downloadGuide } from "@/lib/guides/api";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ==========================================
// BLUE SCHEME — property.js / service page se same (green hata diya)
// Light modal: white panel + INK text + blue accents (service page cards jaisa)
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

/**
 * =============================================
 * REUSABLE GUIDE DOWNLOAD FORM
 * =============================================
 *
 * BUYER GUIDE:
 *   <GuideForm guideType="buyer" />
 *
 * SELLER GUIDE:
 *   <GuideForm guideType="seller" />
 *
 * CUSTOM TRIGGER:
 *   <GuideForm
 *     guideType="buyer"
 *     trigger={<button>Get Free Guide</button>}
 *   />
 *
 * CONTROLLED:
 *   <GuideForm
 *     guideType="seller"
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *   />
 * =============================================
 */
export default function GuideForm({
  guideType,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  className = "",
}) {
  // ---- Open State ----
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  // ---- Form State ----
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const nameRef = useRef(null);

  // ---- Guide Config ----
  const isBuyer = guideType === "buyer";
  const guideLabel = isBuyer ? "Buyer" : "Seller";
  const guideColor = ACCENT;

  // ---- Auto-focus ----
  useEffect(() => {
    if (isOpen && !submitted) {
      const t = setTimeout(() => nameRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen, submitted]);

  // ---- Reset form when modal closes ----
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm({ name: "", email: "", phone: "" });
        setSubmitted(false);
        setError("");
        setDownloadUrl(null);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ---- FIX SCROLLBAR ----
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ---- Handlers ----
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("All fields are required.");
      return;
    }

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        guideType: guideType,
      };

      const response = await downloadGuide(payload);

      setSubmitted(true);
      setDownloadUrl(response?.data?.downloadUrl);
      onSuccess?.(response?.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Download handler ----
  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setOpen(false), 1000);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* ---- TRIGGER ---- */}
      {trigger ? (
        <div onClick={() => setOpen(true)} className={className}>
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm cursor-pointer font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg ${className}`}
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LT})`,
            boxShadow: `0 10px 25px -5px ${ACCENT}40`,
          }}
        >
          <Download size={16} /> Download {guideLabel} Guide
        </button>
      )}

      {/* ---- MODAL ----
          createPortal (document.body) me render hota hai. Wajah: guide card
          ka motion.div pe Framer Motion "whileHover y:-6" lagata hai jis se
          ancestor pe ek "transform" aa jaata hai. Ek transform lagne se woh
          element "containing block" ban jaata hai, aur uske andar ka
          position:fixed modal viewport ke bajaye card ke andar trap ho
          jaata tha (card ka overflow-hidden use clip bhi karta tha) — is
          liye modal open hote hi band ho jaata tha. Portal se yeh fix. */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-9999 bg-black/70 rounded-2xl backdrop-blur-sm"
            onClick={() => !submitting && setOpen(false)}
          />

          {/* Panel wrapper */}
          <div className="fixed inset-0 z-10000 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            {/* Panel */}
            <div
              className="relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${LINE}`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ---- HEADER ---- */}
              <div
                className="relative px-6 pt-6 pb-12"
                style={{
                  background: `linear-gradient(to right, ${guideColor}18, ${guideColor}08, transparent)`,
                  borderBottom: `1px solid ${LINE}`,
                }}
              >
                {!submitting && !submitted && (
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1D4ED8]/10 transition-colors cursor-pointer"
                    style={{
                      backgroundColor: ACCENT_SOFT,
                    }}
                  >
                    <X size={16} style={{ color: ACCENT_DK }} />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: `${guideColor}18`,
                      border: `1px solid ${guideColor}30`,
                    }}
                  >
                    {submitted ? (
                      <CheckCircle2 size={18} style={{ color: guideColor }} />
                    ) : (
                      <BookOpen size={18} style={{ color: guideColor }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`text-lg ${playfair.variable} font-(family-name:--font-playfair)`}
                      style={{ color: INK }}
                    >
                      {submitted ? "Guide Ready!" : `${guideLabel} Guide`}
                    </h3>
                    <p className="text-xs truncate" style={{ color: ACCENT }}>
                      {submitted
                        ? "Your download is ready below"
                        : `Free ${guideLabel.toLowerCase()} resource`}
                    </p>
                  </div>
                </div>

                {!submitted && (
                  <p style={{ color: MUTED }} className="text-xs mt-1">
                    Fill in your details to get instant access to our comprehensive {guideLabel.toLowerCase()} guide.
                  </p>
                )}
              </div>

              {/* ---- BODY ---- */}
              <div className="relative px-6 pb-6 -mt-6">
                {/* Inner card bg */}
                <div
                  className="rounded-2xl shadow-lg p-5"
                  style={{
                    backgroundColor: PAPER,
                    border: `1px solid ${LINE}`,
                  }}
                >
                  {/* SUCCESS + DOWNLOAD */}
                  {submitted ? (
                    <div className="flex flex-col items-center py-8 gap-4">
                      {/* PDF Icon */}
                      <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                          backgroundColor: ACCENT_SOFT,
                          border: `1px solid ${LINE}`,
                        }}
                      >
                        <FileText size={32} style={{ color: ACCENT_DK }} />
                      </div>

                      <div className="text-center">
                        <h4
                          className={`text-lg mb-1 ${playfair.variable} font-(family-name:--font-playfair)`}
                          style={{ color: INK }}
                        >
                          {guideLabel} Guide PDF
                        </h4>
                        <p className="text-sm" style={{ color: MUTED }}>
                          Click below to download your free guide
                        </p>
                      </div>

                      {/* Download Button */}
                      {downloadUrl && (
                        <button
                          onClick={handleDownload}
                          className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 text-white text-sm font-bold rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LT})`,
                            boxShadow: `0 10px 25px -5px ${ACCENT}40`,
                          }}
                        >
                          <Download size={18} />
                          Download {guideLabel} Guide
                        </button>
                      )}

                      <button
                        onClick={() => setOpen(false)}
                        className="text-xs transition-colors cursor-pointer"
                        style={{ color: MUTED }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT_DK)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
                      >
                        Close
                      </button>
                    </div>
                  ) : (
                    /* ---- FORM ---- */
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      {/* Error */}
                      {error && (
                        <div
                          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs"
                          style={{
                            backgroundColor: "#FEF2F2",
                            border: "1px solid #FECACA",
                            color: "#DC2626",
                          }}
                        >
                          <X size={14} className="shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      {/* Name */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: MUTED }}
                        >
                          <User size={10} />
                          Full Name <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          ref={nameRef}
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: CARD,
                            border: `1px solid ${LINE}`,
                            color: INK,
                            colorScheme: "light",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}40`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: MUTED }}
                        >
                          <Mail size={10} />
                          Email Address <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter your email address"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: CARD,
                            border: `1px solid ${LINE}`,
                            color: INK,
                            colorScheme: "light",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}40`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: MUTED }}
                        >
                          <Phone size={10} />
                          Phone Number <span style={{ color: guideColor }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                          className="w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:border-transparent"
                          style={{
                            backgroundColor: CARD,
                            border: `1px solid ${LINE}`,
                            color: INK,
                            colorScheme: "light",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 2px ${guideColor}40`;
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>

                      {/* Guide Type Badge */}
                      <div
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: `${guideColor}08`,
                          border: `1px solid ${guideColor}15`,
                        }}
                      >
                        <FileText
                          size={14}
                          style={{ color: `${guideColor}` }}
                          className="shrink-0"
                        />
                        <span className="text-xs flex-1" style={{ color: MUTED }}>
                          {guideLabel} Guide — Free PDF Download
                        </span>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                          style={{
                            backgroundColor: guideColor,
                          }}
                        >
                          Free
                        </span>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_LT})`,
                          boxShadow: `0 10px 25px -5px ${ACCENT}40`,
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </>
                        ) : (
                          <>
                            <Download size={16} /> Get Free {guideLabel} Guide
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-center" style={{ color: MUTED }}>
                        We respect your privacy. No spam, ever.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}