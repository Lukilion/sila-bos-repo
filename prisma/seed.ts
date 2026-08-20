import bcrypt from "bcryptjs";

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
  if (!connectionString) {
    console.error("No DATABASE_URL or DIRECT_URL found in environment. Set it to your database connection string and re-run the seed.");
    process.exit(1);
  }

  const { prisma } = await import("../lib/prisma");

  const defaultPassword = await bcrypt.hash("Admin@12345", 10);

  // 1. Create Default Tenant[cite: 1]
  const tenant = await prisma.tenant.upsert({
    where: { code: "SHAH_ALAMI_HUB" },
    update: {},
    create: {
      name: "Shah Alami Wholesale Hub",
      code: "SHAH_ALAMI_HUB",
    },
  });

  // 2. Create Sudo Admin User[cite: 1]
  await prisma.user.upsert({
    where: { phone: "03000000000" },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "sudo@shahalami.com",
      phone: "03000000000",
      fullName: "Super Admin (Sudo)",
      passwordHash: defaultPassword,
      role: "SUDO",
    },
  });

  // 3. Create Operations Admin (Mukhtar)[cite: 1]
  await prisma.user.upsert({
    where: { phone: "03001111111" },
    update: {},
    create: {
      tenantId: tenant.id,
      email: "admin@shahalami.com",
      phone: "03001111111",
      fullName: "Mukhtar Operations Admin",
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  });

  // 4. Create Sample Warehouse & category[cite: 1]
  await prisma.warehouse.create({
    data: {
      tenantId: tenant.id,
      name: "Central Receiving Godown A",
      location: "Main Market Gate 2, Shah Alami, Lahore",
    },
  });

  await prisma.category.create({
    data: {
      nameEn: "Electronics & Accessories",
      nameUr: "الیکٹرانکس اور لوازمات",
    },
  });

  console.log("Database seeded successfully with default tenant and user accounts.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // dynamic import ensures prisma exists in this scope
    try {
      const { prisma } = await import("../lib/prisma");
      await prisma.$disconnect();
    } catch (e) {
      // ignore
    }
  });
