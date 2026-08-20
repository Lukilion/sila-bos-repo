import type { Metadata } from "next";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
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
  title: "Sila Bos",
  description: "Sila Bos application",
};

function MobileDrawerNav({ locale }: { locale: string }) {
  return (
    <div className="flex items-center gap-2 md:hidden" aria-label={`Navigation for ${locale}`}>
      <span className="h-5 w-5 rounded-sm bg-neu-accent/80" />
    </div>
  );
}

function DirectionSwitcher({ currentLocale }: { currentLocale: string }) {
  return (
    <div className="text-xs font-medium uppercase tracking-[0.2em] text-neu-text/70">
      {currentLocale}
    </div>
  );
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const tHeader = await getTranslations({ locale, namespace: "Header" });
  const direction = locale === "ur-PK" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction} className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoNastaleeq.variable} bg-neu-base text-neu-text antialiased min-h-screen flex flex-col font-sans`}
      >
        <NextIntlClientProvider messages={messages}>
          <header className="sticky top-0 z-40 bg-neu-flat/80 backdrop-blur-md border-b border-neu-light/20 px-4 py-3 shadow-neu-extruded-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MobileDrawerNav locale={locale} />
              <h1 className="text-lg font-bold tracking-tight bg-neu-accent-gradient bg-clip-text text-transparent">
                {tHeader("title")}
              </h1>
            </div>
            <DirectionSwitcher currentLocale={locale} />
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
