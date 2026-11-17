"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  Tag,
  LinkIcon,
  BookOpen,
  ChevronRight,
  Eye,
  Share2,
  X,
  CheckCircle2,
  Hash,
  Home,
  Newspaper,
} from "lucide-react";
import { getBlogById, getAllBlogs } from "@/lib/blogs/api";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// BLUE SCHEME (same as Properties / Blogs page)
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

const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1600&q=80";

// Fallback avatar (used when no logged-in user picture is found)
const DEFAULT_FACE_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";

// Alpha tint helpers (8-digit hex = RGB + alpha)
const accentTint = (a) => `${ACCENT}${a}`;
const inkTint = (a) => `${INK}${a}`;

const CARD_STYLE = {
  backgroundColor: CARD,
  border: `1px solid ${LINE}`,
  boxShadow: "0 2px 12px rgba(10,26,47,0.05)",
};

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

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
// AUTH USER — logged-in user's name + Google avatar
// ============================================
const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const candidateKeys = [
      "user",
      "token",
      "auth_token",
      "access_token",
      "auth",
      "session",
    ];
    for (const key of candidateKeys) {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!raw) continue;
      try {
        const u = JSON.parse(raw);
        if (u && typeof u === "object") {
          const name =
            u.name ||
            u.fullName ||
            u.displayName ||
            u.username ||
            (u.email ? u.email.split("@")[0] : null);
          const avatar =
            u.picture ||
            u.avatar ||
            u.photoURL ||
            u.image ||
            u.profilePicture ||
            u.profile_image ||
            null;
          const email = u.email || null;
          if (name || avatar || email) return { name, avatar, email };
        }
      } catch {
        // not JSON — skip
      }
    }
    return null;
  } catch {
    return null;
  }
};

// ============================================
// SOCIAL SVG ICONS
// ============================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 22.267.792 23 1.771 23h20.451C23.208 23 24 22.267 24 21.271V1.729C24 .774 23.208 0 22.222 0h.003z" />
  </svg>
);

// ============================================
// TOAST
// ============================================
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-semibold shadow-2xl"
      style={{
        backgroundColor: ACCENT,
        color: "#FFFFFF",
        boxShadow: "0 10px 30px rgba(29,78,216,0.45)",
      }}
    >
      ✓ {message}
    </div>
  );
};

// ============================================
// SMALL UI PIECES
// ============================================
const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionLabel = ({ children }) => (
  <div className="mb-5 flex items-center gap-3">
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: ACCENT }}
    />
    <span
      className="text-[10px] font-bold uppercase tracking-[0.25em]"
      style={{ color: ACCENT_DK }}
    >
      {children}
    </span>
    <div
      className="h-px flex-1"
      style={{
        background: `linear-gradient(to right, ${LINE}, transparent)`,
      }}
    />
  </div>
);

const CardTitle = ({ children }) => (
  <div className="mb-5">
    <h3 className="text-lg font-semibold sm:text-xl" style={{ color: INK }}>
      {children}
    </h3>
    <div
      className="mt-2 h-1 w-12 rounded-full"
      style={{ backgroundColor: ACCENT }}
    />
  </div>
);

const SidebarLabel = ({ children }) => (
  <h4
    className="mb-3 text-[9px] font-bold uppercase tracking-[0.25em]"
    style={{ color: ACCENT_DK }}
  >
    {children}
  </h4>
);

const InfoRow = ({ icon: Icon, label, value, last = false }) => (
  <div
    className="flex items-center justify-between py-2.5 text-xs sm:text-sm"
    style={last ? undefined : { borderBottom: `1px solid ${LINE}` }}
  >
    <span className="flex items-center gap-2" style={{ color: MUTED }}>
      <Icon size={12} style={{ color: ACCENT }} />
      {label}
    </span>
    <span className="font-semibold" style={{ color: INK }}>
      {value}
    </span>
  </div>
);

const MetaPill = ({ icon: Icon, children }) => (
  <div
    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 backdrop-blur-md"
    style={{
      backgroundColor: "rgba(10,26,47,0.45)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <Icon size={12} style={{ color: ACCENT_LT }} />
    <span className="text-xs font-semibold text-white">{children}</span>
  </div>
);

const ShareBtn = ({ href, onClick, children, title }) => {
  const cls =
    "flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:-translate-y-0.5 hover:border-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white sm:h-11 sm:w-11";
  const style = {
    backgroundColor: ACCENT_SOFT,
    color: ACCENT_DK,
    border: `1px solid ${LINE}`,
  };
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        style={style}
        title={title}
      >
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cls} style={style} title={title}>
      {children}
    </button>
  );
};

