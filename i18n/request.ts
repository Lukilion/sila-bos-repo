import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fallback to default if undefined or not supported
  if (!locale || !["en-US", "ur-PK"].includes(locale)) {
    locale = "en-US";
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
