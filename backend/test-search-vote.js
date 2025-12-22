/**
 * Test script for Search and Vote APIs
 * Run: node test-search-vote.js
 */

const API_BASE = 'http://localhost:3001/api';

// Helper function to make requests
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Test functions
async function testSearchEndpoints() {
  console.log('\n=== Testing Search Endpoints ===\n');

  // Test 1: Basic search
  console.log('1. Testing basic search...');
  const search1 = await request('/search?q=javascript');
  console.log('   Status:', search1.status);
  console.log('   Results:', search1.data?.questions?.length || 0, 'questions');

  // Test 2: Search with tags
  console.log('\n2. Testing search with tags...');
  const search2 = await request('/search?tags=javascript,react');
  console.log('   Status:', search2.status);
  console.log('   Results:', search2.data?.questions?.length || 0, 'questions');

  // Test 3: Search with status filter
  console.log('\n3. Testing search with status filter...');
  const search3 = await request('/search?status=solved');
  console.log('   Status:', search3.status);
  console.log('   Results:', search3.data?.questions?.length || 0, 'questions');

  // Test 4: Search with sort
  console.log('\n4. Testing search with sort...');
  const search4 = await request('/search?sort=votes');
  console.log('   Status:', search4.status);
  console.log('   Results:', search4.data?.questions?.length || 0, 'questions');

  // Test 5: Search with vote range
  console.log('\n5. Testing search with vote range...');
  const search5 = await request('/search?minVotes=5');
  console.log('   Status:', search5.status);
  console.log('   Results:', search5.data?.questions?.length || 0, 'questions');

  // Test 6: Search suggestions
  console.log('\n6. Testing search suggestions...');
  const suggestions = await request('/search/suggestions?q=java');
  console.log('   Status:', suggestions.status);
  console.log('   Suggestions:', suggestions.data?.suggestions ? 'Available' : 'None');

  // Test 7: Popular searches
  console.log('\n7. Testing popular searches...');
  const popular = await request('/search/popular');
  console.log('   Status:', popular.status);
  console.log('   Popular tags:', popular.data?.popularTags?.length || 0);
}

async function testVoteEndpoints(token) {
  console.log('\n=== Testing Vote Endpoints ===\n');

  if (!token) {
    console.log('⚠️  Skipping vote tests (no auth token provided)');
    console.log('   To test voting, provide a valid JWT token as argument');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  // Test 1: Get vote stats (no auth required)
  console.log('1. Testing get vote stats...');
  const stats = await request('/votes/stats?questionId=test-id');
  console.log('   Status:', stats.status);
  console.log('   Stats available:', !!stats.data);

  // Test 2: Vote on question (requires auth)
  console.log('\n2. Testing vote on question...');
  const vote1 = await request('/votes', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      value: 1,
      questionId: 'test-question-id'
    })
  });
  console.log('   Status:', vote1.status);
  console.log('   Response:', vote1.data?.message || vote1.data?.error?.message);

  // Test 3: Get user vote (requires auth)
  console.log('\n3. Testing get user vote...');
  const userVote = await request('/votes/user?questionId=test-question-id', {
    headers
  });
  console.log('   Status:', userVote.status);
  console.log('   User vote:', userVote.data?.vote);
}

// Main execution
async function main() {
  console.log('🚀 Starting API Tests...');
  console.log('📍 API Base URL:', API_BASE);

  // Get token from command line argument
  const token = process.argv[2];

  await testSearchEndpoints();
  await testVoteEndpoints(token);

  console.log('\n✅ Tests completed!\n');
  console.log('Note: Some tests may fail if:');
  console.log('  - Backend is not running');
  console.log('  - Database is empty');
  console.log('  - Invalid token provided for vote tests');
  console.log('\nTo test voting with authentication:');
  console.log('  node test-search-vote.js YOUR_JWT_TOKEN');
}

main().catch(console.error);
