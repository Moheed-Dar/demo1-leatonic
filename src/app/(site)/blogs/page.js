"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllBlogs } from "@/lib/blogs/api";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Tag,
  ArrowUpRight,
  BookOpen,
  X,
  Grid3X3,
  List,
  RefreshCw,
  Newspaper,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// BLUE SCHEME (same as Properties page)
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

const BG_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
];

// ==========================================
// HELPERS
// ==========================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
};

const getPreview = (blog, len = 120) =>
  blog.excerpt ||
  (blog.content ? stripHtml(blog.content).slice(0, len) + "..." : null) ||
  "No preview available";

const getBlogImage = (blog) =>
  getSafeImage(blog.featuredImage) || getSafeImage(blog.image) || PLACEHOLDER;

// ==========================================
// SMALL UI PIECES
// ==========================================
const LightSelect = ({ value, onChange, options, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="w-full cursor-pointer appearance-none rounded-xl py-2.5 pl-4 pr-8 text-xs font-medium shadow-sm transition-all duration-200 hover:border-[#1D4ED8] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
      style={{
        backgroundColor: CARD,
        color: INK,
        border: `1px solid ${LINE}`,
        colorScheme: "light",
      }}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          style={{ backgroundColor: CARD, color: INK, padding: "8px 12px" }}
        >
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2.5}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      style={{ color: MUTED }}
    />
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

const CategoryButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
    style={
      isActive
        ? {
            backgroundColor: ACCENT,
            color: "#FFFFFF",
            border: `1px solid ${ACCENT}`,
            boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
          }
        : {
            backgroundColor: CARD,
            color: MUTED,
            border: `1px solid ${LINE}`,
          }
    }
  >
    {label}
  </button>
);

const SkeletonCard = () => (
  <div
    className="animate-pulse overflow-hidden rounded-2xl"
    style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
  >
    <div className="h-104" style={{ backgroundColor: LINE }} />
  </div>
);

const SkeletonList = () => (
  <div
    className="flex h-52 animate-pulse overflow-hidden rounded-2xl"
    style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
  >
    <div className="w-full" style={{ backgroundColor: LINE }} />
  </div>
);

// ==========================================
// MOTION VARIANTS
// ==========================================
const gridContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

// ==========================================
// GRID CARD
// ==========================================
const BlogCard = ({ blog, index = 0 }) => {
  const img = getBlogImage(blog);

  return (
    <motion.div
      variants={gridItemVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-104 cursor-pointer overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)] sm:h-108"
      style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
    >
      <Link href={`/blogs/${blog._id}`} className="relative block h-full w-full">
        <Image
          src={img}
          alt={blog.title || "Blog image"}
          fill
          priority={index < 3}
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.10) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.30) 0%, transparent 60%)",
          }}
        />

        {/* Top badges */}
        <div className="absolute left-4 right-4 top-4 z-10 flex items-start justify-between">
          <div className="flex flex-wrap gap-2">
            {blog.category && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
              >
                {blog.category}
              </span>
            )}
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              border: `1px solid ${LINE}`,
            }}
          >
            <BookOpen size={15} style={{ color: MUTED }} />
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {blog.createdAt && (
              <MetaPill icon={Calendar}>{formatDate(blog.createdAt)}</MetaPill>
            )}
            {blog.tags?.length > 0 && (
              <MetaPill icon={Tag}>{blog.tags.length}</MetaPill>
            )}
          </div>

          <h3 className="mb-1.5 line-clamp-2 text-xl font-semibold leading-tight text-white drop-shadow-lg">
            {blog.title}
          </h3>

          <p
            className="mb-4 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            {getPreview(blog)}
          </p>

          <div className="flex items-end justify-between">
            <div className="flex flex-wrap items-center gap-1.5">
              {blog.tags?.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    color: ACCENT_SOFT,
                    backgroundColor: "rgba(29,78,216,0.35)",
                    border: "1px solid rgba(147,197,253,0.30)",
                  }}
                >
                  {tag}
                </span>
              ))}
              {blog.tags?.length > 2 && (
                <span
                  className="text-[10px]"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  +{blog.tags.length - 2} more
                </span>
              )}
            </div>
            <div
              className="flex h-9 w-9 shrink-0 translate-y-2 items-center justify-center rounded-xl opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                backgroundColor: ACCENT,
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(29,78,216,0.50)",
              }}
            >
              <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ==========================================
