const BASE_URL = 'http://localhost:3000';

const routes = [
  '/',
  '/opportunities',
  '/login',
  '/signup',
  '/forgot-password',
  '/onboarding',
  '/onboarding/complete',
  '/my-posts',
  '/saved',
  '/profile',
  '/notifications',
  '/admin',
];

async function verifyPages() {
  console.log('🧪 Verifying page routes rendering...\n');
  let passed = 0;
  let failed = 0;

  for (const route of routes) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      const text = await res.text();
      const isHtml = text.includes('<!DOCTYPE html>') || text.includes('<html');
      if (res.status === 200 && isHtml) {
        console.log(`  ✅ 200 OK: ${route.padEnd(24)} (${text.length} bytes)`);
        passed++;
      } else {
        console.error(`  ❌ FAIL: ${route.padEnd(24)} Status: ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ❌ ERROR: ${route.padEnd(24)} ${err.message}`);
      failed++;
    }
  }

  // Also verify opportunity detail route with real seed id
  const oppRes = await fetch(`${BASE_URL}/api/opportunities?limit=1`);
  const oppData = await oppRes.json();
  if (oppData.opportunities && oppData.opportunities.length > 0) {
    const oppId = oppData.opportunities[0].id;
    const detailRoute = `/opportunities/${oppId}`;
    const res = await fetch(`${BASE_URL}${detailRoute}`);
    const text = await res.text();
    if (res.status === 200) {
      console.log(`  ✅ 200 OK: ${detailRoute.padEnd(24)} (${text.length} bytes)`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${detailRoute.padEnd(24)} Status: ${res.status}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} routes OK, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

verifyPages();
