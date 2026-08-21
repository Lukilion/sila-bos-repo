import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-shah-alami"
);

export async function POST(req: NextRequest) {
  try {
    const { uid, email, displayName, photoURL, provider, role } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address from provider is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const resolvedName = displayName || normalizedEmail.split("@")[0].toUpperCase();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    }).catch(() => null);

    if (!user) {
      let defaultTenant = await prisma.tenant.findFirst().catch(() => null);
      if (!defaultTenant) {
        try {
          defaultTenant = await prisma.tenant.create({
            data: {
              name: "Shah Alami Wholesale Hub",
              code: "SHAH_ALAMI_01",
            },
          });
        } catch {
          // ignore
        }
      }

      const tenantId = defaultTenant?.id || "tenant-shah-alami-01";
      const generatedPhone = `03${Math.floor(100000000 + Math.random() * 900000000)}`;

      let assignedRole: Role = Role.SELLER;
      const roleStr = (role || "").toUpperCase();
      if (roleStr === "SUDO") assignedRole = Role.SUDO;
      else if (roleStr === "ADMIN") assignedRole = Role.ADMIN;
      else if (roleStr === "INVESTOR") assignedRole = Role.INVESTOR;
      else if (roleStr === "SOURCING_AGENT" || roleStr === "DISTRIBUTOR") assignedRole = Role.SOURCING_AGENT;

      try {
        user = await prisma.user.create({
          data: {
            id: uid ? `oauth_${uid}` : undefined,
            tenantId,
            email: normalizedEmail,
            fullName: resolvedName,
            phone: generatedPhone,
            passwordHash: `OAUTH_${(provider || "SOCIAL").toUpperCase()}_VERIFIED`,
            role: assignedRole,
            isActive: true,
          },
        });
      } catch {
        // Fallback user object
        user = {
          id: uid ? `oauth_${uid}` : `usr_${Date.now()}`,
          tenantId,
          email: normalizedEmail,
          fullName: resolvedName,
          phone: generatedPhone,
          passwordHash: "OAUTH_VERIFIED",
          role: assignedRole,
          creditLimit: 0 as unknown as any,
          creditDays: 30,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    // Generate JWT cookie session
    const token = await new SignJWT({
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
      phone: user.phone,
      name: user.fullName,
      email: user.email,
      photoURL: photoURL || null,
      provider: provider || "oauth",
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

    let redirectPath = "/catalog";
    switch (user.role) {
      case "SUDO":
        redirectPath = "/sudo";
        break;
      case "ADMIN":
        redirectPath = "/admin";
        break;
      case "INVESTOR":
        redirectPath = "/investor";
        break;
      case "SOURCING_AGENT":
        redirectPath = "/sourcing";
        break;
      default:
        redirectPath = "/catalog";
        break;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      redirectPath,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OAuth session creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