// LIST CARD
// ==========================================
const BlogListItem = ({ blog }) => {
  const img = getBlogImage(blog);

  return (
    <motion.div
      variants={gridItemVariants}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-52 cursor-pointer overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)] sm:h-56"
      style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
    >
      <Link href={`/blogs/${blog._id}`} className="relative block h-full w-full">
        <Image
          src={img}
          alt={blog.title || "Blog image"}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)",
          }}
        />

        <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between">
          <div className="flex gap-1.5">
            {blog.category && (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
              >
                {blog.category}
              </span>
            )}
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              border: `1px solid ${LINE}`,
            }}
          >
            <ArrowUpRight size={14} style={{ color: MUTED }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <h3 className="mb-1 line-clamp-1 text-lg leading-tight text-white drop-shadow-lg">
            {blog.title}
          </h3>
          <p
            className="mb-1.5 line-clamp-1 text-xs"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            {getPreview(blog, 90)}
          </p>
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            <Calendar size={11} style={{ color: ACCENT_LT }} />
            <span>{formatDate(blog.createdAt)}</span>
            {blog.tags?.length > 0 && (
              <>
                <span style={{ color: "rgba(255,255,255,0.3)" }} className="mx-1">
                  ·
                </span>
                <Tag size={11} style={{ color: ACCENT_LT }} />
                <span className="truncate">
                  {blog.tags.slice(0, 2).join(", ")}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// ==========================================
// MAIN BLOGS PAGE
// ==========================================
export default function BlogsPage() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const headingRef = useRef(null);
  const controlsRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [status] = useState("published");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  // UI
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Dynamic categories
  const [availableCategories, setAvailableCategories] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // ==========================================
  // GSAP (guarded against null refs)
  // ==========================================
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (bgRef.current) {
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
      }
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
      if (controlsRef.current) {
        gsap.from(controlsRef.current, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: controlsRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const data = await getAllBlogs({
          limit: 100,
          status: "published",
          sortBy: "createdAt",
          order: "desc",
        });

        if (data.success && data.data) {
          const catSet = new Set();
          data.data.forEach((blog) => {
            if (blog.category && blog.category.trim()) {
              catSet.add(blog.category.trim());
            }
          });
          setAvailableCategories(Array.from(catSet).sort());
        }
      } catch (err) {
        console.error("Fetch categories error:", err);
        setAvailableCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // FETCH BLOGS
  // ==========================================
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllBlogs({
        page: currentPage,
        limit: 9,
        status: status,
        category: activeCategory || "",
        search: search,
        sortBy: sortBy,
        order: order,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch blogs");
      }

      setBlogs(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalBlogs(data.totalBlogs || 0);
      setHasNextPage(data.hasNextPage || false);
      setHasPrevPage(data.hasPrevPage || false);
    } catch (err) {
      console.error("Fetch blogs error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, activeCategory, status, sortBy, order]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ==========================================
  // SEARCH (debounced)
  // ==========================================
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setSearch((prev) => {
        if (prev !== searchInput) setCurrentPage(1);
        return searchInput;
      });
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setCurrentPage(1);
    searchInputRef.current?.focus();
  };

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat === "All" ? "" : cat);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const [by, ord] = e.target.value.split("-");
    setSortBy(by);
    setOrder(ord);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const clearAllFilters = () => {
    setSearch("");
    setSearchInput("");
    setActiveCategory("");
    setSortBy("createdAt");
    setOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(search || activeCategory);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
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

      {/* Hero */}
      <div className="relative z-20">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT_LT }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p
                className="inline-flex items-center gap-2 text-[13px] font-medium"
                style={{ color: ACCENT_SOFT }}
              >
                <Newspaper size={14} style={{ color: ACCENT_LT }} />
                Insights & articles
              </p>
            </div>

            <div ref={headingRef}>
              <h1
                className="mb-4 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-[48px]"
                style={{ color: "#FFFFFF" }}
              >
                Our Blogs
              </h1>
              <div
                className="mb-4 h-1 w-24 rounded-full sm:w-32"
                style={{ backgroundColor: ACCENT_LT }}
              />
              <p
                className="mb-8 max-w-xl text-[15px] leading-[1.65] sm:text-base"
                style={{ color: "rgba(219,234,254,0.75)" }}
              >
                Stay updated with the latest trends, tips, and stories from our
                experts — curated insights to inform and inspire.
              </p>
            </div>
          </div>

          {/* Search + Controls */}
          <div ref={controlsRef} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative min-w-70 flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <div
                    className="relative flex items-center rounded-2xl shadow-sm transition-all focus-within:border-[#1D4ED8] focus-within:ring-2 focus-within:ring-[#1D4ED8]/20"
                    style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
                  >
                    <Search
                      size={16}
                      className="absolute left-3.5"
                      style={{ color: MUTED }}
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search blogs by title, content, or tags..."
                      className="w-full bg-transparent py-3 pl-9 pr-20 text-sm focus:outline-none"
                      style={{ color: INK }}
                      autoComplete="off"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-12 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors hover:bg-[#0A1A2F]/10"
                        title="Clear search"
                      >
                        <X size={14} style={{ color: MUTED }} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl transition-transform hover:scale-105"
                      style={{
                        backgroundColor: ACCENT,
                        color: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                      }}
                      title="Search"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Count */}
              <motion.div
                key={totalBlogs}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${LINE}`,
                  color: INK,
                }}
              >
                {totalBlogs} {totalBlogs === 1 ? "blog" : "blogs"}
              </motion.div>

              {/* Refresh */}
              <button
                onClick={fetchBlogs}
                disabled={loading}
                className="shrink-0 rounded-xl p-2.5 transition-all hover:border-[#1D4ED8] hover:text-[#1D4ED8] disabled:opacity-40"
                style={{
                  backgroundColor: CARD,
                  border: `1px solid ${LINE}`,
                  color: MUTED,
                }}
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all"
                style={
                  showFilters || hasActiveFilters
                    ? {
                        backgroundColor: ACCENT,
                        color: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                      }
                    : {
                        backgroundColor: CARD,
                        color: MUTED,
                        border: `1px solid ${LINE}`,
                      }
                }
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>

              {/* View toggle */}
              <div
                className="flex shrink-0 items-center rounded-xl p-1"
                style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className="rounded-lg p-1.5 transition-colors"
                  style={
                    viewMode === "grid"
                      ? { backgroundColor: ACCENT, color: "#FFFFFF" }
                      : { color: MUTED }
                  }
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="rounded-lg p-1.5 transition-colors"
                  style={
                    viewMode === "list"
                      ? { backgroundColor: ACCENT, color: "#FFFFFF" }
                      : { color: MUTED }
                  }
                >
                  <List size={15} />
                </button>
              </div>

              {/* Sort */}
              <LightSelect
                className="w-36 shrink-0"
                value={`${sortBy}-${order}`}
                onChange={handleSortChange}
                options={SORT_OPTIONS}
              />
            </div>

            {/* Category filter panel */}
            <AnimatePresence initial={false}>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="rounded-2xl p-4 shadow-sm"
                    style={{
                      backgroundColor: `${CARD}F2`,
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: ACCENT_DK }}
                      >
                        Categories
                      </span>
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="text-xs underline underline-offset-2 transition-colors hover:text-[#1D4ED8]"
                          style={{ color: MUTED }}
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryButton
                        label="All"
                        isActive={!activeCategory}
                        onClick={() => handleCategoryChange("All")}
                      />
                      {!categoryLoading &&
                        availableCategories.map((cat) => (
                          <CategoryButton
                            key={cat}
                            label={cat}
                            isActive={activeCategory === cat}
                            onClick={() => handleCategoryChange(cat)}
                          />
                        ))}
                      {categoryLoading && (
                        <span className="px-3 py-2 text-xs" style={{ color: MUTED }}>
                          Loading categories...
                        </span>
                      )}
                      {!categoryLoading && availableCategories.length === 0 && (
                        <span className="px-3 py-2 text-xs" style={{ color: MUTED }}>
                          No categories available
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Loading */}
        {loading &&
          (viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonList key={i} />
              ))}
            </div>
          ))}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="max-w-md rounded-2xl p-8 text-center"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${LINE}`,
                boxShadow: "0 12px 30px -8px rgba(10,26,47,0.15)",
              }}
            >
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: ACCENT_SOFT }}
              >
                <X className="h-6 w-6" style={{ color: ACCENT_DK }} />
              </div>
              <p className="mb-2 text-lg font-semibold" style={{ color: INK }}>
                Failed to load blogs
              </p>
              <p className="mb-4 text-sm" style={{ color: MUTED }}>
                {error}
              </p>
              <button
                onClick={fetchBlogs}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
                style={{
                  backgroundColor: ACCENT,
                  color: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: ACCENT_SOFT }}
            >
              <BookOpen className="h-8 w-8" style={{ color: ACCENT }} />
            </div>
            <h3 className="mb-1 text-lg font-semibold" style={{ color: INK }}>
              No Blogs Found
            </h3>
            <p className="mb-6 text-sm" style={{ color: MUTED }}>
              {hasActiveFilters
                ? "Try adjusting your search or filters."
                : "No blogs published yet."}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:opacity-90"
                style={{
                  backgroundColor: ACCENT,
                  color: "#FFFFFF",
                  boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Grid view */}
        {!loading && !error && blogs.length > 0 && viewMode === "grid" && (
          <motion.div
            key={`grid-${currentPage}-${search}-${activeCategory}-${sortBy}-${order}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {blogs.map((blog, i) => (
              <BlogCard key={blog._id || i} blog={blog} index={i} />
            ))}
          </motion.div>
        )}

        {/* List view */}
        {!loading && !error && blogs.length > 0 && viewMode === "list" && (
          <motion.div
            key={`list-${currentPage}-${search}-${activeCategory}-${sortBy}-${order}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {blogs.map((blog, i) => (
              <BlogListItem key={blog._id || i} blog={blog} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={!hasPrevPage}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:border-[#1D4ED8] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                border: `1px solid ${LINE}`,
                backgroundColor: CARD,
                color: MUTED,
              }}
            >
              <ChevronLeft size={18} />
            </button>

            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors"
                style={
                  page === currentPage
                    ? {
                        backgroundColor: ACCENT,
                        color: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(29,78,216,0.40)",
                      }
                    : {
                        border: `1px solid ${LINE}`,
                        backgroundColor: CARD,
                        color: MUTED,
                      }
                }
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={!hasNextPage}
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:border-[#1D4ED8] hover:text-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                border: `1px solid ${LINE}`,
                backgroundColor: CARD,
                color: MUTED,
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}