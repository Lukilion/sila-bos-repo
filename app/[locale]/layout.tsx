import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { EnterpriseShell } from "@/components/navigation/EnterpriseShell";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoNastaleeq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaleeq",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Sila BOS - Wholesale Operating System",
  description: "Shah Alami Wholesale Business Operating System",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const direction = locale === "ur-PK" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoNastaleeq.variable} bg-slate-950 text-slate-100 antialiased min-h-screen font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <EnterpriseShell locale={locale}>
            {children}
          </EnterpriseShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