// ============================================
// MAIN BLOG DETAIL PAGE
// ============================================
export default function BlogDetailPage() {
  const { id } = useParams();

  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [authUser, setAuthUser] = useState(null);

  const [toast, setToast] = useState({ message: "", visible: false });
  const showToast = (msg) => setToast({ message: msg, visible: true });
  const hideToast = () => setToast({ message: "", visible: false });

  // Logged-in user
  useEffect(() => {
    setAuthUser(getAuthUser());
  }, []);

  // Fetch blog by id
  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getBlogById(id);
        setBlog(res?.data || res);
      } catch (err) {
        setError(err.message || "Blog not found or removed");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // Fetch recent blogs
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAllBlogs({
          limit: 4,
          status: "published",
          sortBy: "createdAt",
          order: "desc",
        });
        if (data.success) {
          const filtered = (data.data || []).filter((b) => b._id !== id);
          setRecentBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Fetch recent blogs error:", err);
      }
    };
    if (id) fetchRecent();
  }, [id]);

  // GSAP parallax background (guarded against null refs)
  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 22,
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
  }, [loading, blog]);

  // Share
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "Blog Post";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: `Check out: ${blog?.title}`,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      copyToClipboard();
    }
  };

  // Helpers
  const formatDateShort = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getReadTime = (content) => {
    if (!content) return "1 min read";
    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const blogImageUrl = blog
    ? getSafeImage(blog.featuredImage) || getSafeImage(blog.image) || null
    : null;
  const decodedContent = blog ? decodeHtml(blog.content) : "";

  const authName = authUser?.name || blog?.author?.name || "Author";
  const authEmail = authUser?.email || blog?.author?.email || null;
  const authAvatar =
    authUser?.avatar ||
    getSafeImage(blog?.author?.avatar) ||
    DEFAULT_FACE_AVATAR;

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: PAPER }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className="h-14 w-14 animate-spin rounded-full border-2"
              style={{
                borderColor: accentTint("25"),
                borderTopColor: ACCENT,
              }}
            />
            <Newspaper
              size={16}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: ACCENT }}
            />
          </div>
          <p
            className="text-sm uppercase tracking-[0.2em]"
            style={{ color: MUTED }}
          >
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error || !blog) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: PAPER }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: ACCENT_SOFT, border: `1px solid ${LINE}` }}
        >
          <X size={32} style={{ color: ACCENT_DK }} />
        </div>
        <h2 className="text-xl font-semibold" style={{ color: INK }}>
          Blog Not Found
        </h2>
        <p className="max-w-sm text-center text-sm" style={{ color: MUTED }}>
          {error ||
            "The blog you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href="/blogs"
          className="mt-2 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{
            backgroundColor: ACCENT,
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
          }}
        >
          <ArrowLeft size={16} /> Browse Blogs
        </Link>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      {/* Parallax background */}
      <div
        ref={bgRef}
        className="pointer-events-none fixed inset-0 z-0 will-change-transform"
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
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${INK}E6 0%, ${INK}CC 15%, ${INK}80 30%, ${INK}33 45%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${PAPER}F2 0%, ${PAPER}CC 20%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 90% 8%, rgba(29,78,216,0.30) 0%, rgba(29,78,216,0.08) 25%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 10% 35%, rgba(147,197,253,0.10) 0%, transparent 35%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ============================== */}
      {/* TOP: BREADCRUMB + HERO CARD */}
      {/* ============================== */}
      <section className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-28 sm:px-6 sm:pt-32">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 backdrop-blur-md sm:gap-2.5 sm:rounded-2xl sm:px-5 sm:py-3"
            style={{
              backgroundColor: "rgba(10,26,47,0.45)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Link
              href="/"
              className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-white/80 transition-colors hover:text-white sm:text-sm"
            >
              <Home size={13} className="shrink-0" style={{ color: ACCENT_LT }} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight size={12} className="shrink-0 text-white/40" />
            <Link
              href="/blogs"
              className="shrink-0 text-xs font-medium text-white/80 transition-colors hover:text-white sm:text-sm"
            >
              Blogs
            </Link>
            <ChevronRight size={12} className="shrink-0 text-white/40" />
            {blog.category && (
              <>
                <Link
                  href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="shrink-0 text-xs font-medium text-white/80 transition-colors hover:text-white sm:text-sm"
                >
                  {blog.category}
                </Link>
                <ChevronRight size={12} className="shrink-0 text-white/40" />
              </>
            )}
            <span
              className="truncate text-xs font-semibold sm:text-sm"
              style={{ color: ACCENT_LT }}
            >
              {blog.title}
            </span>
          </motion.nav>

          {/* Hero cover card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-90 w-full overflow-hidden rounded-3xl sm:h-110 lg:h-130"
            style={{
              border: `1px solid ${LINE}`,
              boxShadow: "0 30px 60px -20px rgba(10,26,47,0.40)",
            }}
          >
            {blogImageUrl ? (
              <Image
                src={blogImageUrl}
                alt={blog.title || "Blog cover"}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                unoptimized
              />
            ) : (
              <Image
                src={PLACEHOLDER}
                alt={blog.title || "Blog cover"}
                fill
                className="object-cover"
                priority
                sizes="100vw"
                unoptimized
              />
            )}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.12) 100%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(10,26,47,0.35) 0%, transparent 60%)",
              }}
            />

            {/* Top row */}
            <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between sm:left-6 sm:right-6 sm:top-6">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold backdrop-blur-md transition-transform hover:scale-105"
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: INK,
                  border: `1px solid ${LINE}`,
                }}
              >
                <ArrowLeft size={14} />
                Back
              </Link>
              <button
                onClick={handleShare}
                className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110"
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  border: `1px solid ${LINE}`,
                }}
                title="Share"
              >
                <Share2 size={15} style={{ color: MUTED }} />
              </button>
            </div>

            {/* Bottom content */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-8 lg:p-10">
              {blog.category && (
                <span
                  className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:text-xs"
                  style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                >
                  <Tag size={11} />
                  {blog.category}
                </span>
              )}

              <h1 className="mb-3 max-w-4xl text-2xl font-semibold leading-[1.15] tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p
                  className="mb-5 line-clamp-2 max-w-2xl text-sm leading-relaxed sm:text-base"
                  style={{ color: "rgba(255,255,255,0.80)" }}
                >
                  {blog.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div
                  className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-3 backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(10,26,47,0.45)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div
                    className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full"
                    style={{ border: `2px solid ${ACCENT_LT}` }}
                  >
                    <Image
                      src={authAvatar}
                      alt={authName}
                      fill
                      unoptimized
                      className="rounded-full object-cover"
                      sizes="28px"
                    />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    {authName}
                  </span>
                </div>
                <MetaPill icon={Calendar}>
                  {formatDateShort(blog.createdAt)}
                </MetaPill>
                <MetaPill icon={Clock}>
                  {blog.readTime || getReadTime(blog.content)}
                </MetaPill>
                {blog.viewsCount > 0 && (
                  <MetaPill icon={Eye}>{blog.viewsCount} views</MetaPill>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ===== LEFT COLUMN ===== */}
          <div className="space-y-5 sm:space-y-6 lg:col-span-2">
            {/* Headers */}
            {blog.headers && blog.headers.length > 0 && (
              <div className="space-y-4 sm:space-y-5">
                {blog.headers.map((header, index) => (
                  <Reveal key={index} delay={0.05}>
                    <div
                      className="rounded-2xl p-4 sm:p-5 lg:p-6"
                      style={CARD_STYLE}
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: ACCENT_SOFT,
                            border: `1px solid ${LINE}`,
                          }}
                        >
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: ACCENT_DK }}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <h2
                          className={`font-semibold tracking-tight ${
                            header.headerType === "h2"
                              ? "text-lg sm:text-xl lg:text-2xl"
                              : header.headerType === "h3"
                              ? "text-base sm:text-lg lg:text-xl"
                              : "text-sm sm:text-base lg:text-lg"
                          }`}
                          style={{ color: INK }}
                        >
                          {header.title}
                        </h2>
                      </div>

                      {header.image && getSafeImage(header.image) && (
                        <div
                          className="relative mb-4 h-52 w-full overflow-hidden rounded-xl sm:h-72"
                          style={{
                            backgroundColor: ACCENT_SOFT,
                            border: `1px solid ${LINE}`,
                          }}
                        >
                          <Image
                            src={getSafeImage(header.image)}
                            alt={header.title || "Section image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            unoptimized
                          />
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(10,26,47,0.25), transparent)",
                            }}
                          />
                        </div>
                      )}

                      {header.description && (
                        <div
                          className="text-sm leading-[1.9] sm:text-[15px]
                                     [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
                                     [&_a]:text-[#1D4ED8] [&_a]:underline
                                     [&_b]:text-[#0A1A2F] [&_strong]:text-[#0A1A2F]"
                          style={{ color: MUTED }}
                          dangerouslySetInnerHTML={{
                            __html: decodeHtml(header.description),
                          }}
                        />
                      )}
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Article content */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl p-4 sm:p-6 lg:p-8" style={CARD_STYLE}>
                <SectionLabel>Article</SectionLabel>

                <div
                  className="max-h-[70vh] max-w-none overflow-y-auto pr-2 text-sm leading-[1.9] sm:text-[15px]
                             [&_p]:my-3
                             [&_div]:my-3
                             [&_h1]:my-4 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-[#0A1A2F]
                             [&_h2]:my-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[#0A1A2F]
                             [&_h3]:my-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[#0A1A2F]
                             [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6
                             [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6
                             [&_li]:my-1 [&_li]:ml-2
                             [&_blockquote]:border-l-4 [&_blockquote]:border-[#1D4ED8] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#56697E]
                             [&_a]:text-[#1D4ED8] [&_a]:underline
                             [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl"
                  style={{
                    color: MUTED,
                    scrollbarWidth: "thin",
                    scrollbarColor: `${ACCENT}50 transparent`,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: decodedContent || "<p>No content available.</p>",
                  }}
                />
              </div>
            </Reveal>

            {/* Key points */}
            {blog.points && blog.points.length > 0 && (
              <Reveal delay={0.1}>
                <div
                  className="rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={CARD_STYLE}
                >
                  <SectionLabel>Key Highlights</SectionLabel>
                  <CardTitle>Key Points</CardTitle>

                  <div className="space-y-4">
                    {[...blog.points]
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((point, index, arr) => (
                        <div key={index}>
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: ACCENT,
                                boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                              }}
                            >
                              <span className="text-xs font-bold text-white">
                                {index + 1}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4
                                className="mb-1 text-sm font-semibold leading-snug sm:text-base"
                                style={{ color: INK }}
                              >
                                {point.title}
                              </h4>
                              {point.description && (
                                <p
                                  className="text-xs leading-relaxed sm:text-sm"
                                  style={{ color: MUTED }}
                                >
                                  {point.description}
                                </p>
                              )}
                            </div>
                          </div>
                          {index < arr.length - 1 && (
                            <div className="mt-4 pl-11 sm:pl-12">
                              <div
                                className="h-px"
                                style={{
                                  background: `linear-gradient(to right, ${accentTint("25")}, ${LINE}, transparent)`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <Reveal delay={0.1}>
                <div
                  className="rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={CARD_STYLE}
                >
                  <CardTitle>Tags</CardTitle>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {blog.tags.map((tag, i) => (
                      <Link
                        key={i}
                        href={`/blogs?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors hover:border-[#1D4ED8] hover:bg-[#DBEAFE] sm:text-sm"
                        style={{
                          color: ACCENT_DK,
                          backgroundColor: PAPER,
                          border: `1px solid ${LINE}`,
                        }}
                      >
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{ backgroundColor: ACCENT_SOFT }}
                        >
                          <Hash size={10} style={{ color: ACCENT }} />
                        </span>
                        <span className="capitalize">{tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}

            {/* Share */}
            <Reveal delay={0.1}>
              <div
                className="rounded-2xl p-4 sm:p-6 lg:p-7"
                style={CARD_STYLE}
              >
                <CardTitle>Share This Article</CardTitle>
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <ShareBtn
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    title="Share on Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </ShareBtn>
                  <ShareBtn
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    title="Share on X"
                  >
                    <TwitterIcon className="h-4 w-4" />
                  </ShareBtn>
                  <ShareBtn
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    title="Share on LinkedIn"
                  >
                    <LinkedinIcon className="h-4 w-4" />
                  </ShareBtn>
                  <ShareBtn onClick={copyToClipboard} title="Copy link">
                    <LinkIcon className="h-4 w-4" />
                  </ShareBtn>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* Author */}
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl" style={CARD_STYLE}>
                  <div
                    className="px-4 py-5 sm:px-5 lg:px-6"
                    style={{
                      background: `linear-gradient(to right, ${accentTint("14")}, ${accentTint("08")}, transparent)`,
                      borderBottom: `1px solid ${LINE}`,
                    }}
                  >
                    <SidebarLabel>About the Author</SidebarLabel>
                    <div className="flex items-center gap-3">
                      <div
                        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full"
                        style={{
                          backgroundColor: ACCENT_SOFT,
                          border: `2px solid ${ACCENT_LT}`,
                          boxShadow: "0 4px 12px rgba(10,26,47,0.20)",
                        }}
                      >
                        <Image
                          src={authAvatar}
                          alt={authName}
                          fill
                          unoptimized
                          className="rounded-full object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="truncate text-sm font-semibold"
                          style={{ color: INK }}
                        >
                          {authName}
                        </p>
                        <div
                          className="my-1 h-0.5 w-8 rounded-full"
                          style={{ backgroundColor: ACCENT }}
                        />
                        {authEmail && (
                          <p
                            className="truncate text-[11px] sm:text-xs"
                            style={{ color: MUTED }}
                          >
                            {authEmail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <p
                      className="text-xs leading-relaxed sm:text-sm"
                      style={{ color: MUTED }}
                    >
                      Contributing writer sharing insights and expertise on{" "}
                      <span className="font-semibold" style={{ color: ACCENT_DK }}>
                        {blog.category || "various topics"}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Article info */}
              <Reveal delay={0.15}>
                <div className="rounded-2xl p-4 sm:p-5" style={CARD_STYLE}>
                  <SidebarLabel>Article Info</SidebarLabel>
                  <div>
                    <InfoRow
                      icon={Calendar}
                      label="Published"
                      value={formatDateShort(blog.createdAt)}
                    />
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <InfoRow
                        icon={Clock}
                        label="Updated"
                        value={formatDateShort(blog.updatedAt)}
                      />
                    )}
                    <InfoRow
                      icon={Clock}
                      label="Read Time"
                      value={blog.readTime || getReadTime(blog.content)}
                      last={!(blog.viewsCount > 0) && !blog.tags?.length}
                    />
                    {blog.viewsCount > 0 && (
                      <InfoRow
                        icon={Eye}
                        label="Views"
                        value={blog.viewsCount}
                        last={!blog.tags?.length}
                      />
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <InfoRow
                        icon={Hash}
                        label="Tags"
                        value={`${blog.tags.length} tags`}
                        last
                      />
                    )}
                  </div>
                </div>
              </Reveal>

              {/* Tags cloud */}
              {blog.tags && blog.tags.length > 0 && (
                <Reveal delay={0.2}>
                  <div className="rounded-2xl p-4 sm:p-5" style={CARD_STYLE}>
                    <SidebarLabel>Tags</SidebarLabel>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {blog.tags.map((tag, i) => (
                        <Link
                          key={i}
                          href={`/blogs?search=${encodeURIComponent(tag)}`}
                          className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors hover:border-[#1D4ED8] hover:bg-[#DBEAFE] hover:text-[#1E3A8A]"
                          style={{
                            color: MUTED,
                            backgroundColor: PAPER,
                            border: `1px solid ${LINE}`,
                          }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Recent blogs */}
              {recentBlogs.length > 0 && (
                <Reveal delay={0.25}>
                  <div className="rounded-2xl p-4 sm:p-5" style={CARD_STYLE}>
                    <SidebarLabel>Recent Blogs</SidebarLabel>
                    <div className="space-y-3">
                      {recentBlogs.map((recent) => {
                        const recImg =
                          getSafeImage(recent.featuredImage) ||
                          getSafeImage(recent.image) ||
                          null;
                        return (
                          <Link
                            key={recent._id}
                            href={`/blogs/${recent._id}`}
                            className="group block"
                          >
                            <div className="flex gap-3">
                              <div
                                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                                style={{
                                  backgroundColor: ACCENT_SOFT,
                                  border: `1px solid ${LINE}`,
                                }}
                              >
                                {recImg ? (
                                  <Image
                                    src={recImg}
                                    alt={recent.title || "Recent blog"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="64px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <BookOpen size={16} style={{ color: ACCENT }} />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h5
                                  className="line-clamp-2 text-xs font-semibold transition-colors group-hover:text-[#1D4ED8]"
                                  style={{ color: INK }}
                                >
                                  {recent.title}
                                </h5>
                                <p
                                  className="mt-1 flex items-center gap-1 text-[11px]"
                                  style={{ color: MUTED }}
                                >
                                  <Calendar size={10} style={{ color: ACCENT }} />
                                  {formatDateShort(recent.createdAt)}
                                  <ArrowUpRight
                                    size={11}
                                    className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
                                    style={{ color: ACCENT }}
                                  />
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Verified */}
              <Reveal delay={0.3}>
                <div
                  className="flex items-center gap-3 rounded-2xl p-4 sm:p-5"
                  style={CARD_STYLE}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: ACCENT_SOFT,
                      border: `1px solid ${accentTint("30")}`,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold sm:text-sm"
                      style={{ color: INK }}
                    >
                      Verified Content
                    </p>
                    <p className="text-[11px] sm:text-xs" style={{ color: MUTED }}>
                      This article is fact-checked and reviewed.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}