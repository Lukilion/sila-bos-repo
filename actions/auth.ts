"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-shah-alami"
);

export async function loginAction(formData: FormData, locale: string) {
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!phone || !password) {
    return { error: "Phone and password are required." };
  }

  const user = await prisma.user.findUnique({
    where: { phone },
    include: { tenant: true },
  });

  if (!user || !user.isActive) {
    return { error: "Invalid credentials or account inactive." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: "Invalid credentials." };
  }

  const token = await new SignJWT({
    sub: user.id,
    role: user.role,
    tenantId: user.tenantId,
    phone: user.phone,
    name: user.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  switch (user.role) {
    case "SUDO":
      redirect(`/${locale}/sudo`);
    case "ADMIN":
      redirect(`/${locale}/admin`);
    case "INVESTOR":
      redirect(`/${locale}/investor`);
    case "SOURCING_AGENT":
      redirect(`/${locale}/sourcing`);
    case "SELLER":
    default:
      redirect(`/${locale}/catalog`);
  }
}

export async function signUpAction(formData: FormData, locale: string) {
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const requestedRole = (formData.get("role") as string) || "seller";

  if (!fullName || !phone || !password) {
    return { error: "All fields are required." };
  }

  const normalizedPhone = phone.trim();
  const existingUser = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
  if (existingUser) {
    return { error: "An account with this phone number already exists." };
  }

  const defaultTenant = await prisma.tenant.findFirst();
  if (!defaultTenant) {
    return { error: "System tenant not initialized. Please run database seed." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const email = `${normalizedPhone}@sila.local`;

  // Map requested role to Prisma Role enum if possible
  let roleToAssign: Role = Role.SELLER;
  switch ((requestedRole || "").toLowerCase()) {
    case "sudo":
      roleToAssign = Role.SUDO as Role;
      break;
    case "admin":
      roleToAssign = Role.ADMIN as Role;
      break;
    case "distributor":
      // try DISTRIBUTOR if exists else fallback to SOURCING_AGENT
      // keep as string cast—Prisma will validate at runtime
      roleToAssign = (Role as any).DISTRIBUTOR || Role.SOURCING_AGENT;
      break;
    case "seller":
    default:
      roleToAssign = Role.SELLER;
      break;
  }

  const user = await prisma.user.create({
    data: {
      tenantId: defaultTenant.id,
      email,
      fullName,
      phone: normalizedPhone,
      passwordHash,
      role: roleToAssign,
    },
  });

  const token = await new SignJWT({
    sub: user.id,
    role: user.role,
    tenantId: user.tenantId,
    phone: user.phone,
    name: user.fullName,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(`/${locale}/catalog`);
}

export async function logoutAction(locale: string) {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect(`/${locale}/login`);
}
