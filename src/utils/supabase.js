//import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
//export const supabase = createClient(
//import.meta.env.VITE_SUPABASE_URL,
//import.meta.env.VITE_SUPABASE_ANON_KEY,
//)
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://olqdhaztolhqqhumsqdx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9scWRoYXp0b2xocXFodW1zcWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMDk0OTMsImV4cCI6MjA0NzU4NTQ5M30.aJSHVn8EPVXqwXusbI5reFMFP3kX4UFuNFRPA-evZpY',
)

//Form Action Utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}
