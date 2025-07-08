// Test CRUD operations
import { createClient } from '@supabase/supabase-js';

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please update the Supabase URL and key in testCrud.js');
  console.log('📝 Copy the values from your src/services/supabaseClient.js file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing CRUD Operations...\n');

async function testNewsCrud() {
  console.log('📰 Testing News CRUD...');
  
  try {
    // Test CREATE
    const testNews = {
      title: 'Test News Article',
      content: 'This is a test news article content.',
      author: 'Test Author',
      status: 'published',
      is_featured: false
    };
    
    const { data: createdNews, error: createError } = await supabase
      .from('news')
      .insert([testNews])
      .select();
    
    if (createError) {
      console.log('❌ Create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Create successful:', createdNews[0].title);
    const newsId = createdNews[0].id;
    
    // Test READ
    const { data: readNews, error: readError } = await supabase
      .from('news')
      .select('*')
      .eq('id', newsId)
      .single();
    
    if (readError) {
      console.log('❌ Read failed:', readError.message);
      return false;
    }
    
    console.log('✅ Read successful:', readNews.title);
    
    // Test UPDATE
    const { data: updatedNews, error: updateError } = await supabase
      .from('news')
      .update({ title: 'Updated Test News Article' })
      .eq('id', newsId)
      .select();
    
    if (updateError) {
      console.log('❌ Update failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Update successful:', updatedNews[0].title);
    
    // Test DELETE
    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .eq('id', newsId);
    
    if (deleteError) {
      console.log('❌ Delete failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Delete successful');
    console.log('✅ News CRUD test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ News CRUD test failed:', error.message);
    return false;
  }
}

async function testTeamCrud() {
  console.log('⚽ Testing Team CRUD...');
  
  try {
    // Test CREATE
    const testTeam = {
      name: 'Test Team',
      city: 'Test City',
      division: 'Test Division',
      coach: 'Test Coach'
    };
    
    const { data: createdTeam, error: createError } = await supabase
      .from('teams')
      .insert([testTeam])
      .select();
    
    if (createError) {
      console.log('❌ Create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Create successful:', createdTeam[0].name);
    const teamId = createdTeam[0].id;
    
    // Test READ
    const { data: readTeam, error: readError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single();
    
    if (readError) {
      console.log('❌ Read failed:', readError.message);
      return false;
    }
    
    console.log('✅ Read successful:', readTeam.name);
    
    // Test UPDATE
    const { data: updatedTeam, error: updateError } = await supabase
      .from('teams')
      .update({ name: 'Updated Test Team' })
      .eq('id', teamId)
      .select();
    
    if (updateError) {
      console.log('❌ Update failed:', updateError.message);
      return false;
    }
    
    console.log('✅ Update successful:', updatedTeam[0].name);
    
    // Test DELETE
    const { error: deleteError } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId);
    
    if (deleteError) {
      console.log('❌ Delete failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Delete successful');
    console.log('✅ Team CRUD test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ Team CRUD test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting CRUD Tests...\n');
  
  const newsSuccess = await testNewsCrud();
  const teamSuccess = await testTeamCrud();
  
  if (newsSuccess && teamSuccess) {
    console.log('🎉 All CRUD tests passed!');
    console.log('\n📱 Your admin CRUD operations should now work correctly.');
    console.log('1. Open the app in your device/emulator');
    console.log('2. Tap the logo 7 times to access Admin Dashboard');
    console.log('3. Try creating, updating, and deleting items');
  } else {
    console.log('❌ Some CRUD tests failed.');
    console.log('Please check your database permissions and table structure.');
  }
}

// Run the tests
runAllTests().catch(console.error); 