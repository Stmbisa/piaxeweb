export const runtime = "nodejs";

function requiredEnv(name: string) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function optionalEnv(name: string, fallback: string) {
  return process.env[name] || fallback;
}

export async function GET() {
  const teamId = requiredEnv("APPLE_TEAM_ID");
  const bundleId = optionalEnv("IOS_BUNDLE_ID", "com.piaxis.myapp");

  const body = {
    applinks: {
      apps: [],
      details: [
        {
          appID: `${teamId}.${bundleId}`,
          paths: [
            "/pay/*",
            "/request/*",
            "/cart/*",
            "/join-group/*",
            "/escrow/*",
            "/invite/*",
            "/store/*",
            "/scan/*",
          ],
        },
      ],
    },
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Keep it cacheable but not sticky while you iterate.
      "cache-control": "public, max-age=300, s-maxage=300",
    },
  });
}
