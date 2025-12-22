const fetch = require('node-fetch');

async function testLogin() {
  console.log('\n🔐 Testing Login Endpoint...\n');

  try {
    // Test with one of the seeded users
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'priya.sharma@example.com',
        password: 'password123'
      })
    });

    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    const text = await response.text();
    console.log('\nRaw Response:');
    console.log(text.substring(0, 500));

    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = JSON.parse(text);
      console.log('\n✅ Login successful!');
      console.log('User:', data.data?.user?.name);
      console.log('Token:', data.data?.token ? 'Generated' : 'Missing');
    } else {
      console.log('\n❌ Response is not JSON!');
      console.log('Backend might not be running or route is incorrect');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Make sure backend is running:');
    console.log('   cd lumina-share/backend');
    console.log('   npm run dev');
  }
}

testLogin();
