"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { submitContact } from "@/lib/contact/api";

// ==========================================
// BLUE SCHEME — property.js / service page / GuideForm / contact.jsx se same
// (gold/cream poori tarah hata diya). Light theme: white card bg,
// INK text, blue (ACCENT) accents.
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

// Ink opacity helpers
const INK_05 = "#0A1A2F0D";
const INK_08 = "#0A1A2F14";
const INK_10 = "#0A1A2F1A";
const INK_20 = "#0A1A2F33";
const INK_30 = "#0A1A2F4D";
const INK_40 = "#0A1A2F66";
const INK_50 = "#0A1A2F80";
const INK_60 = "#0A1A2F99";
const INK_70 = "#0A1A2FB3";
const INK_80 = "#0A1A2FCC";

// Accent opacity helpers
const ACCENT_10 = "#1D4ED81A";
const ACCENT_15 = "#1D4ED826";
const ACCENT_20 = "#1D4ED833";
const ACCENT_25 = "#1D4ED840";
const ACCENT_30 = "#1D4ED84D";
const ACCENT_40 = "#1D4ED866";
const ACCENT_50 = "#1D4ED880";
const ACCENT_70 = "#1D4ED8B3";
const ACCENT_80 = "#1D4ED8CC";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [apiDown, setApiDown] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (apiDown) setApiDown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      setApiDown(false);
      const result = await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      if (result.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(result.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setApiDown(true);
        setError(
          "Service is temporarily unavailable. Please try again later or contact us directly via phone.",
        );
      } else {
        setError(
          err?.response?.data?.message ||
            "Network error. Please check your connection and try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Light-theme input: white bg, blue accent focus ring
  const inputClass = (hasError) =>
    `w-full px-4 py-3.5 bg-white border rounded-xl text-sm text-[#0A1A2F] placeholder-[#56697E]/50 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 focus:border-[#1D4ED8]/60 transition-all ${
      hasError ? "border-red-500/60" : "border-[#DCE3EE]"
    }`;

  return (
    <div className="transform-gpu will-change-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border"
          style={{ backgroundColor: ACCENT_15, borderColor: ACCENT_25 }}
        >
          <MessageSquare size={16} style={{ color: ACCENT_DK }} />
        </div>
        <div>
          <h2 className="text-lg font-playfair font-extrabold" style={{ color: INK }}>
            Send Us a Message
          </h2>
          <p className="text-xs mt-0.5" style={{ color: MUTED }}>
            We&apos;d love to hear from you
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="w-full h-px mb-6"
        style={{ background: `linear-gradient(to right, ${ACCENT_50}, ${ACCENT_20}, transparent)` }}
      />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-14"
          >
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center border"
                style={{ backgroundColor: ACCENT_15, borderColor: ACCENT_25 }}
              >
                <CheckCircle2 size={36} style={{ color: ACCENT_DK }} />
              </div>
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-bounce"
                style={{ backgroundColor: ACCENT }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3"
                  style={{ color: "#FFFFFF" }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl mt-5 mb-1.5 font-playfair font-extrabold" style={{ color: INK }}>
              Message Sent!
            </h3>
            <p className="text-sm text-center max-w-xs" style={{ color: MUTED }}>
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form key="form" onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: MUTED }}
              >
                <User size={10} /> Full Name <span style={{ color: ACCENT_DK }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className={inputClass(!!error && !form.name.trim())}
              />
            </div>

            {/* Email */}
            <div>
              <label
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: MUTED }}
              >
                <Mail size={10} /> Email <span style={{ color: ACCENT_DK }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className={inputClass(!!error && !form.email.trim())}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: MUTED }}
              >
                <Phone size={10} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Your Phone Number (Optional)"
                className={inputClass(false)}
              />
            </div>

            {/* Message */}
            <div>
              <label
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5"
                style={{ color: MUTED }}
              >
                <MessageSquare size={10} /> Message <span style={{ color: ACCENT_DK }}>*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Enter your message here..."
                className={`${inputClass(!!error && !form.message.trim())} resize-none`}
              />
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border ${
                    apiDown
                      ? "border-[#1D4ED8]/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                  style={
                    apiDown
                      ? { backgroundColor: ACCENT_10, borderColor: ACCENT_30 }
                      : undefined
                  }
                >
                  {apiDown ? (
                    <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: ACCENT_DK }} />
                  ) : (
                    <X size={14} className="shrink-0 mt-0.5 text-red-500" />
                  )}
                  <div className="flex-1">
                    <p
                      className="text-sm leading-relaxed"
                      style={apiDown ? { color: ACCENT_DK } : { color: "#B91C1C" }}
                    >
                      {error}
                    </p>
                    {apiDown && (
                      <p className="text-[11px] mt-1" style={{ color: MUTED }}>
                        Call us: <span style={{ color: ACCENT_DK }}>+12269325002</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button — blue gradient with white text */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex cursor-pointer items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg"
              style={{
                background: `linear-gradient(to right, ${ACCENT}, ${ACCENT_DK})`,
                color: "#FFFFFF",
                boxShadow: `0 8px 20px ${ACCENT}40`,
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send size={16} /> Send Message <ArrowRight size={14} style={{ color: "#FFFFFF", opacity: 0.9 }} />
                </>
              )}
            </button>

            <p className="text-center text-[10px] mt-2" style={{ color: MUTED }}>
              By submitting, you agree to our privacy policy.
            </p>
          </form>
        )}
      </AnimatePresence>
    </div>
  );
}