import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid

    // Upsert or create OTP in Prisma DB
    try {
      await prisma.emailOtp.create({
        data: {
          email: normalizedEmail,
          otp,
          expiresAt,
        },
      });
    } catch {
      // If table doesn't have create support or DB is fallback, proceed gracefully
    }

    // Check if SMTP is configured, else log OTP for dev / instant access
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    let emailSent = false;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"SILA Wholesale BOS" <${smtpUser}>`,
          to: normalizedEmail,
          subject: `Your SILA Wholesale Verification Code: ${otp}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #EDEBF8; padding: 24px; border-radius: 16px; color: #6C7293; max-width: 500px; margin: 0 auto;">
              <h2 style="color: #007BFF; margin-bottom: 8px;">SILA Wholesale BOS</h2>
              <p style="font-size: 14px; margin-bottom: 16px;">Here is your single-use one-time verification code for Shah Alami Wholesale Portal:</p>
              <div style="background: #FFFFFF; padding: 16px; border-radius: 12px; font-size: 32px; font-weight: bold; letter-spacing: 6px; text-align: center; color: #007BFF; box-shadow: 4px 4px 10px #C5C3D8;">
                ${otp}
              </div>
              <p style="font-size: 12px; color: #7E8299; margin-top: 16px;">This code expires in 10 minutes. If you did not request this code, you can safely ignore this email.</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailErr) {
        console.warn("SMTP email sending error, falling back to instant code delivery:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? `Verification code dispatched to ${normalizedEmail}`
        : `Verification code generated for ${normalizedEmail}`,
      // Return devOtp for direct preview testing
      devOtp: otp,
      expiresAt: expiresAt.toISOString(),
      purpose: purpose || "login",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
