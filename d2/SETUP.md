# 🚀 Mauritania Football App - Database Setup Guide

## 📋 Overview
This guide will help you set up your Supabase database and initialize your Mauritania Football App with sample data.

## 🔧 Prerequisites
- Your Supabase project is already created
- URL: `https://vedoazeixsvaorrlxhuk.supabase.co`
- API Key: Already configured in the app

## 🎯 Quick Setup Steps

### 1. 🏃‍♂️ Access Database Setup
There are two ways to access the database setup:

**Option A: Through Home Screen**
1. Open the app
2. Tap the logo 5 times quickly
3. This will open the Database Setup screen

**Option B: Through Admin Dashboard**
1. Open the app
2. Tap the logo 7 times quickly to access Admin Dashboard
3. Tap "إعداد قاعدة البيانات" (Database Setup) button

### 2. 📊 Database Initialization Process

Once you're in the Database Setup screen, follow these steps:

#### Step 1: Test Connection
- Tap "1. اختبار الاتصال" (Test Connection)
- You should see: "✅ الاتصال ناجح! (الجداول غير موجودة بعد)"

#### Step 2: Create Database Schema
- Tap "2. إنشاء الجداول" (Create Tables)
- If automatic creation fails, you'll need to do it manually:
  1. Go to your Supabase Dashboard
  2. Navigate to SQL Editor
  3. Copy the contents from `src/data/schema.sql`
  4. Paste and run the SQL in the editor
  5. Return to the app and tap "Test Connection" again

#### Step 3: Import Sample Data
- Tap "3. إدراج البيانات" (Import Data)
- This will populate your database with sample data:
  - 6 Football teams
  - 18 Players
  - 10 News articles
  - 8 Matches
  - 3 Shop categories
  - 12 Shop items

#### Step 4: Test Data Services
- Tap "4. اختبار الخدمات" (Test Services)
- This verifies all data services are working correctly

### 3. 🎉 Success!
Once all steps are complete, you'll see:
- ✅ All connection tests passing
- ✅ Data imported successfully
- ✅ All services working

## 📱 Using the App

### For Users:
- **Home**: Latest news and match updates
- **Matches**: View all matches and details
- **Teams**: Browse teams and player information
- **Shop**: Browse and view products
- **News**: Read all news articles
- **President Cup**: Special tournament section

### For Admins:
1. Tap the logo 7 times to access Admin Dashboard
2. Manage:
   - News articles
   - Teams and players
   - Matches
   - Shop items and categories

## 🗃️ Database Structure

### Tables Created:
1. **Teams**: Enhanced with colors, stadium, achievements, staff
2. **Players**: Comprehensive player data with stats, attributes, contracts
3. **News**: Full CMS with SEO, categories, tags, gallery
4. **Matches**: Detailed match info with stats, events, highlights
5. **Shop Categories**: Product categorization
6. **Shop Items**: Full e-commerce with variants, promotions, inventory

### Key Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Automatic timestamps
- ✅ Performance indexes
- ✅ Data validation triggers
- ✅ Captain management system
- ✅ Age calculation from birth date

## 📚 Sample Data Included

### Teams (6 teams):
- نادي نواكشوط (Nouakchott Club)
- نادي الوحدة (Al-Wahda Club)
- نادي الكرامة (Al-Karama Club)
- نادي الأهلي (Al-Ahly Club)
- نادي الاتحاد (Al-Ittihad Club)
- نادي الغدير (Al-Ghadeer Club)

### Players (18 players):
- 3 players per team
- Realistic Arabic names
- Complete player profiles
- Position-specific attributes

### News (10 articles):
- Breaking news
- Match reports
- Transfer news
- Tournament updates

### Matches (8 matches):
- Recent and upcoming
- Complete match details
- Stats and events

### Shop (12 items in 3 categories):
- Jerseys and apparel
- Equipment and accessories
- Promotional items

## 🔧 Troubleshooting

### Connection Issues:
- Verify your internet connection
- Check if Supabase service is running
- Ensure API keys are correct

### Table Creation Issues:
- Manually run the SQL from `schema.sql`
- Check Supabase dashboard for any errors
- Verify your project permissions

### Data Import Issues:
- Ensure tables are created first
- Check the progress log for specific errors
- Try importing data in smaller batches

## 🎯 Next Steps

After successful setup:
1. ✅ Start using the app normally
2. ✅ Add your own teams and players
3. ✅ Create news articles
4. ✅ Schedule matches
5. ✅ Manage shop inventory

## 🛠️ Technical Details

### Technologies Used:
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for images)
- **Real-time**: Supabase Realtime

### Security Features:
- Row Level Security policies
- Public read access
- Admin write access
- Secure API key handling

## 📞 Support

If you encounter any issues:
1. Check the progress log in the Database Setup screen
2. Verify all steps were completed successfully
3. Check Supabase dashboard for any errors
4. Ensure your internet connection is stable

---

**🏆 Enjoy your Mauritania Football App!** 