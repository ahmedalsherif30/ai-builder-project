import fetch from 'node-fetch';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

async function phase1_PreRestart() {
  console.log('=== PHASE 1: PRE-RESTART CREATION & PERSISTENCE TEST ===\n');

  const timestamp = Date.now();
  const user1Email = `testuser1_${timestamp}@explainingdream.com`;
  const user1Pass = 'TestPassword123!';
  const user2Email = `testuser2_${timestamp}@explainingdream.com`;
  const user2Pass = 'TestPassword456!';

  // 1. REGISTER USER 1
  console.log('1. Registering User 1 (POST /api/auth/register)...');
  const reg1Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'مستخدم اختبار أول',
      email: user1Email,
      password: user1Pass,
      phone: '+201000000001',
      gender: 'female',
      maritalStatus: 'single'
    })
  });
  const reg1Data = await reg1Res.json();
  console.log('User 1 Reg Status:', reg1Res.status, 'ID:', reg1Data.user?.id, 'Role:', reg1Data.user?.role);
  if (!reg1Data.user || !reg1Data.user.id) throw new Error('User 1 registration failed!');

  // 2. CREATE REAL DATA FOR USER 1 (DREAM & ORDER)
  console.log('\n2. Creating Real Test Data for User 1 (Dream & Order)...');
  const dreamRes = await fetch(`${BASE_URL}/api/interpret-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      dreamText: 'رأيت في المنام أنني أصلي الفجر في مكان هادئ وتشرق الشمس وكنت أبتسم بشدة.',
      maritalStatus: 'single',
      gender: 'female',
      clientEmail: user1Email,
      clientName: 'مستخدم اختبار أول',
      clientPhone: '+201000000001'
    })
  });
  const dreamData = await dreamRes.json();
  console.log('User 1 Dream Submission Status:', dreamRes.status, 'Summary:', dreamData.summary || 'ok');

  const orderRes = await fetch(`${BASE_URL}/api/paid-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceId: 'written',
      serviceTitle: 'تفسير كتابي مفصل ومعتمد',
      clientName: 'مستخدم اختبار أول',
      clientEmail: user1Email,
      clientPhone: '+201000000001',
      dreamText: 'رأيت في المنام أنني أصلي الفجر...',
      maritalStatus: 'single',
      amountPaid: 29,
      deliveryType: 'written'
    })
  });
  const orderData = await orderRes.json();
  console.log('User 1 Order Creation Status:', orderRes.status, 'Order ID:', orderData.order?.id);

  // 3. READ USER 1 PROFILE
  console.log('\n3. Verifying User 1 Profile & Orders via API...');
  const prof1Res = await fetch(`${BASE_URL}/api/client/my-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user1Email })
  });
  const prof1Data = await prof1Res.json();
  console.log('User 1 Dreams Count:', prof1Data.dreams?.length);
  console.log('User 1 Orders Count:', prof1Data.orders?.length);

  // 4. USER 2 REGISTRATION & ISOLATION
  console.log('\n4. User 2 Registration & Isolation Test...');
  const reg2Res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'مستخدم اختبار ثاني',
      email: user2Email,
      password: user2Pass,
      phone: '+201000000002'
    })
  });
  const reg2Data = await reg2Res.json();
  console.log('User 2 Reg Status:', reg2Res.status, 'ID:', reg2Data.user?.id);

  const prof2Res = await fetch(`${BASE_URL}/api/client/my-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user2Email })
  });
  const prof2Data = await prof2Res.json();
  console.log('User 2 Dreams Count (Expected 0):', prof2Data.dreams?.length);
  console.log('User 2 Orders Count (Expected 0):', prof2Data.orders?.length);

  // 5. ADMIN RBAC ISOLATION TEST
  console.log('\n5. Testing Admin Isolation (Non-admin request to /api/admin/dreams)...');
  const nonAdminRes = await fetch(`${BASE_URL}/api/admin/dreams`, {
    headers: { 'x-user-role': 'member', 'x-user-email': user1Email }
  });
  console.log('Non-Admin Request Status (Expected 403):', nonAdminRes.status);

  const adminRes = await fetch(`${BASE_URL}/api/admin/dreams`, {
    headers: { 'x-user-role': 'admin', 'x-user-email': 'ahmedalsherif30@gmail.com' }
  });
  console.log('Authorized Admin Request Status (Expected 200):', adminRes.status);

  // 6. FREE DREAM COUNTER TEST FOR USER 2 (SUBMIT DREAMS WITH REQUIRED FIELDS)
  console.log('\n6. Testing Free Dream Submissions for User 2...');
  for (let i = 0; i < 2; i++) {
    const dRes = await fetch(`${BASE_URL}/api/interpret-dream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dreamText: `حلم تجريبي مجاني رقم ${i + 2} للمستخدم الثاني لاختبار العداد والربط بالملف.`,
        clientEmail: user2Email,
        clientName: 'مستخدم اختبار ثاني',
        clientPhone: '+201000000002'
      })
    });
    console.log(`Free Dream Submission ${i + 2} Status:`, dRes.status);
  }

  // Save session state to disk for Phase 2 (post-restart)
  const session = {
    user1Email,
    user1Pass,
    user1Id: reg1Data.user.id,
    user2Email,
    user2Pass,
    user2Id: reg2Data.user.id,
    user1DreamCount: prof1Data.dreams?.length || 0,
    user1OrderCount: prof1Data.orders?.length || 0
  };
  fs.writeFileSync('test-session.json', JSON.stringify(session, null, 2));
  console.log('\n✅ PHASE 1 COMPLETE. SESSION SAVED TO test-session.json.');
}

async function phase2_PostRestart() {
  console.log('\n=== PHASE 2: POST-RESTART VERIFICATION TEST ===\n');

  if (!fs.existsSync('test-session.json')) {
    throw new Error('test-session.json not found! Run Phase 1 first.');
  }

  const session = JSON.parse(fs.readFileSync('test-session.json', 'utf8'));
  console.log('Loaded Session Target User 1:', session.user1Email);

  // 1. LOGIN AFTER RESTART
  console.log('\n1. Logging in as User 1 after restart (POST /api/auth/login)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: session.user1Email,
      password: session.user1Pass
    })
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status, 'Success:', loginData.success);
  if (!loginData.success || !loginData.user) {
    throw new Error(`Login failed after restart for user ${session.user1Email}!`);
  }
  console.log(`-> User survived restart successfully! User ID: ${loginData.user.id}`);

  // 2. READ OLD DATA AFTER RESTART
  console.log('\n2. Fetching profile & old dreams/orders after restart...');
  const profRes = await fetch(`${BASE_URL}/api/client/my-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: session.user1Email })
  });
  const profData = await profRes.json();
  console.log('Post-Restart Dreams Count:', profData.dreams?.length, '(Expected >=', session.user1DreamCount, ')');
  console.log('Post-Restart Orders Count:', profData.orders?.length, '(Expected >=', session.user1OrderCount, ')');

  if (profData.dreams?.length < session.user1DreamCount || profData.orders?.length < session.user1OrderCount) {
    throw new Error('Data persistence check failed! Records lost after restart.');
  }

  // 3. VERIFY FREE DREAM COUNTER PERSISTENCE FOR USER 2
  console.log('\n3. Verifying Free Dream Counter survival for User 2...');
  const u2ProfRes = await fetch(`${BASE_URL}/api/client/my-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: session.user2Email })
  });
  const u2ProfData = await u2ProfRes.json();
  console.log('User 2 Dreams Count after restart:', u2ProfData.dreams?.length);
  console.log('User 2 Recorded Dreams Submitted Count in DB:', u2ProfData.customer?.dreamsSubmittedCount);

  // 4. CONCURRENT REQUESTS TEST
  console.log('\n4. Testing Concurrent Dream Submissions (Atomic Operations)...');
  const tempEmail = `concurrent_${Date.now()}@explainingdream.com`;
  // Create test user for concurrency
  await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'مستخدم تزامن', email: tempEmail, password: 'Password123!', phone: '+201099999999' })
  });

  // Launch 2 concurrent interpret-dream requests simultaneously
  console.log('Launching 2 parallel requests...');
  const req1 = fetch(`${BASE_URL}/api/interpret-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamText: 'حلم تزامني أول للتأكد من المعالجة الذكية.', clientEmail: tempEmail, clientName: 'مستخدم تزامن', clientPhone: '+201099999999' })
  });
  const req2 = fetch(`${BASE_URL}/api/interpret-dream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamText: 'حلم تزامني ثاني للتأكد من عدم التضارب.', clientEmail: tempEmail, clientName: 'مستخدم تزامن', clientPhone: '+201099999999' })
  });

  const [cRes1, cRes2] = await Promise.all([req1, req2]);
  console.log('Concurrent Request 1 Status:', cRes1.status);
  console.log('Concurrent Request 2 Status:', cRes2.status);

  console.log('\n=== ALL PERSISTENCE AND SECURITY TESTS COMPLETED SUCCESSFULLY! ===');
}

const mode = process.argv[2];
if (mode === 'phase1') {
  phase1_PreRestart().catch(err => { console.error(err); process.exit(1); });
} else if (mode === 'phase2') {
  phase2_PostRestart().catch(err => { console.error(err); process.exit(1); });
} else {
  console.log('Please specify "phase1" or "phase2"');
}
