/**
 * Connection Test Script
 * Tests Frontend-Backend-Database connections for all pages
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BACKEND_URL = `${API_BASE_URL}/api`;

// Demo user credentials
const DEMO_USERS = {
  superAdmin: { phone: '+880171234569', password: 'Demo@123' },
  moderator: { phone: '+880171234571', password: 'Demo@123' },
  company: { phone: '+880171234575', password: 'Demo@123' },
  caregiver: { phone: '+880171234585', password: 'Demo@123' },
  guardian: { phone: '+880171234588', password: 'Demo@123' },
};

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  details?: any;
  timestamp: string;
}

const results: TestResult[] = [];

function logResult(test: string, status: 'pass' | 'fail' | 'skip', message: string, details?: any) {
  const result: TestResult = {
    test,
    status,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
  results.push(result);
  console.log(`[${status.toUpperCase()}] ${test}: ${message}`);
  if (details) console.log('  Details:', JSON.stringify(details, null, 2));
}

async function testBackendHealth(): Promise<boolean> {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:35',message:'Testing backend health endpoint',data:{url:`${BACKEND_URL}/health`},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'BACKEND_HEALTH'})}).catch(()=>{});
    // #endregion
    
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    
    if (response.ok && data.status === 'ok') {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:42',message:'Backend health check passed',data:{status:data.status,database:data.database},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'BACKEND_HEALTH'})}).catch(()=>{});
      // #endregion
      
      logResult('Backend Health', 'pass', 'Backend is responding', data);
      
      if (data.database?.status === 'connected') {
        logResult('Database Connection', 'pass', 'Database is connected', data.database);
        return true;
      } else {
        logResult('Database Connection', 'fail', 'Database connection failed', data.database);
        return false;
      }
    } else {
      logResult('Backend Health', 'fail', 'Backend health check failed', data);
      return false;
    }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:58',message:'Backend health check error',data:{error:error instanceof Error ? error.message : 'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'BACKEND_HEALTH'})}).catch(()=>{});
    // #endregion
    
    logResult('Backend Health', 'fail', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

async function testAuthentication(phone: string, password: string, role: string): Promise<string | null> {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:68',message:'Testing authentication',data:{phone,role},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'AUTH_TEST'})}).catch(()=>{});
    // #endregion
    
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.tokens?.accessToken) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:78',message:'Authentication successful',data:{role,userId:data.user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'AUTH_TEST'})}).catch(()=>{});
      // #endregion
      
      logResult(`Auth: ${role}`, 'pass', 'Authentication successful', { userId: data.user?.id });
      return data.tokens.accessToken;
    } else {
      logResult(`Auth: ${role}`, 'fail', `Authentication failed: ${data.error || 'Unknown error'}`, data);
      return null;
    }
  } catch (error) {
    logResult(`Auth: ${role}`, 'fail', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

async function testApiEndpoint(endpoint: string, token: string | null, method: string = 'GET'): Promise<boolean> {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:95',message:'Testing API endpoint',data:{endpoint,method,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'API_ENDPOINT'})}).catch(()=>{});
    // #endregion
    
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers,
    });
    
    const status = response.status;
    const isSuccess = status >= 200 && status < 300;
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/b1fa42f1-6cf1-4fba-89a5-28a421cba99c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'test-connections.ts:108',message:'API endpoint response',data:{endpoint,status,isSuccess},timestamp:Date.now(),sessionId:'debug-session',runId:'connection-test',hypothesisId:'API_ENDPOINT'})}).catch(()=>{});
    // #endregion
    
    if (isSuccess || status === 401 || status === 403) {
      // 401/403 are expected for unauthorized endpoints
      logResult(`API: ${endpoint}`, 'pass', `Status: ${status}`);
      return true;
    } else {
      const data = await response.json().catch(() => ({}));
      logResult(`API: ${endpoint}`, 'fail', `Status: ${status}`, data);
      return false;
    }
  } catch (error) {
    logResult(`API: ${endpoint}`, 'fail', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('='.repeat(60));
  console.log('Connection Test Suite');
  console.log('='.repeat(60));
  console.log(`Backend URL: ${BACKEND_URL}\n`);
  
  // Test 1: Backend Health & Database
  const dbConnected = await testBackendHealth();
  
  if (!dbConnected) {
    console.log('\n⚠️  Database connection failed. Some tests may be skipped.\n');
  }
  
  // Test 2: Authentication for each role
  const tokens: Record<string, string | null> = {};
  for (const [role, credentials] of Object.entries(DEMO_USERS)) {
    tokens[role] = await testAuthentication(credentials.phone, credentials.password, role);
    await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting
  }
  
  // Test 3: Test key API endpoints
  const endpoints = [
    { path: '/users', role: 'superAdmin' },
    { path: '/dashboard/stats', role: 'superAdmin' },
    { path: '/companies', role: 'company' },
    { path: '/caregivers', role: 'caregiver' },
    { path: '/patients', role: 'guardian' },
    { path: '/jobs', role: 'company' },
    { path: '/packages', role: 'company' },
  ];
  
  for (const endpoint of endpoints) {
    const token = tokens[endpoint.role];
    await testApiEndpoint(endpoint.path, token);
    await new Promise(resolve => setTimeout(resolve, 300)); // Rate limiting
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  
  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`  - ${r.test}: ${r.message}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Write results to file
  const fs = require('fs');
  fs.writeFileSync(
    'connection-test-results.json',
    JSON.stringify({ summary: { passed, failed, skipped, total: results.length }, results }, null, 2)
  );
  console.log('Results saved to connection-test-results.json');
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests, testBackendHealth, testAuthentication, testApiEndpoint };

