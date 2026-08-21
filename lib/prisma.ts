/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Default in-memory seed records for development / mock mode when DB is not connected
const defaultTenant = {
  id: "tenant-shah-alami",
  name: "Shah Alami Wholesale Hub",
  code: "SHAH_ALAMI_HUB",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const defaultCategories = [
  {
    id: "cat-1",
    nameEn: "Electronics & Fast Accessories",
    nameUr: "الیکٹرانکس اور تیز رفتار لوازمات",
  },
  {
    id: "cat-2",
    nameEn: "Mobile Spare Parts & Cables",
    nameUr: "موبائل اسپیئر پارٹس اور کیبلز",
  },
  {
    id: "cat-3",
    nameEn: "Hardware & Tools",
    nameUr: "ہارڈ ویئر اور اوزار",
  },
];

const defaultWarehouses = [
  {
    id: "wh-1",
    tenantId: defaultTenant.id,
    name: "Central Receiving Godown A (Gate 2)",
    location: "Main Market Gate 2, Shah Alami, Lahore",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "wh-2",
    tenantId: defaultTenant.id,
    name: "Bansanwala Godown B",
    location: "Bansanwala Bazar, Lahore",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "wh-3",
    tenantId: defaultTenant.id,
    name: "Rang Mahal Distribution Depot",
    location: "Rang Mahal, Shah Alami, Lahore",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultProducts = [
  {
    id: "prod-1",
    tenantId: defaultTenant.id,
    categoryId: "cat-1",
    sku: "CBL-TC-65W",
    barcode: "89640001",
    nameEn: "Type-C 65W Fast Charging Braided Cable (1.2m)",
    nameUr: "فاسٹ چارجنگ کیبل 65 واٹ",
    unitCost: "280.00",
    bulkPrice: "360.00",
    salePrice: "520.00",
    moq: 50,
    minStockAlert: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    inventoryBins: [
      { id: "bin-1", warehouseId: "wh-1", productId: "prod-1", binCode: "Zone-A-Rack-01", quantity: 1200, updatedAt: new Date() },
      { id: "bin-2", warehouseId: "wh-2", productId: "prod-1", binCode: "Zone-B-Rack-04", quantity: 800, updatedAt: new Date() },
    ],
  },
  {
    id: "prod-2",
    tenantId: defaultTenant.id,
    categoryId: "cat-1",
    sku: "ADP-GAN-33W",
    barcode: "89640002",
    nameEn: "GaN Dual Port Mini Fast Charger Adapter 33W",
    nameUr: "منی فاسٹ چارجر اڈاپٹر 33 واٹ",
    unitCost: "680.00",
    bulkPrice: "850.00",
    salePrice: "1250.00",
    moq: 25,
    minStockAlert: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    inventoryBins: [
      { id: "bin-3", warehouseId: "wh-1", productId: "prod-2", binCode: "Zone-A-Rack-02", quantity: 650, updatedAt: new Date() },
    ],
  },
  {
    id: "prod-3",
    tenantId: defaultTenant.id,
    categoryId: "cat-2",
    sku: "LCD-OLED-A15",
    barcode: "89640003",
    nameEn: "Original OLED Display Assembly (Pack of 5)",
    nameUr: "او ایل ای ڈی ڈسپلے اسمبلی پینل",
    unitCost: "4200.00",
    bulkPrice: "4800.00",
    salePrice: "6500.00",
    moq: 5,
    minStockAlert: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    inventoryBins: [
      { id: "bin-4", warehouseId: "wh-2", productId: "prod-3", binCode: "Zone-B-Secure-01", quantity: 180, updatedAt: new Date() },
    ],
  },
  {
    id: "prod-4",
    tenantId: defaultTenant.id,
    categoryId: "cat-3",
    sku: "KIT-MAG-24IN1",
    barcode: "89640004",
    nameEn: "Precision Magnetic Screwdriver Toolkit 24-in-1",
    nameUr: "میگنیٹک اسکرو ڈرائیور ٹول کٹ",
    unitCost: "420.00",
    bulkPrice: "560.00",
    salePrice: "890.00",
    moq: 20,
    minStockAlert: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    inventoryBins: [
      { id: "bin-5", warehouseId: "wh-3", productId: "prod-4", binCode: "Zone-C-Rack-01", quantity: 420, updatedAt: new Date() },
    ],
  },
];

// Hashed password for "Admin@12345" and "Lukilion9211"
const defaultPasswordHash = "$2a$10$i0K6bL6y8j6bVjV9r1.OoeZ8yHqU9E0.R89c9Z4g4U.O0gE4fC2vK";

const defaultUsers = [
  {
    id: "user-sudo",
    tenantId: defaultTenant.id,
    email: "sudo@shahalami.com",
    phone: "03000000000",
    fullName: "Super Admin (Sudo Central)",
    passwordHash: defaultPasswordHash,
    role: "SUDO",
    creditLimit: "1000000.00",
    creditDays: 60,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-admin",
    tenantId: defaultTenant.id,
    email: "admin@shahalami.com",
    phone: "03001111111",
    fullName: "Mukhtar Operations Admin",
    passwordHash: defaultPasswordHash,
    role: "ADMIN",
    creditLimit: "500000.00",
    creditDays: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-seller-1",
    tenantId: defaultTenant.id,
    email: "seller1@shahalami.com",
    phone: "03001234567",
    fullName: "Haji Rafiq & Sons Wholesale",
    passwordHash: defaultPasswordHash,
    role: "SELLER",
    creditLimit: "250000.00",
    creditDays: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-seller-2",
    tenantId: defaultTenant.id,
    email: "seller2@shahalami.com",
    phone: "03057851808",
    fullName: "Lahore Tech Retailers",
    passwordHash: defaultPasswordHash,
    role: "SELLER",
    creditLimit: "150000.00",
    creditDays: 15,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user-investor-1",
    tenantId: defaultTenant.id,
    email: "investor@shahalami.com",
    phone: "03009999999",
    fullName: "Chaudhry Akram (Partner Pool)",
    passwordHash: defaultPasswordHash,
    role: "INVESTOR",
    creditLimit: "0.00",
    creditDays: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultOrders = [
  {
    id: "ord-1001",
    tenantId: defaultTenant.id,
    orderNumber: "ORD-948102",
    sellerId: "user-seller-1",
    seller: defaultUsers[2],
    status: "APPROVED",
    paymentType: "CREDIT_UDHAAR",
    subTotal: "72000.00",
    taxAmount: "12960.00",
    discount: "0.00",
    totalAmount: "84960.00",
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(),
    items: [],
  },
  {
    id: "ord-1002",
    tenantId: defaultTenant.id,
    orderNumber: "ORD-948103",
    sellerId: "user-seller-2",
    seller: defaultUsers[3],
    status: "DISPATCHED",
    paymentType: "CASH",
    subTotal: "34000.00",
    taxAmount: "6120.00",
    discount: "500.00",
    totalAmount: "39620.00",
    createdAt: new Date(Date.now() - 3600000 * 18),
    updatedAt: new Date(),
    items: [],
  },
];

const defaultLedgers = [
  {
    id: "tx-1",
    tenantId: defaultTenant.id,
    userId: "user-investor-1",
    orderId: null,
    type: "INVESTOR_POOL",
    debit: "0.00",
    credit: "2500000.00",
    balance: "2500000.00",
    description: "Capital Injection - Shah Alami Working Capital Pool A",
    createdAt: new Date(Date.now() - 86400000 * 5),
    user: defaultUsers[4],
    order: null,
  },
  {
    id: "tx-2",
    tenantId: defaultTenant.id,
    userId: "user-admin",
    orderId: null,
    type: "PROCUREMENT_OUTFLOW",
    debit: "850000.00",
    credit: "0.00",
    balance: "1650000.00",
    description: "Bulk Sourcing Lot #542 (Fast Cables & GaN Adapters)",
    createdAt: new Date(Date.now() - 86400000 * 4),
    user: defaultUsers[1],
    order: null,
  },
  {
    id: "tx-3",
    tenantId: defaultTenant.id,
    userId: "user-seller-1",
    orderId: "ord-1001",
    type: "SELLER_INFLOW",
    debit: "0.00",
    credit: "84960.00",
    balance: "1734960.00",
    description: "Wholesale Order Payment ORD-948102",
    createdAt: new Date(Date.now() - 86400000 * 2),
    user: defaultUsers[2],
    order: defaultOrders[0],
  },
  {
    id: "tx-4",
    tenantId: defaultTenant.id,
    userId: null,
    orderId: null,
    type: "OPERATIONAL_EXPENSE",
    debit: "35000.00",
    credit: "0.00",
    balance: "1699960.00",
    description: "Godown rent & cartage charges (Gate 2)",
    createdAt: new Date(Date.now() - 86400000 * 1),
    user: null,
    order: null,
  },
];

const defaultInvestments = [
  {
    id: "inv-1",
    tenantId: defaultTenant.id,
    investorId: "user-investor-1",
    investor: defaultUsers[4],
    amount: "2500000.00",
    profitShare: "22.50",
    active: true,
    createdAt: new Date(),
  },
  {
    id: "inv-2",
    tenantId: defaultTenant.id,
    investorId: "user-sudo",
    investor: defaultUsers[0],
    amount: "5000000.00",
    profitShare: "45.00",
    active: true,
    createdAt: new Date(),
  },
];

// In-Memory Store
const store = {
  tenant: [...defaultTenant ? [defaultTenant] : []],
  category: [...defaultCategories],
  warehouse: defaultWarehouses.map((w) => ({
    ...w,
    bins: defaultProducts.flatMap((p) => p.inventoryBins.filter((b) => b.warehouseId === w.id)),
  })),
  product: defaultProducts.map((p) => ({
    ...p,
    category: defaultCategories.find((c) => c.id === p.categoryId),
  })),
  user: defaultUsers.map((u) => ({
    ...u,
    tenant: defaultTenant,
  })),
  order: [...defaultOrders],
  transactionLedger: [...defaultLedgers],
  investment: [...defaultInvestments],
  expense: [] as any[],
  damageLog: [] as any[],
  fbrInvoiceLog: [] as any[],
  auditLog: [] as any[],
};

function createMockModel(modelName: keyof typeof store) {
  return {
    findMany: async (args?: any) => {
      let list = store[modelName] ? [...store[modelName]] : [];
      if (args?.where) {
        list = list.filter((item: any) => {
          return Object.entries(args.where).every(([key, val]) => {
            if (val === undefined) return true;
            return item[key] === val;
          });
        });
      }
      if (args?.orderBy) {
        // simple order by
        const [k, dir] = Object.entries(args.orderBy)[0] || [];
        if (k) {
          list.sort((a: any, b: any) => {
            if (a[k] < b[k]) return dir === "desc" ? 1 : -1;
            if (a[k] > b[k]) return dir === "desc" ? -1 : 1;
            return 0;
          });
        }
      }
      if (args?.take) {
        list = list.slice(0, args.take);
      }
      return list;
    },
    findFirst: async (args?: any) => {
      const list = await (createMockModel(modelName).findMany(args));
      return list[0] ?? null;
    },
    findUnique: async (args?: any) => {
      const list = store[modelName] || [];
      const where = args?.where || {};
      const found = list.find((item: any) => {
        return Object.entries(where).every(([k, v]) => item[k] === v);
      });
      return found ?? null;
    },
    count: async (args?: any) => {
      const list = await (createMockModel(modelName).findMany(args));
      return list.length;
    },
    create: async (args: any) => {
      const newItem = {
        id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      if (modelName === "user") {
        newItem.tenant = defaultTenant;
      }
      if (store[modelName]) {
        store[modelName].push(newItem);
      }
      return newItem;
    },
    upsert: async (args: any) => {
      const existing = await createMockModel(modelName).findUnique({ where: args.where });
      if (existing) {
        Object.assign(existing, args.update || {}, { updatedAt: new Date() });
        return existing;
      } else {
        return createMockModel(modelName).create({ data: args.create });
      }
    },
    update: async (args: any) => {
      const existing = await createMockModel(modelName).findUnique({ where: args.where });
      if (existing) {
        Object.assign(existing, args.data || {}, { updatedAt: new Date() });
        return existing;
      }
      return args.data;
    },
    delete: async (args: any) => {
      const list = store[modelName] || [];
      const where = args?.where || {};
      const idx = list.findIndex((item: any) => Object.entries(where).every(([k, v]) => item[k] === v));
      if (idx !== -1) {
        return list.splice(idx, 1)[0];
      }
      return {};
    },
    deleteMany: async (args: any) => {
      if (!store[modelName]) return { count: 0 };
      const where = args?.where || {};
      const initialLen = store[modelName].length;
      store[modelName] = store[modelName].filter((item: any) => {
        return !Object.entries(where).every(([k, v]) => item[k] === v);
      });
      return { count: initialLen - store[modelName].length };
    },
  };
}

const mockPrisma = new Proxy(
  {
    $disconnect: async () => {},
  } as any,
  {
    get: (target, prop: string) => {
      if (prop in target) return target[prop];
      if (prop in store) {
        return createMockModel(prop as keyof typeof store);
      }
      return createMockModel(prop as any);
    },
  }
);

// Create real or mock instance
let realPrisma: PrismaClient | null = null;
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";

if (connectionString && !connectionString.includes("mock")) {
  try {
    const adapter = new PrismaPg({ connectionString });
    realPrisma = new PrismaClient({ adapter });
  } catch (err) {
    console.warn("[AI Studio] Failed to init real Prisma client, using resilient mock store:", err);
  }
}

// Global handler with proxy fallback
const globalForPrisma = globalThis as unknown as {
  prisma: typeof mockPrisma | undefined;
};

export const prisma = globalForPrisma.prisma ?? (realPrisma ?? mockPrisma);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
