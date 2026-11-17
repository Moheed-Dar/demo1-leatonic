"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  Grid3X3,
  List,
  X,
  ArrowUpRight,
  Building2,
  Crown,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Inter } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ==========================================
// BLUE SCHEME
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

const PROPERTY_TYPES = [
  "all",
  "house",
  "apartment",
  "villa",
  "penthouse",
  "plot",
  "commercial",
  "flat",
  "studio",
];

const PRICE_TYPES = [
  { value: "", label: "All Types" },
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First" },
  { value: "price", label: "Price: Low to High" },
  { value: "title", label: "Name: A to Z" },
  { value: "viewsCount", label: "Most Viewed" },
];

const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

const getStatusStyles = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "sold":
      return "bg-red-50 text-red-700 border border-red-200";
    case "rented":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "reserved":
      return "bg-purple-50 text-purple-700 border border-purple-200";
    case "under construction":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "off plan":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "new":
      return "bg-teal-50 text-teal-700 border border-teal-200";
    default:
      return "bg-blue-50 text-blue-700 border border-blue-200";
  }
};

const getStatusDotColor = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available": return "bg-emerald-500";
    case "sold": return "bg-red-500";
    case "rented": return "bg-amber-500";
    case "pending": return "bg-yellow-500";
    case "reserved": return "bg-purple-500";
    case "under construction": return "bg-sky-500";
    case "off plan": return "bg-indigo-500";
    case "new": return "bg-teal-500";
    default: return "bg-blue-500";
  }
};

const HighlightText = ({ text, query }) => {
  if (!query || !query.trim() || !text) return <>{text}</>;
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;

  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = words.some((w) => part.toLowerCase() === w.toLowerCase());
        return isMatch ? (
          <span key={i} style={{ color: ACCENT_DK }} className="font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
};

const LightSelect = ({ value, onChange, options, className = "" }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className="appearance-none w-full pl-4 pr-8 py-2.5 text-xs font-medium rounded-xl focus:outline-none transition-all duration-200 cursor-pointer shadow-sm hover:border-[#1D4ED8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#1D4ED8]/20"
      style={{
        backgroundColor: CARD,
        color: INK,
        borderColor: LINE,
        colorScheme: "light",
      }}
    >
      {options}
    </select>
    <ChevronDown
      size={14}
      strokeWidth={2.5}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: MUTED }}
    />
  </div>
);

