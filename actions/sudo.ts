"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { jwtVerify, JWTPayload } from "jose";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-shah-alami"
);

interface CustomAuthPayload extends JWTPayload {
  role?: string;
  tenantId?: string;
}

export async function changeUserRole(formData: FormData) {
  const userId = formData.get("userId") as string;
  const newRole = (formData.get("newRole") as string) || "SELLER";
  const locale = (formData.get("locale") as string) || "en-US";

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) throw new Error("Not authenticated.");

  const { payload } = await jwtVerify<CustomAuthPayload>(token, JWT_SECRET).catch(() => {
    throw new Error("Invalid token.");
  });

  const actorRole = payload.role;
  if (actorRole !== "SUDO") throw new Error("Unauthorized.");

  await prisma.user.update({ where: { id: userId }, data: { role: newRole as Role } });

  // redirect back to sudo dashboard
  redirect(`/${locale}/sudo`);
}

// Dev-only helper: create or upsert a SUDO user. Only allowed in non-production or when ENABLE_DEV_SUDO=true
export async function createDevSudo(formData: FormData) {
  if (process.env.NODE_ENV === "production" && process.env.ENABLE_DEV_SUDO !== "true") {
    throw new Error("Not allowed in production.");
  }

  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("fullName") as string) || "Dev Sudo";

  if (!phone || !password) throw new Error("Phone and password required.");

  const bcrypt = (await import("bcryptjs")).default;
  const passwordHash = await bcrypt.hash(password, 10);

  const defaultTenant = await prisma.tenant.findFirst();
  if (!defaultTenant) throw new Error("No tenant found.");

  await prisma.user.upsert({
    where: { phone },
    update: { passwordHash, role: Role.SUDO, fullName },
    create: {
      phone,
      fullName,
      email: `${phone}@sila.local`,
      passwordHash,
      tenantId: defaultTenant.id,
      role: Role.SUDO,
    },
  });

  // redirect back to sudo dashboard
  redirect(`/en-US/sudo`);
}
