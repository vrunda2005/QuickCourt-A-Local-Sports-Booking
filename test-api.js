const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing QuickCourt API endpoints...\n');

  try {
    // Test public endpoints
    console.log('1. Testing public facilities endpoint...');
    const facilitiesRes = await axios.get(`${API_BASE}/facilities`);
    console.log('✅ Public facilities:', facilitiesRes.data.success ? 'Working' : 'Failed');
    
    // Test server health
    console.log('\n2. Testing server health...');
    const healthRes = await axios.get('http://localhost:5000/');
    console.log('✅ Server health:', healthRes.data);
    
    console.log('\n🎉 Basic API tests completed successfully!');
    console.log('\nTo test authenticated endpoints, you need to:');
    console.log('1. Start the frontend (cd auth && npm run dev)');
    console.log('2. Sign up as a FacilityOwner');
    console.log('3. Create a facility');
    console.log('4. Sign up as an Admin (use admin-unlock page)');
    console.log('5. Approve the facility');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the server is running:');
      console.log('   cd server && npm start');
    }
  }
}

testAPI();
