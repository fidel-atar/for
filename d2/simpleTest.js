// Simple database connection test
import { createClient } from '@supabase/supabase-js';

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please update the Supabase URL and key in simpleTest.js');
  console.log('📝 Copy the values from your src/services/supabaseClient.js file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Testing Supabase Connection...\n');

async function testConnection() {
  try {
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('teams')
      .select('count', { count: 'exact' });
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Teams count: ${data || 0}\n`);
    return true;
  } catch (error) {
    console.log('❌ Connection error:', error.message);
    return false;
  }
}

async function testTables() {
  console.log('2. Testing all tables...');
  
  const tables = ['teams', 'players', 'news', 'matches', 'shop_categories', 'shop_items'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact' });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${data || 0} records`);
      }
    } catch (error) {
      console.log(`❌ ${table}: ${error.message}`);
    }
  }
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Starting Supabase Connection Tests...\n');
  
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testTables();
    
    console.log('🎉 All tests completed!');
    console.log('\n📱 Next steps:');
    console.log('1. Open the app in your device/emulator');
    console.log('2. Tap the logo 7 times to access Admin Dashboard');
    console.log('3. Use the admin features to manage your data');
  } else {
    console.log('❌ Connection failed. Please check your Supabase configuration.');
  }
}

// Run the tests
runAllTests().catch(console.error); 