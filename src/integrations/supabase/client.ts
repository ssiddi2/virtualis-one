
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://ourfwvlbeokoxfgftyrs.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cmZ3dmxiZW9rb3hmZ2Z0eXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDMzMDQsImV4cCI6MjA2NjQxOTMwNH0.5gPjpXrObYfiSzczuz1WgwiHmKMTwt5m3fTXs6qEkrM'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