const StatPill = ({ icon: Icon, value }) => (
  <div
    className="flex items-center gap-1.5 px-2.5 py-1.5 backdrop-blur-md rounded-lg"
    style={{
      backgroundColor: "rgba(10,26,47,0.45)",
      border: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <Icon size={12} style={{ color: ACCENT_LT }} />
    <span className="text-white text-xs font-semibold">{value}</span>
  </div>
);

const PriceText = ({ currency, price }) => (
  <p
    className="text-2xl leading-none font-inter"
    style={{
      background: `linear-gradient(to right, ${ACCENT_LT}, ${ACCENT})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {currency === "PKR" ? "Rs" : "$"} {Number(price)?.toLocaleString()}
  </p>
);

export default function PropertiesPage() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const controlsRef = useRef(null);

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceType, setPriceType] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 9;

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const fetchProperties = async (pageNum = page) => {
    try {
      setLoading(true);
      let url = `/api/properties/get-all?page=${pageNum}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (priceType) url += `&priceType=${priceType}`;
      if (propertyType && propertyType !== "all") url += `&propertyType=${propertyType}`;

      const res = await axios.get(url);

      const raw = res.data;
      const list =
        raw?.data ||
        raw?.properties ||
        raw?.results ||
        (Array.isArray(raw) ? raw : []);

      setProperties(Array.isArray(list) ? list : []);
      setPagination(raw?.pagination || null);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyType, priceType, sortBy, sortOrder]);

  // ============================================
  // GSAP — guarded against null refs (fixes "Invalid scope")
  // ============================================
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

  const matchProperty = useCallback((p, words) => {
    const title = (p.title || "").toLowerCase();
    const location = (p.location || p.city || "").toLowerCase();
    const code = (p.propertyCode || "").toLowerCase();
    return words.every(
      (word) => title.includes(word) || location.includes(word) || code.includes(word)
    );
  }, []);

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties;
    const searchWords = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (searchWords.length === 0) return properties;
    return properties.filter((p) => matchProperty(p, searchWords));
  }, [properties, search, matchProperty]);

  const suggestions = useMemo(() => {
    if (!searchInput.trim()) return [];
    const words = searchInput.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return properties.filter((p) => matchProperty(p, words)).slice(0, 5);
  }, [searchInput, properties, matchProperty]);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        searchInputRef.current && !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setShowSuggestions(false);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  const handleSuggestionClick = () => setShowSuggestions(false);

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasActiveFilters = propertyType !== "all" || priceType || search;

  const clearAllFilters = () => {
    setPropertyType("all");
    setPriceType("");
    setSearch("");
    setSearchInput("");
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const handleRefresh = () => fetchProperties(page);

  // === FIX: h-[26rem] (was invalid h-26rem) ===
  const SkeletonCard = () => (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
    >
      <div className="h-104" style={{ backgroundColor: LINE }} />
      <div className="p-5 space-y-3">
        <div className="h-5 rounded w-3/4" style={{ backgroundColor: LINE }} />
        <div className="h-3 rounded w-1/2" style={{ backgroundColor: LINE }} />
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div
      className="rounded-2xl overflow-hidden animate-pulse flex h-48"
      style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
    >
      <div className="w-56 shrink-0" style={{ backgroundColor: LINE }} />
      <div className="p-5 flex-1 space-y-3">
        <div className="h-5 rounded w-2/3" style={{ backgroundColor: LINE }} />
        <div className="h-3 rounded w-1/3" style={{ backgroundColor: LINE }} />
      </div>
    </div>
  );

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

  // ===== GRID CARD =====
  const PropertyCard = ({ property, index = 0 }) => {
    const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <motion.div
        variants={gridItemVariants}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        // === FIX: h-[26rem] sm:h-[27rem] (was invalid h-26rem sm:h-27rem) ===
       className="group relative h-104 sm:h-108 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)]"
        style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
      >
        <Link href={`/properties/${property._id}`} className="block h-full w-full relative">
          <Image
            src={img}
            alt={property.title || "Property"}
            fill
            priority={index < 3}
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* === FIX: bg-gradient-to-t (was bg-linear-to-t) === */}
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />
          <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-transparent pointer-events-none" />

          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex flex-wrap gap-2">
              {property.isFeatured && (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 backdrop-blur-md text-[10px] font-bold rounded-full uppercase tracking-wider"
                  style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                >
                  <Crown size={9} style={{ fill: "#FFFFFF" }} />
                  Featured
                </span>
              )}
              <span
                className="inline-flex items-center px-2.5 py-1 backdrop-blur-md text-[10px] font-bold rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: INK,
                  border: `1px solid ${LINE}`,
                }}
              >
                {property.priceType}
              </span>
            </div>
            <button
              onClick={(e) => toggleLike(property._id, e)}
              className="w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110"
              style={{
                backgroundColor: "rgba(255,255,255,0.92)",
                border: `1px solid ${LINE}`,
              }}
            >
              <Heart
                size={15}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
                style={!isLiked ? { color: MUTED } : undefined}
              />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
            <div className="flex items-center gap-3 mb-3">
              {property.bedrooms > 0 && <StatPill icon={Bed} value={property.bedrooms} />}
              {property.bathrooms > 0 && <StatPill icon={Bath} value={property.bathrooms} />}
              {(property.areaSize || property.area) > 0 && (
                <StatPill
                  icon={Maximize}
                  value={`${property.areaSize || property.area} ${property.areaUnit || "sqft"}`}
                />
              )}
            </div>

            <h3 className="text-xl text-white mb-1.5 leading-tight line-clamp-1 drop-shadow-lg font-inter">
              {property.title}
            </h3>

            <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
              <MapPin size={13} style={{ color: ACCENT_LT }} className="shrink-0" />
              <span className="truncate">{property.location || property.city}</span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <PriceText currency={property.currency} price={property.price} />
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-md capitalize ${getStatusStyles(property.status)}`}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${getStatusDotColor(property.status)}`} />
                    {property.status}
                  </span>
                  {property.viewsCount > 0 && (
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                      · {property.viewsCount} views
                    </span>
                  )}
                </div>
              </div>
              <div
                className="w-9 h-9 flex items-center justify-center rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                style={{
                  backgroundColor: ACCENT,
                  color: "#FFFFFF",
                  boxShadow: `0 4px 12px rgba(29,78,216,0.50)`,
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

  // ===== LIST CARD =====
  const PropertyListItem = ({ property, index = 0 }) => {
    const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <motion.div
        variants={gridItemVariants}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-52 sm:h-56 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-500 hover:shadow-[0_30px_60px_-20px_rgba(10,26,47,0.40)]"
        style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}
      >
        <Link href={`/properties/${property._id}`} className="block h-full w-full relative">
          <Image
            src={img}
            alt={property.title || "Property"}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1024px) 100vw"
          />
          {/* === FIX: bg-gradient-to-t === */}
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
            <div className="flex gap-1.5">
              {property.isFeatured && (
                <span
                  className="px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1"
                  style={{ backgroundColor: ACCENT, color: "#FFFFFF" }}
                >
                  <Crown size={8} style={{ fill: "#FFFFFF" }} />
                  Featured
                </span>
              )}
              <span
                className="px-2 py-0.5 backdrop-blur-md text-[9px] font-bold rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(255,255,255,0.92)",
                  color: INK,
                  border: `1px solid ${LINE}`,
                }}
              >
                {property.priceType}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-semibold rounded-md capitalize ${getStatusStyles(property.status)}`}
              >
                <span className={`inline-block w-1 h-1 rounded-full ${getStatusDotColor(property.status)}`} />
                {property.status}
              </span>
            </div>
            <button
              onClick={(e) => toggleLike(property._id, e)}
              className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110"
              style={{
                backgroundColor: "rgba(255,255,255,0.92)",
                border: `1px solid ${LINE}`,
              }}
            >
              <Heart
                size={14}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
                style={!isLiked ? { color: MUTED } : undefined}
              />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-lg text-white mb-0.5 leading-tight drop-shadow-lg line-clamp-1 font-inter">
                  {property.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
                  {property.propertyCode && (
                    <span
                      className="inline-block font-mono text-[10px] font-bold mr-2 px-1.5 py-0.5 rounded"
                      style={{ color: ACCENT_LT, backgroundColor: "rgba(0,0,0,0.4)" }}
                    >
                      {property.propertyCode}
                    </span>
                  )}
                  <MapPin size={11} style={{ color: ACCENT_LT }} />
                  <span className="truncate">{property.location || property.city}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)" }} className="mx-1">·</span>
                  <div className="flex items-center gap-2">
                    {property.bedrooms > 0 && <span>{property.bedrooms} Bed</span>}
                    {property.bathrooms > 0 && <span>{property.bathrooms} Bath</span>}
                    {(property.areaSize || property.area) > 0 && (
                      <span>{property.areaSize || property.area} {property.areaUnit || "sqft"}</span>
                    )}
                  </div>
                </div>
              </div>
              <PriceText currency={property.currency} price={property.price} />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  const lightOptionStyle = {
    backgroundColor: CARD,
    color: INK,
    padding: "8px 12px",
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen font-inter overflow-hidden"
      style={{ backgroundColor: PAPER, color: INK }}
    >
      {/* Background */}
      <div
        ref={bgRef}
        className="fixed inset-0 z-0 will-change-transform pointer-events-none"
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
      <div ref={heroRef} className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT_LT }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p
                className="text-[13px] font-medium inline-flex items-center gap-2"
                style={{ color: ACCENT_SOFT }}
              >
                <Building2 size={14} style={{ color: ACCENT_LT }} />
                Explore listings
              </p>
            </div>

            <div ref={headingRef}>
              <h1
                className="text-[34px] sm:text-4xl lg:text-[48px] tracking-[-0.02em] leading-[1.1] mb-4 font-inter font-semibold"
                style={{ color: "#FFFFFF" }}
              >
                Our Properties
              </h1>
              <div
                className="h-1 w-24 rounded-full mb-4 sm:w-32"
                style={{ backgroundColor: ACCENT_LT }}
              />
              <p
                className="text-[15px] sm:text-base leading-[1.65] mb-8 max-w-xl"
                style={{ color: "rgba(219,234,254,0.75)" }}
              >
                Discover your perfect property from our curated collection of
                premium real estate listings.
              </p>
            </div>
          </div>

          {/* Search + Controls */}
          <div ref={controlsRef} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* === FIX: min-w-[280px] (was min-w-280px] / min-w-45) === */}
              <div className="relative flex-1 min-w-70">
                <form onSubmit={handleSearch}>
                  <div
                    className="relative flex items-center rounded-2xl transition-all shadow-sm focus-within:border-[#1D4ED8] focus-within:ring-2 focus-within:ring-[#1D4ED8]/20"
                    style={{
                      backgroundColor: CARD,
                      border: `1px solid ${LINE}`,
                    }}
                  >
                    <Search size={16} className="absolute left-3.5" style={{ color: MUTED }} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        if (searchInput.trim()) setShowSuggestions(true);
                      }}
                      placeholder="Search by title, location, or property code..."
                      className="w-full pl-9 pr-20 py-3 text-sm bg-transparent focus:outline-none"
                      style={{ color: INK }}
                      autoComplete="off"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-12 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full transition-colors hover:bg-[#0A1A2F]/8"
                        title="Clear search"
                      >
                        <X size={14} style={{ color: MUTED }} />
                      </button>
                    )}
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-xl transition-transform hover:scale-105"
                      style={{
                        backgroundColor: ACCENT,
                        color: "#FFFFFF",
                        boxShadow: `0 4px 12px rgba(29,78,216,0.40)`,
                      }}
                      title="Search"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      ref={suggestionsRef}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50"
                      style={{
                        backgroundColor: `${CARD}F2`,
                        border: `1px solid ${LINE}`,
                      }}
                    >
                      <div className="max-h-80 overflow-y-auto">
                        {suggestions.map((property) => {
                          const img =
                            getSafeImg(property.thumbnail) ||
                            getSafeImg(property.images?.[0]) ||
                            PLACEHOLDER;
                          return (
                            <Link
                              key={property._id}
                              href={`/properties/${property._id}`}
                              onClick={handleSuggestionClick}
                              className="flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-[#DBEAFE]/60"
                              style={{ borderBottom: `1px solid ${LINE}` }}
                            >
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 shadow-lg">
                                <Image src={img} alt="" fill className="object-cover" sizes="64px" unoptimized />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold leading-tight line-clamp-1 font-inter" style={{ color: INK }}>
                                  <HighlightText text={property.title} query={searchInput} />
                                </p>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <MapPin size={10} style={{ color: ACCENT_DK }} className="shrink-0" />
                                  <span className="text-[11px] truncate" style={{ color: MUTED }}>
                                    <HighlightText text={property.location || property.city || "N/A"} query={searchInput} />
                                  </span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                key={filteredProperties.length}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap"
                style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, color: INK }}
              >
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1 ? "property" : "properties"}
              </motion.div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-xl transition-all shrink-0 disabled:opacity-40 hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
                style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, color: MUTED }}
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-xl transition-all shrink-0"
                style={
                  showFilters || hasActiveFilters
                    ? { backgroundColor: ACCENT, color: "#FFFFFF", boxShadow: `0 4px 12px rgba(29,78,216,0.40)` }
                    : { backgroundColor: CARD, color: MUTED, border: `1px solid ${LINE}` }
                }
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>

              <div className="flex items-center rounded-xl p-1 shrink-0" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
                <button
                  onClick={() => setViewMode("grid")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={viewMode === "grid" ? { backgroundColor: ACCENT, color: "#FFFFFF" } : { color: MUTED }}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="p-1.5 rounded-lg transition-colors"
                  style={viewMode === "list" ? { backgroundColor: ACCENT, color: "#FFFFFF" } : { color: MUTED }}
                >
                  <List size={15} />
                </button>
              </div>

              <LightSelect
                className="w-36 shrink-0"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [f, o] = e.target.value.split("-");
                  setSortBy(f);
                  setSortOrder(o);
                }}
                options={SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={`${opt.value}-${opt.value === "price" ? "asc" : "desc"}`}
                    style={lightOptionStyle}
                  >
                    {opt.label}
                  </option>
                ))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {loading ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonList key={i} />
              ))}
            </div>
          )
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-lg mb-1 font-semibold" style={{ color: INK }}>
              No Properties Found
            </h3>
            <p className="text-sm" style={{ color: MUTED }}>
              {hasActiveFilters ? "Try different filters." : "No properties listed yet."}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <motion.div
            key={`grid-${page}-${search}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredProperties.map((property, i) => (
              <PropertyCard key={property._id || i} property={property} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`list-${page}-${search}`}
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {filteredProperties.map((property, i) => (
              <PropertyListItem key={property._id || i} property={property} index={i} />
            ))}
          </motion.div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => fetchProperties(page - 1)}
              disabled={!pagination.hasPrevPage}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
              style={{ border: `1px solid ${LINE}`, backgroundColor: CARD, color: MUTED }}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span
                    key={`d${i}`}
                    className="w-10 h-10 flex items-center justify-center text-sm"
                    style={{ color: MUTED }}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => fetchProperties(item)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors"
                    style={
                      page === item
                        ? {
                            backgroundColor: ACCENT,
                            color: "#FFFFFF",
                            boxShadow: `0 4px 12px rgba(29,78,216,0.40)`,
                          }
                        : {
                            border: `1px solid ${LINE}`,
                            backgroundColor: CARD,
                            color: MUTED,
                          }
                    }
                  >
                    {item}
                  </button>
                )
              )}
            <button
              onClick={() => fetchProperties(page + 1)}
              disabled={!pagination.hasNextPage}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#1D4ED8] hover:text-[#1D4ED8]"
              style={{ border: `1px solid ${LINE}`, backgroundColor: CARD, color: MUTED }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}