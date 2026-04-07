import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjvysxkfvyvwrohouqda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdnlzeGtmdnl2d3JvaG91cWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjYyMzcsImV4cCI6MjA5MTA0MjIzN30.PIEXdhcHbGPBVyhtfxkL7koL2jAO5iCzk8jlpZQM0vs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
