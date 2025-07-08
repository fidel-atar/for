// Test data flow from admin creation to user display
import { createClient } from '@supabase/supabase-js';

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.log('❌ Please update the Supabase URL and key in testDataFlow.js');
  console.log('📝 Copy the values from your src/services/supabaseClient.js file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔄 Testing Data Flow from Admin to User...\n');

async function testNewsFlow() {
  console.log('📰 Testing News Flow...');
  
  try {
    // 1. Create news as admin
    const testNews = {
      title: 'Test News Article for User Display',
      content: 'This is a test news article that should be visible to users.',
      author: 'Test Author',
      status: 'published',
      is_featured: false
    };
    
    const { data: createdNews, error: createError } = await supabase
      .from('news')
      .insert([testNews])
      .select();
    
    if (createError) {
      console.log('❌ Admin create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Admin created news:', createdNews[0].title);
    const newsId = createdNews[0].id;
    
    // 2. Test user can see it (getNews - should show published news)
    const { data: userNews, error: userError } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (userError) {
      console.log('❌ User view failed:', userError.message);
      return false;
    }
    
    const foundNews = userNews.find(n => n.id === newsId);
    if (foundNews) {
      console.log('✅ User can see the news:', foundNews.title);
    } else {
      console.log('❌ User cannot see the news');
      return false;
    }
    
    // 3. Clean up
    await supabase.from('news').delete().eq('id', newsId);
    console.log('✅ News flow test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ News flow test failed:', error.message);
    return false;
  }
}

async function testTeamFlow() {
  console.log('⚽ Testing Team Flow...');
  
  try {
    // 1. Create team as admin
    const testTeam = {
      name: 'Test Team for User Display',
      city: 'Test City',
      division: 'Test Division',
      coach: 'Test Coach'
    };
    
    const { data: createdTeam, error: createError } = await supabase
      .from('teams')
      .insert([testTeam])
      .select();
    
    if (createError) {
      console.log('❌ Admin create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Admin created team:', createdTeam[0].name);
    const teamId = createdTeam[0].id;
    
    // 2. Test user can see it (getTeams - should show all teams)
    const { data: userTeams, error: userError } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (userError) {
      console.log('❌ User view failed:', userError.message);
      return false;
    }
    
    const foundTeam = userTeams.find(t => t.id === teamId);
    if (foundTeam) {
      console.log('✅ User can see the team:', foundTeam.name);
    } else {
      console.log('❌ User cannot see the team');
      return false;
    }
    
    // 3. Clean up
    await supabase.from('teams').delete().eq('id', teamId);
    console.log('✅ Team flow test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ Team flow test failed:', error.message);
    return false;
  }
}

async function testMatchFlow() {
  console.log('🏆 Testing Match Flow...');
  
  try {
    // First create two teams for the match
    const team1 = {
      name: 'Test Team A',
      city: 'City A',
      division: 'Test Division'
    };
    
    const team2 = {
      name: 'Test Team B', 
      city: 'City B',
      division: 'Test Division'
    };
    
    const { data: createdTeam1 } = await supabase.from('teams').insert([team1]).select();
    const { data: createdTeam2 } = await supabase.from('teams').insert([team2]).select();
    
    // 1. Create match as admin
    const testMatch = {
      home_team_id: createdTeam1[0].id,
      away_team_id: createdTeam2[0].id,
      date: new Date().toISOString(),
      venue: 'Test Stadium',
      status: 'scheduled',
      home_score: null,
      away_score: null
    };
    
    const { data: createdMatch, error: createError } = await supabase
      .from('matches')
      .insert([testMatch])
      .select();
    
    if (createError) {
      console.log('❌ Admin create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Admin created match');
    const matchId = createdMatch[0].id;
    
    // 2. Test user can see it (getMatches - should show all matches)
    const { data: userMatches, error: userError } = await supabase
      .from('matches')
      .select(`
        *,
        home_team:teams!matches_home_team_id_fkey (
          id,
          name,
          logo_url
        ),
        away_team:teams!matches_away_team_id_fkey (
          id,
          name,
          logo_url
        )
      `)
      .order('date', { ascending: false });
    
    if (userError) {
      console.log('❌ User view failed:', userError.message);
      return false;
    }
    
    const foundMatch = userMatches.find(m => m.id === matchId);
    if (foundMatch) {
      console.log('✅ User can see the match');
    } else {
      console.log('❌ User cannot see the match');
      return false;
    }
    
    // 3. Clean up
    await supabase.from('matches').delete().eq('id', matchId);
    await supabase.from('teams').delete().eq('id', createdTeam1[0].id);
    await supabase.from('teams').delete().eq('id', createdTeam2[0].id);
    console.log('✅ Match flow test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ Match flow test failed:', error.message);
    return false;
  }
}

async function testShopFlow() {
  console.log('🛍️ Testing Shop Flow...');
  
  try {
    // First create a category
    const testCategory = {
      name: 'Test Category'
    };
    
    const { data: createdCategory } = await supabase.from('shop_categories').insert([testCategory]).select();
    
    // 1. Create shop item as admin
    const testItem = {
      name: 'Test Shop Item for User Display',
      description: 'This is a test shop item that should be visible to users.',
      price: 99.99,
      category_id: createdCategory[0].id,
      is_available: true,
      stock_quantity: 10
    };
    
    const { data: createdItem, error: createError } = await supabase
      .from('shop_items')
      .insert([testItem])
      .select();
    
    if (createError) {
      console.log('❌ Admin create failed:', createError.message);
      return false;
    }
    
    console.log('✅ Admin created shop item:', createdItem[0].name);
    const itemId = createdItem[0].id;
    
    // 2. Test user can see it (getShopItems - should show available items)
    const { data: userItems, error: userError } = await supabase
      .from('shop_items')
      .select(`
        *,
        shop_categories (
          id,
          name
        )
      `)
      .eq('is_available', true)
      .order('name');
    
    if (userError) {
      console.log('❌ User view failed:', userError.message);
      return false;
    }
    
    const foundItem = userItems.find(i => i.id === itemId);
    if (foundItem) {
      console.log('✅ User can see the shop item:', foundItem.name);
    } else {
      console.log('❌ User cannot see the shop item');
      return false;
    }
    
    // 3. Clean up
    await supabase.from('shop_items').delete().eq('id', itemId);
    await supabase.from('shop_categories').delete().eq('id', createdCategory[0].id);
    console.log('✅ Shop flow test completed successfully!\n');
    return true;
    
  } catch (error) {
    console.log('❌ Shop flow test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Data Flow Tests...\n');
  
  const newsSuccess = await testNewsFlow();
  const teamSuccess = await testTeamFlow();
  const matchSuccess = await testMatchFlow();
  const shopSuccess = await testShopFlow();
  
  if (newsSuccess && teamSuccess && matchSuccess && shopSuccess) {
    console.log('🎉 All data flow tests passed!');
    console.log('\n📱 Your app should now work correctly:');
    console.log('1. Admin creates data → Data appears in user screens');
    console.log('2. News: Only published news shows to users');
    console.log('3. Teams: All teams show to users');
    console.log('4. Matches: All matches show to users');
    console.log('5. Shop: Only available items show to users');
    console.log('\n✅ Data flow is working correctly!');
  } else {
    console.log('❌ Some data flow tests failed.');
    console.log('Please check your database permissions and table structure.');
  }
}

// Run the tests
runAllTests().catch(console.error); 