# Supabase Integration Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully provisioned

## 2. Get Your Supabase Credentials

1. Go to Settings → API in your Supabase dashboard
2. Copy your `Project URL` and `anon public key`
3. Update the credentials in `src/services/supabaseClient.js`:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';
```

## 3. Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the entire contents of `src/data/schema.sql`
3. Run the SQL query to create all tables and policies

## 4. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install @supabase/supabase-js react-native-url-polyfill
```

## 5. Insert Initial Data

After setting up the database schema, you can insert initial data by:

1. Import the `insertInitialData` function from `src/data/initialData.js`
2. Call it in your app (preferably in a one-time setup screen or during development)

Example usage:
```javascript
import { insertInitialData } from '../data/initialData';

// Call this once to populate your database
const setupDatabase = async () => {
  const result = await insertInitialData();
  if (result.success) {
    console.log('Database populated successfully!');
  }
};
```

## 6. Test the Integration

The app should now be connected to Supabase. You can test the connection by:

1. Running the app
2. Checking if data loads in the HomeScreen
3. Testing admin functions (tap the logo 7 times to access admin mode)

## Database Structure

The app uses the following tables:

- **teams**: Football teams with basic information
- **players**: Player profiles linked to teams
- **news**: News articles with featured flag
- **matches**: Match information with home/away teams
- **shop_categories**: Product categories for the shop
- **shop_items**: Shop products linked to categories

## Features Enabled

With Supabase integration, your app now supports:

- ✅ Real-time data from the cloud
- ✅ Full CRUD operations for all entities
- ✅ Automatic data synchronization
- ✅ Scalable backend infrastructure
- ✅ User authentication (can be added later)
- ✅ File storage for images (can be added later)

## Next Steps

1. **Add Authentication**: Implement user login/signup
2. **File Storage**: Add image upload functionality
3. **Real-time Updates**: Enable real-time subscriptions
4. **Admin Panel**: Enhance admin controls
5. **Push Notifications**: Add notification system

## Troubleshooting

If you encounter issues:

1. **Connection Error**: Check your Supabase URL and key
2. **Table Not Found**: Ensure you've run the schema.sql
3. **Permission Denied**: Check Row Level Security policies
4. **Data Not Loading**: Verify your internet connection

## Security Notes

- The current setup uses Row Level Security (RLS) with public read access
- For production, implement proper authentication and authorization
- Never commit your actual Supabase credentials to version control
- Consider using environment variables for sensitive data

## Support

For issues with this integration, check:
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native) 