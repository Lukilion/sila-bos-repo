export type UserRole = "ADMIN" | "WAREHOUSE_MANAGER" | "SALES_REP" | "SUDO";

export interface NavSubItem {
  key: string;
  href: string;
  label: {
    en: string;
    ur: string;
  };
  permittedRoles: UserRole[];
  badge?: string | number;
}

export interface NavItem {
  key: string;
  href: string;
  label: {
    en: string;
    ur: string;
  };
  icon: string; // Lucide icon name
  permittedRoles: UserRole[];
  badge?: {
    text: string | number;
    variant: "neutral" | "warning" | "danger" | "success" | "accent";
  };
  subItems?: NavSubItem[];
  section?: "core" | "operations" | "commercial" | "financial" | "system";
}

export interface QuickCreateAction {
  id: string;
  label: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  icon: string;
  shortcut: string;
  href?: string;
  actionKey: "sales_order" | "purchase_order" | "khata_entry" | "export_bill" | "stock_transfer";
  permittedRoles: UserRole[];
}

export interface ApprovalAlert {
  id: string;
  type: "credit_limit" | "low_stock" | "discount_approval" | "margin_warning";
  title: {
    en: string;
    ur: string;
  };
  detail: {
    en: string;
    ur: string;
  };
  timestamp: string;
  urgency: "high" | "medium" | "low";
  amount?: string;
  entityId: string;
  permittedRoles: UserRole[];
}

export interface SystemNotification {
  id: string;
  category: "order" | "inventory" | "khata" | "system";
  title: {
    en: string;
    ur: string;
  };
  message: {
    en: string;
    ur: string;
  };
  time: string;
  read: boolean;
  actionUrl?: string;
}

export interface NavigationConfig {
  brand: {
    name: string;
    tagline: {
      en: string;
      ur: string;
    };
    hubCode: string;
    logoText: string;
  };
  navItems: NavItem[];
  quickCreateActions: QuickCreateAction[];
  bottomTabItems: {
    key: string;
    href: string;
    label: {
      en: string;
      ur: string;
    };
    icon: string;
    isMenuTrigger?: boolean;
    permittedRoles: UserRole[];
  }[];
}

