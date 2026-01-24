const ANDROID_PACKAGE = process.env.NEXT_PUBLIC_ANDROID_PACKAGE_NAME || "com.piaxis.myapp";
const ANDROID_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_ANDROID_PLAY_STORE_URL ||
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;
const IOS_APP_STORE_URL = process.env.NEXT_PUBLIC_IOS_APP_STORE_URL || "";

export function buildCustomSchemeUrl(pathWithQuery: string) {
  const cleaned = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  // Use the standard scheme URL shape.
  // Example: piaxis://scan?code=...
  return `piaxis://${cleaned.slice(1)}`;
}

export function buildAndroidStoreUrl(originalUrl: string) {
  // Best-effort: attach original URL as an install referrer so we can support deferred deep linking later.
  // To actually open the deep link after install, the native app must read the Play Install Referrer.
  const referrer = encodeURIComponent(`deeplink=${encodeURIComponent(originalUrl)}`);
  const sep = ANDROID_PLAY_STORE_URL.includes("?") ? "&" : "?";
  return `${ANDROID_PLAY_STORE_URL}${sep}referrer=${referrer}`;
}

export function getIosStoreUrl() {
  return IOS_APP_STORE_URL;
}

export function getAndroidStoreUrl(originalUrl: string) {
  return buildAndroidStoreUrl(originalUrl);
}

export function getAndroidPackageName() {
  return ANDROID_PACKAGE;
}
