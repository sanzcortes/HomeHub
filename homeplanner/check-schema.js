import axios from 'axios';

const SUPABASE_URL = 'https://kjvysxkfvyvwrohouqda.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdnlzeGtmdnl2d3JvaG91cWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjYyMzcsImV4cCI6MjA5MTA0MjIzN30.PIEXdhcHbGPBVyhtfxkL7koL2jAO5iCzk8jlpZQM0vs';

const supabase = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  },
});

try {
  const response = await supabase.post('/rest/v1/households', {
    name: 'Test household',
    household_code: 'TEST-1234',
  }, {
    headers: { 'Prefer': 'return=representation' }
  });
  console.log('SUCCESS! household_code column exists now');
  console.log('Response:', response.data);
  
  if (response.data && response.data[0]?.id) {
    await supabase.delete(`/rest/v1/households?id=eq.${response.data[0].id}`);
    console.log('Test record cleaned up');
  }
} catch (error) {
  console.log('Error:', error.response?.data || error.message);
}
