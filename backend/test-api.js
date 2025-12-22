const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Testing SolveHub API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthRes = await fetch(`${API_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Get all questions
    console.log('\n2. Testing get all questions...');
    const questionsRes = await fetch(`${API_URL}/questions`);
    const questionsData = await questionsRes.json();
    console.log(`✅ Found ${questionsData.data?.questions?.length || 0} questions`);
    if (questionsData.data?.questions?.length > 0) {
      console.log('   First question:', questionsData.data.questions[0].title);
    }

    // Test 3: Get questions with category filter
    console.log('\n3. Testing category filter (React)...');
    const reactRes = await fetch(`${API_URL}/questions?category=React`);
    const reactData = await reactRes.json();
    console.log(`✅ Found ${reactData.data?.questions?.length || 0} React questions`);

    // Test 4: Get trending questions
    console.log('\n4. Testing trending questions...');
    const trendingRes = await fetch(`${API_URL}/questions/trending`);
    const trendingData = await trendingRes.json();
    console.log(`✅ Found ${trendingData.data?.length || 0} trending questions`);

    // Test 5: Get tags
    console.log('\n5. Testing tags endpoint...');
    const tagsRes = await fetch(`${API_URL}/tags`);
    const tagsData = await tagsRes.json();
    console.log(`✅ Found ${tagsData.data?.length || 0} tags`);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Make sure the backend server is running on port 3001');
  }
}

testAPI();
