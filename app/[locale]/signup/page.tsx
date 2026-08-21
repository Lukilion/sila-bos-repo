"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function SignUpRedirectPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en-US";

  useEffect(() => {
    router.replace(`/${locale}/login?mode=signup`);
  }, [locale, router]);

  return (
    <div className="bg-[#DFDCF0] min-h-screen flex items-center justify-center py-8 px-4 font-sans select-none text-[#3A3F58]">
      <div className="w-full max-w-xl p-8 rounded-3xl neu-card flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#007BFF]" />
        <span className="text-xs font-bold text-[#6C7293]">Redirecting to Wholesale Registration...</span>
      </div>
    </div>
  );
}
