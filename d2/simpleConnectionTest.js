// Simple Supabase connection test without React Native dependencies
import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const supabaseUrl = 'https://vedoazeixsvaorrlxhuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZG9hemVpeHN2YW9ycmx4aHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY1NzAsImV4cCI6MjA2NzU0MjU3MH0.kgOrP9G_NRjPiK4AarOZk56PUXXqFaUJozi3Fn8u1dk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

async function testCRUDOperations() {
  console.log('3. Testing CRUD operations...');
  
  try {
    // Test creating a news article
    const testNews = {
      title: 'Test News Article',
      content: 'This is a test news article to verify CRUD operations.',
      author: 'Test Admin',
      status: 'published'
    };
    
    const { data: createdNews, error: createError } = await supabase
      .from('news')
      .insert([testNews])
      .select();
    
    if (createError) {
      console.log(`❌ Create news: ${createError.message}`);
    } else {
      console.log(`✅ Created news: ${createdNews[0].title}`);
      
      // Test updating the news
      const { data: updatedNews, error: updateError } = await supabase
        .from('news')
        .update({ title: 'Updated Test News Article' })
        .eq('id', createdNews[0].id)
        .select();
      
      if (updateError) {
        console.log(`❌ Update news: ${updateError.message}`);
      } else {
        console.log(`✅ Updated news: ${updatedNews[0].title}`);
      }
      
      // Test deleting the news
      const { error: deleteError } = await supabase
        .from('news')
        .delete()
        .eq('id', createdNews[0].id);
      
      if (deleteError) {
        console.log(`❌ Delete news: ${deleteError.message}`);
      } else {
        console.log(`✅ Deleted test news article`);
      }
    }
    
  } catch (error) {
    console.log('❌ CRUD test error:', error.message);
  }
  console.log('');
}

async function runAllTests() {
  console.log('🚀 Starting Supabase Connection Tests...\n');
  
  const connectionOk = await testConnection();
  
  if (connectionOk) {
    await testTables();
    await testCRUDOperations();
    
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