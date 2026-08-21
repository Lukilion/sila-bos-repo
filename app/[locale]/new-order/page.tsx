"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { PRODUCT_CATALOG, ProductItem } from "@/lib/catalogData";
import { NavIcon } from "@/components/navigation/NavIcon";
import confetti from "canvas-confetti";

interface SelectedOrderItem {
  product: ProductItem;
  quantity: number;
}

// Simple Web Audio API Synthesizer for tactile feedback
function playSoundEffect(type: "add" | "skip" | "undo" | "bulk" | "chime", soundEnabled: boolean) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === "add") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === "skip") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "bulk") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "undo") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "chime") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.value = freq;
        const startT = now + idx * 0.08;
        g.gain.setValueAtTime(0.15, startT);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.35);
        o.start(startT);
        o.stop(startT + 0.35);
      });
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
}

// -------------------------------------------------------------
// Interactive Swiper Card for Tinder-style Single Deck Mode
// -------------------------------------------------------------
function DraggableDeckCard({
  product,
  isUrdu,
  displayLang,
  currentQty,
  onSwipeAdd,
  onSwipeSkip,
  onBulkAdd,
}: {
  product: ProductItem;
  isUrdu: boolean;
  displayLang: "ur" | "en";
  currentQty: number;
  onSwipeAdd: (qty?: number) => void;
  onSwipeSkip: () => void;
  onBulkAdd: (qty: number) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const addOpacity = useTransform(x, [20, 100], [0, 1]);
  const skipOpacity = useTransform(x, [-20, -100], [0, 1]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 80) {
      onSwipeAdd(1);
    } else if (info.offset.x < -80) {
      onSwipeSkip();
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        scale: cardScale,
        boxShadow: "-8px -8px 20px #FFFFFF, 8px 8px 20px #C5C3D8",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      className="absolute inset-0 rounded-3xl bg-[#EDEBF8] p-6 sm:p-8 flex flex-col justify-between cursor-grab select-none overflow-hidden touch-none"
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      {/* Green Add Badge on Right Swipe */}
      <motion.div
        style={{ opacity: addOpacity }}
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-sm tracking-wider border-2 border-emerald-300 shadow-lg pointer-events-none transform -rotate-12 flex items-center gap-1.5"
      >
        <NavIcon name="Plus" className="w-5 h-5" />
        <span>{isUrdu ? "شامل کریں (+ ADD)" : "+ ADD ITEM"}</span>
      </motion.div>

      {/* Red Skip Badge on Left Swipe */}
      <motion.div
        style={{ opacity: skipOpacity }}
        className="absolute top-6 right-6 z-20 px-4 py-2 rounded-2xl bg-rose-500 text-white font-black text-sm tracking-wider border-2 border-rose-300 shadow-lg pointer-events-none transform rotate-12 flex items-center gap-1.5"
      >
        <NavIcon name="X" className="w-5 h-5" />
        <span>{isUrdu ? "چھوڑ دیں (SKIP)" : "SKIP"}</span>
      </motion.div>

      {/* Top Details & Price */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-xl bg-[#E2E0EE] text-[#6C7293] font-mono text-xs font-bold shadow-inner">
            ITEM #{product.id}
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-[#007BFF]/10 text-[#007BFF] font-mono font-black text-sm shadow-sm">
            PKR {product.price.toLocaleString()}
          </span>
        </div>

        {/* Product Visual Center */}
        <div className="text-center py-4 sm:py-6 space-y-2">
          <div
            className="size-20 sm:size-24 mx-auto rounded-3xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
            style={{
              boxShadow: "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
            }}
          >
            <NavIcon name="Package" className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#3A3F58] leading-tight px-2">
            {displayLang === "ur" ? product.nameUrdu : product.nameEn}
          </h2>

          <p className="text-xs sm:text-sm text-[#7E8299] font-medium">
            {displayLang === "ur" ? product.nameEn : product.nameUrdu}
          </p>

          <div className="pt-1 flex items-center justify-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E2E0EE] text-[#6C7293] font-mono">
              {product.category === "kashif" ? "Kashif Naeem List" : "Common Wholesale List"}
            </span>
            {currentQty > 0 && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                ✓ In Cart: {currentQty} units
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Drag Tutorial & Action Buttons */}
      <div className="space-y-4 pt-2 border-t border-[#C5C3D8]/30">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#7E8299] px-2">
          <span className="flex items-center gap-1 text-rose-600">
            <span>👈</span> {isUrdu ? "بائیں سوائپ (Skip)" : "Swipe Left (Skip)"}
          </span>
          <span className="flex items-center gap-1 text-emerald-600">
            {isUrdu ? "دائیں سوائپ (+1)" : "Swipe Right (+1)"} <span>👉</span>
          </span>
        </div>

        {/* Fast Action Click/Tap Bar */}
        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => onSwipeSkip()}
            className="py-3 px-3 rounded-2xl bg-[#EDEBF8] text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer hover:bg-rose-50/50"
            style={{
              boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
            }}
          >
            <NavIcon name="X" className="w-4 h-4" />
            <span>{isUrdu ? "چھوڑیں" : "Skip"}</span>
          </button>

          <button
            type="button"
            onClick={() => onBulkAdd(5)}
            className="py-3 px-3 rounded-2xl bg-[#EDEBF8] text-[#007BFF] font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer hover:bg-[#007BFF]/5"
            style={{
              boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
            }}
          >
            <NavIcon name="Zap" className="w-4 h-4" />
            <span>{isUrdu ? "+5 بلک" : "+5 Bulk"}</span>
          </button>

          <button
            type="button"
            onClick={() => onSwipeAdd(1)}
            className="py-3 px-3 rounded-2xl bg-[#007BFF] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer hover:bg-[#0A84FF] shadow-md"
          >
            <NavIcon name="Plus" className="w-4 h-4" />
            <span>{isUrdu ? "+1 شامل" : "+1 Add"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// Interactive Batch Grid Card (Draggable + Clickable)
// -------------------------------------------------------------
function DraggableGridCard({
  product,
  displayLang,
  isUrdu,
  quantity,
  onAddOne,
  onRemoveOne,
  onToggle,
  onSkip,
}: {
  product: ProductItem;
  displayLang: "ur" | "en";
  isUrdu: boolean;
  quantity: number;
  onAddOne: () => void;
  onRemoveOne: () => void;
  onToggle: () => void;
  onSkip: () => void;
}) {
  const isSelected = quantity > 0;
  const x = useMotionValue(0);
  const [feedback, setFeedback] = useState<"added" | "skipped" | null>(null);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 60) {
      onAddOne();
      setFeedback("added");
      setTimeout(() => setFeedback(null), 700);
    } else if (info.offset.x < -60) {
      onSkip();
      setFeedback("skipped");
      setTimeout(() => setFeedback(null), 700);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      whileHover={{ y: -2 }}
      className={`p-4 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between transition-all duration-200 relative overflow-hidden select-none touch-none ${
        isSelected ? "ring-2 ring-[#007BFF] ring-offset-2 ring-offset-[#EDEBF8]" : ""
      }`}
      style={{
        x,
        boxShadow: isSelected
          ? "inset 3px 3px 7px #C5C3D8, inset -3px -3px 7px #FFFFFF"
          : "-5px -5px 12px #FFFFFF, 5px 5px 12px #C5C3D8",
      }}
    >
      {/* Visual Feedback Overlay */}
      {feedback && (
        <div
          className={`absolute inset-0 z-20 flex items-center justify-center font-bold text-xs text-white ${
            feedback === "added" ? "bg-emerald-600/90" : "bg-rose-600/90"
          }`}
        >
          {feedback === "added" ? (isUrdu ? "✓ شامل کر لیا گیا" : "✓ Added") : (isUrdu ? "چھوڑ دیا گیا" : "Skipped")}
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono font-bold text-[#7E8299] px-2 py-0.5 rounded-md bg-[#E2E0EE]/60">
            #{product.id}
          </span>
          <span className="text-xs font-black text-[#007BFF] font-mono">
            PKR {product.price.toLocaleString()}
          </span>
        </div>

        {/* Product Names */}
        <div className="my-2 cursor-pointer" onClick={onToggle} title="Click to toggle selection">
          <h3 className="text-sm font-black text-[#3A3F58] leading-snug">
            {displayLang === "ur" ? product.nameUrdu : product.nameEn}
          </h3>
          <p className="text-[11px] text-[#7E8299] font-medium">
            {displayLang === "ur" ? product.nameEn : product.nameUrdu}
          </p>
        </div>
      </div>

      {/* Actions & Quantity Controls */}
      <div className="pt-3 border-t border-[#C5C3D8]/30 space-y-2 mt-2">
        {isSelected ? (
          <div className="space-y-2">
            <div
              className="flex items-center justify-between p-1 rounded-xl bg-[#EDEBF8]"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <button
                type="button"
                onClick={onRemoveOne}
                className="size-7 rounded-lg bg-[#EDEBF8] text-rose-600 flex items-center justify-center font-bold hover:bg-rose-50 transition active:scale-90 cursor-pointer"
                style={{
                  boxShadow: "-1px -1px 3px #FFFFFF, 1px 1px 3px #C5C3D8",
                }}
              >
                -
              </button>
              <span className="font-mono font-bold text-xs text-[#3A3F58]">
                {quantity} {isUrdu ? "عدد" : "qty"}
              </span>
              <button
                type="button"
                onClick={onAddOne}
                className="size-7 rounded-lg bg-[#EDEBF8] text-emerald-600 flex items-center justify-center font-bold hover:bg-emerald-50 transition active:scale-90 cursor-pointer"
                style={{
                  boxShadow: "-1px -1px 3px #FFFFFF, 1px 1px 3px #C5C3D8",
                }}
              >
                +
              </button>
            </div>

            <div className="text-[10px] text-center font-bold text-[#007BFF] font-mono">
              PKR {(quantity * product.price).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onAddOne}
              className="py-2 px-2 rounded-xl bg-[#007BFF] text-white font-bold text-xs flex items-center justify-center gap-1 hover:bg-[#0A84FF] transition active:scale-95 cursor-pointer shadow-sm"
            >
              <NavIcon name="Plus" className="w-3.5 h-3.5" />
              <span>{isUrdu ? "شامل" : "Add"}</span>
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="py-2 px-2 rounded-xl bg-[#EDEBF8] text-[#7E8299] font-bold text-xs flex items-center justify-center transition active:scale-95 cursor-pointer hover:text-[#3A3F58]"
              style={{
                boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
              }}
            >
              <span>{isUrdu ? "چھوڑیں" : "Skip"}</span>
            </button>
          </div>
        )}

        <div className="text-[10px] text-center text-[#7E8299]/70 font-medium">
          ↔ {isUrdu ? "سوائپ ڈریگ سپورٹ" : "Drag to swipe"}
        </div>
      </div>
    </motion.div>
  );
}

// -------------------------------------------------------------
// MAIN PAGE COMPONENT
// -------------------------------------------------------------
export default function NewOrderPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ur-PK";
  const isUrduInterface = locale === "ur-PK";

  // --- Step 1: Preferences & Order Basics ---
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [displayLanguage, setDisplayLanguage] = useState<"ur" | "en">(isUrduInterface ? "ur" : "en");
  const [catalogChoice, setCatalogChoice] = useState<"common" | "kashif">("common");

  // Format today's date DD-MM-YYYY
  const todayFormatted = useMemo(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  const [customerName, setCustomerName] = useState("");
  const [orderDate, setOrderDate] = useState(todayFormatted);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // --- Step 2: Interactive Swiping & Bundle Selection ---
  const [selectedItemsMap, setSelectedItemsMap] = useState<Record<number, SelectedOrderItem>>({});
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0); // 0 = batch 1, 1 = batch 2...
  const [activeDeckIndex, setActiveDeckIndex] = useState(0); // 0..4 within current batch for Deck mode
  const [swiperViewMode, setSwiperViewMode] = useState<"deck" | "grid">("deck");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyStack, setHistoryStack] = useState<Array<{ id: number; prevQty: number; action: "add" | "skip" | "bulk" }>>([]);

  const BATCH_SIZE = 5;

  // Filter Catalog by choice
  const baseCatalogList = useMemo(() => {
    if (catalogChoice === "common") {
      return PRODUCT_CATALOG.filter((item) => item.category === "common");
    }
    return PRODUCT_CATALOG;
  }, [catalogChoice]);

  // Search filtered list if searching
  const activeCatalogList = useMemo(() => {
    if (!searchQuery.trim()) return baseCatalogList;
    const q = searchQuery.toLowerCase().trim();
    return baseCatalogList.filter(
      (item) =>
        item.nameUrdu.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        String(item.id).includes(q) ||
        String(item.price).includes(q)
    );
  }, [baseCatalogList, searchQuery]);

  const totalBatches = Math.max(1, Math.ceil(activeCatalogList.length / BATCH_SIZE));

  // Current 5 items of active batch
  const currentBatchItems = useMemo(() => {
    const start = currentBatchIndex * BATCH_SIZE;
    return activeCatalogList.slice(start, start + BATCH_SIZE);
  }, [activeCatalogList, currentBatchIndex]);

  // Current item for Deck view
  const currentDeckItem = useMemo(() => {
    if (currentBatchItems.length === 0) return null;
    return currentBatchItems[activeDeckIndex] || currentBatchItems[0];
  }, [currentBatchItems, activeDeckIndex]);

  // --- Step 3: Khata & Financial Adjustments ---
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Calculations
  const selectedList = useMemo(() => Object.values(selectedItemsMap), [selectedItemsMap]);
  const totalItemCount = useMemo(
    () => selectedList.reduce((acc, item) => acc + item.quantity, 0),
    [selectedList]
  );
  const currentBillTotal = useMemo(
    () => selectedList.reduce((acc, item) => acc + item.quantity * item.product.price, 0),
    [selectedList]
  );

  const currentBalance = Math.max(0, currentBillTotal - paidAmount);
  const totalKhataPayable = currentBillTotal + previousBalance;
  const totalOutstanding = Math.max(0, totalKhataPayable - paidAmount);

  // Handlers for Add / Remove / Skip / Bulk
  const handleAddQuantity = useCallback(
    (product: ProductItem, qtyToAdd = 1) => {
      setSelectedItemsMap((prev) => {
        const existing = prev[product.id];
        const oldQty = existing ? existing.quantity : 0;
        setHistoryStack((h) => [...h, { id: product.id, prevQty: oldQty, action: qtyToAdd > 1 ? "bulk" : "add" }]);
        return {
          ...prev,
          [product.id]: {
            product,
            quantity: oldQty + qtyToAdd,
          },
        };
      });
      playSoundEffect(qtyToAdd > 1 ? "bulk" : "add", soundEnabled);

      // Advance deck index if in deck mode
      if (swiperViewMode === "deck") {
        if (activeDeckIndex < currentBatchItems.length - 1) {
          setActiveDeckIndex((prev) => prev + 1);
        } else if (currentBatchIndex < totalBatches - 1) {
          setCurrentBatchIndex((b) => b + 1);
          setActiveDeckIndex(0);
        }
      }
    },
    [soundEnabled, swiperViewMode, activeDeckIndex, currentBatchItems.length, currentBatchIndex, totalBatches]
  );

  const handleSkipItem = useCallback(
    (product: ProductItem) => {
      const oldQty = selectedItemsMap[product.id]?.quantity || 0;
      setHistoryStack((h) => [...h, { id: product.id, prevQty: oldQty, action: "skip" }]);
      playSoundEffect("skip", soundEnabled);

      // Advance deck index if in deck mode
      if (swiperViewMode === "deck") {
        if (activeDeckIndex < currentBatchItems.length - 1) {
          setActiveDeckIndex((prev) => prev + 1);
        } else if (currentBatchIndex < totalBatches - 1) {
          setCurrentBatchIndex((b) => b + 1);
          setActiveDeckIndex(0);
        }
      }
    },
    [selectedItemsMap, soundEnabled, swiperViewMode, activeDeckIndex, currentBatchItems.length, currentBatchIndex, totalBatches]
  );

  const handleRemoveQuantity = useCallback((productId: number, qtyToRemove = 1) => {
    setSelectedItemsMap((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      const newQty = existing.quantity - qtyToRemove;
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = { ...existing, quantity: newQty };
      }
      return updated;
    });
  }, []);

  const handleToggleProduct = useCallback((product: ProductItem) => {
    setSelectedItemsMap((prev) => {
      const updated = { ...prev };
      if (updated[product.id]) {
        delete updated[product.id];
      } else {
        updated[product.id] = { product, quantity: 1 };
      }
      return updated;
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (historyStack.length === 0) return;
    const lastAction = historyStack[historyStack.length - 1];
    setHistoryStack((h) => h.slice(0, -1));

    setSelectedItemsMap((prev) => {
      const updated = { ...prev };
      if (lastAction.prevQty === 0) {
        delete updated[lastAction.id];
      } else {
        const prod = PRODUCT_CATALOG.find((p) => p.id === lastAction.id);
        if (prod) {
          updated[lastAction.id] = { product: prod, quantity: lastAction.prevQty };
        }
      }
      return updated;
    });

    if (swiperViewMode === "deck" && activeDeckIndex > 0) {
      setActiveDeckIndex((prev) => prev - 1);
    }
    playSoundEffect("undo", soundEnabled);
  }, [historyStack, swiperViewMode, activeDeckIndex, soundEnabled]);

  // Keyboard Shortcuts for Swiper
  useEffect(() => {
    if (currentStep !== 2) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (currentDeckItem) handleAddQuantity(currentDeckItem, 1);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (currentDeckItem) handleSkipItem(currentDeckItem);
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        if (currentDeckItem) handleAddQuantity(currentDeckItem, 5);
      } else if (e.key === "z" || e.key === "Z" || e.key === "Backspace") {
        handleUndo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, currentDeckItem, handleAddQuantity, handleSkipItem, handleUndo]);

  // Text Summary generator for WhatsApp & Khata
  const textSummary = useMemo(() => {
    const cust = customerName.trim() || (isUrduInterface ? "عام گاہک" : "Valued Customer");
    const dt = orderDate || todayFormatted;

    let itemsStr = "";
    selectedList.forEach((item) => {
      const name = displayLanguage === "ur" ? item.product.nameUrdu : item.product.nameEn;
      const itemTotal = item.quantity * item.product.price;
      itemsStr += `* ${name} x ${item.quantity} = ${itemTotal.toLocaleString()} روپے\n`;
    });

    return `* ${cust} — ${dt}

* منتخب کردہ آئٹمز:
${itemsStr || "* کوئی آئٹم منتخب نہیں کی گئی\n"}--------------------------------
موجودہ بل (Current Bill): ${currentBillTotal.toLocaleString()} روپے
ادائیگی / جمع (Paid): ${paidAmount.toLocaleString()} روپے
باقی رقم (Current Balance): ${currentBalance.toLocaleString()} روپے

--------------------------------
سابقہ بقایا (Previous Balance): ${previousBalance.toLocaleString()} روپے
مجموعی بل (Total Khata): ${totalKhataPayable.toLocaleString()} روپے
مجموعی جمع (Total Paid): ${paidAmount.toLocaleString()} روپے
مجموعی باقی رقم (Total Outstanding): ${totalOutstanding.toLocaleString()} روپے`;
  }, [
    customerName,
    orderDate,
    todayFormatted,
    selectedList,
    displayLanguage,
    currentBillTotal,
    paidAmount,
    currentBalance,
    previousBalance,
    totalKhataPayable,
    totalOutstanding,
    isUrduInterface,
  ]);

  // Download CSV
  const handleDownloadCSV = () => {
    const cust = customerName.trim() || "Customer";
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Item ID,Product (Urdu),Product (English),Unit Price (PKR),Quantity,Total (PKR)\n";

    selectedList.forEach((item) => {
      const line = [
        item.product.id,
        `"${item.product.nameUrdu}"`,
        `"${item.product.nameEn}"`,
        item.product.price,
        item.quantity,
        item.quantity * item.product.price,
      ].join(",");
      csvContent += line + "\n";
    });

    csvContent += "\n";
    csvContent += `Customer Name,"${cust}"\n`;
    csvContent += `Order Date,"${orderDate}"\n`;
    csvContent += `Current Bill Total,${currentBillTotal}\n`;
    csvContent += `Paid Amount,${paidAmount}\n`;
    csvContent += `Current Balance,${currentBalance}\n`;
    csvContent += `Previous Balance,${previousBalance}\n`;
    csvContent += `Total Khata,${totalKhataPayable}\n`;
    csvContent += `Total Outstanding,${totalOutstanding}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Order_${cust.replace(/\s+/g, "_")}_${orderDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(textSummary);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleFinishAndConfetti = () => {
    playSoundEffect("chime", soundEnabled);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6 pb-24 select-none max-w-5xl mx-auto">
      {/* Header Banner */}
      <div
        id="new-order-header-banner"
        className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              TACTILE SWIPER & KHATA
            </span>
            <span className="text-xs text-[#7E8299]">Batch Swiper • Khata Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrduInterface ? "+ نیا ہول سیل آرڈر بنائیں" : "+ Create New Wholesale Order"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl">
            {isUrduInterface
              ? "آئٹم سوائپر، ڈریگ اشارے، 5 آئٹم بنڈلز اور فوری کھاتہ حساب کتاب۔"
              : "Physics-based item swiping, drag gesture support, 5-item batch bundles, and live ledger balance."}
          </p>
        </div>

        {/* Audio Toggle & Cart Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className={`size-10 rounded-2xl flex items-center justify-center transition cursor-pointer ${
              soundEnabled ? "text-[#007BFF]" : "text-[#7E8299] opacity-60"
            }`}
            style={{
              boxShadow: soundEnabled
                ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                : "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
            }}
            title={soundEnabled ? "Sound Effects ON" : "Sound Effects OFF"}
          >
            <NavIcon name={soundEnabled ? "Volume2" : "VolumeX"} className="w-4 h-4" />
          </button>

          <Link
            href={`/${locale}/orders`}
            className="h-10 px-4 rounded-2xl bg-[#EDEBF8] flex items-center gap-2 text-[#6C7293] hover:text-[#3A3F58] text-xs font-bold transition active:scale-95 cursor-pointer"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
          >
            <NavIcon name="ArrowLeft" className="w-4 h-4" />
            <span>{isUrduInterface ? "آرڈرز" : "Orders"}</span>
          </Link>

          <div
            className="h-10 px-3.5 rounded-2xl bg-[#EDEBF8] flex items-center gap-2 text-[#007BFF] font-mono text-xs font-bold"
            style={{
              boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
            }}
          >
            <NavIcon name="ShoppingBag" className="w-4 h-4" />
            <span>
              {totalItemCount} {isUrduInterface ? "یونٹس" : "Items"}
            </span>
            <span className="text-[#3A3F58]">|</span>
            <span className="text-[#3A3F58]">PKR {currentBillTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div
        id="order-workflow-stepper"
        className="p-3 sm:p-4 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            {
              step: 1,
              titleEn: "Step 1: Setup",
              titleUr: "مرحلہ 1: ترتیبات",
              descEn: "Catalog & Customer",
              descUr: "کیٹلاگ و گاہک کا نام",
            },
            {
              step: 2,
              titleEn: "Step 2: Item Swiper",
              titleUr: "مرحلہ 2: اشیاء سوائپر",
              descEn: "Swipe & Select Batches",
              descUr: "5 اشیاء بیچ سوائپ",
            },
            {
              step: 3,
              titleEn: "Step 3: Khata Review",
              titleUr: "مرحلہ 3: کھاتہ حساب",
              descEn: "Ledger & Balances",
              descUr: "وصولی اور سابقہ بقایا",
            },
            {
              step: 4,
              titleEn: "Step 4: Final Summary",
              titleUr: "مرحلہ 4: حتمی خلاصہ",
              descEn: "Text & CSV Export",
              descUr: "متن اور سی ایس وی ایکسپورٹ",
            },
          ].map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => {
                  if (!customerName.trim()) {
                    setCustomerName(isUrduInterface ? "عام گاہک" : "General Customer");
                  }
                  setCurrentStep(s.step as 1 | 2 | 3 | 4);
                }}
                className={`p-3 rounded-2xl text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                  isActive
                    ? "bg-[#EDEBF8] text-[#007BFF]"
                    : isCompleted
                    ? "bg-[#EDEBF8] text-emerald-600"
                    : "bg-[#EDEBF8] text-[#7E8299] hover:text-[#3A3F58]"
                }`}
                style={
                  isActive
                    ? {
                        boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                      }
                    : {
                        boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                      }
                }
              >
                <div
                  className={`size-8 sm:size-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-[#007BFF] text-white shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-[#EDEBF8] text-[#7E8299]"
                  }`}
                  style={
                    !isActive && !isCompleted
                      ? {
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }
                      : undefined
                  }
                >
                  {isCompleted ? <NavIcon name="Check" className="w-4 h-4" /> : s.step}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">
                    {isUrduInterface ? s.titleUr : s.titleEn}
                  </div>
                  <div className="text-[11px] text-[#7E8299] truncate font-medium">
                    {isUrduInterface ? s.descUr : s.descEn}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= STEP 1: PREFERENCE SETUP ================= */}
      {currentStep === 1 && (
        <div
          id="step-1-configuration-card"
          className="p-6 rounded-2xl bg-[#EDEBF8] space-y-6"
          style={{
            boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
          }}
        >
          <div className="border-b border-[#C5C3D8]/40 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#3A3F58]">
                {isUrduInterface
                  ? "مرحلہ 1: ترجیحات اور بنیادی تفصیلات"
                  : "Step 1: Preference Setup & Order Basics"}
              </h2>
              <p className="text-xs text-[#7E8299]">
                {isUrduInterface
                  ? "کیٹلاگ کی زبان، فہرست اور گاہک کا نام منتخب کریں۔"
                  : "Select product display language, catalog list, and customer billing credentials."}
              </p>
            </div>
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              SETUP CONFIG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Language Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293] block">
                {isUrduInterface ? "کیٹلاگ زبان (Display Language)" : "Catalog Language"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDisplayLanguage("ur")}
                  className={`p-3 rounded-2xl text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    displayLanguage === "ur"
                      ? "text-[#007BFF] bg-[#EDEBF8]"
                      : "text-[#6C7293] hover:text-[#3A3F58]"
                  }`}
                  style={
                    displayLanguage === "ur"
                      ? {
                          boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                        }
                      : {
                          boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
                        }
                  }
                >
                  <NavIcon name="Languages" className="w-4 h-4" />
                  <span>اردو (Urdu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDisplayLanguage("en")}
                  className={`p-3 rounded-2xl text-center font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    displayLanguage === "en"
                      ? "text-[#007BFF] bg-[#EDEBF8]"
                      : "text-[#6C7293] hover:text-[#3A3F58]"
                  }`}
                  style={
                    displayLanguage === "en"
                      ? {
                          boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                        }
                      : {
                          boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
                        }
                  }
                >
                  <NavIcon name="Globe" className="w-4 h-4" />
                  <span>English (Transliterated)</span>
                </button>
              </div>
            </div>

            {/* 2. Catalog Choice */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293] block">
                {isUrduInterface ? "کیٹلاگ لسٹ منتخب کریں (Catalog List)" : "Select Catalog List"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCatalogChoice("common");
                    setCurrentBatchIndex(0);
                    setActiveDeckIndex(0);
                  }}
                  className={`p-3 rounded-2xl text-start font-bold text-xs transition cursor-pointer ${
                    catalogChoice === "common"
                      ? "text-[#007BFF] bg-[#EDEBF8]"
                      : "text-[#6C7293] hover:text-[#3A3F58]"
                  }`}
                  style={
                    catalogChoice === "common"
                      ? {
                          boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                        }
                      : {
                          boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
                        }
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>{isUrduInterface ? "مشترکہ لسٹ" : "Common List"}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#007BFF]/10 text-[#007BFF]">
                      57 Items
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7E8299] font-normal">
                    {isUrduInterface ? "بنیادی جنرل ہول سیل اشیاء" : "Items 1 to 57"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCatalogChoice("kashif");
                    setCurrentBatchIndex(0);
                    setActiveDeckIndex(0);
                  }}
                  className={`p-3 rounded-2xl text-start font-bold text-xs transition cursor-pointer ${
                    catalogChoice === "kashif"
                      ? "text-[#007BFF] bg-[#EDEBF8]"
                      : "text-[#6C7293] hover:text-[#3A3F58]"
                  }`}
                  style={
                    catalogChoice === "kashif"
                      ? {
                          boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                        }
                      : {
                          boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
                        }
                  }
                >
                  <div className="flex items-center justify-between mb-1">
                    <span>{isUrduInterface ? "کاشف نعیم لسٹ" : "Kashif Naeem List"}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      72 Items
                    </span>
                  </div>
                  <div className="text-[11px] text-[#7E8299] font-normal">
                    {isUrduInterface ? "خصوصی اضافی اشیاء شامل" : "15 Unique + Base 57"}
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Customer Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293] block">
                {isUrduInterface ? "گاہک کا نام (Customer Name) *" : "Customer Name *"}
              </label>
              <div
                className="rounded-2xl p-1 bg-[#EDEBF8] flex items-center"
                style={{
                  boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                }}
              >
                <div className="pl-3 text-[#7E8299]">
                  <NavIcon name="User" className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isUrduInterface ? "مثال: علی حیدر یا حاجی رفیق اینڈ سنز" : "e.g. Ali Haider / Haji Rafiq & Sons"}
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-[#3A3F58] font-bold focus:outline-none placeholder:text-[#7E8299]/70"
                />
              </div>
            </div>

            {/* 4. Order Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293] block">
                {isUrduInterface ? "آرڈر کی تاریخ (Order Date)" : "Order Date"}
              </label>
              <div
                className="rounded-2xl p-1 bg-[#EDEBF8] flex items-center"
                style={{
                  boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                }}
              >
                <div className="pl-3 text-[#7E8299]">
                  <NavIcon name="Calendar" className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full bg-transparent px-3 py-2.5 text-xs text-[#3A3F58] font-bold focus:outline-none placeholder:text-[#7E8299]/70"
                />
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="button"
              id="step-1-next-btn"
              onClick={() => {
                if (!customerName.trim()) {
                  setCustomerName(isUrduInterface ? "عام گاہک" : "Standard Customer");
                }
                setCurrentStep(2);
              }}
              className="h-11 px-6 rounded-2xl bg-[#007BFF] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#0A84FF] transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>{isUrduInterface ? "اشیاء سوائپر پر جائیں" : "Proceed to Item Swiper"}</span>
              <NavIcon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 2: INTERACTIVE SWIPER & BUNDLES ================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Top Control Bar: Search + View Mode Switch + Batch Info */}
          <div
            id="batch-progress-header"
            className="p-4 rounded-2xl bg-[#EDEBF8] flex flex-wrap items-center justify-between gap-4"
            style={{
              boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
            }}
          >
            {/* Batch Info */}
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-bold font-mono text-xs"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                {currentBatchIndex + 1}/{totalBatches}
              </div>
              <div>
                <div className="text-xs font-bold text-[#3A3F58]">
                  {isUrduInterface
                    ? `بنڈل ${currentBatchIndex + 1} از ${totalBatches} (آئٹمز ${
                        currentBatchIndex * BATCH_SIZE + 1
                      } - ${Math.min(
                        (currentBatchIndex + 1) * BATCH_SIZE,
                        activeCatalogList.length
                      )})`
                    : `Batch ${currentBatchIndex + 1} of ${totalBatches} (Items ${
                        currentBatchIndex * BATCH_SIZE + 1
                      } to ${Math.min(
                        (currentBatchIndex + 1) * BATCH_SIZE,
                        activeCatalogList.length
                      )})`}
                </div>
                <div className="text-[11px] text-[#7E8299]">
                  {isUrduInterface
                    ? "ماؤس یا ٹچ سے دائیں سوائپ کر کے شامل کریں، بائیں سوائپ چھوڑیں۔"
                    : "Drag or swipe cards right to add (+1), left to skip."}
                </div>
              </div>
            </div>

            {/* Quick Search */}
            <div
              className="rounded-xl p-1 bg-[#EDEBF8] flex items-center w-full sm:w-64"
              style={{
                boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
              }}
            >
              <div className="pl-2.5 text-[#7E8299]">
                <NavIcon name="Search" className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentBatchIndex(0);
                  setActiveDeckIndex(0);
                }}
                placeholder={isUrduInterface ? "تلاش کریں (نام یا نمبر)..." : "Search item / #ID..."}
                className="w-full bg-transparent px-2.5 py-1 text-xs text-[#3A3F58] font-bold focus:outline-none placeholder:text-[#7E8299]/70"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="pr-2 text-[#7E8299] hover:text-[#3A3F58] text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Toggle (Deck vs Grid) & Review Button */}
            <div className="flex items-center gap-2.5">
              <div
                className="p-1 rounded-xl bg-[#EDEBF8] flex items-center gap-1"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSwiperViewMode("deck")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    swiperViewMode === "deck" ? "bg-[#007BFF] text-white shadow-sm" : "text-[#7E8299]"
                  }`}
                >
                  <NavIcon name="Layers" className="w-3.5 h-3.5" />
                  <span>{isUrduInterface ? "🎴 کارڈ ڈیک" : "Deck Swiper"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSwiperViewMode("grid")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    swiperViewMode === "grid" ? "bg-[#007BFF] text-white shadow-sm" : "text-[#7E8299]"
                  }`}
                >
                  <NavIcon name="Grid" className="w-3.5 h-3.5" />
                  <span>{isUrduInterface ? "📦 بنڈل گرڈ" : "Batch Grid (5)"}</span>
                </button>
              </div>

              {selectedList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="h-9 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition active:scale-95 cursor-pointer shadow"
                >
                  <NavIcon name="CheckCircle" className="w-4 h-4" />
                  <span>
                    {isUrduInterface ? "کھاتہ ریویو" : "Review Khata"} ({totalItemCount})
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ================= VIEW MODE 1: TINDER-STYLE DECK SWIPER ================= */}
          {swiperViewMode === "deck" && (
            <div className="space-y-4">
              {/* Deck Swiper Stage */}
              <div className="relative w-full max-w-md mx-auto h-[440px] sm:h-[460px]">
                {/* Background Shadow / Deck Depth Effect */}
                <div
                  className="absolute inset-x-4 inset-y-2 rounded-3xl bg-[#E2E0EE]/50 transform scale-95 translate-y-3 pointer-events-none"
                  style={{
                    boxShadow: "-4px -4px 10px #FFFFFF, 4px 4px 10px #C5C3D8",
                  }}
                />

                <AnimatePresence mode="wait">
                  {currentDeckItem && (
                    <DraggableDeckCard
                      key={currentDeckItem.id}
                      product={currentDeckItem}
                      isUrdu={isUrduInterface}
                      displayLang={displayLanguage}
                      currentQty={selectedItemsMap[currentDeckItem.id]?.quantity || 0}
                      onSwipeAdd={(qty = 1) => handleAddQuantity(currentDeckItem, qty)}
                      onSwipeSkip={() => handleSkipItem(currentDeckItem)}
                      onBulkAdd={(qty) => handleAddQuantity(currentDeckItem, qty)}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Deck Sub-navigation Dots (5 Cards in current batch) */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={historyStack.length === 0}
                  className="h-8 px-3 rounded-xl bg-[#EDEBF8] text-[#6C7293] font-bold text-[11px] flex items-center gap-1.5 transition active:scale-90 disabled:opacity-30 cursor-pointer"
                  style={{
                    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                  }}
                  title="Undo last swipe (Z / Backspace)"
                >
                  <NavIcon name="RotateCcw" className="w-3.5 h-3.5" />
                  <span>{isUrduInterface ? "واپس (Undo)" : "Undo"}</span>
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDEBF8] shadow-inner">
                  {currentBatchItems.map((item, idx) => {
                    const isSelected = !!selectedItemsMap[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveDeckIndex(idx)}
                        className={`size-3 rounded-full transition-all cursor-pointer ${
                          activeDeckIndex === idx
                            ? "bg-[#007BFF] w-6"
                            : isSelected
                            ? "bg-emerald-500"
                            : "bg-[#C5C3D8]"
                        }`}
                        title={displayLanguage === "ur" ? item.nameUrdu : item.nameEn}
                      />
                    );
                  })}
                </div>

                <span className="text-[11px] font-mono font-bold text-[#7E8299]">
                  Card {activeDeckIndex + 1} of {currentBatchItems.length}
                </span>
              </div>
            </div>
          )}

          {/* ================= VIEW MODE 2: 5-ITEM BATCH GRID ================= */}
          {swiperViewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {currentBatchItems.map((prod) => (
                <DraggableGridCard
                  key={prod.id}
                  product={prod}
                  displayLang={displayLanguage}
                  isUrdu={isUrduInterface}
                  quantity={selectedItemsMap[prod.id]?.quantity || 0}
                  onAddOne={() => handleAddQuantity(prod, 1)}
                  onRemoveOne={() => handleRemoveQuantity(prod.id, 1)}
                  onToggle={() => handleToggleProduct(prod)}
                  onSkip={() => handleSkipItem(prod)}
                />
              ))}
            </div>
          )}

          {/* Sticky Bottom Controls for Batch Jumping */}
          <div
            id="bundle-bottom-controls"
            className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#EDEBF8] flex flex-wrap items-center justify-between gap-3"
            style={{
              boxShadow: "-8px -8px 20px #FFFFFF, 8px 8px 20px #C5C3D8",
            }}
          >
            {/* Previous Batch */}
            <button
              type="button"
              disabled={currentBatchIndex === 0}
              onClick={() => {
                setCurrentBatchIndex((prev) => Math.max(0, prev - 1));
                setActiveDeckIndex(0);
              }}
              className="h-10 px-4 rounded-xl bg-[#EDEBF8] text-[#3A3F58] font-bold text-xs flex items-center gap-2 transition active:scale-95 disabled:opacity-40 cursor-pointer"
              style={{
                boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
              }}
            >
              <NavIcon name="ArrowLeft" className="w-4 h-4" />
              <span>{isUrduInterface ? "پچھلا بنڈل" : "Previous Batch"}</span>
            </button>

            {/* Batch Dots Indicator */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[220px] sm:max-w-none px-2 py-1">
              {Array.from({ length: totalBatches }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentBatchIndex(idx);
                    setActiveDeckIndex(0);
                  }}
                  className={`size-2.5 rounded-full transition-all cursor-pointer ${
                    currentBatchIndex === idx
                      ? "bg-[#007BFF] w-6"
                      : "bg-[#C5C3D8] hover:bg-[#7E8299]"
                  }`}
                  title={`Batch ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next or Finish */}
            <div className="flex items-center gap-2.5">
              {currentBatchIndex < totalBatches - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentBatchIndex((prev) => prev + 1);
                    setActiveDeckIndex(0);
                  }}
                  className="h-10 px-5 rounded-xl bg-[#007BFF] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#0A84FF] transition shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{isUrduInterface ? "اگلا بنڈل" : "Next Batch"}</span>
                  <NavIcon name="ArrowRight" className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="h-10 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{isUrduInterface ? "کھاتہ ریویو کریں" : "Proceed to Khata"}</span>
                  <NavIcon name="CheckCircle" className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 3: KHATA ADJUSTMENT & REVIEW ================= */}
      {currentStep === 3 && (
        <div
          id="step-3-khata-card"
          className="p-6 rounded-2xl bg-[#EDEBF8] space-y-6"
          style={{
            boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
          }}
        >
          <div className="border-b border-[#C5C3D8]/40 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#3A3F58]">
                {isUrduInterface
                  ? "مرحلہ 3: کھاتہ حساب اور ادائیگی ایڈجسٹمنٹ"
                  : "Step 3: Khata Ledger & Payment Adjustments"}
              </h2>
              <p className="text-xs text-[#7E8299]">
                {isUrduInterface
                  ? "موجودہ وصول شدہ رقم اور سابقہ بقایا کھاتہ درج کریں۔"
                  : "Enter upfront cash collected and customer's previous ledger balance for automatic calculation."}
              </p>
            </div>
            <span className="neu-pill-badge bg-[#EDEBF8] text-emerald-600 font-mono">
              KHATA LEDGER
            </span>
          </div>

          {/* Selected Items Summary Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6C7293]">
                {isUrduInterface ? "منتخب کردہ اشیاء کی تفصیل" : "Selected Items Breakdown"} (
                {selectedList.length} Unique Items / {totalItemCount} Units)
              </h3>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="text-xs font-bold text-[#007BFF] hover:underline cursor-pointer flex items-center gap-1"
              >
                <NavIcon name="Plus" className="w-3.5 h-3.5" />
                <span>{isUrduInterface ? "+ مزید اشیاء شامل کریں" : "+ Add More Items"}</span>
              </button>
            </div>

            <div
              className="rounded-2xl p-2 bg-[#EDEBF8] overflow-x-auto max-h-60 overflow-y-auto"
              style={{
                boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
              }}
            >
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="text-[#7E8299] text-[11px] font-semibold border-b border-[#C5C3D8]/50">
                    <th className="py-2 px-3 text-start">#</th>
                    <th className="py-2 px-3 text-start">
                      {isUrduInterface ? "آئٹم کا نام" : "Product Item"}
                    </th>
                    <th className="py-2 px-3 text-start">
                      {isUrduInterface ? "فی یونٹ قیمت" : "Unit Price"}
                    </th>
                    <th className="py-2 px-3 text-start">
                      {isUrduInterface ? "تعداد (Qty)" : "Quantity"}
                    </th>
                    <th className="py-2 px-3 text-start">
                      {isUrduInterface ? "کل رقم" : "Item Total"}
                    </th>
                    <th className="py-2 px-3 text-end">
                      {isUrduInterface ? "حذف" : "Remove"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5C3D8]/30">
                  {selectedList.map((item) => (
                    <tr key={item.product.id} className="hover:bg-[#E2E0EE]/40">
                      <td className="py-2 px-3 font-mono text-[#7E8299]">#{item.product.id}</td>
                      <td className="py-2 px-3 font-bold text-[#3A3F58]">
                        {displayLanguage === "ur" ? item.product.nameUrdu : item.product.nameEn}
                        <span className="text-[10px] text-[#7E8299] block">
                          {displayLanguage === "ur" ? item.product.nameEn : item.product.nameUrdu}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-[#6C7293]">
                        PKR {item.product.price}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-[#3A3F58]">
                        {item.quantity}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-[#007BFF]">
                        PKR {(item.quantity * item.product.price).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuantity(item.product.id, item.quantity)}
                          className="size-6 rounded-md bg-rose-50 text-rose-600 inline-flex items-center justify-center hover:bg-rose-100 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-[#7E8299] font-medium">
                        {isUrduInterface ? "کوئی آئٹم منتخب نہیں کی گئی۔" : "No items selected."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Khata Payment Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Current Bill Total (Read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293]">
                {isUrduInterface ? "موجودہ بل (Current Bill)" : "Current Bill (PKR)"}
              </label>
              <div
                className="p-3 rounded-2xl bg-[#EDEBF8] text-base font-mono font-black text-[#007BFF]"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              >
                PKR {currentBillTotal.toLocaleString()}
              </div>
            </div>

            {/* Paid Amount */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                {isUrduInterface ? "وصول شدہ رقم (Paid / Received)" : "Cash Received / Paid (PKR)"}
              </label>
              <div
                className="p-1 rounded-2xl bg-[#EDEBF8] flex items-center"
                style={{
                  boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                }}
              >
                <input
                  type="number"
                  min={0}
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-transparent px-3 py-2 text-sm text-emerald-700 font-mono font-bold focus:outline-none placeholder:text-[#7E8299]"
                />
              </div>
            </div>

            {/* Previous Balance */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-700">
                {isUrduInterface ? "سابقہ بقایا (Previous Khata)" : "Previous Ledger Balance (PKR)"}
              </label>
              <div
                className="p-1 rounded-2xl bg-[#EDEBF8] flex items-center"
                style={{
                  boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                }}
              >
                <input
                  type="number"
                  min={0}
                  value={previousBalance || ""}
                  onChange={(e) => setPreviousBalance(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-transparent px-3 py-2 text-sm text-rose-700 font-mono font-bold focus:outline-none placeholder:text-[#7E8299]"
                />
              </div>
            </div>
          </div>

          {/* Real-time Ledger Balance Display Card */}
          <div
            className="p-4 rounded-2xl bg-[#EDEBF8] grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{
              boxShadow: "-4px -4px 10px #FFFFFF, 4px 4px 10px #C5C3D8",
            }}
          >
            <div>
              <div className="text-[11px] text-[#7E8299] font-bold">
                {isUrduInterface ? "باقی رقم (Current Bal)" : "Current Balance"}
              </div>
              <div className="text-sm font-mono font-bold text-[#3A3F58]">
                PKR {currentBalance.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#7E8299] font-bold">
                {isUrduInterface ? "مجموعی بل (Total Khata)" : "Total Khata"}
              </div>
              <div className="text-sm font-mono font-bold text-[#3A3F58]">
                PKR {totalKhataPayable.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#7E8299] font-bold">
                {isUrduInterface ? "مجموعی جمع (Total Paid)" : "Total Paid"}
              </div>
              <div className="text-sm font-mono font-bold text-emerald-600">
                PKR {paidAmount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-rose-600 font-bold">
                {isUrduInterface ? "حتمی واجب الادا (Net Outstanding)" : "Net Outstanding"}
              </div>
              <div className="text-sm font-mono font-black text-rose-600">
                PKR {totalOutstanding.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="h-10 px-4 rounded-xl bg-[#EDEBF8] text-[#6C7293] hover:text-[#3A3F58] font-bold text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
              style={{
                boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
              }}
            >
              <NavIcon name="ArrowLeft" className="w-4 h-4" />
              <span>{isUrduInterface ? "اشیاء پر واپس جائیں" : "Back to Items"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStep(4);
                handleFinishAndConfetti();
              }}
              className="h-11 px-6 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition shadow-md active:scale-95 cursor-pointer"
            >
              <span>{isUrduInterface ? "حتمی خلاصہ اور ایکسپورٹ دیکھیں" : "Generate Final Export"}</span>
              <NavIcon name="ArrowRight" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: EXPORT & FINAL SUMMARY ================= */}
      {currentStep === 4 && (
        <div
          id="step-4-export-card"
          className="p-6 rounded-2xl bg-[#EDEBF8] space-y-6"
          style={{
            boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
          }}
        >
          <div className="border-b border-[#C5C3D8]/40 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#3A3F58]">
                {isUrduInterface
                  ? "مرحلہ 4: حتمی خلاصہ اور ایکسپورٹ انجن"
                  : "Step 4: Order Export & Ledger Summary"}
              </h2>
              <p className="text-xs text-[#7E8299]">
                {isUrduInterface
                  ? "واٹس ایپ شیئرنگ کے لیے مکمل اردو متن اور پرنٹ/ایکسل کے لیے سی ایس وی ڈاؤن لوڈ کریں۔"
                  : "Formatted text output tagged with asterisk (*) for instant WhatsApp dispatch and CSV ledger download."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="neu-pill-badge bg-emerald-50 text-emerald-600 font-mono">
                ✓ ORDER READY
              </span>
            </div>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="copy-text-summary-btn"
              onClick={handleCopySummary}
              className="h-10 px-5 rounded-2xl bg-[#007BFF] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#0A84FF] transition shadow-md active:scale-95 cursor-pointer"
            >
              <NavIcon name="Copy" className="w-4 h-4" />
              <span>
                {copyFeedback
                  ? isUrduInterface
                    ? "✓ کاپی ہو گیا!"
                    : "✓ Copied to Clipboard!"
                  : isUrduInterface
                  ? "اردو بل کاپی کریں"
                  : "Copy Text Summary"}
              </span>
            </button>

            <button
              type="button"
              id="download-csv-btn"
              onClick={handleDownloadCSV}
              className="h-10 px-5 rounded-2xl bg-[#EDEBF8] text-[#3A3F58] hover:text-[#007BFF] font-bold text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
              style={{
                boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
            >
              <NavIcon name="Download" className="w-4 h-4 text-emerald-600" />
              <span>{isUrduInterface ? "سی ایس وی ڈاؤن لوڈ کریں (CSV)" : "Download CSV Ledger"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const text = encodeURIComponent(textSummary);
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }}
              className="h-10 px-5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition shadow-md active:scale-95 cursor-pointer"
            >
              <NavIcon name="Send" className="w-4 h-4" />
              <span>{isUrduInterface ? "واٹس ایپ پر بھیجیں" : "Send via WhatsApp"}</span>
            </button>
          </div>

          {/* Editable Formatted Text Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6C7293]">
                {isUrduInterface ? "فارمیٹڈ کھاتہ متن (Editable Text Output)" : "Formatted Text Output"}
              </label>
              <span className="text-[11px] text-[#7E8299]">
                {isUrduInterface ? "آپ ضرورت کے مطابق اس متن میں ترمیم کر سکتے ہیں۔" : "You can directly edit this text."}
              </span>
            </div>

            <textarea
              rows={14}
              defaultValue={textSummary}
              className="w-full p-4 rounded-2xl bg-[#EDEBF8] text-[#3A3F58] font-mono text-xs leading-relaxed focus:outline-none resize-y"
              style={{
                boxShadow: "inset 3px 3px 8px #C5C3D8, inset -3px -3px 8px #FFFFFF",
              }}
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-[#C5C3D8]/30 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="h-10 px-4 rounded-xl bg-[#EDEBF8] text-[#6C7293] hover:text-[#3A3F58] font-bold text-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
              style={{
                boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
              }}
            >
              <NavIcon name="ArrowLeft" className="w-4 h-4" />
              <span>{isUrduInterface ? "کھاتہ ایڈجسٹمنٹ پر واپس" : "Edit Khata"}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedItemsMap({});
                  setCurrentBatchIndex(0);
                  setActiveDeckIndex(0);
                  setCustomerName("");
                  setPaidAmount(0);
                  setPreviousBalance(0);
                  setCurrentStep(1);
                }}
                className="h-10 px-4 rounded-xl bg-[#EDEBF8] text-rose-600 font-bold text-xs transition active:scale-95 cursor-pointer"
                style={{
                  boxShadow: "-3px -3px 7px #FFFFFF, 3px 3px 7px #C5C3D8",
                }}
              >
                {isUrduInterface ? "نیا آرڈر شروع کریں" : "Start Another Order"}
              </button>

              <Link
                href={`/${locale}/orders`}
                className="h-10 px-5 rounded-xl bg-[#007BFF] text-white font-bold text-xs flex items-center gap-2 hover:bg-[#0A84FF] transition shadow-md active:scale-95 cursor-pointer"
              >
                <NavIcon name="Check" className="w-4 h-4" />
                <span>{isUrduInterface ? "آرڈرز پر واپس جائیں" : "Go to Orders List"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
