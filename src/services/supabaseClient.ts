
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize supabase client only if credentials are available
let supabase: ReturnType<typeof createClient>;

try {
  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or anon key is missing. Please check your .env file.');
    throw new Error('Missing Supabase credentials');
  }
  
  // Create Supabase client with valid credentials
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock supabase object with methods that return mock data
  // This prevents crashes when Supabase operations are called
  supabase = {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not initialized') }),
          then: async () => ({ data: [], error: new Error('Supabase not initialized') })
        }),
        ilike: () => ({
          then: async () => ({ data: [], error: new Error('Supabase not initialized') })
        }),
        then: async () => ({ data: [], error: new Error('Supabase not initialized') })
      }),
      insert: () => ({
        then: async () => ({ error: new Error('Supabase not initialized') })
      }),
      delete: () => ({
        eq: () => ({
          then: async () => ({ error: new Error('Supabase not initialized') })
        })
      })
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: new Error('Supabase not initialized') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    },
    functions: {
      invoke: async () => ({ data: { results: [] }, error: new Error('Supabase not initialized') })
    }
  } as unknown as ReturnType<typeof createClient>;
}

export default supabase;
