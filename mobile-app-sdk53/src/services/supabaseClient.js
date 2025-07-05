import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

// Supabase project details
const SUPABASE_URL = 'https://jqeyimbwmaebvnnxwedc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZXlpbWJ3bWFlYnZubnh3ZWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzAyMTcsImV4cCI6MjA2NzMwNjIxN30.oU6CMoPzkX7RGGYh491Qil59Gx87nyX8XFEE5cKldPY';

// Create a single Supabase client for the whole project
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Simple utility that tries to perform a lightweight API call to ensure that
 * the provided URL & anon key are valid and Supabase is reachable.
 *
 * @returns {Promise<boolean>} true if the call succeeds, otherwise false
 */
export const checkConnection = async () => {
  try {
    // A harmless request that never requires any tables or permissions.
    await supabase.auth.getSession();
    console.log('[Supabase] Connection successful');
    return true;
  } catch (error) {
    console.error('[Supabase] Connection failed', error);
    return false;
  }
}; 