import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export async function saveBookingToDatabase(bookingData) {
  // If Supabase environment variables exist, attempt database insertion
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .insert([bookingData]);

      if (error) {
        console.warn('Supabase DB error:', error.message);
      } else {
        console.log('Successfully saved to SQL Database via Supabase:', data);
        return { success: true, data };
      }
    } catch (err) {
      console.warn('Supabase connection failed:', err);
    }
  }

  // Local fallback
  return { success: true, localOnly: true };
}
