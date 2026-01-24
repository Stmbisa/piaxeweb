export const runtime = "nodejs";

function requiredEnv(name: string) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function optionalEnv(name: string, fallback: string) {
  return process.env[name] || fallback;
}

function parseFingerprints(raw: string): string[] {
  return raw
  .split(/,|\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function GET() {
  const packageName = optionalEnv("ANDROID_PACKAGE_NAME", "com.piaxis.myapp");
  const fingerprints = parseFingerprints(requiredEnv("ANDROID_SHA256_CERT_FINGERPRINTS"));

  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
