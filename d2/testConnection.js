// Quick test script to verify Supabase connection
import { supabase } from './src/services/supabaseClient.js';
import dataService from './src/services/dataService.js';

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

async function testDataService() {
  console.log('3. Testing data service functions...');
  
  try {
    const teams = await dataService.getTeams();
    console.log(`✅ getTeams(): ${teams?.length || 0} teams`);
    
    const players = await dataService.getPlayers();
    console.log(`✅ getPlayers(): ${players?.length || 0} players`);
    
    const news = await dataService.getNews();
    console.log(`✅ getNews(): ${news?.length || 0} news articles`);
    
    const matches = await dataService.getMatches();
    console.log(`✅ getMatches(): ${matches?.length || 0} matches`);
    
    const categories = await dataService.getShopCategories();
    console.log(`✅ getShopCategories(): ${categories?.length || 0} categories`);
    
    const items = await dataService.getShopItems();
    console.log(`✅ getShopItems(): ${items?.length || 0} shop items`);
    
  } catch (error) {
    console.log('❌ Data service error:', error.message);
  }
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Starting Supabase Connection Tests...\n');
  
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testTables();
    await testDataService();
    
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