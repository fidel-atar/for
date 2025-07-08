import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Your actual Supabase credentials
const supabaseUrl = 'https://vedoazeixsvaorrlxhuk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZG9hemVpeHN2YW9ycmx4aHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NjY1NzAsImV4cCI6MjA2NzU0MjU3MH0.kgOrP9G_NRjPiK4AarOZk56PUXXqFaUJozi3Fn8u1dk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase; 