export const NAVIGATION_CONFIG: NavigationConfig = {
  brand: {
    name: "SILA BOS",
    tagline: {
      en: "Shah Alami Wholesale Hub",
      ur: "شاہ عالمی مارکیٹ ہول سیل ہب",
    },
    hubCode: "LHR-SA-01",
    logoText: "صلہ",
  },
  navItems: [
    // 1. Dashboard / Home
    {
      key: "dashboard",
      href: "/dashboard",
      label: {
        en: "Dashboard",
        ur: "کنٹرول پینل",
      },
      icon: "LayoutDashboard",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
      section: "core",
    },

    // 2. Inventory & Warehousing
    {
      key: "inventory",
      href: "/inventory",
      label: {
        en: "Inventory & Godowns",
        ur: "انوینٹری و گودام",
      },
      icon: "Warehouse",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
      badge: {
        text: "3 Low",
        variant: "warning",
      },
      section: "operations",
      subItems: [
        {
          key: "stock_tracking",
          href: "/inventory/tracking",
          label: {
            en: "Stock Tracking & Bins",
            ur: "اسٹاک ٹریکنگ اور ریکس",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
        },
        {
          key: "multi_transfers",
          href: "/inventory/transfers",
          label: {
            en: "Multi-Warehouse Transfers",
            ur: "گودام در گودام منتقلی",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
        },
        {
          key: "batch_expiry",
          href: "/inventory/batches",
          label: {
            en: "Batch & Expiry Controls",
            ur: "بیچ نمبر اور ایکسپائری",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
        },
        {
          key: "stock_adjustments",
          href: "/inventory/adjustments",
          label: {
            en: "Stock Adjustments & Damage",
            ur: "اسٹاک آڈٹ و ٹوٹ پھوٹ",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
        },
      ],
    },

    // 3. B2B Orders & Fulfillment
    {
      key: "orders",
      href: "/orders",
      label: {
        en: "B2B Orders & Dispatch",
        ur: "تھوک آرڈرز و ڈسپیچ",
      },
      icon: "ShoppingBag",
      permittedRoles: ["ADMIN", "SALES_REP", "WAREHOUSE_MANAGER", "SUDO"],
      badge: {
        text: "12 New",
        variant: "accent",
      },
      section: "commercial",
      subItems: [
        {
          key: "bulk_sales",
          href: "/orders/sales",
          label: {
            en: "Bulk Sales Orders",
            ur: "ہول سیل سیلز آرڈرز",
          },
          permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
        },
        {
          key: "purchase_orders",
          href: "/orders/purchases",
          label: {
            en: "Purchase Orders (Lots)",
            ur: "خریداری لاٹس (پی او)",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
        },
        {
          key: "dispatch_tracking",
          href: "/orders/dispatches",
          label: {
            en: "Dispatch & Delivery Fleet",
            ur: "ڈسپیچ اور ڈیلیوری ٹریکنگ",
          },
          permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
        },
      ],
    },

    // 4. Customers & B2B Ledger (Khata)
    {
      key: "customers",
      href: "/customers",
      label: {
        en: "Customers & Khata Ledger",
        ur: "گاہک کھاتہ و واجبات",
      },
      icon: "BookOpenCheck",
      permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
      badge: {
        text: "PKR 2.8M",
        variant: "danger",
      },
      section: "commercial",
      subItems: [
        {
          key: "khata_receivables",
          href: "/customers/khata",
          label: {
            en: "Khata / Receivables Ledger",
            ur: "کھاتہ و ادھار وصولی",
          },
          permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
        },
        {
          key: "customer_profiles",
          href: "/customers/profiles",
          label: {
            en: "Customer Directory & NTN",
            ur: "گاہک ڈائرکٹری اور این ٹی این",
          },
          permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
        },
        {
          key: "credit_limits",
          href: "/customers/credit-limits",
          label: {
            en: "Credit Limits & Overrides",
            ur: "ادھار حد و منظوری",
          },
          permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
        },
        {
          key: "price_tiers",
          href: "/customers/price-tiers",
          label: {
            en: "Dual Wholesale Price Tiers",
            ur: "مخصوص تھوک قیمتیں",
          },
          permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
        },
      ],
    },

    // 5. Finance & Cash Flow
    {
      key: "finance",
      href: "/finance",
      label: {
        en: "Finance & Cash Flow",
        ur: "مالیات و کیش بک",
      },
      icon: "Coins",
      permittedRoles: ["ADMIN", "SUDO"],
      section: "financial",
      subItems: [
        {
          key: "cash_book",
          href: "/finance/cashbook",
          label: {
            en: "Daily Cash Book (روکڑ)",
            ur: "روزانہ کیش بک (روکڑ)",
          },
          permittedRoles: ["ADMIN", "SUDO"],
        },
        {
          key: "fbr_invoices",
          href: "/finance/invoices",
          label: {
            en: "FBR Digital Invoices",
            ur: "ایف بی آر ڈیجیٹل انوائسز",
          },
          permittedRoles: ["ADMIN", "SUDO"],
        },
        {
          key: "vendor_payables",
          href: "/finance/payables",
          label: {
            en: "Vendor Payables & Sourcing",
            ur: "سپلائر ادائیگیاں",
          },
          permittedRoles: ["ADMIN", "SUDO"],
        },
        {
          key: "bank_reconciliation",
          href: "/finance/reconciliation",
          label: {
            en: "Bank Reconciliation & Cheques",
            ur: "بینک اسٹیٹمنٹ و چیکس",
          },
          permittedRoles: ["ADMIN", "SUDO"],
        },
      ],
    },

    // 6. Sourcing & Lot Entry (Supplemental module)
    {
      key: "sourcing",
      href: "/sourcing",
      label: {
        en: "Market Sourcing Hub",
        ur: "مارکیٹ مال آمد ہب",
      },
      icon: "PackageSearch",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
      section: "operations",
    },

    // 7. Wholesale Catalog (Browse & Fast Order)
    {
      key: "catalog",
      href: "/catalog",
      label: {
        en: "Product Catalog",
        ur: "تھوک کیٹلاگ",
      },
      icon: "Grid",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
      section: "commercial",
    },

    // 8. Investor & Triple-Entry Vault
    {
      key: "investor",
      href: "/investor",
      label: {
        en: "Investor Khata Pool",
        ur: "انویسٹر پول کھاتہ",
      },
      icon: "TrendingUp",
      permittedRoles: ["ADMIN", "SUDO"],
      section: "financial",
    },

    // 9. Sudo & IAM Governance
    {
      key: "sudo",
      href: "/sudo",
      label: {
        en: "IAM & System Governance",
        ur: "سوڈو و اجازت نامے",
      },
      icon: "ShieldAlert",
      permittedRoles: ["SUDO", "ADMIN"],
      section: "system",
    },

    // 10. Neumorphic Design System (Soft UI Library)
    {
      key: "design_system",
      href: "/design-system",
      label: {
        en: "Soft UI Design System",
        ur: "نیومورفک ڈیزائن سسٹم",
      },
      icon: "Sparkles",
      badge: {
        text: "Soft UI",
        variant: "accent",
      },
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
      section: "core",
    },
  ],

  // Bottom Fixed Mobile Tab Bar
  bottomTabItems: [
    {
      key: "tab_home",
      href: "/dashboard",
      label: {
        en: "Home",
        ur: "ہوم",
      },
      icon: "LayoutDashboard",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
    },
    {
      key: "tab_orders",
      href: "/orders",
      label: {
        en: "Orders",
        ur: "آرڈرز",
      },
      icon: "ShoppingBag",
      permittedRoles: ["ADMIN", "SALES_REP", "WAREHOUSE_MANAGER", "SUDO"],
    },
    {
      key: "tab_inventory",
      href: "/inventory",
      label: {
        en: "Inventory",
        ur: "گودام",
      },
      icon: "Warehouse",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
    },
    {
      key: "tab_khata",
      href: "/customers",
      label: {
        en: "Khata",
        ur: "کھاتہ",
      },
      icon: "BookOpenCheck",
      permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
    },
    {
      key: "tab_menu",
      href: "#",
      label: {
        en: "Menu",
        ur: "مینو",
      },
      icon: "Menu",
      isMenuTrigger: true,
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"],
    },
  ],

  // Quick Create Dropdown Items
  quickCreateActions: [
    {
      id: "qc-sales-order",
      label: {
        en: "New Sales Order",
        ur: "نیا سیلز آرڈر بنائیں",
      },
      description: {
        en: "Create bulk order with dual wholesale pricing",
        ur: "تھوک نرخ پر نیا آرڈر درج کریں",
      },
      icon: "FilePlus",
      shortcut: "N",
      actionKey: "sales_order",
      href: "/orders/sales?action=new",
      permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
    },
    {
      id: "qc-purchase-order",
      label: {
        en: "New Purchase Order (PO)",
        ur: "نیا پرچیز آرڈر درج کریں",
      },
      description: {
        en: "Inward shipment lot allocation to Godown",
        ur: "گودام کے لیے نئی مال لاٹ اندراج",
      },
      icon: "Truck",
      shortcut: "P",
      actionKey: "purchase_order",
      href: "/sourcing",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
    },
    {
      id: "qc-khata-entry",
      label: {
        en: "Record Payment / Khata Entry",
        ur: "ادائیگی یا وصولی اندراج",
      },
      description: {
        en: "Post cash/cheque receipt to customer ledger",
        ur: "گاہک کے کھاتے میں نقد یا چیک وصولی جمع کریں",
      },
      icon: "ReceiptText",
      shortcut: "K",
      actionKey: "khata_entry",
      href: "/customers/khata?action=payment",
      permittedRoles: ["ADMIN", "SALES_REP", "SUDO"],
    },
    {
      id: "qc-stock-transfer",
      label: {
        en: "Multi-Godown Stock Transfer",
        ur: "گودام در گودام اسٹاک منتقلی",
      },
      description: {
        en: "Move inventory between Shah Alami godowns",
        ur: "مرکزی گودام سے سب گودام میں مال ٹرانسفر",
      },
      icon: "ArrowLeftRight",
      shortcut: "T",
      actionKey: "stock_transfer",
      href: "/inventory/transfers",
      permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
    },
    {
      id: "qc-export-bill",
      label: {
        en: "Export CSV Bill & Tax Summary",
        ur: "سی ایس وی بل اور ٹیکس رپورٹ",
      },
      description: {
        en: "Download FBR-compliant billing journal",
        ur: "ایف بی آر ٹیکس جرنل اور ڈیٹا ایکسپورٹ",
      },
      icon: "Download",
      shortcut: "E",
      actionKey: "export_bill",
      href: "/checkout",
      permittedRoles: ["ADMIN", "SUDO"],
    },
  ],
};

// Initial Mock Notifications
export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    category: "order",
    title: {
      en: "New Bulk Order #ORD-948104",
      ur: "نیا ہول سیل آرڈر #ORD-948104",
    },
    message: {
      en: "Haji Rafiq & Sons placed an order for 200 Fast Chargers (PKR 72,000).",
      ur: "حاجی رفیق اینڈ سنز نے 200 فاسٹ چارجرز کا آرڈر بک کروایا۔",
    },
    time: "4 mins ago",
    read: false,
    actionUrl: "/orders",
  },
  {
    id: "notif-2",
    category: "inventory",
    title: {
      en: "Low Stock Alert: Godown Gate 2",
      ur: "کم اسٹاک الرٹ: گودام گیٹ 2",
    },
    message: {
      en: "Type-C 65W Braided Cable is below 20 units threshold in Rack-01.",
      ur: "ٹائپ سی 65 واٹ کیبل 20 یونٹس سے کم رہ گئی ہے۔",
    },
    time: "28 mins ago",
    read: false,
    actionUrl: "/inventory",
  },
  {
    id: "notif-3",
    category: "khata",
    title: {
      en: "Payment Received: Lahore Tech",
      ur: "ادائیگی موصول ہوئی: لاہور ٹیک",
    },
    message: {
      en: "PKR 50,000 received via Habib Bank cheque #48190.",
      ur: "50,000 روپے حبیب بینک چیک #48190 کے ذریعے موصول۔",
    },
    time: "2 hours ago",
    read: false,
    actionUrl: "/customers",
  },
  {
    id: "notif-4",
    category: "system",
    title: {
      en: "FBR POS Daily Reconciliation",
      ur: "ایف بی آر پی او ایس روزانہ آڈٹ",
    },
    message: {
      en: "All 18 digital tax invoices transmitted successfully to FBR API.",
      ur: "تمام 18 ٹیکس انوائسز ایف بی آر کو کامیابی سے بھیج دی گئیں۔",
    },
    time: "Yesterday",
    read: true,
    actionUrl: "/checkout",
  },
];

// Initial Pending Approvals / Alert Badges
export const INITIAL_APPROVAL_ALERTS: ApprovalAlert[] = [
  {
    id: "appr-1",
    type: "credit_limit",
    title: {
      en: "Credit Limit Exceeded",
      ur: "ادھار حد سے تجاوز کی منظوری",
    },
    detail: {
      en: "Haji Rafiq & Sons requested order PKR 84,960 exceeding PKR 250,000 credit cap.",
      ur: "حاجی رفیق اینڈ سنز نے 250,000 کی کریڈٹ حد سے زیادہ کا آرڈر بک کیا ہے۔",
    },
    timestamp: "12m ago",
    urgency: "high",
    amount: "PKR 84,960",
    entityId: "ORD-948102",
    permittedRoles: ["ADMIN", "SUDO"],
  },
  {
    id: "appr-2",
    type: "low_stock",
    title: {
      en: "Critical Stock Re-order Trigger",
      ur: "ضروری مال خریداری الرٹ",
    },
    detail: {
      en: "OLED Display Assembly (Pack of 5) stock is at 10 units in Godown B.",
      ur: "او ایل ای ڈی ڈسپلے اسمبلی پینل گودام بی میں صرف 10 یونٹس باقی ہیں۔",
    },
    timestamp: "45m ago",
    urgency: "medium",
    amount: "10 Units",
    entityId: "prod-3",
    permittedRoles: ["ADMIN", "WAREHOUSE_MANAGER", "SUDO"],
  },
  {
    id: "appr-3",
    type: "discount_approval",
    title: {
      en: "Special Bulk Discount (7.5%)",
      ur: "خصوصی ڈسکاؤنٹ منظوری (7.5%)",
    },
    detail: {
      en: "Sales Rep applied 7.5% margin discount on 500 Fast Cables for Faisalabad Retail.",
      ur: "سیلز نمائندے نے 500 کیبلز پر 7.5 فیصد خصوصی ڈسکاؤنٹ لاگو کیا۔",
    },
    timestamp: "1h ago",
    urgency: "low",
    amount: "PKR 13,500 Save",
    entityId: "ORD-948110",
    permittedRoles: ["ADMIN", "SUDO"],
  },
];

// Helper to filter nav items based on user role
export function filterNavItemsByRole(items: NavItem[], role: UserRole): NavItem[] {
  return items
    .filter((item) => item.permittedRoles.includes(role))
    .map((item) => {
      if (!item.subItems) return item;
      return {
        ...item,
        subItems: item.subItems.filter((sub) => sub.permittedRoles.includes(role)),
      };
    });
}
