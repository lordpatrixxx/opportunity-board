// Updated E2E verification test for Opportunity Board
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('🚀 Starting Opportunity Board E2E Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. Categories
  console.log('--- Test 1: Category Listing ---');
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const catData = await catRes.json();
  assert(catRes.status === 200, 'GET /api/categories returns 200');
  assert(catData.categories && catData.categories.length >= 5, `Fetched ${catData.categories?.length} categories`);

  // 2. Browse & Search Opportunities
  console.log('\n--- Test 2: Browse & Search Opportunities ---');
  const oppRes = await fetch(`${BASE_URL}/api/opportunities?limit=10`);
  const oppData = await oppRes.json();
  assert(oppRes.status === 200, 'GET /api/opportunities returns 200');
  assert(oppData.opportunities && oppData.opportunities.length > 0, `Browse returned ${oppData.opportunities?.length} opportunities`);

  const searchRes = await fetch(`${BASE_URL}/api/opportunities?q=AI`);
  const searchData = await searchRes.json();
  assert(searchRes.status === 200, 'Search with keyword q=AI returns 200');
  assert(searchData.opportunities && searchData.opportunities.length > 0, `Search returned ${searchData.opportunities?.length} matches`);

  // 3. User Authentication (Login)
  console.log('\n--- Test 3: Authentication (Login) ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@stanford.edu',
      password: 'Password123!',
    }),
  });
  assert(loginRes.status === 200, 'POST /api/auth/login returns 200');
  const loginData = await loginRes.json();
  assert(loginData.user && loginData.user.email === 'student@stanford.edu', 'Student session retrieved');

  // Extract clean cookie name=value
  const setCookie = loginRes.headers.get('set-cookie') || '';
  const cleanCookie = setCookie.split(';')[0];
  assert(cleanCookie.startsWith('auth-token='), 'Valid auth-token cookie extracted');

  // 4. Check Current User Session
  console.log('\n--- Test 4: Session Persistence (/api/auth/me) ---');
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { cookie: cleanCookie },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200, 'GET /api/auth/me returns 200 with cookie');
  assert(meData.user?.fullName === 'Maya Lin', `Session identity verified: ${meData.user?.fullName}`);

  // 5. Bookmarks Flow
  console.log('\n--- Test 5: Bookmarks (Save & Unsave) ---');
  const testOppId = oppData.opportunities[0].id;
  const saveRes = await fetch(`${BASE_URL}/api/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cleanCookie },
    body: JSON.stringify({ opportunityId: testOppId }),
  });
  const saveData = await saveRes.json();
  assert(saveRes.status === 200 || saveRes.status === 201, `POST /api/bookmarks saved (status: ${saveRes.status})`);

  const getSavedRes = await fetch(`${BASE_URL}/api/bookmarks`, {
    headers: { cookie: cleanCookie },
  });
  const getSavedData = await getSavedRes.json();
  assert(getSavedRes.status === 200, 'GET /api/bookmarks retrieves saved list');
  assert(getSavedData.bookmarks.some(b => b.opportunityId === testOppId), 'Target opportunity is in saved list');

  // 6. Opportunity CRUD: CREATE
  console.log('\n--- Test 6: Opportunity CRUD (Create) ---');
  const createPayload = {
    title: 'Autonomous Robotics Software Engineering Intern',
    organizationName: 'Boston Dynamics Labs',
    categorySlug: 'software-engineering',
    opportunityType: 'internship',
    workplaceMode: 'onsite',
    location: 'Waltham, MA',
    applicationDeadline: '2026-11-30T23:59:59.000Z',
    duration: 'Summer 2026',
    compensationAmount: '$58/hour + Housing Stipend',
    applicationUrl: 'https://bostondynamics.com/careers/robotics-2026',
    shortSummary: 'Develop embedded control algorithms and perception pipelines for next-generation mobile robots.',
    description: 'Join the robotics platform team to work on high-frequency motion planning, dynamic obstacle avoidance, and real-time sensor fusion.',
    eligibility: 'Enrolled in Computer Science, Robotics, or Electrical Engineering.',
    skills: ['C++', 'ROS 2', 'Python', 'Control Systems'],
  };

  const createRes = await fetch(`${BASE_URL}/api/opportunities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: cleanCookie },
    body: JSON.stringify(createPayload),
  });
  const createData = await createRes.json();
  if (createRes.status !== 200 && createRes.status !== 201) {
    console.error('Create error response:', createData);
  }
  assert(createRes.status === 201 || createRes.status === 200, 'POST /api/opportunities creates opportunity');
  assert(createData.opportunity?.title === createPayload.title, 'Created opportunity title matches');
  const newOppId = createData.opportunity?.id;

  // 7. Opportunity CRUD: READ (Details & My Posts)
  console.log('\n--- Test 7: Opportunity CRUD (Read Details & My Posts) ---');
  const detailRes = await fetch(`${BASE_URL}/api/opportunities/${newOppId}`);
  const detailData = await detailRes.json();
  assert(detailRes.status === 200, `GET /api/opportunities/${newOppId} returns 200`);
  assert(detailData.opportunity?.title === createPayload.title, 'Opportunity details verified');

  const myPostsRes = await fetch(`${BASE_URL}/api/my-posts`, {
    headers: { cookie: cleanCookie },
  });
  const myPostsData = await myPostsRes.json();
  assert(myPostsRes.status === 200, 'GET /api/my-posts returns 200');
  assert(myPostsData.opportunities && myPostsData.opportunities.some(o => o.id === newOppId), 'New opportunity is present in user My Posts');

  // 8. Opportunity CRUD: UPDATE (Edit)
  console.log('\n--- Test 8: Opportunity CRUD (Update / Edit) ---');
  const updateRes = await fetch(`${BASE_URL}/api/opportunities/${newOppId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', cookie: cleanCookie },
    body: JSON.stringify({
      title: 'Autonomous Robotics Software Engineering Intern (Updated 2026)',
      compensationAmount: '$65/hour + Full Housing',
    }),
  });
  const updateData = await updateRes.json();
  assert(updateRes.status === 200, `PUT /api/opportunities/${newOppId} returns 200`);
  assert(updateData.opportunity?.title.includes('Updated 2026'), 'Updated title verified');

  // 9. Opportunity CRUD: DELETE
  console.log('\n--- Test 9: Opportunity CRUD (Delete) ---');
  const deleteRes = await fetch(`${BASE_URL}/api/opportunities/${newOppId}`, {
    method: 'DELETE',
    headers: { cookie: cleanCookie },
  });
  assert(deleteRes.status === 200, `DELETE /api/opportunities/${newOppId} returns 200`);

  const checkDeleted = await fetch(`${BASE_URL}/api/opportunities/${newOppId}`);
  assert(checkDeleted.status === 404, 'Deleted opportunity returns 404');

  // 10. Admin Moderation & Security (RBAC)
  console.log('\n--- Test 10: Admin Moderation & Security (RBAC) ---');
  // Student trying to access admin endpoint -> should return 403
  const forbiddenRes = await fetch(`${BASE_URL}/api/admin/opportunities`, {
    headers: { cookie: cleanCookie },
  });
  assert(forbiddenRes.status === 403, 'Regular student receives 403 on /api/admin/opportunities');

  // Admin login
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@opportunityboard.org',
      password: 'AdminSecure2026!',
    }),
  });
  const adminSetCookie = adminLoginRes.headers.get('set-cookie') || '';
  const adminCleanCookie = adminSetCookie.split(';')[0];
  assert(adminLoginRes.status === 200, 'Admin login returns 200');

  const adminListRes = await fetch(`${BASE_URL}/api/admin/opportunities`, {
    headers: { cookie: adminCleanCookie },
  });
  const adminListData = await adminListRes.json();
  assert(adminListRes.status === 200, 'Admin successfully accesses /api/admin/opportunities');
  assert(adminListData.opportunities && adminListData.opportunities.length > 0, `Admin queue contains ${adminListData.opportunities?.length} items`);

  // 11. Profile & Preferences
  console.log('\n--- Test 11: Profile & Preferences ---');
  const profRes = await fetch(`${BASE_URL}/api/profile`, {
    headers: { cookie: cleanCookie },
  });
  const profData = await profRes.json();
  assert(profRes.status === 200, 'GET /api/profile returns 200');
  assert(profData.user?.email === 'student@stanford.edu', 'Profile user confirmed');

  // 12. Notifications Center
  console.log('\n--- Test 12: Notifications Center ---');
  const notifRes = await fetch(`${BASE_URL}/api/notifications`, {
    headers: { cookie: cleanCookie },
  });
  const notifData = await notifRes.json();
  assert(notifRes.status === 200, 'GET /api/notifications returns 200');
  assert(Array.isArray(notifData.notifications), `Notifications list fetched (${notifData.notifications?.length} items)`);

  // Summary
  console.log('\n========================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
